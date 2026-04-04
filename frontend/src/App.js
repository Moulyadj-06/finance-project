// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import 'bootstrap/dist/css/bootstrap.min.css';


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // ✅ import Navigate
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ViewerDashboard from "./pages/ViewerDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route "/" redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/viewer-dashboard" element={<ViewerDashboard />} />
        <Route path="/analyst-dashboard" element={<AnalystDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Catch-all: unknown routes go to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;