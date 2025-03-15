import { useState, useEffect } from "react";
import axiosinstance from "../../utils/axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import NavBar from "../NavBar";
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

const ProductMaster = () => {
  const [editFlag, setEditFlag] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [FormData, setFormData] = useState({
    Item_Id: "",
    Name: "",
    Rate: "",
    CategoryId: 0,
    UserId: sessionStorage.getItem("UserId"), // remove this from input
  });
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeCategory = (event) => {
    setFormData({ ...FormData, CategoryId: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh
    try {
      let response;
      if (editFlag) {
        response = await axiosinstance.put("product/ProductUpdate", FormData);
      } else {
        response = await axiosinstance.post("product/Productinsert", FormData);
      }
      if (response.status === 200) {
        toast.success(
          editFlag
            ? "Product updated successfully"
            : "Product insertion successful"
        );
        fetchProduct();
        setFormData({
          Item_Id: "",
          Name: "",
          Rate: "",
          CategoryId: "",
          UserId: sessionStorage.getItem("UserId"),
        });
        if (editFlag) {
          setEditFlag(false);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error inserting product data");
    }
  };
  const fetchProduct = async () => {
    try {
      const response = await axiosinstance.get("product/getProduct");
      if (response.status === 200 && response.data.Valid) {
        setRowData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Product data:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

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

  const handleRowClick = (event) => {
    const rowData = event.data;
    setFormData({
      Item_Id: rowData.Item_Id,
      Name: rowData.Name,
      Rate: rowData.Rate,
      CategoryId: rowData.CategoryId,
      UserId: rowData.UserId || "",
    });
    setEditFlag(true);
  };

  const handleReset = (event) => {
    setFormData({
      Item_Id: '',
      Name: '',
      Rate: '',
      CategoryId: '',
      UserId: '',
    });
    setEditFlag(false);
  }

  // const contains = (target, lookingFor) => {
  //   return target && target.indexOf(lookingFor) >= 0;
  // };

  const athleteFilterParams = {
    filterOptions: ["contains", "notContains"],
    textFormatter: (r) => {
      if (r == null) return null;
      return r
        .toLowerCase()
        .replace(/[àáâãäå]/g, "a")
        .replace(/æ/g, "ae")
        .replace(/ç/g, "c")
        .replace(/[èéêë]/g, "e")
        .replace(/[ìíîï]/g, "i")
        .replace(/ñ/g, "n")
        .replace(/[òóôõö]/g, "o")
        .replace(/œ/g, "oe")
        .replace(/[ùúûü]/g, "u")
        .replace(/[ýÿ]/g, "y");
    },
    debounceMs: 200,
    maxNumConditions: 1,
  };

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "Item_Id", sortable: true, width: 50 },
    {
      headerName: "Name",
      field: "Name",
      sortable: true,
      filter: true,
      filterParams: athleteFilterParams,
      width: 400,
    },
    {
      headerName: "Rate",
      field: "Rate",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Category",
      field: "CategoryId",
      sortable: true,
      filter: true,
      width: 200,
      hide: true,
    },
    {
      headerName: "Category Name", // This header will show Gaming or Food
      field: "CategoryId", // We are using CategoryId to display the correct name
      sortable: true,
      filter: true,
      width: 200,
      valueGetter: (params) => {
        // Conditionally return "Gaming" or "Food" based on CategoryId
        return params.data.CategoryId === 1 ? "Gaming" : params.data.CategoryId === 2 ? "Food" : "Unknown";
      }
    },
  ]);

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
          <h1>Product Master</h1>
          <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="#">Master</a>
              </li>
              <li class="breadcrumb-item active">Product Master</li>
            </ol>
          </nav>
        </div>

        <section class="section">
          <ToastContainer />
          <div class="row">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Enter Product Details</h5>

                <form class="row g-3" onSubmit={handleSubmit}>
                  <div class="col-md-3">
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
                  <div class="col-md-3">
                    <input
                      type="text"
                      class="form-control"
                      name="Rate"
                      placeholder="Rate"
                      value={FormData.Rate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div class="col-md-3"> 
                    <select id="inputState" class="form-select" value={FormData.CategoryId}
                      onChange={handleChangeCategory} >
                      <option value="0" selected>Select Category</option>
                      <option value="1">Gamimg</option>
                      <option value="2">Food</option>
                    </select>
                  </div>
                  <div class="col-1">
                    <button type="submit" class="btn btn-outline-success">
                      ADD
                    </button>
                  </div>
                  <div class="col-1">
                    <button type="reset" class="btn btn-outline-secondary" onClick={handleReset}>Reset</button>
                  </div>
                </form>
              </div>
              <div
                className="ag-theme-alpine custom-ag-grid"
                style={{ height: 400, width: "100%" }}
              >
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  gridOptions={gridOptions}
                  onRowDoubleClicked={handleRowClick}
                  modules={[ClientSideRowModelModule]}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <a
        href="#"
        className={`back-to-top d-flex align-items-center justify-content-center ${isVisible ? "active" : ""
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

export default ProductMaster;
