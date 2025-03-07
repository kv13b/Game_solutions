import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css';

import "/src/assets/vendor/bootstrap/css/bootstrap.min.css";
import "/src/assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "/src/assets/vendor/boxicons/css/boxicons.min.css";
import "/src/assets/vendor/quill/quill.snow.css";
import "/src/assets/vendor/quill/quill.bubble.css";
import "/src/assets/vendor/remixicon/remixicon.css";
import "/src/assets/vendor/simple-datatables/style.css";
import "/src/assets/css/style.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
