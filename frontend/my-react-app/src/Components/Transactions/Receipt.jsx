import { useState } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../NavBar";

const Receipt = () => {
  const [FormData, setFormData] = useState({
    Name: "",
    Address: "",
    ContactNo: "",
    Email: "",
    UserId: "", // remove this from input
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh

    // Validate if customer is selected
    if (selectedCustomer === "0") {
      toast.error("Please select a customer");
      return; // Stop form submission
    }

    // Validate amount field
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return; // Stop form submission
    }

    try {
      const response = await axiosinstance.post("master/client", FormData);

      if (response.status === 200) {
        toast.success("Client insertion successful");
        setFormData({
          Name: "",
          Address: "",
          ContactNo: "",
          Email: "",
          UserId: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error inserting client data");
    }
  };

  return (
    <div className="container">
      <NavBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Receipt</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Transactions</a>
              </li>
              <li className="breadcrumb-item active">Receipt</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Receipt Entry</h5>

                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label htmlFor="inputState" className="form-label">
                        Customer
                      </label>
                      <select id="inputState" className="form-select" required>
                        <option value="0">Select</option>
                        <option value="1">ABC</option>
                        <option value="2">XYZ</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="inputState" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value="shailu580@gmail.com"
                        disabled
                      />
                    </div>

                    <div className="col-md-2">
                      <label htmlFor="inputState" className="form-label">
                        Contact No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value="9060837081"
                        disabled
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

                    <div className="col-md-2">
                      <label htmlFor="inputState" className="form-label">
                        Amount
                      </label>
                      <input type="number" className="form-control" required />
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <button
                      type="submit"
                      className="btn btn-outline-success"
                      style={{ marginRight: "10px" }}
                    >
                      Save
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
      <ToastContainer />
    </div>
  );
};

export default Receipt;
