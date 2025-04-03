import { useEffect, useState, useRef } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../NavBar";
import { AgGridReact } from "ag-grid-react";
import { data, useNavigate } from "react-router-dom";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import ViewSales from "./ViewSales";
import ViewMainSales from "./ViewMainSales";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);
const Sales = () => {
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    // Add the scroll event listener on mount
    window.addEventListener("scroll", handleScroll);

    // Call the handleScroll to check the initial scroll position
    handleScroll();

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    ContactNo: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [MainmodalIsOpen, setMainModalIsOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    id: 0,
    product: "",
    checkIn: "",
    checkOut: "",
    quantity: 0,
    Rate: 0,
    amount: 0,
  });
  const [AmountForm, setAmountForm] = useState({
    upi: 0,
    cash: 0,
    credit: 0,
    NetAmount: 0,
  });
  const [clients, setClients] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [gridData, setGridData] = useState([]);
  const [products, setProducts] = useState([]);
  const rateInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
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
  const handleCustomerChange = async (e) => {
    const custid = e.target.value;
    setSelectedCustomer(custid);

    const selectedClient = clients.find(
      (client) => client.Customer_Id.toString() === custid
    );

    if (selectedClient) {
      try {
        // Make a POST request and send the Customer_Id in the body
        const response = await axiosinstance.post("client/getCustomerBalance", {
          Customer_Id: selectedClient.Customer_Id,
        });

        if (response.status === 200 && response.data.Valid) {
          // Assuming 'credit' is returned inside the 'data' object in the response
          const credit = response.data.data[0]?.credit; // Access the 'credit' value from the response

          // You can now use this 'credit' value as needed
          console.log("Fetched credit:", credit);
          const finalCredit =
            credit !== null && credit !== undefined && credit !== ""
              ? credit
              : 0;
          // You can update the formData or handle the credit value in any other way
          setFormData({
            Email: selectedClient.Email,
            ContactNo: selectedClient.ContactNo,
            Balance: finalCredit,
          });
        } else {
          console.error(
            "Failed to fetch customer balance:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching customer balance:", error);

        if (error.response) {
          console.error("Response error:", error.response.data);
          console.error("Request error:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
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
        quantity: 1,
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

  useEffect(() => {
    const userId = sessionStorage.getItem("UserId");
    if (!userId) {
      navigate("/"); // Redirect to login if UserId is not found
    }
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

  useEffect(() => {
    if (productForm.quantity && productForm.Rate) {
      setProductForm((prev) => ({
        ...prev,
        amount: Number(prev.quantity) * Number(prev.Rate), // Ensures no NaN issues
      }));
    }
  }, [productForm.quantity, productForm.Rate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.name === "amount") {
      e.preventDefault();
      console.log("this is productForm", productForm);
      console.log("Available products:", products);
      const { product, checkIn, checkOut, quantity, Rate, amount, id } =
        productForm;

      if (!product) {
        alert("Please fill all product fields");
        return;
      }
      const selectedProduct = products.find(
        (p) => Number(p.Item_Id) === Number(product)
      );

      console.log("selected pro", selectedProduct);

      setGridData((prev) => [
        ...prev,
        {
          id: id || crypto.randomUUID(),
          product: selectedProduct.Name,
          checkIn,
          checkOut,
          quantity: Number(quantity),
          Rate:Number(Rate),
          amount,
        },
      ]);
      console.log("added grid data", gridData);
      setProductForm((prev) => ({
        ...prev,
        product: "",
        checkIn: "",
        checkOut: "",
        quantity: "",
        Rate: "",
        amount: "",
        id: "",
      }));
    }
  };

  useEffect(() => {
    console.log("Updated Grid Data in useeffect:", gridData);
    const total = gridData.reduce((acc, item) => acc + (item.amount || 0), 0);
    setAmountForm((prev) => ({
      ...prev,
      NetAmount: total,
    }));
    console.log(total);
  }, [gridData]);

  const columnDefs = [
    { headerName: "ID", field: "id", hide: true },
    { headerName: "Product", field: "product", width: 240 },
    { headerName: "Check In", field: "checkIn", width: 120 },
    { headerName: "Check Out", field: "checkOut", width: 120, editable: true },
    { headerName: "Quantity", field: "quantity", width: 120 },
    { headerName: "Rate", field: "Rate", width: 120 },
    { headerName: "Amount", field: "amount", width: 120 },
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
  const handleTempSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission

    // Validate that required fields are filled
    if (!selectedCustomer || !gridData.length) {
      toast.error("Please select a customer and add at least one product!");
      return;
    }

    const payload = {
      User_Id: sessionStorage.getItem("UserId"),
      customerId: selectedCustomer,
      email: formData.Email,
      contactNo: formData.ContactNo,
      products: gridData, // Sending the gridData array as products
      selectedId: selectedId,
    };

    console.log("Payload:", payload);

    try {
      let response;
      if (selectedId !== null) {
        response = await axiosinstance.post("sales/SalesUpdateWait", payload);
      } else {
        response = await axiosinstance.post("sales/SalesInsertWait", payload);
      }

      //const response = await axiosinstance.post("sales/saleinsert", payload);

      if (response.status === 200 && response.data.Valid) {
        toast.success("Sales entry created successfully!");
        // Clear form data and grid after successful submission
        setFormData({ Email: "", ContactNo: "" });
        setGridData([]);
        setSelectedCustomer("");
      } else {
        toast.error(response.data.Message || "Failed to create sales entry");
      }
    } catch (error) {
      console.error("Error creating sales entry:", error);
      toast.error("Failed to create sales entry");
    }
  };
  const handleTransactionSelect = (id) => {
    setSelectedId(id);
    axiosinstance
      .get(`sales/getSalesDetails/${id}`)
      .then((response) => {
        setGridData(response.data);
        if (response.data.length > 0) {
          const custdetail = {
            Email: response.data[0].Email || "",
            ContactNo: response.data[0].ContactNo || "",
          };
          setFormData(custdetail);
          setSelectedCustomer(response.data[0].Customer_Id || "");
        }
      })
      .catch((error) => {
        console.error("Error fetching sales details:", error);
      });
  };

  const handleRowClick = (event) => {
    const rowData = event.data;
    const selectedProduct = products.find((p) => p.Name === rowData.product);

    setProductForm({
      id: rowData.id,
      product: selectedProduct ? selectedProduct.Item_Id : "",
      checkIn: rowData.checkIn,
      checkOut: rowData.checkOut,
      quantity: rowData.quantity,
      Rate: rowData.Rate,
      amount: rowData.amount,
    });

    setGridData((prevData) => {
      const updatedData = prevData.filter(
        (row) => row.product !== rowData.product
      );
      return updatedData;
    });
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    setAmountForm((prev) => ({
      ...prev,
      [name]: value ? Number(value) : 0,
    }));
  };
  const handleKeyDownQuantity = (e) => {
    // If Enter key is pressed, prevent form submission
    if (e.key === "Enter" && e.target.name === "quantity") {
      e.preventDefault(); // Prevent form submission on Enter
      const quantity = parseFloat(productForm.quantity);
      // if (quantity > 0) {
      if (rateInputRef.current) {
        rateInputRef.current.focus();
      }
      // } else {
      //   toast.error("Quantity must be greater than 0");
      // }
    }
    if (e.key === "Enter" && e.target.name === "Rate") {
      e.preventDefault(); // Prevent form submission on Enter
      const rate = parseFloat(productForm.Rate);
      if (rate > 0) {
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      } else {
        toast.error("Rate must be greater than 0");
      }
    }
  };
  const handleMainSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission

    // Validate that required fields are filled
    if (!selectedCustomer || !gridData.length) {
      toast.error("Please select a customer and add at least one product!");
      return;
    }
    const { upi, cash, credit, NetAmount } = AmountForm;
    if (upi <= 0 && cash <= 0 && credit <= 0) {
      toast.error(
        "Please enter at least one of the payment fields: UPI, Cash, or Credit."
      );
      return;
    }
    console.log(Number(upi), "this is upi + cash + credit");
    console.log(Number(cash));
    console.log(Number(credit));
    console.log(Number(NetAmount), "netamt");
    if (upi + cash + credit !== NetAmount) {
      toast.error(
        "The sum of UPI, Cash, and Credit must equal the Net Amount."
      );
      return;
    }

    const payload = {
      User_Id: sessionStorage.getItem("UserId"),
      customerId: selectedCustomer,
      email: formData.Email,
      contactNo: formData.ContactNo,
      products: gridData, // Sending the gridData array as products
      Amount: AmountForm,
      selectedId: selectedId,
    };

    console.log("Payload:", payload);

    try {
      const response = await axiosinstance.post(
        "sales/salesinsertMain",
        payload
      );

      if (response.status === 200 && response.data.Valid) {
        toast.success("Sales entry created successfully!");
        ResetAll();
      } else {
        toast.error(response.data.Message || "Failed to create sales entry");
      }
    } catch (error) {
      console.error("Error creating sales entry:", error);
      toast.error("Failed to create sales entry");
    }
  };
  useEffect(() => {
    if (productForm.checkIn && productForm.checkOut) {
      const newQuantity = calculateTimeDifference(
        productForm.checkIn,
        productForm.checkOut
      );

      setProductForm((prev) => ({
        ...prev,
        quantity: newQuantity,
      }));
    }
  }, [productForm.checkIn, productForm.checkOut]);
  const calculateTimeDifference = (checkIn, checkOut) => {
    const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
    const [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);

    let checkInTime = checkInHours * 60 + checkInMinutes; // Convert to minutes
    let checkOutTime = checkOutHours * 60 + checkOutMinutes;

    if (checkOutTime < checkInTime) {
      // Handle overnight case (e.g., Check-In: 23:30, Check-Out: 01:00)
      checkOutTime += 24 * 60;
    }
    return checkOutTime - checkInTime;
  };
  const ResetAll = () => {
    setProductForm({
      id: 0,
      product: "",
      checkIn: "",
      checkOut: "",
      quantity: 0,
      Rate: 0,
      amount: 0,
    });
    setAmountForm({
      upi: 0,
      cash: 0,
      credit: 0,
      NetAmount: 0,
    });
    setFormData({
      Email: "",
      ContactNo: "",
    });
    setGridData([]);
    setSelectedCustomer("");
  };

  return (
    <div className="container">
      <NavBar />
      <main id="main" className="main">
        <div className="row pagetitle">
          <div className="col-md-3">
            <h1>Sales</h1>
            <nav>
              <ol className="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="#">
                    <i class="bi bi-house-door"></i>
                  </a>
                </li>
                <li className="breadcrumb-item active">Transactions</li>
                <li className="breadcrumb-item active">Sales</li>
              </ol>
            </nav>
          </div>
          <div className="col-md-9 d-flex justify-content-end">
            <button
              type="reset"
              className="btn btn-outline-dark"
              onClick={() => setMainModalIsOpen(true)}
            >
              Sales List
            </button>
            {MainmodalIsOpen && (
              <ViewMainSales
                isOpen={MainmodalIsOpen}
                onClose={() => setMainModalIsOpen(false)}
                // onSelectTransaction={handleTransactionSelect}
              />
            )}
          </div>
        </div>
        <section className="section">
          <div className="row">
            <div className="card">
              <div className="card-body">
                <form className="row g-3 mt-3">
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
                        name="ContactNo"
                        placeholder="Contact No"
                        value={formData.Balance}
                        onChange={handleChange}
                        required
                        readOnly
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
                          onClick={handleTempSubmit}
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
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          onClick={() => setModalIsOpen(true)}
                        >
                          View
                        </button>
                        {modalIsOpen && (
                          <ViewSales
                            isOpen={modalIsOpen}
                            onClose={() => setModalIsOpen(false)}
                            onSelectTransaction={handleTransactionSelect}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-2">
                      <input type="hidden" name="id" value={productForm.id} />
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
                        type="text"
                        className="form-control"
                        name="quantity"
                        value={productForm.quantity}
                        onChange={handleQuantityAndRateChange}
                        onKeyDown={handleKeyDownQuantity}
                      />
                    </div>
                    <div className="col-2">
                      <label htmlFor="inputNanme4" className="form-label">
                        Rate
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Rate"
                        value={productForm.Rate}
                        ref={rateInputRef}
                        onKeyDown={handleKeyDownQuantity}
                         onChange={handleQuantityAndRateChange}
                      />
                    </div>
                    <div className="col-2">
                      <label htmlFor="inputNanme4" className="form-label">
                        Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="amount"
                        value={productForm.amount}
                        onChange={handleProductChange}
                        ref={amountInputRef}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div
                      className="ag-theme-alpine custom-ag-grid"
                      style={{ height: "300px", width: "100%" }}
                    >
                      <AgGridReact
                        // key={gridData.length}
                        rowData={gridData}
                        columnDefs={columnDefs}
                        gridOptions={gridOptions}
                        onRowDoubleClicked={handleRowClick}
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    {/* <label htmlFor="inputNanme4" className="form-label">
                      Cash
                    </label> */}
                    <h2 class="card-title">Cash</h2>
                    <input
                      type="text"
                      className="form-control"
                      name="cash"
                      value={AmountForm.cash}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <div className="col-2">
                    <h2 class="card-title">UPI</h2>
                    <input
                      type="text"
                      className="form-control"
                      name="upi"
                      value={AmountForm.upi}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <div className="col-2">
                    <h2 class="card-title">Credit</h2>
                    <input
                      type="text"
                      className="form-control"
                      name="credit"
                      value={AmountForm.credit}
                      onChange={handleAmountChange}
                    />
                  </div>
                  <div className="col-6" style={{ textAlign: "right" }}>
                    <h4 class="card-title">Net Amount</h4>
                    <div class="ps-3">
                      <h6
                        style={{
                          fontSize: "28px",
                          color: "#012970",
                          fontWeight: 700,
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        ₹{AmountForm.NetAmount}
                      </h6>
                    </div>
                    {/* <div style={{ textAlign: "right" }}>
                      <h4>
                        <span id="lblNetAmount">{AmountForm.NetAmount}</span>
                      </h4>
                    </div> */}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <button
                      type="submit"
                      className="btn btn-outline-success"
                      style={{ marginRight: "10px" }}
                      onClick={handleMainSubmit}
                    >
                      Submit
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={ResetAll}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ToastContainer />
      <a
        href="#"
        className={`back-to-top d-flex align-items-center justify-content-center ${
          isVisible ? "active" : ""
        }`}
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
};

export default Sales;
