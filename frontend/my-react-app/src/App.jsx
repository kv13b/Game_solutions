import { Route, Routes, BrowserRouter } from "react-router-dom";
import SignIn from "./Components/SignUp";
import Home from "./Components/Home";
import ClientMaster from "./Components/Masters/ClientMaster";
import ProductMaster from "./Components/Masters/ProductMaster";
import Sales from "./Components/Transactions/Sales";
import Dashboard from "./Components/Dashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/client" element={<ClientMaster />} />
        <Route path="/Product" element={<ProductMaster />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Sales" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
