import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import HomeUser from "../pages/User/Home";
import TaskUser from "../pages/User/Task";
import EditTaskUser from "../pages/User/EditTask";
import UpdateTaskUser from "../pages/User/UpdateTask";
import CategoryUser from "../pages/User/Category";
import AllUsersAdmin from "../pages/Admin/AllUsers";
import UpdateUserAdmin from "../pages/Admin/UpdateUser";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home-user" element={<HomeUser />} />
      <Route path="/task-user" element={<TaskUser />} />
      <Route path="/edit-user" element={<EditTaskUser />} />
      <Route path="/update-user" element={<UpdateTaskUser />} />
      <Route path="/add-categories-user" element={<CategoryUser />} />
      <Route path="/all-users-adm" element={<AllUsersAdmin />} />
      <Route path="/update-user-admin" element={<UpdateUserAdmin />} />
    </Routes>
  );
};

export default AppRoutes;
