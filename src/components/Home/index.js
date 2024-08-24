// src/components/Scheduler.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [mentors, setMentors] = useState([]);
  const [studentName, setStudentName] = useState(localStorage.getItem("name"));
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [duration, setDuration] = useState(30);
  const [sessionTime, setSessionTime] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");

  const fetchMentors = async () => {
    const response = await fetch("http://localhost:3001/mentors");

    if (response.ok) {
      const data = await response.json();

      const mentor = data.response;
      console.log(mentor);
      setMentors(mentor);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

    const handleSchedule = async () => {
    if (!studentName || !areaOfInterest || !selectedMentor || !sessionTime) {
      alert("Please fill in all fields.");
      return;
    }

    const studentData = {
      studentName: localStorage.getItem("name"),
      mentorName: selectedMentor,
      duration,
      sessionTime,
    };

    const response = await fetch("http://localhost:3001/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });
    console.log(response);

    if (response.ok) {
      alert("Session scheduled successfully!");
      // Optionally reset form fields here
      setStudentName("");
      setAreaOfInterest("");
      setDuration(30);
      setSessionTime("");
      setSelectedMentor("");
      fetchMentors(); // Refresh mentor list after scheduling
    } else {
      console.error("Error scheduling session:");
      alert("Error scheduling session. Please check your input and try again.");
    }
  };

  return (
    <div>
      <h1>Schedule a Session</h1>

      <input
        type="text"
        placeholder="Student Name"
        value={localStorage.getItem("name")}
        onChange={(e) => setStudentName(e.target.value)}
        disabled
      />
      <select
        onChange={(e) => setAreaOfInterest(e.target.value)}
        value={areaOfInterest}
      >
        <option value="">Select Area of Interest</option>
        <option value="FMCG Sales">FMCG Sales</option>
        <option value="Equity Research">Equity Research</option>
        <option value="Digital Marketing">Digital Marketing</option>
      </select>
      <select
        onChange={(e) => setSelectedMentor(e.target.value)}
        value={selectedMentor}
      >
        <option value="">Select a Mentor</option>
        {mentors.map((mentor) => (
          <option key={mentor.mentorId} value={mentor.mentorId}>
            {mentor.mentorName}
          </option>
        ))}
      </select>
      <select onChange={(e) => setDuration(e.target.value)} value={duration}>
        <option value="30">30 mins</option>
        <option value="45">45 mins</option>
        <option value="60">60 mins</option>
      </select>
      <input
        type="datetime-local"
        value={sessionTime}
        onChange={(e) => setSessionTime(e.target.value)}
      />
      <button onClick={handleSchedule}>Schedule Session</button>
      <nav className="navbar bg-body-tertiary">
        <div className="text-right">
          <Link to="/">
            <button className="btn">Logout</button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Home;
