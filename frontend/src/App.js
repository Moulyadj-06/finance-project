
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ViewerDashboard from "./pages/ViewerDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Helper to get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

function App() {
  const user = getCurrentUser();

  // Role-based dashboard route
  const DashboardRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    switch (user.role) {
      case "viewer":
        return <ViewerDashboard />;
      case "analyst":
        return <AnalystDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Landing page is now default "/" */}
        <Route path="/" element={<Landing />} />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route path="/viewer-dashboard" element={user?.role === "viewer" ? <ViewerDashboard /> : <Navigate to="/login" />} />
        <Route path="/analyst-dashboard" element={user?.role === "analyst" ? <AnalystDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />

        {/* Catch-all: unknown routes go to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;