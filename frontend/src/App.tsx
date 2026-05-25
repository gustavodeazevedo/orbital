import { Routes, Route } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import Home from "./pages/landing/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardAppointments from "./pages/dashboard/DashboardAppointments";
import DashboardClients from "./pages/dashboard/DashboardClients";
import DashboardServices from "./pages/dashboard/DashboardServices";

const App = () => {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="agendamentos" element={<DashboardAppointments />} />
          <Route path="clientes" element={<DashboardClients />} />
          <Route path="servicos" element={<DashboardServices />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
