import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Students from "./pages/Students";
import Layout from "./components/Layout";
import DashBoard from "./pages/DashBoard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/signup' element={<Signup />} />
        <Route path='/auth/forgotpassword' element={<ForgotPassword />} />
        <Route path='/auth/reset' element={<ResetPassword />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path='/students' element={<Students />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
