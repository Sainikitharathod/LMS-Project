import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showTrainerLogin, setShowTrainerLogin] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [empId, setEmpId] = useState('');

  const [trainerEmail, setTrainerEmail] = useState('');
  const [trainerId, setTrainerId] = useState('');

  const [studentEmail, setStudentEmail] = useState('');
  const [rollNo, setRollNo] = useState('');

  const navigate = useNavigate();

  const handleAdminClick = () => {
    setShowAdminLogin(true);
    setShowTrainerLogin(false);
    setShowStudentLogin(false);
  };

  const handleTrainerClick = () => {
    setShowTrainerLogin(true);
    setShowAdminLogin(false);
    setShowStudentLogin(false);
  };

  const handleStudentClick = () => {
    setShowStudentLogin(true);
    setShowAdminLogin(false);
    setShowTrainerLogin(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !empId) {
      alert('Please enter both Email and Employee ID');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, empId })
      });

      const data = await response.text();
      console.log("Admin Login Response:", response.status, data);

      if (response.ok) {
        navigate('/admin-dashboard');
      } else {
        alert(data || 'Invalid Admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Server error! Please try again later.');
    }
  };

  const handleTrainerLogin = async (e) => {
    e.preventDefault();
    if (!trainerEmail || !trainerId) {
      alert('Please enter both Email and Trainer ID');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/trainer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: trainerEmail, trainerId })
      });

      const data = await response.text();
      console.log("Trainer Login Response:", response.status, data);

      if (response.ok) {
        navigate('/trainer-dashboard');
      } else {
        alert(data || 'Invalid Trainer credentials');
      }
    } catch (error) {
      console.error('Trainer login error:', error);
      alert('Server error! Please try again later.');
    }
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (studentEmail && rollNo) {
      console.log("Student login details:", { studentEmail, rollNo });
      navigate('/student-dashboard');
    } else {
      alert('Please enter both Email and Roll Number');
    }
  };

  return (
    <div className="landing-container">
      <h1 className="landing-title">Learning Management System</h1>

      <div className="role-buttons">
        <button className="role-button" onClick={handleAdminClick}>Admin</button>
        <button className="role-button" onClick={handleTrainerClick}>Trainer</button>
        <button className="role-button" onClick={handleStudentClick}>Student</button>
      </div>

      {showAdminLogin && (
        <form className="login-form admin-login-form" onSubmit={handleAdminLogin}>
          <h2>Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}

      {showTrainerLogin && (
        <form className="login-form trainer-login-form" onSubmit={handleTrainerLogin}>
          <h2>Trainer Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={trainerEmail}
            onChange={(e) => setTrainerEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Trainer ID"
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}

      {showStudentLogin && (
        <form className="login-form student-login-form" onSubmit={handleStudentLogin}>
          <h2>Student Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default LandingPage;
