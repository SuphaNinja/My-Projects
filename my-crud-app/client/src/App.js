
import 'react-toastify/dist/ReactToastify.css'
import { Route, Routes } from "react-router-dom";


import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";


function App() {
  return (
    <div className="bg-default no-scrollbar">
    <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/editpost/:postId" element={<EditPost />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
      
    </div>
  );
}

export default App;
