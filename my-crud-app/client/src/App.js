import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";


function App() {
  return (
    <div className="bg-default h-screen">
    <ToastContainer />
    <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/createpost" element={<CreatePost />} />
      </Routes>
    </div>
  );
}

export default App;
