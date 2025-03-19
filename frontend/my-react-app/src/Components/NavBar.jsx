import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  // State to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle function for sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Use useEffect to add/remove 'toggle-sidebar' className to body when the state changes
  useEffect(() => {
    const storedUserName = sessionStorage.getItem("UserName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (isSidebarOpen) {
      document.body.classList.add("toggle-sidebar");
    } else {
      document.body.classList.remove("toggle-sidebar");
    }
  }, [isSidebarOpen]); // Runs when `isSidebarOpen` changes

  const handleCustomer = () => {
    navigate("/client", { replace: true });
  };

  const handleDashboard = () => {
    navigate("/client", { replace: true });
  };

  const handleProduct = () => {
    navigate("/Product", { replace: true });
  };
  const handleSales = () => {
    navigate("/Sales", { replace: true });
  };
  const handleReceipt = () => {
    navigate("/Receipt", { replace: true });
  };
  const handleSignOut = () => {
    navigate("/", { replace: true });
  };

  return (
    <div>
      {/* Header */}
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <a
            href="#"
            onClick={handleDashboard}
            className="logo d-flex align-items-center"
          >
            {/* <img src="/img/logo.png" alt="" /> */}
            <span className="d-none d-lg-block">ABC</span>
          </a>
          <i
            className="bi bi-list toggle-sidebar-btn"
            onClick={toggleSidebar}
          ></i>
        </div>

        <div className="search-bar">
          <form
            className="search-form d-flex align-items-center"
            method="POST"
            action="#"
          >
            <input
              type="text"
              name="query"
              placeholder="Search"
              title="Enter search keyword"
            />
            <button type="button" title="Search">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>

            <li className="nav-item dropdown">
              {/* <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">4</span>
              </a> */}

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  You have 4 new notifications
                  <a href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>Lorem Ipsum</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>30 min. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-x-circle text-danger"></i>
                  <div>
                    <h4>Atque rerum nesciunt</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>1 hr. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <div>
                    <h4>Sit rerum fuga</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>2 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-info-circle text-primary"></i>
                  <div>
                    <h4>Dicta reprehenderit</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>4 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-footer">
                  <a href="#">Show all notifications</a>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              {/* <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-success badge-number">3</span>
              </a> */}

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                  You have 3 new messages
                  <a href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img
                      src="/img/messages-1.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>Maria Hudson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>4 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img
                      src="/img/messages-2.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>Anna Nelson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>6 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img
                      src="/img/messages-3.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>David Muldon</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>8 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                  <a href="#">Show all messages</a>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
              >
                {/* <img
                  src="/img/profile-img.jpg"
                  alt="Profile"
                  className="rounded-circle"
                /> */}
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  {userName}
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>Hi!</h6>
                  <span>{userName}</span>
                </li>
                {/* <li>
                  <hr className="dropdown-divider" />
                </li> */}

                {/* <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="users-profile.html"
                  >
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </a>
                </li> */}
                {/* <li>
                  <hr className="dropdown-divider" />
                </li> */}

                {/* <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="users-profile.html"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </a>
                </li> */}
                <li>
                  <hr className="dropdown-divider" />
                </li>

                {/* <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="pages-faq.html"
                  >
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </a>
                </li> */}
                {/* <li>
                  <hr className="dropdown-divider" />
                </li> */}

                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    onClick={handleSignOut}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`sidebar ${isSidebarOpen ? "active" : ""}`}
      >
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <a className="nav-link " href="#" onClick={handleDashboard}>
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#components-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>Masters</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="components-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <a href="#" onClick={handleCustomer}>
                  <i className="bi bi-circle"></i>
                  <span>Customer Master</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={handleProduct}>
                  <i className="bi bi-circle"></i>
                  <span>Product Master</span>
                </a>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#forms-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-journal-text"></i>
              <span>Transactions</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="forms-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <a href="#" onClick={handleSales}>
                  <i className="bi bi-circle"></i>
                  <span>Sales</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={handleReceipt}>
                  <i className="bi bi-circle"></i>
                  <span>Receipt</span>
                </a>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#charts-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-bar-chart"></i>
              <span>Reports</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <a href="charts-apexcharts.html">
                  <i className="bi bi-circle"></i>
                  <span>Sales Register</span>
                </a>
              </li>
              <li>
                <a href="charts-chartjs.html">
                  <i className="bi bi-circle"></i>
                  <span>Customer Register</span>
                </a>
              </li>
              <li>
                <a href="charts-echarts.html">
                  <i className="bi bi-circle"></i>
                  <span>Product Register</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default NavBar;
