import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('home'); // To track which tab to show
  const [courseName, setCourseName] = useState('');
  const [courses, setCourses] = useState([]); // To store added courses

  // Handle course registration
  const handleRegisterCourse = () => {
    if (courseName) {
      setCourses([...courses, courseName]);
      setCourseName('');
      alert('Course Added Successfully!');
    } else {
      alert('Please enter a course name');
    }
  };

  return (
    <div className="student-dashboard-container">
      <div className="sidebar">
        <h2>Student Dashboard</h2>
        <ul>
          <li><button onClick={() => setActiveTab('add')}>Add Courses</button></li>
          <li><button onClick={() => setActiveTab('view')}>View Courses</button></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </div>

      <div className="dashboard-content">
        {activeTab === 'home' && <h3>Welcome, Student!</h3>}

        {/* Add Courses Form */}
        {activeTab === 'add' && (
          <div className="form-container">
            <h3>Add a New Course</h3>
            <form className="course-form">
              <input
                type="text"
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
              <button type="button" onClick={handleRegisterCourse}>Add Course</button>
            </form>
          </div>
        )}

        {/* View Courses Section */}
        {activeTab === 'view' && (
          <div>
            <h3>Courses Enrolled</h3>
            {courses.length === 0 ? (
              <p>You have not enrolled in any courses yet.</p>
            ) : (
              <ul>
                {courses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
