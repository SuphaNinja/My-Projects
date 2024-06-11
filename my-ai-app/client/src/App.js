import { ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NewClient from "./pages/NewClient";
import MyJourney from "./pages/MyJourney";




function App() {

  
  

  return (
    <div className="bg-slate-400 h-screen">
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newclient" element={<NewClient />} />
        <Route path="/myjourney" element={<MyJourney />} />
      </Routes>
    </div>
  );
}

export default App;
