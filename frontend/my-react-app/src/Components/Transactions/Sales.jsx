import { useEffect, useState } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../NavBar";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
const Sales = () => {
  const [formData, setFormData] = useState({
    Email: "",
    ContactNo: "",
  });
  const [productForm, setProductForm] = useState({
    product: "",
    checkIn: "",
    checkOut: "",
    quantity: 0,
    Rate: 0,
    amount: 0,
  });
  const [clients, setClients] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [gridData, setGridData] = useState([]);

  const [products, setProducts] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState("");

  const fetchClients = async () => {
    try {
      const response = await axiosinstance.get("client");
      if (response.status === 200 && response.data.Valid) {
        setClients(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };
  const handleCustomerChange = (e) => {
    const custid = e.target.value;
    setSelectedCustomer(e.target.value);
    const selectedClient = clients.find(
      (client) => client.Customer_Id.toString() === custid
    );
    if (selectedClient) {
      setFormData({
        Email: selectedClient.Email,
        ContactNo: selectedClient.ContactNo,
      });
    }
  };

  const handleProChange = (e) => {
    const { name, value } = e.target;

    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (e) => {
    const itemId = e.target.value;

    if (!products || products.length === 0) {
      console.warn("Products are not defined or empty");
      return;
    }
    const selectedProduct = products.find(
      (product) => product.Item_Id.toString() === itemId
    );

    if (selectedProduct) {
      setProductForm((prev) => ({
        ...prev,
        product: itemId,
        Rate: selectedProduct.Rate,
        amount: selectedProduct.amount,
      }));
      console.log(productForm);
    }
  };

  const handleCombinedChange = (e) => {
    handleProChange(e);
    handleProductChange(e);
  };

  const fetchProduct = async () => {
    try {
      const response = await axiosinstance.get("product/getProduct");
      if (response.status === 200 && response.data.Valid) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Product data:", error);
    }
  };

  const handleSubmit = () => {};
  useEffect(() => {
    fetchClients();
    fetchProduct();
  }, []);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleQuantityAndRateChange = (e) => {
    const { name, value } = e.target;

    setProductForm((prev) => {
      // Convert values to numbers htmlFor calculation
      const quantity =
        name === "quantity" ? Number(value) : Number(prev.quantity);
      const rate = name === "Rate" ? Number(value) : Number(prev.Rate);

      const updatedForm = {
        ...prev,
        [name]: value,
        amount: !isNaN(quantity) && !isNaN(rate) ? quantity * rate : 0, // Calculate amount
      };

      return updatedForm;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const { product, checkIn, checkOut, quantity, Rate, amount } =
        productForm;

      if (!product || !checkIn || !checkOut || !quantity || !Rate || !amount) {
        alert("Please fill all product fields");
        return;
      }
      console.log(products);
      // Add new row to grid
      // setProducts((prev) => [
      //   ...prev,
      //   {
      //     id: crypto.randomUUID(),
      //     product,
      //     checkIn,
      //     checkOut,
      //     quantity,
      //     Rate,
      //     amount,
      //   },
      // ]);
      setGridData((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          product,
          checkIn,
          checkOut,
          quantity,
          Rate,
          amount,
        },
      ]);

      console.log(gridData);

      // Clear product form after adding
      setProductForm((prev) => ({
        ...prev,
        product: "",
        checkIn: "",
        checkOut: "",
        quantity: "",
        Rate: "",
        amount: "",
      }));

      // setSelectedProduct(""); // Reset product dropdown
    }
  };
  useEffect(() => {
    console.log("Updated gridData:", gridData);
  }, [gridData]);

  const columnDefs = [
    { headerName: "Product", field: "product" },
    { headerName: "Check In", field: "checkIn" },
    { headerName: "Check Out", field: "checkOut" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Rate", field: "rate" },
    { headerName: "Amount", field: "amount" },
  ];
  const gridOptions = {
    onGridReady: (params) => {
      // Automatically adjust the columns when the grid is ready
      params.api.sizeColumnsToFit();

      // Use params.columnApi.getAllColumns() instead of params.api.getAllColumns()
      const allColumns = params.columnApi.getAllColumns();

      if (allColumns) {
        allColumns.forEach((column) => {
          params.columnApi.autoSizeColumn(column.getColId());
        });
      }
    },
  };

  return (
    <div className="container">
      <NavBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Sales</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Transactions</a>
              </li>
              <li className="breadcrumb-item active">Sales</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Sales Entry</h5>

                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label htmlFor="inputState" className="form-label">
                        Customer
                      </label>
                      <select
                        id="inputState"
                        className="form-select"
                        value={selectedCustomer}
                        onChange={handleCustomerChange}
                      >
                        <option value="">Select</option>
                        {clients.map((client) => (
                          <option
                            key={client.Customer_Id}
                            value={client.Customer_Id}
                          >
                            {client.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="inputState" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="Email"
                        placeholder="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="inputState" className="form-label">
                        Contact No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="ContactNo"
                        placeholder="Contact No"
                        value={formData.ContactNo}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="inputState" className="form-label">
                        Balance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value="0.00"
                        disabled
                      />
                    </div>
                    <div className="col-md-1">
                      <label
                        htmlFor="inputState"
                        className="form-label"
                      ></label>
                      <div>
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginRight: "5px" }}
                        >
                          Wait
                        </button>
                      </div>
                    </div>
                    <div className="col-md-1">
                      <label
                        htmlFor="inputState"
                        className="form-label"
                      ></label>
                      <div>
                        <button type="button" className="btn btn-outline-info">
                          View
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-2">
                      <label htmlFor="inputNanme4" className="form-label">
                        Product
                      </label>

                      <select
                        id="inputState"
                        className="form-select"
                        name="product"
                        value={productForm.product || ""}
                        onChange={handleCombinedChange}
                      >
                        <option value="">Select</option>
                        {products.map((product, index) => (
                          <option
                            key={product.Item_Id ?? index}
                            value={product.Item_Id}
                          >
                            {product.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-2">
                      <label htmlFor="inputTime" className="form-label">
                        Check In
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        name="checkIn"
                        value={productForm.checkIn || ""}
                        onChange={handleCombinedChange}
                      />
                    </div>
                    <div className="col-2">
                      <label htmlFor="inputTime" className="form-label">
                        Check Out
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        name="checkOut"
                        value={productForm.checkOut || ""}
                        onChange={handleCombinedChange}
                      />
                    </div>
                    <div className="col-2">
                      <label htmlFor="inputNanme4" className="form-label">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={productForm.quantity}
                        onChange={handleQuantityAndRateChange}
                      />
                    </div>
                    <div className="col-2">
                      <label htmlFor="inputNanme4" className="form-label">
                        Rate
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="Rate"
                        value={productForm.Rate}
                        onChange={handleQuantityAndRateChange}
                      />
                    </div>
                    <div className="col-2">
                      <label htmlFor="inputNanme4" className="form-label">
                        Amount
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={productForm.amount}
                        onChange={handleProductChange}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <div>
                      <AgGridReact
                        key={gridData.length} // React will re-render the grid when gridData changes
                        rowData={gridData}
                        columnDefs={columnDefs}
                        // gridOptions={gridOptions}
                        // onRowDoubleClicked={handleRowClick}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <button
                      type="submit"
                      className="btn btn-outline-success"
                      style={{ marginRight: "10px" }}
                    >
                      Submit
                    </button>
                    <button type="reset" className="btn btn-outline-secondary">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Sales;
