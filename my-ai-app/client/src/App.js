import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NewClient from "./pages/NewClient";
import MyJourney from "./pages/MyJourney";
import MyClients from "./pages/MyClients";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import ShoppingCart from "./pages/ShoppingCart";
import Footer from "./components/Footer";




function App() {

  return (
    <div className="bg-slate-400 min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newclient" element={<NewClient />} />
        <Route path="/myjourney" element={<MyJourney />} />
        <Route path="/myclients" element={<MyClients />} />
        <Route path="/myclients/:userId" element={<MyClients />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/productPage/:productId" element={<ProductPage />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
      </Routes>
      <Footer/>
      <ToastContainer />
    </div>
  );
}

export default App;
