import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TrainerDashboard.css";

// Use environment variables for dynamic configuration
const trainerEmail = process.env.REACT_APP_TRAINER_EMAIL || "T004"; // Replace with auth mechanism
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "home");
  const [assignmentType, setAssignmentType] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [mcqsAdded, setMcqsAdded] = useState("");
  const [programsAdded, setProgramsAdded] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState(null);
  const [questions, setQuestions] = useState([
    {
      type: "MCQ",
      mcqs: [{ text: "", options: ["", "", "", ""], answer: null }],
      programs: [{ text: "", solution: "", testCases: [{ input: "", output: "" }] }],
    },
  ]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAssignmentIndex, setViewAssignmentIndex] = useState(null);
  const [showEditQuestionsModal, setShowEditQuestionsModal] = useState(false);

  // Utility to convert string to title case
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/assessments/trainer/${trainerEmail}`);
        const backendAssignments = response.data.map((assessment) => ({
          id: assessment.id,
          type: assessment.assessmentType || "MCQ",
          assignmentname: toTitleCase(assessment.assessmentName || ""),
          totalQuestions: assessment.numberOfQuestions || 0,
          mcqsAdded: assessment.numberOfMcq || 0,
          programsAdded: assessment.numberOfPrograms || 0,
          status: assessment.assessmentStatus || "Active",
          createdBy: assessment.createdBy || "Trainer",
          addedOn: assessment.paperAddedOn || new Date().toLocaleString(),
          questions: [],
        }));
        setAssignments(backendAssignments);
        localStorage.setItem("assignments", JSON.stringify(backendAssignments));

        for (const assignment of backendAssignments) {
          if (assignment.id) {
            const paperResponse = await axios.get(`${API_BASE_URL}/api/assessment-papers/trainer/${trainerEmail}`);
            const questions = paperResponse.data.map((paper) => ({
              type: paper.type || "",
              mcqs: paper.mcqs || [],
              programs: paper.programs || [],
            }));
            setAssignments((prev) =>
              prev.map((a) => (a.id === assignment.id ? { ...a, questions } : a))
            );
          }
        }
        localStorage.setItem("assignments", JSON.stringify(assignments));
      } catch (error) {
        console.error("Error fetching assessments:", {
          message: error.message,
          response: error.response ? {
            status: error.response.status,
            info: error.response.data,
          } : null,
        });
        alert("Failed to fetch assessments. Please check if the backend is running and trainer exists in the trainer table.");
      }
    };

    fetchAssessments();
  }, []);

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    window.location.href = "/";
  };

  const checkDuplicateName = async (name) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/assessments`);
      const normalizedName = toTitleCase(name).toLowerCase();
      return response.data.some(
        (assessment) => toTitleCase(assessment.assessmentName).toLowerCase() === normalizedName
      );
    } catch (error) {
      console.error("Error checking duplicate name:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      alert("Failed to check for duplicate names. Please try again.");
      return true; // Prevent saving on error to avoid duplicates
    }
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentType || !assignmentName || !totalQuestions || totalQuestions <= 0) {
      alert("Please fill all required fields with valid values.");
      return;
    }
    if ((assignmentType === "MCQ" || assignmentType === "Both") && (!mcqsAdded || mcqsAdded <= 0)) {
      alert("Please specify a valid number of MCQs.");
      return;
    }
    if ((assignmentType === "Program" || assignmentType === "Both") && (!programsAdded || programsAdded <= 0)) {
      alert("Please specify a valid number of programs.");
      return;
    }

    const normalizedAssignmentName = toTitleCase(assignmentName);
    if (editIndex === null && (await checkDuplicateName(normalizedAssignmentName))) {
      alert(`Assessment name "${normalizedAssignmentName}" already exists. Please choose a different name.`);
      return;
    }

    const newAssignment = {
      assessmentType: assignmentType,
      assessmentName: normalizedAssignmentName,
      numberOfQuestions: Number(totalQuestions) || 0,
      numberOfMcq: (assignmentType === "MCQ" || assignmentType === "Both") ? (Number(mcqsAdded) || 0) : 0,
      numberOfPrograms: (assignmentType === "Program" || assignmentType === "Both") ? (Number(programsAdded) || 0) : 0,
      assessmentStatus: "Active",
      createdBy: "Trainer",
      paperAddedOn: new Date().toISOString().substring(0, 19),
      paperAddedStatus: 0,
      status: true,
      trainer: { employeeId: trainerEmail },
      manager: { empId: "EMP001" },
    };

    try {
      console.log("Sending payload:", JSON.stringify(newAssignment, null, 2));
      let updatedAssignments;
      if (editIndex !== null) {
        const assignmentId = assignments[editIndex]?.id;
        if (!assignmentId) {
          alert("Invalid assignment ID for update.");
          return;
        }
        const response = await axios.put(`${API_BASE_URL}/api/assessments/${assignmentId}`, newAssignment);
        updatedAssignments = [...assignments];
        updatedAssignments[editIndex] = {
          id: response.data.id,
          type: response.data.assessmentType,
          assignmentname: toTitleCase(response.data.assessmentName),
          totalQuestions: response.data.numberOfQuestions,
          mcqsAdded: response.data.numberOfMcq,
          programsAdded: response.data.numberOfPrograms,
          status: response.data.assessmentStatus,
          createdBy: response.data.createdBy,
          addedOn: response.data.paperAddedOn,
          questions: assignments[editIndex].questions || [],
        };
        setAssignments(updatedAssignments);
        alert("Assignment updated!");
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/assessments`, newAssignment);
        const createdAssignment = {
          id: response.data.id,
          type: response.data.assessmentType,
          assignmentname: toTitleCase(response.data.assessmentName),
          totalQuestions: response.data.numberOfQuestions,
          mcqsAdded: response.data.numberOfMcq,
          programsAdded: response.data.numberOfPrograms,
          status: response.data.assessmentStatus,
          createdBy: response.data.createdBy,
          addedOn: response.data.paperAddedOn,
          questions: [],
        };
        updatedAssignments = [...assignments, createdAssignment];
        setAssignments(updatedAssignments);
        alert("Assignment added!");
      }
      localStorage.setItem("assignments", JSON.stringify(updatedAssignments));
      setAssignmentType("");
      setAssignmentName("");
      setTotalQuestions("");
      setMcqsAdded("");
      setProgramsAdded("");
      setEditIndex(null);
      setShowEditQuestionsModal(false);
    } catch (error) {
      console.error("Error saving assessment:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      let errorMessage = "Failed to save assessment.";
      if (error.response?.status === 409 || (typeof error.response?.data === "string" && error.response.data.includes("Duplicate entry"))) {
        errorMessage = `Assessment name "${normalizedAssignmentName}" already exists in the database. Please choose a different name.`;
      } else if (typeof error.response?.data === "object" && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response?.data === "string") {
        errorMessage = error.response.data;
      }
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEdit = (index) => {
    const item = assignments[index];
    setAssignmentName(toTitleCase(item.assignmentname));
    setAssignmentType(item.type);
    setTotalQuestions(item.totalQuestions);
    setMcqsAdded(item.mcqsAdded);
    setProgramsAdded(item.programsAdded);
    setQuestions(
      item.questions.length > 0
        ? item.questions
        : [
            {
              type: "MCQ",
              mcqs: [{ text: "", options: ["", "", "", ""], answer: null }],
              programs: [{ text: "", solution: "", testCases: [{ input: "", output: "" }] }],
            },
          ]
    );
    setEditIndex(index);
    setSelectedAssignmentIndex(index);
    setActiveTab("addAssignment");
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const assignmentId = assignments[index].id;
        await axios.delete(`${API_BASE_URL}/api/assessments/${assignmentId}`);
        const updated = assignments.filter((_, i) => i !== index);
        setAssignments(updated);
        localStorage.setItem("assignments", JSON.stringify(updated));
        alert("Assignment deleted!");
      } catch (error) {
        console.error("Error deleting assessment:", error);
        alert("Failed to delete assessment. Please try again.");
      }
    }
  };

  const handleAddPaper = (index) => {
    setSelectedAssignmentIndex(index);
    const selectedAssignment = assignments[index];
    setQuestions(
      selectedAssignment.questions.length > 0
        ? selectedAssignment.questions
        : [
            {
              type: "MCQ",
              mcqs: [{ text: "", options: ["", "", "", ""], answer: null }],
              programs: [{ text: "", solution: "", testCases: [{ input: "", output: "" }] }],
            },
          ]
    );
    setShowModal(true);
  };

  const handleView = (index) => {
    setViewAssignmentIndex(index);
    setShowViewModal(true);
  };

  const handleQuestionTypeChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].type = value;
    if (value === "MCQ") {
      updated[qIndex].mcqs = [{ text: "", options: ["", "", "", ""], answer: null }];
      updated[qIndex].programs = [];
    } else if (value === "Program") {
      updated[qIndex].programs = [{ text: "", solution: "", testCases: [{ input: "", output: "" }] }];
      updated[qIndex].mcqs = [];
    } else if (value === "Both") {
      updated[qIndex].mcqs = [{ text: "", options: ["", "", "", ""], answer: null }];
      updated[qIndex].programs = [{ text: "", solution: "", testCases: [{ input: "", output: "" }] }];
    }
    setQuestions(updated);
  };

  const handleMcqChange = (qIndex, mIndex, field, value) => {
    const updated = [...questions];
    if (field === "text") {
      updated[qIndex].mcqs[mIndex].text = value;
    } else if (field === "options") {
      updated[qIndex].mcqs[mIndex].options = value;
      if (updated[qIndex].mcqs[mIndex].answer >= value.length) {
        updated[qIndex].mcqs[mIndex].answer = null;
      }
    } else if (field === "answer") {
      updated[qIndex].mcqs[mIndex].answer = value === "" ? null : parseInt(value);
    }
    setQuestions([...updated]);
  };

  const handleProgramChange = (qIndex, pIndex, field, value, tIndex = null) => {
    const updated = [...questions];
    if (field === "text" || field === "solution") {
      updated[qIndex].programs[pIndex][field] = value;
    } else if (field === "testCaseInput" && tIndex !== null) {
      updated[qIndex].programs[pIndex].testCases[tIndex].input = value;
    } else if (field === "testCaseOutput" && tIndex !== null) {
      updated[qIndex].programs[pIndex].testCases[tIndex].output = value;
    }
    setQuestions([...updated]);
  };

  const addNewMcq = (qIndex) => {
    const assignment = assignments[selectedAssignmentIndex];
    const maxMcqs = parseInt(assignment?.mcqsAdded) || 0;
    const currentMcqs = questions.reduce((sum, q) => sum + (q.mcqs?.length || 0), 0);

    if (currentMcqs >= maxMcqs) {
      alert(`Cannot add more MCQs. Limit of ${maxMcqs} MCQs reached.`);
      return;
    }

    const updated = [...questions];
    updated[qIndex].mcqs.push({ text: "", options: ["", "", "", ""], answer: null });
    setQuestions(updated);
  };

  const addNewProgram = (qIndex) => {
    const assignment = assignments[selectedAssignmentIndex];
    const maxPrograms = parseInt(assignment?.programsAdded) || 0;
    const currentPrograms = questions.reduce((sum, q) => sum + (q.programs?.length || 0), 0);

    if (currentPrograms >= maxPrograms) {
      alert(`Cannot add more programs. Limit of ${maxPrograms} programs reached.`);
      return;
    }

    const updated = [...questions];
    updated[qIndex].programs.push({ text: "", solution: "", testCases: [{ input: "", output: "" }] });
    setQuestions(updated);
  };

  const addTestCase = (qIndex, pIndex) => {
    const updated = [...questions];
    updated[qIndex].programs[pIndex].testCases.push({ input: "", output: "" });
    setQuestions(updated);
  };

  const removeTestCase = (qIndex, pIndex, tIndex) => {
    const updated = [...questions];
    if (updated[qIndex].programs[pIndex].testCases.length > 1) {
      updated[qIndex].programs[pIndex].testCases.splice(tIndex, 1);
      setQuestions(updated);
    }
  };

  const removeMcq = (qIndex, mIndex) => {
    const updated = [...questions];
    if (updated[qIndex].mcqs.length > 1) {
      updated[qIndex].mcqs.splice(mIndex, 1);
      setQuestions(updated);
    }
  };

  const removeProgram = (qIndex, pIndex) => {
    const updated = [...questions];
    if (updated[qIndex].programs.length > 1) {
      updated[qIndex].programs.splice(pIndex, 1);
      setQuestions(updated);
    }
  };

  const addNewQuestion = () => {
    const assignment = assignments[selectedAssignmentIndex];
    const maxMcqs = parseInt(assignment?.mcqsAdded) || 0;
    const maxPrograms = parseInt(assignment?.programsAdded) || 0;
    const currentMcqs = questions.reduce((sum, q) => sum + (q.mcqs?.length || 0), 0);
    const currentPrograms = questions.reduce((sum, q) => sum + (q.programs?.length || 0), 0);

    if (currentMcqs >= maxMcqs && currentPrograms >= maxPrograms) {
      alert(`Cannot add more question sets. MCQ limit (${maxMcqs}) and program limit (${maxPrograms}) reached.`);
      return;
    }

    setQuestions([
      ...questions,
      {
        type: "MCQ",
        mcqs: [{ text: "", options: ["", "", "", ""], answer: null }],
        programs: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updated = [...questions];
      updated.splice(index, 1);
      setQuestions(updated);
    }
  };

  const saveQuestions = async () => {
    const assignment = assignments[selectedAssignmentIndex];
    if (!assignment || !assignment.id) {
      alert("Error: No valid assignment selected. Please try again.");
      console.error("Invalid assignment or assignment ID:", { assignment, selectedAssignmentIndex });
      return;
    }

    const maxMcqs = parseInt(assignment?.mcqsAdded) || 0;
    const maxPrograms = parseInt(assignment?.programsAdded) || 0;
    const currentMcqs = questions.reduce((sum, q) => sum + (q.mcqs?.length || 0), 0);
    const currentPrograms = questions.reduce((sum, q) => sum + (q.programs?.length || 0), 0);

    if (currentMcqs > maxMcqs) {
      alert(`Cannot save. Number of MCQs (${currentMcqs}) exceeds the limit of ${maxMcqs}.`);
      return;
    }
    if (currentPrograms > maxPrograms) {
      alert(`Cannot save. Number of programs (${currentPrograms}) exceeds the limit of ${maxPrograms}.`);
      return;
    }

    // Validate question content
    for (const question of questions) {
      if (question.type === "MCQ" || question.type === "Both") {
        if (!question.mcqs || question.mcqs.length === 0) {
          alert("Error: At least one MCQ is required for MCQ or Both question types.");
          return;
        }
        for (const mcq of question.mcqs) {
          if (!mcq.text || mcq.text.trim() === "") {
            alert("Error: MCQ question text cannot be empty.");
            return;
          }
          if (!mcq.options || mcq.options.length !== 4 || mcq.options.some(opt => opt.trim() === "")) {
            alert("Error: Each MCQ must have exactly 4 non-empty options.");
            return;
          }
          if (mcq.answer === null || mcq.answer < 0 || mcq.answer >= mcq.options.length) {
            alert("Error: Each MCQ must have a valid correct answer selected.");
            return;
          }
        }
      }
      if (question.type === "Program" || question.type === "Both") {
        if (!question.programs || question.programs.length === 0) {
          alert("Error: At least one program is required for Program or Both question types.");
          return;
        }
        for (const program of question.programs) {
          if (!program.text || program.text.trim() === "") {
            alert("Error: Program question text cannot be empty.");
            return;
          }
          if (!program.solution || program.solution.trim() === "") {
            alert("Error: Program solution cannot be empty.");
            return;
          }
          if (!program.testCases || program.testCases.length === 0 || program.testCases.some(tc => !tc.input || !tc.output)) {
            alert("Error: Each program must have at least one test case with non-empty input and output.");
            return;
          }
        }
      }
    }

    try {
      const assignmentId = assignment.id;
      console.log("Saving questions for assignmentId:", assignmentId);
      for (const question of questions) {
        const questionsString = JSON.stringify({
          type: question.type,
          mcqs: question.mcqs || [],
          programs: question.programs || [],
        });
        if (questionsString.length > 1000) {
          alert("Error: Questions data exceeds 1000 characters. Please reduce the content.");
          return;
        }
        const assessmentPaper = {
          manager: { empId: "EMP001" },
          trainer: { employeeId: trainerEmail },
          assessmentDate: new Date().toISOString(),
          questions: questionsString,
          courseName: assignment.assignmentname,
          assessmentName: assignment.assignmentname,
          addedBy: "Trainer",
          status: true,
        };
        console.log("Sending payload:", JSON.stringify(assessmentPaper, null, 2));
        await axios.post(`${API_BASE_URL}/api/assessment-papers`, assessmentPaper);
      }

      const updatedAssignments = [...assignments];
      updatedAssignments[selectedAssignmentIndex].questions = questions;
      setAssignments(updatedAssignments);
      localStorage.setItem("assignments", JSON.stringify(updatedAssignments));
      alert("Questions saved successfully!");
      setShowModal(false);
      setShowEditQuestionsModal(false);
    } catch (error) {
      console.error("Error saving questions:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
      });
      let errorMessage = "Failed to save questions. Please try again.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Invalid question data. Please check your inputs and ensure all required fields are filled.";
        } else if (error.response.status === 404) {
          errorMessage = "Assessment or trainer not found. Ensure the assignment and trainer (T004) exist in the database.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please check if the backend is running and try again.";
        }
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEditQuestions = () => {
    setShowEditQuestionsModal(true);
  };

  const assignmentNameOptions = [
    "HTML Basics",
    "CSS Fundamentals",
    "JavaScript Essentials",
    "React Introduction",
    "Java Programming",
    "Data Structures",
    "Spring Boot API",
    "machine learning",
  ];

  return (
    <div className="trainer-dashboard">
      <header className="trainer-navbar">
        <h1 className="trainer-logo">Trainer Dashboard</h1>
        <span className="trainer-email">trainer@gmail.com</span>
      </header>

      <div className="trainer-body">
        <aside className="trainer-sidebar">
          <button onClick={() => setActiveTab("viewStudents")}>View Students</button>
          <button onClick={() => setActiveTab("addAssignment")}>Add Assignment</button>
          <button onClick={() => setActiveTab("viewAssignment")}>View Assignment</button>
          <button onClick={() => setActiveTab("viewResult")}>View Result</button>
          <button onClick={handleLogout}>Logout</button>
        </aside>

        <main className="trainer-main-content">
          {activeTab === "addAssignment" && (
            <div className="form-container">
              <h2>{editIndex !== null ? "Edit Assignment" : "Add Assignment"}</h2>
              <div className="trainer-assignment-form">
                <label>Assignment Type:</label>
                <br />
                <label>
                  <input
                    type="radio"
                    value="MCQ"
                    checked={assignmentType === "MCQ"}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  MCQ
                </label>
                <label>
                  <input
                    type="radio"
                    value="Program"
                    checked={assignmentType === "Program"}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  Program
                </label>
                <label>
                  <input
                    type="radio"
                    value="Both"
                    checked={assignmentType === "Both"}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  Both
                </label>
                <br />
                <br />

                <label>Assignment Name:</label>
                <br />
                <select value={assignmentName} onChange={(e) => setAssignmentName(toTitleCase(e.target.value))}>
                  <option value="">-- Select Assignment --</option>
                  {assignmentNameOptions.map((name, idx) => (
                    <option key={idx} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <br />
                <br />

                {assignmentType && (
                  <>
                    <label>Total Number of Questions:</label>
                    <br />
                    <input
                      type="number"
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(e.target.value)}
                      min="1"
                    />
                    <br />
                    <br />
                  </>
                )}

                {(assignmentType === "MCQ" || assignmentType === "Both") && (
                  <>
                    <label>MCQs Added:</label>
                    <br />
                    <input
                      type="number"
                      value={mcqsAdded}
                      onChange={(e) => setMcqsAdded(e.target.value)}
                      min="1"
                    />
                    <br />
                    <br />
                  </>
                )}

                {(assignmentType === "Program" || assignmentType === "Both") && (
                  <>
                    <label>Programs Added:</label>
                    <br />
                    <input
                      type="number"
                      value={programsAdded}
                      onChange={(e) => setProgramsAdded(e.target.value)}
                      min="1"
                    />
                    <br />
                    <br />
                  </>
                )}

                <button onClick={handleSaveAssignment} className="view-btn">
                  {editIndex !== null ? "Update" : "Add"} Assignment
                </button>
                {editIndex !== null && (
                  <button onClick={handleEditQuestions} className="edit-questions-btn">
                    Edit Questions
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "viewAssignment" && (
            <div className="assignment-list">
              <h2>Assignments</h2>
              {assignments.length === 0 ? (
                <p>No assignments available.</p>
              ) : (
                <table className="assignment-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Total Questions</th>
                      <th>MCQs Added</th>
                      <th>Programs Added</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th>Added On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((item, index) => (
                      <tr key={index}>
                        <td>{item.assignmentname}</td>
                        <td>{item.type}</td>
                        <td>{item.totalQuestions || 0}</td>
                        <td>{item.mcqsAdded || 0}</td>
                        <td>{item.programsAdded || 0}</td>
                        <td>{item.status}</td>
                        <td>{item.createdBy}</td>
                        <td>{item.addedOn}</td>
                        <td className="action-buttons">
                          <button onClick={() => handleEdit(index)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(index)} className="delete-btn">
                            Delete
                          </button>
                          <button onClick={() => handleAddPaper(index)} className="add-btn">
                            Add
                          </button>
                          <button onClick={() => handleView(index)} className="view-btn">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "viewStudents" && <h2>Student List</h2>}
          {activeTab === "viewResult" && <h2>View Result</h2>}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">
                  Add Questions for {assignments[selectedAssignmentIndex]?.assignmentname}
                </h3>
                <div className="question-paper-container">
                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-container">
                      <div className="question-header">
                        <h4>Question Set {qIndex + 1}</h4>
                        <div className="question-actions">
                          {questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(qIndex)}
                              className="remove-question-btn"
                            >
                              Remove Question Set
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="question-type">
                        <label>Question Type:</label>
                        <div className="type-options">
                          <label>
                            <input
                              type="radio"
                              value="MCQ"
                              checked={question.type === "MCQ"}
                              onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                            />
                            MCQ
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="Program"
                              checked={question.type === "Program"}
                              onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                            />
                            Program
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="Both"
                              checked={question.type === "Both"}
                              onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                            />
                            Both
                          </label>
                        </div>
                      </div>

                      {(question.type === "MCQ" || question.type === "Both") && (
                        <div className="mcq-section">
                          <h5>MCQ Questions</h5>
                          {question.mcqs.map((mcq, mIndex) => (
                            <div key={mIndex} className="mcq-container">
                              <div className="mcq-header">
                                <h6>MCQ {mIndex + 1}</h6>
                                {question.mcqs.length > 1 && (
                                  <button
                                    onClick={() => removeMcq(qIndex, mIndex)}
                                    className="remove-mcq-btn"
                                  >
                                    Remove MCQ
                                  </button>
                                )}
                              </div>
                              <div className="question-text">
                                <label>Question Text:</label>
                                <textarea
                                  value={mcq.text}
                                  onChange={(e) => handleMcqChange(qIndex, mIndex, "text", e.target.value)}
                                  placeholder="Enter MCQ question text..."
                                  className="question-textarea"
                                />
                              </div>
                              <div className="options-container">
                                <label>Options:</label>
                                <div className="options-grid">
                                  {mcq.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="option-item">
                                      <input
                                        type="text"
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                          const newOptions = [...mcq.options];
                                          newOptions[oIndex] = e.target.value;
                                          handleMcqChange(qIndex, mIndex, "options", newOptions);
                                        }}
                                        className="option-input"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="correct-answer-container">
                                  <label>Correct Answer:</label>
                                  <select
                                    value={mcq.answer !== null ? mcq.answer : ""}
                                    onChange={(e) => handleMcqChange(qIndex, mIndex, "answer", e.target.value)}
                                    className="correct-answer-select"
                                  >
                                    <option value="">Select Correct Answer</option>
                                    {mcq.options.map((_, oIndex) => (
                                      <option key={oIndex} value={oIndex}>
                                        Option {oIndex + 1}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addNewMcq(qIndex)}
                            className="add-mcq-btn"
                            disabled={
                              questions.reduce((sum, q) => sum + (q.mcqs?.length || 0), 0) >=
                              parseInt(assignments[selectedAssignmentIndex]?.mcqsAdded || 0)
                            }
                          >
                            Add New MCQ
                          </button>
                        </div>
                      )}

                      {(question.type === "Program" || question.type === "Both") && (
                        <div className="program-section">
                          <h5>Program Questions</h5>
                          {question.programs.map((program, pIndex) => (
                            <div key={pIndex} className="program-container">
                              <div className="program-header">
                                <h6>Program {pIndex + 1}</h6>
                                {question.programs.length > 1 && (
                                  <button
                                    onClick={() => removeProgram(qIndex, pIndex)}
                                    className="remove-program-btn"
                                  >
                                    Remove Program
                                  </button>
                                )}
                              </div>
                              <div className="question-text">
                                <label>Question Text:</label>
                                <textarea
                                  value={program.text}
                                  onChange={(e) => handleProgramChange(qIndex, pIndex, "text", e.target.value)}
                                  placeholder="Enter program question text..."
                                  className="question-textarea"
                                />
                              </div>
                              <div className="solution-section">
                                <label>Sample Solution:</label>
                                <textarea
                                  value={program.solution}
                                  onChange={(e) => handleProgramChange(qIndex, pIndex, "solution", e.target.value)}
                                  placeholder="Enter sample solution code..."
                                  className="solution-textarea"
                                />
                              </div>
                              <div className="test-cases-section">
                                <label>Test Cases:</label>
                                {program.testCases.map((testCase, tIndex) => (
                                  <div key={tIndex} className="test-case-container">
                                    <div className="test-case-header">
                                      <h6>Test Case {tIndex + 1}</h6>
                                      {program.testCases.length > 1 && (
                                        <button
                                          onClick={() => removeTestCase(qIndex, pIndex, tIndex)}
                                          className="remove-test-case-btn"
                                        >
                                          Remove Test Case
                                        </button>
                                      )}
                                    </div>
                                    <div className="test-case-input">
                                      <label>Input:</label>
                                      <input
                                        type="text"
                                        value={testCase.input}
                                        onChange={(e) =>
                                          handleProgramChange(qIndex, pIndex, "testCaseInput", e.target.value, tIndex)
                                        }
                                        placeholder="Enter input..."
                                        className="test-case-input-field"
                                      />
                                    </div>
                                    <div className="test-case-output">
                                      <label>Expected Output:</label>
                                      <input
                                        type="text"
                                        value={testCase.output}
                                        onChange={(e) =>
                                          handleProgramChange(qIndex, pIndex, "testCaseOutput", e.target.value, tIndex)
                                        }
                                        placeholder="Enter expected output..."
                                        className="test-case-output-field"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addTestCase(qIndex, pIndex)}
                                  className="add-test-case-btn"
                                >
                                  Add Test Case
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addNewProgram(qIndex)}
                            className="add-program-btn"
                            disabled={
                              questions.reduce((sum, q) => sum + (q.programs?.length || 0), 0) >=
                              parseInt(assignments[selectedAssignmentIndex]?.programsAdded || 0)
                            }
                          >
                            Add New Program
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="modal-buttons">
                    <button
                      onClick={addNewQuestion}
                      className="add-question-btn"
                      disabled={
                        questions.reduce((sum, q) => sum + (q.mcqs?.length || 0), 0) >=
                          parseInt(assignments[selectedAssignmentIndex]?.mcqsAdded || 0) &&
                        questions.reduce((sum, q) => sum + (q.programs?.length || 0), 0) >=
                          parseInt(assignments[selectedAssignmentIndex]?.programsAdded || 0)
                      }
                    >
                      Add New Question
                    </button>
                    <button onClick={saveQuestions} className="save-btn">
                      Save
                    </button>
                    <button onClick={() => setShowModal(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showViewModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">
                  View Question Paper: {assignments[viewAssignmentIndex]?.assignmentname}
                </h3>
                <div className="question-paper-container">
                  <h4>Questions</h4>
                  {assignments[viewAssignmentIndex]?.questions.length > 0 ? (
                    assignments[viewAssignmentIndex].questions.map((question, qIndex) => (
                      <div key={qIndex} className="question-container">
                        <h5>Question Set {qIndex + 1} ({question.type})</h5>
                        {(question.type === "MCQ" || question.type === "Both") && (
                          <div className="mcq-section">
                            <h6>MCQ Questions</h6>
                            {question.mcqs.map((mcq, mIndex) => (
                              <div key={mIndex} className="mcq-container">
                                <p><strong>MCQ {mIndex + 1}:</strong> {mcq.text}</p>
                                <ul>
                                  {mcq.options.map((opt, oIndex) => (
                                    <li key={oIndex}>Option {oIndex + 1}: {opt}</li>
                                  ))}
                                </ul>
                                <p>
                                  <strong>Correct Answer:</strong>{" "}
                                  {mcq.answer !== null && mcq.answer >= 0 && mcq.answer < mcq.options.length
                                    ? `Option ${mcq.answer + 1}`
                                    : "No answer selected"}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        {(question.type === "Program" || question.type === "Both") && (
                          <div className="program-section">
                            <h6>Program Questions</h6>
                            {question.programs.map((program, pIndex) => (
                              <div key={pIndex} className="program-container">
                                <p><strong>Program {pIndex + 1}:</strong> {program.text}</p>
                                <p><strong>Sample Solution:</strong></p>
                                <pre>{program.solution}</pre>
                                <h6>Test Cases</h6>
                                {program.testCases.map((testCase, tIndex) => (
                                  <div key={tIndex} className="test-case-container">
                                    <p><strong>Test Case {tIndex + 1}</strong></p>
                                    <p>Input: {testCase.input}</p>
                                    <p>Expected Output: {testCase.output}</p>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No questions saved yet.</p>
                  )}
                </div>
                <div className="modal-buttons">
                  <button onClick={() => setShowViewModal(false)} className="cancel-btn">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditQuestionsModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">
                  Edit Questions for {assignments[selectedAssignmentIndex]?.assignmentname}
                </h3>
                <div className="question-paper-container">
                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-container">
                      <div className="question-header">
                        <h4>Question Set {qIndex + 1}</h4>
                        <div className="question-actions">
                          {questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(qIndex)}
                              className="remove-question-btn"
                            >
                              Remove Question Set
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="question-type">
                        <label>Question Type:</label>
                        <div className="type-options">
                          <label>
                            <input
                              type="radio"
                              value="MCQ"
                              checked={question.type === "MCQ"}
                              onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                            />
                            MCQ
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="Program"
                              checked={question.type === "Program"}
                              onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                            />
                            Program
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="Both"
                              checked={question.type === "Both"}
                              onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                            />
                            Both
                          </label>
                        </div>
                      </div>

                      {(question.type === "MCQ" || question.type === "Both") && (
                        <div className="mcq-section">
                          <h5>MCQ Questions</h5>
                          {question.mcqs.map((mcq, mIndex) => (
                            <div key={mIndex} className="mcq-container">
                              <div className="mcq-header">
                                <h6>MCQ {mIndex + 1}</h6>
                                {question.mcqs.length > 1 && (
                                  <button
                                    onClick={() => removeMcq(qIndex, mIndex)}
                                    className="remove-mcq-btn"
                                  >
                                    Remove MCQ
                                  </button>
                                )}
                              </div>
                              <div className="question-text">
                                <label>Question Text:</label>
                                <textarea
                                  value={mcq.text}
                                  onChange={(e) => handleMcqChange(qIndex, mIndex, "text", e.target.value)}
                                  placeholder="Enter MCQ question text..."
                                  className="question-textarea"
                                />
                              </div>
                              <div className="options-container">
                                <label>Options:</label>
                                <div className="options-grid">
                                  {mcq.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="option-item">
                                      <input
                                        type="text"
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                          const newOptions = [...mcq.options];
                                          newOptions[oIndex] = e.target.value;
                                          handleMcqChange(qIndex, mIndex, "options", newOptions);
                                        }}
                                        className="option-input"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="correct-answer-container">
                                  <label>Correct Answer:</label>
                                  <select
                                    value={mcq.answer !== null ? mcq.answer : ""}
                                    onChange={(e) => handleMcqChange(qIndex, mIndex, "answer", e.target.value)}
                                    className="correct-answer-select"
                                  >
                                    <option value="">Select Correct Answer</option>
                                    {mcq.options.map((_, oIndex) => (
                                      <option key={oIndex} value={oIndex}>
                                        Option {oIndex + 1}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addNewMcq(qIndex)}
                            className="add-mcq-btn"
                            disabled={
                              questions.reduce((sum, q) => sum + (q.mcqs?.length || 0), 0) >=
                              parseInt(assignments[selectedAssignmentIndex]?.mcqsAdded || 0)
                            }
                          >
                            Add New MCQ
                          </button>
                        </div>
                      )}

                      {(question.type === "Program" || question.type === "Both") && (
                        <div className="program-section">
                          <h5>Program Questions</h5>
                          {question.programs.map((program, pIndex) => (
                            <div key={pIndex} className="program-container">
                              <div className="program-header">
                                <h6>Program {pIndex + 1}</h6>
                                {question.programs.length > 1 && (
                                  <button
                                    onClick={() => removeProgram(qIndex, pIndex)}
                                    className="remove-program-btn"
                                  >
                                    Remove Program
                                  </button>
                                )}
                              </div>
                              <div className="question-text">
                                <label>Question Text:</label>
                                <textarea
                                  value={program.text}
                                  onChange={(e) => handleProgramChange(qIndex, pIndex, "text", e.target.value)}
                                  placeholder="Enter program question text..."
                                  className="question-textarea"
                                />
                              </div>
                              <div className="solution-section">
                                <label>Sample Solution:</label>
                                <textarea
                                  value={program.solution}
                                  onChange={(e) => handleProgramChange(qIndex, pIndex, "solution", e.target.value)}
                                  placeholder="Enter sample solution code..."
                                  className="solution-textarea"
                                />
                              </div>
                              <div className="test-cases-section">
                                <label>Test Cases:</label>
                                {program.testCases.map((testCase, tIndex) => (
                                  <div key={tIndex} className="test-case-container">
                                    <div className="test-case-header">
                                      <h6>Test Case {tIndex + 1}</h6>
                                      {program.testCases.length > 1 && (
                                        <button
                                          onClick={() => removeTestCase(qIndex, pIndex, tIndex)}
                                          className="remove-test-case-btn"
                                        >
                                          Remove Test Case
                                        </button>
                                      )}
                                    </div>
                                    <div className="test-case-input">
                                      <label>Input:</label>
                                      <input
                                        type="text"
                                        value={testCase.input}
                                        onChange={(e) =>
                                          handleProgramChange(qIndex, pIndex, "testCaseInput", e.target.value, tIndex)
                                        }
                                        placeholder="Enter input..."
                                        className="test-case-input-field"
                                      />
                                    </div>
                                    <div className="test-case-output">
                                      <label>Expected Output:</label>
                                      <input
                                        type="text"
                                        value={testCase.output}
                                        onChange={(e) =>
                                          handleProgramChange(qIndex, pIndex, "testCaseOutput", e.target.value, tIndex)
                                        }
                                        placeholder="Enter expected output..."
                                        className="test-case-output-field"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addTestCase(qIndex, pIndex)}
                                  className="add-test-case-btn"
                                >
                                  Add Test Case
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addNewProgram(qIndex)}
                            className="add-program-btn"
                            disabled={
                              questions.reduce((sum, q) => sum + (q.programs?.length || 0), 0) >=
                              parseInt(assignments[selectedAssignmentIndex]?.programsAdded || 0)
                            }
                          >
                            Add New Program
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="modal-buttons">
                    <button
                      onClick={addNewQuestion}
                      className="add-question-btn"
                      disabled={
                        questions.reduce((sum, q) => sum + (q.mcqs?.length || 0), 0) >=
                          parseInt(assignments[selectedAssignmentIndex]?.mcqsAdded || 0) &&
                        questions.reduce((sum, q) => sum + (q.programs?.length || 0), 0) >=
                          parseInt(assignments[selectedAssignmentIndex]?.programsAdded || 0)
                      }
                    >
                      Add New Question
                    </button>
                    <button onClick={saveQuestions} className="save-btn">
                      Save
                    </button>
                    <button onClick={() => setShowEditQuestionsModal(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default TrainerDashboard;