// src/Dashboards/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminEmpId = location.state?.adminEmpId || "EMP001";
  const adminEmail = "admin@gmail.com";

  const [activeTab, setActiveTab] = useState('home');
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    trainerId: '',
    role: '',
    status: '1',
  });
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [editTrainer, setEditTrainer] = useState(null);

  const courseOptions = [
    'Web Development', 'Data Science', 'Machine Learning', 'Cyber Security',
    'Cloud Computing', 'Mobile App Development', 'Java Full Stack', 'Python Full Stack',
    'Java', 'React'
  ].map(course => ({ label: course, value: course }));

  const roleOptions = [
    'Senior Trainer',
    'Junior Trainer',
    'Guest Trainer',
    'Mentor',
    'Instructor',
  ];

  const courseSubjectsMapping = {
    'Web Development': ['HTML', 'CSS', 'JavaScript', 'React'],
    'Data Science': ['Python', 'Pandas', 'Numpy', 'Matplotlib'],
    'Machine Learning': ['Regression', 'Classification', 'Clustering', 'Deep Learning'],
    'Cyber Security': ['Network Security', 'Cryptography', 'Ethical Hacking'],
    'Cloud Computing': ['AWS', 'Azure', 'Google Cloud'],
    'Mobile App Development': ['Flutter', 'React Native', 'Android Development'],
    'Java Full Stack': ['Frontend', 'Backend', 'Database'],
    'Python Full Stack': ['Python', 'SQL', 'Django'],
    'Java': ['OOPs', 'Collections', 'Streams'],
    'React': ['Hooks', 'State', 'Props'],
  };

  useEffect(() => {
    if (!adminEmpId) {
      alert("Admin Emp ID not found. Redirecting to login.");
      navigate('/');
    } else {
      setActiveTab('view');
    }
  }, [adminEmpId, navigate]);

  useEffect(() => {
    if (activeTab === 'view') fetchTrainers();
  }, [activeTab]);

  const fetchTrainers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trainers/admin/${adminEmpId}`);
      if (Array.isArray(response.data)) {
        setTrainers(response.data);
      } else {
        setTrainers([]);
        console.error('Expected trainers as array but got:', response.data);
      }
    } catch (err) {
      console.error("Error fetching trainers:", err);
      alert("Failed to load trainers.");
    }
  };

  const handleLogout = () => navigate('/');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedCourse(values);
    setSelectedSubjects([]);
  };

  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSubjects(prev =>
      checked ? [...prev, value] : prev.filter(s => s !== value)
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      trainerId: '',
      role: '',
      status: '1',
    });
    setSelectedCourse([]);
    setSelectedSubjects([]);
    setEditTrainer(null);
  };

  const handleRegisterTrainer = async (e) => {
    e.preventDefault();

    const { name, email, trainerId, role, status } = formData;

    if (!name.trim() || !email.trim() || !trainerId.trim() || !role.trim() || !status.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    if (selectedCourse.length === 0) {
      alert("Please select at least one course.");
      return;
    }

    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }

    const addedOn = editTrainer?.addedOn || new Date().toISOString();

    const trainerPayload = {
      employeeId: trainerId,
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      status: status.trim(),
      addedOn,
      course: selectedCourse.join(', '),
      subjects: selectedSubjects.join(', '),
      adminEmpId,
    };

    try {
      if (editTrainer) {
        await axios.put(
          `http://localhost:8080/api/trainers/admin/${adminEmpId}/trainer/${editTrainer.employeeId}`,
          trainerPayload
        );
        alert('Trainer updated successfully.');
      } else {
        await axios.post(
          `http://localhost:8080/api/trainers/admin/${adminEmpId}/add`,
          trainerPayload
        );
        alert('Trainer registered successfully.');
      }

      await fetchTrainers();
      resetForm();
      setActiveTab('view');
    } catch (err) {
      console.error("Trainer save error:", err);
      alert("Error saving trainer: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTrainer = (trainerId) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;

    axios.delete(`http://localhost:8080/api/trainers/${trainerId}`)
      .then(() => {
        setTrainers(prev => prev.filter(t => t.employeeId !== trainerId));
        alert('Trainer deleted successfully.');
      })
      .catch(err => {
        console.error("Error deleting trainer:", err);
        alert("Error deleting trainer: " + err.message);
      });
  };

  const handleEditTrainer = (trainerId) => {
    const trainer = trainers.find(t => t.employeeId === trainerId);
    if (trainer) {
      setFormData({
        name: trainer.name || '',
        email: trainer.email || '',
        trainerId: trainer.employeeId || '',
        role: trainer.role || '',
        status: trainer.status || '1',
      });

      const selectedCourses = trainer.course ? trainer.course.split(',').map(c => c.trim()) : [];
      const selectedSubjects = trainer.subjects ? trainer.subjects.split(',').map(s => s.trim()) : [];

      setSelectedCourse(selectedCourses);
      setSelectedSubjects(selectedSubjects);
      setEditTrainer(trainer);
      setActiveTab('add');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="navbar">
        <div className="navbar-content">
          <div className="logo">Admin Dashboard</div>
          <span className="admin-email">{adminEmail}</span>
        </div>
      </header>

      <div className="main-body">
        <aside className="sidebar">
          <button onClick={() => { resetForm(); setActiveTab('add'); }}>
            Add Trainer
          </button>
          <button onClick={() => setActiveTab('view')}>View Trainers</button>
          <button onClick={handleLogout}>Logout</button>
        </aside>

        <main className="dashboard-content">
          {activeTab === 'add' && (
            <form className="trainer-form centered-form" onSubmit={handleRegisterTrainer}>
              <h2>{editTrainer ? 'Edit Trainer' : 'Register Trainer'}</h2>

              <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleInputChange} />
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} />
              <input type="text" name="trainerId" placeholder="Trainer ID" required value={formData.trainerId} onChange={handleInputChange} disabled={!!editTrainer} />

              <label>Role:</label>
              <select name="role" required value={formData.role} onChange={handleInputChange}>
                <option value="">Select Role</option>
                {roleOptions.map((role, idx) => (
                  <option key={idx} value={role}>{role}</option>
                ))}
              </select>

              <label>Courses:</label>
              <Select
                options={courseOptions}
                isMulti
                value={courseOptions.filter(option => selectedCourse.includes(option.value))}
                onChange={handleCourseChange}
              />

              {selectedCourse.length > 0 && (
                <>
                  <label>Subjects:</label>
                  <div className="subjects-checkbox-group">
                    {[...new Set(selectedCourse.flatMap(course => courseSubjectsMapping[course] || []))].map((subject, idx) => (
                      <label key={idx}>
                        <input
                          type="checkbox"
                          value={subject}
                          checked={selectedSubjects.includes(subject)}
                          onChange={handleSubjectChange}
                        />
                        {subject}
                      </label>
                    ))}
                  </div>
                </>
              )}

              <label>Status:</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <button type="submit">{editTrainer ? 'Update' : 'Register'} Trainer</button>
            </form>
          )}

          {activeTab === 'view' && (
            <div>
              <h2>Trainers List</h2>
              <table>
                <thead>
                  <tr>
                    <th>Trainer ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Courses</th>
                    <th>Subjects</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((trainer, idx) => (
                    <tr key={idx}>
                      <td>{trainer.employeeId}</td>
                      <td>{trainer.name}</td>
                      <td>{trainer.email}</td>
                      <td>{trainer.role}</td>
                      <td>{trainer.status === '1' ? 'Active' : 'Inactive'}</td>
                      <td>{trainer.course}</td>
                      <td>{trainer.subjects}</td>
                      <td>
  <div className="action-buttons">
    <button className="edit-btn" onClick={() => handleEditTrainer(trainer.employeeId)}>Edit</button>
    <button className="delete-btn" onClick={() => handleDeleteTrainer(trainer.employeeId)}>Delete</button>
  </div>
</td>


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
