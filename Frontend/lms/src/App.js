// src/App.js
//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './Dashboards/AdminDashboard';
import TrainerDashboard from './Dashboards/TrainerDashboard';
import StudentDashboard from './Dashboards/StudentDashboard'; // Import StudentDashboard

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} /> {/* Add Student Dashboard Route */}
      </Routes>
    </Router>
  );
};

export default App;
