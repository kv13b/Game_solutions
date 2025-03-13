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
  const [clients, setClients] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [productData, setProductData] = useState({
    product: "",
    checkIn: "",
    checkOut: "",
    quantity: "",
    rate: "",
    amount: "",
  });
  const [products, setProducts] = useState([]);
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
  const handleSubmit = () => {};
  useEffect(() => {
    fetchClients();
  }, []);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleProductChange = (e) => {
    setProductData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const { product, checkIn, checkOut, quantity, rate, amount } =
        productData;

      if (!product || !checkIn || !checkOut || !quantity || !rate || !amount) {
        alert("Please fill all product fields");
        return;
      }

      // Add new row to grid
      setProducts((prev) => [
        ...prev,
        { product, checkIn, checkOut, quantity, rate, amount },
      ]);

      // Clear product form after adding
      setProductData({
        product: "",
        checkIn: "",
        checkOut: "",
        quantity: "",
        rate: "",
        amount: "",
      });
    }
  };
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
      params.api.getAllColumns().forEach((column) => {
        column.getColDef().autoSize = true;
      });
      params.api.autoSizeColumns(params.columnApi.getAllColumns());
    },
  };
  return (
    <div className="container">
      <NavBar />
      <main id="main" class="main">
        <div class="pagetitle">
          <h1>Sales</h1>
          <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="#">Transactions</a>
              </li>
              <li class="breadcrumb-item active">Sales</li>
            </ol>
          </nav>
        </div>

        <section class="section">
          <div class="row">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Sales Entry</h5>

                <form class="row g-3" onSubmit={handleSubmit}>
                  <div class="row mb-3">
                    <div class="col-md-3">
                      <label for="inputState" class="form-label">
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
                    <div class="col-md-3">
                      <label for="inputState" class="form-label">
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
                    <div class="col-md-2">
                      <label for="inputState" class="form-label">
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
                    <div class="col-md-2">
                      <label for="inputState" class="form-label">
                        Balance
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        value="0.00"
                        disabled
                      />
                    </div>
                    <div class="col-md-1">
                      <label htmlFor="inputState" className="form-label">
                         
                      </label>
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
                    <div class="col-md-1">
                      <label htmlFor="inputState" className="form-label">
                         
                      </label>
                      <div>
                        <button type="button" className="btn btn-outline-info">
                          View
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-2">
                      <label for="inputNanme4" class="form-label">
                        Product
                      </label>
                      <select
                        id="inputState"
                        className="form-select"
                        name="product"
                        value={productData.product}
                        onChange={handleProductChange}
                      >
                        <option value="">Select</option>
                        <option value="Pool 1">Pool 1</option>
                        <option value="Pool 2">Pool 2</option>
                        <option value="Play Station 1">Play Station 1</option>
                        <option value="Juice">Juice</option>
                        <option value="Burger">Burger</option>
                      </select>
                    </div>
                    <div class="col-2">
                      <label for="inputTime" class="form-label">
                        Check In
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        name="checkIn"
                        value={productData.checkIn}
                        onChange={handleProductChange}
                      />
                    </div>
                    <div class="col-2">
                      <label for="inputTime" class="form-label">
                        Check Out
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        name="checkOut"
                        value={productData.checkOut}
                        onChange={handleProductChange}
                      />
                    </div>
                    <div class="col-2">
                      <label for="inputNanme4" class="form-label">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={productData.quantity}
                        onChange={handleProductChange}
                      />
                    </div>
                    <div class="col-2">
                      <label for="inputNanme4" class="form-label">
                        Rate
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="rate"
                        value={productData.rate}
                        onChange={handleProductChange}
                      />
                    </div>
                    <div class="col-2">
                      <label for="inputNanme4" class="form-label">
                        Amount
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={productData.amount}
                        onChange={handleProductChange}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <div>
                      {/* <AgGridReact
                        rowData={products}
                        columnDefs={columnDefs}
                        gridOptions={gridOptions}
                        // onRowDoubleClicked={handleRowClick}
                        modules={[ClientSideRowModelModule]}
                      /> */}
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
