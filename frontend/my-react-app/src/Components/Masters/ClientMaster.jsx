import { useState } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../NavBar";


const ClientMaster = () => {
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
          <h1>Customer Master</h1>
          <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">Master</a></li>
              <li class="breadcrumb-item active">Customer Master</li>
            </ol>
          </nav>
        </div>

        <section class="section">
          <div class="row">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Enter Customer Details</h5>

                <form class="row g-3" onSubmit={handleSubmit}>
                  <div class="col-md-12">
                    <input type="text" class="form-control"  name="Name" placeholder="Your Name" value={FormData.Name}
                      onChange={handleChange} required />
                  </div>
                  <div class="col-md-6">
                    <input type="email" class="form-control"  name="Email" placeholder="Email" value={FormData.Email}
                      onChange={handleChange} required />
                  </div>
                  <div class="col-md-6">
                    <input type="text" class="form-control"  name="ContactNo" placeholder="Contact No" value={FormData.ContactNo}
                      onChange={handleChange} required />
                  </div>
                  <div class="col-12">
                    <input type="text" class="form-control"  name="Address" placeholder="Address" value={FormData.Address}
                      onChange={handleChange} required />
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary">Submit</button>
                    {/* <button type="reset" class="btn btn-secondary">Reset</button> */}
                  </div>
                </form>

              </div>
            </div>
          </div>
        </section>
      </main >
    </div >
  );
};

export default ClientMaster;
