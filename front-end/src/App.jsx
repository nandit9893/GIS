import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/:userID" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
