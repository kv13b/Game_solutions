import { useState } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../NavBar";

const Sales = () => {
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
    try {
      const response = await axiosinstance.post("master/client", FormData);

      if (response.status === 200) {
        toast("Client insertion successful");
        setFormData({
          Name: "",
          Address: "",
          ContactNo: "",
          Email: "",
          UserId: "",
        });
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast("Error inserting client data");
    }
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
                      <select id="inputState" class="form-select">
                        <option value="0" selected>
                          Select
                        </option>
                        <option value="1">ABC</option>
                        <option value="2">XYZ</option>
                      </select>
                    </div>
                    <div class="col-md-3">
                      <label for="inputState" class="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        value="shailu580@gmail.com"
                        disabled
                      />
                    </div>
                    <div class="col-md-2">
                      <label for="inputState" class="form-label">
                        Contact No
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        value="9060837081"
                        disabled
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
                      <div style={{ textAlign: "right" }}>
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
                      <div style={{ textAlign: "right" }}>
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
                      <select id="inputState" class="form-select">
                        <option value="0" selected>
                          Select
                        </option>
                        <option value="1">Pool 1</option>
                        <option value="2">Pool 1</option>
                        <option value="2">Play Station 1</option>
                        <option value="2">Play Station 1</option>
                        <option value="2">Juice</option>
                        <option value="2">Burger</option>
                      </select>
                    </div>
                    <div class="col-2">
                      <label for="inputTime" class="form-label">
                        Check In
                      </label>
                      <input type="time" class="form-control" />
                    </div>
                    <div class="col-2">
                      <label for="inputTime" class="form-label">
                        Check Out
                      </label>
                      <input type="time" class="form-control" />
                    </div>
                    <div class="col-2">
                      <label for="inputNanme4" class="form-label">
                        Quantity
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputNanme4"
                      />
                    </div>
                    <div class="col-2">
                      <label for="inputNanme4" class="form-label">
                        Rate
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputNanme4"
                      />
                    </div>
                    <div class="col-2">
                      <label for="inputNanme4" class="form-label">
                        Amount
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputNanme4"
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
