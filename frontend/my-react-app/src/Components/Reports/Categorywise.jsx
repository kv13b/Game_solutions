import { useState, useMemo, useCallback, useRef } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../NavBar";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([ExcelExportModule]);

const Categorywise = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [formData, setFormData] = useState({
    Email: "",
    ContactNo: "",
    customerId: 0,
    Balance: 0,
    Amount: 0,
  });
  const [selectedCatogory, setSelectedCatogory] = useState("");
  const gridRef = useRef(null);

  // Wrap handleSubmit with useCallback for optimization
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault(); // Prevent form refresh

      const userId = sessionStorage.getItem("UserId");
      const CatogoryId = selectedCatogory === "" ? 0 : selectedCatogory;
      const fromdate = formData.fromdate;
      const todate = formData.todate;

      try {
        const response = await axiosinstance.get(
          `sales/GetCategoryWise/${CatogoryId}?fromdate=${fromdate}&todate=${todate}&User_Id=${userId}`
        );
        setGridData(response.data);
        if (response.data.length > 0) {
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching Receipt details:", error);
        toast.error("Error fetching sales register data");
      }
    },
    [formData, selectedCatogory]
  );

  const columnDefs = [
    {
      headerName: "Tran Date",
      field: "Tran_Date",
      width: 120,
      valueFormatter: function (params) {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      headerName: "Tran No",
      field: "Tran_No",
      width: 120,
    },
    {
      headerName: "Name",
      field: "Name",
      width: 150,
    },
    {
      headerName: "Category",
      field: "Category",
      width: 100,
    },
    {
      headerName: "Amount",
      field: "Amount",
      width: 120,
    },
  ];

  const gridOptions = {
    api: null,
    columnApi: null,
    onGridReady: (params) => {
      params.api.sizeColumnsToFit();
      params.api.getAllColumns().forEach((column) => {
        column.getColDef().autoSize = true;
      });
      params.api.autoSizeColumns(params.columnApi.getAllColumns());
    },
  };

  const defaultExcelExportParams = useMemo(() => {
    return {
      exportAsExcelTable: true,
    };
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const sendEmail = async () => {
    setIsLoading(true);
    let totalAmount = 0;

    gridData.forEach((row) => {
      totalAmount += row.Amount || 0;
    });

    const emailContent = ` <html lang="en">
      <head>
        <style>
          table { 
            border-collapse: collapse;
            font-family: Arial, sans-serif;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .total-row {
            font-weight: bold;
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h3 style="font-family: Arial, sans-serif; color: #333;">Sales Register</h3>
        <table>
          <thead>
            <tr>
              <th>Tran Date</th>
              <th>Tran No</th>
              <th>Name</th>
              <th>Category</th> 
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${gridData
              .map(
                (row) => `
                <tr>
                  <td>${new Date(row.Tran_Date).toLocaleDateString()}</td>
                  <td>${row.Tran_No}</td>
                  <td>${row.Name}</td>
                  <td>${row.Category}</td> 
                  <td>${row.Amount}</td>
                </tr>`
              )
              .join("")}
            <!-- Add the total row -->
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Total</td>
              <td> </td> 
              <td>${totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;

    const fromDate = formData.fromdate;
    const toDate = formData.todate;
    const emailSubject = `Category wise   ${fromDate}   ${toDate}`;
    const emailData = {
      // to: "Akshay.amin3@gmail.com,Nehasshetty0037@gmail.com", // The recipient's email
      to: "shailu580@gmail.com,karthikbhatt22@gmail.com", // The recipient's email
      subject: emailSubject,
      body: emailContent,
    };

    try {
      const response = await axiosinstance.post(
        "auth/SendMailCategoryWise",
        emailData
      );
      if (response.status === 200) {
        setTimeout(() => {
          setIsLoading(false); // Reset loading state after action is complete
        }, 500);
        toast.success("Email sent successfully");
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  const handleChangeCategory = (event) => {
    const CategoryId = event.target.value;
    setSelectedCatogory(CategoryId);
  };

  return (
    <div className="container">
      <NavBar />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Category Wise</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Reports</a>
              </li>
              <li className="breadcrumb-item active">Category Wise</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Category Wise</h5>
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    {/* Customer Dropdown */}
                    <div className="col-md-4">
                      <label htmlFor="inputState" className="form-label">
                        Category
                      </label>
                      <select
                        id="inputState"
                        class="form-select"
                        value={selectedCatogory}
                        onChange={handleChangeCategory}
                      >
                        <option value="0" selected>
                          Select Category
                        </option>
                        <option value="1">Gamimg</option>
                        <option value="2">Food</option>
                      </select>
                    </div>

                    {/* From Date Input */}
                    <div className="col-md-3">
                      <label htmlFor="fromdate" className="form-label">
                        From Date:
                      </label>
                      <input
                        type="date"
                        id="fromdate"
                        name="fromdate"
                        value={formData.fromdate}
                        onChange={(e) =>
                          setFormData({ ...formData, fromdate: e.target.value })
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    {/* To Date Input */}
                    <div className="col-md-3">
                      <label htmlFor="todate" className="form-label">
                        To Date:
                      </label>
                      <input
                        type="date"
                        id="todate"
                        name="todate"
                        value={formData.todate}
                        onChange={(e) =>
                          setFormData({ ...formData, todate: e.target.value })
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-2 d-flex justify-content-between align-items-end">
                      <button type="submit" className="btn btn-outline-success">
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Data Grid */}
                  <div className="row mb-3">
                    <div
                      className="ag-theme-alpine custom-ag-grid"
                      style={{ height: "300px", width: "100%" }}
                    >
                      <AgGridReact
                        ref={gridRef}
                        key={gridData.length}
                        rowData={gridData}
                        columnDefs={columnDefs}
                        gridOptions={gridOptions}
                        defaultExcelExportParams={defaultExcelExportParams}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      style={{ marginRight: "10px" }}
                      onClick={onBtExport}
                    >
                      Export to Excel
                    </button>

                    <button
                      className={`btn btn-outline-success ${
                        isLoading ? "disabled" : ""
                      }`}
                      type="button"
                      onClick={!isLoading ? sendEmail : null}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading...
                        </>
                      ) : (
                        "Send Mail"
                      )}
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

export default Categorywise;
