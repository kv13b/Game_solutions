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
                            <li class="breadcrumb-item"><a href="#">Transactions</a></li>
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
                                        <div class="col-3">
                                            <label for="inputNanme4" class="form-label">Sales Date</label>
                                            <input type="date" class="form-control" id="inputNanme4" />
                                        </div>
                                        <div class="col-md-3">
                                            <label for="inputState" class="form-label">Payment Mode</label>
                                            <select id="inputState" class="form-select">
                                                <option value="0" selected>Select</option>
                                                <option value="1">Cash</option>
                                                <option value="2">Credit</option>
                                            </select>
                                        </div>
                                        <div class="col-md-5">
                                            <label for="inputState" class="form-label">Customer</label>
                                            <select id="inputState" class="form-select">
                                                <option value="0" selected>Select</option>
                                                <option value="1">ABC</option>
                                                <option value="2">XYZ</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <div class="col-3">
                                            <label for="inputNanme4" class="form-label">Product</label>
                                            <input type="text" class="form-control" id="inputNanme4" />
                                        </div>
                                        <div class="col-2">
                                            <label for="inputNanme4" class="form-label">Quantity</label>
                                            <input type="text" class="form-control" id="inputNanme4" />
                                        </div>
                                        <div class="col-2">
                                            <label for="inputNanme4" class="form-label">Rate</label>
                                            <input type="text" class="form-control" id="inputNanme4" />
                                        </div>
                                        <div class="col-2">
                                            <label for="inputNanme4" class="form-label">Amount</label>
                                            <input type="text" class="form-control" id="inputNanme4" />
                                        </div>
                                        <div class="col-1 text-center">
                                        <label for="inputNanme4" class="form-label"> </label>
                                            <button type="submit" class="btn btn-primary">ADD</button>
                                        </div>
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

export default Sales;
