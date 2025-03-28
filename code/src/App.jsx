
// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import EditUser from "./EditUser";
import Users from "./Users";
import Login from "./Login";
import "./styles.css";

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Users List Route */}
        <Route path="/users" element={<Users />} />

        {/* Edit User Route */}
        <Route path="/edit-user/:id" element={<EditUser />} />

        {/* Catch-all Route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </div>
  );
};

export default App;
