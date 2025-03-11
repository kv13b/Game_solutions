import { useState, useEffect } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import NavBar from "../NavBar";
import { ClientSideRowModelModule } from "ag-grid-community";

const ClientMaster = () => {
  const [rowData, setRowData] = useState([]);
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
      const response = await axiosinstance.post("client/master", FormData);

      if (response.status === 200) {
        toast.success("Client insertion successful");
        fetchClients();
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
  const fetchClients = async () => {
    try {
      const response = await axiosinstance.get("client");
      if (response.status === 200 && response.data.Valid) {
        setRowData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  const columnDefs = [
    { headerName: "ID", field: "Customer_Id", sortable: true, filter: true },
    { headerName: "Name", field: "Name", sortable: true, filter: true },
    { headerName: "Address", field: "Address", sortable: true, filter: true },
    {
      headerName: "Contact No",
      field: "ContactNo",
      sortable: true,
      filter: true,
    },
    { headerName: "Email", field: "Email", sortable: true, filter: true },
    { headerName: "User ID", field: "UserId", sortable: true, filter: true },
    {
      headerName: "Entry Date",
      field: "Entry_Date",
      sortable: true,
      filter: true,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
  ];
  return (
    <div className="container">
      <NavBar />
      <main id="main" class="main">
        <div class="pagetitle">
          <h1>Customer Master</h1>
          <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="#">Master</a>
              </li>
              <li class="breadcrumb-item active">Customer Master</li>
            </ol>
          </nav>
        </div>

        <section class="section">
          <ToastContainer />
          <div class="row">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Enter Customer Details</h5>

                <form class="row g-3" onSubmit={handleSubmit}>
                  <div class="col-md-12">
                    <input
                      type="text"
                      class="form-control"
                      name="Name"
                      placeholder="Your Name"
                      value={FormData.Name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <input
                      type="email"
                      class="form-control"
                      name="Email"
                      placeholder="Email"
                      value={FormData.Email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <input
                      type="text"
                      class="form-control"
                      name="ContactNo"
                      placeholder="Contact No"
                      value={FormData.ContactNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div class="col-12">
                    <input
                      type="text"
                      class="form-control"
                      name="Address"
                      placeholder="Address"
                      value={FormData.Address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary">
                      Submit
                    </button>
                    {/* <button type="reset" class="btn btn-secondary">Reset</button> */}
                  </div>
                </form>
              </div>
              <div
                className="ag-theme-alpine custom-ag-grid"
                style={{
                  height: "200px",
                  width: "90%",
                  margin: "20px auto",
                  borderRadius: "10px",
                }}
              >
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={5}
                  modules={[ClientSideRowModelModule]}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientMaster;
