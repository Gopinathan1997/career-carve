const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");

const { open } = require("sqlite");
const { appendFileSync } = require("fs");

const app = express();
const dbPath = path.join(__dirname, "database.db");

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create students table
    await db.run(`
      CREATE TABLE IF NOT EXISTS students (
        studentId INTEGER PRIMARY KEY AUTOINCREMENT,
        studentName TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);

    // Create mentors table
    await db.run(`
      CREATE TABLE IF NOT EXISTS mentors (
        mentorId INTEGER PRIMARY KEY AUTOINCREMENT,
        mentorName TEXT NOT NULL,
        company_name TEXT,
        password TEXT NOT NULL
      )
    `);

    // Create sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        sessionId INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        mentor_id INTEGER NOT NULL,
        area_of_interest TEXT,
        duration TEXT NOT NULL,
        session_time TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(studentId),
        FOREIGN KEY (mentor_id) REFERENCES mentors(mentorId)
      )
    `);

    app.listen(3001, () => {
      console.log("Server running at http://localhost:3001");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// Signup route
app.post("/register", async (req, res) => {
  const { name, company_name, role, password } = req.body;

  let sql;
  let params;
  let selectUserQuery;
  let databaseUser;

  if (role === "mentor") {
    selectUserQuery = `SELECT * FROM mentors WHERE mentorName = ?;`;
    databaseUser = await db.get(selectUserQuery, [name]);

    if (databaseUser) {
      return res.status(400).json("User already exists");
    }

    sql = `INSERT INTO mentors (mentorName, company_name, password) VALUES (?, ?, ?)`;
    params = [name, company_name, password];
  } else {
    selectUserQuery = `SELECT * FROM students WHERE studentName = ?;`;
    databaseUser = await db.get(selectUserQuery, [name]);

    if (databaseUser) {
      return res.status(400).json("User already exists");
    }

    sql = `INSERT INTO students (studentName, password) VALUES (?, ?)`;
    params = [name, password];
  }

  db.run(sql, params);
  res.json("User Registration Successful!!").status(200);
});

// Login route
app.post("/login", async (req, res) => {
  const { name, role, password } = req.body;
  const table = role === "mentor" ? "mentors" : "students";
  const columnName = role === "mentor" ? "mentorName" : "studentName";
  console.log(req.body);

  const dbUser = await db.get(
    `SELECT * FROM ${table} WHERE ${columnName} = ? AND password = ?`,
    [name, password]
  );
  if (!dbUser) {
    return res.status(400).json({ error: "Invalid Username" });
  }
  if (dbUser.password === password) {
    return res.json({ message: "Login success!" });
  } else {
    return res.status(400).json({ error: "Invalid Password" });
  }
});

// Get Mentor
app.get("/mentors", async (req, res) => {
  const selectQuery = `SELECT * from mentors`;
  const response = await db.all(selectQuery);
  res.json({ response });
});

// Insert mentor route
app.post("/mentors", (req, res) => {
  const { name, area_of_interest, available_time } = req.body;
  db.run(
    "INSERT INTO mentors (mentorName, area_of_interest, available_time) VALUES (?, ?, ?)",
    [name, area_of_interest, available_time],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json({ id: this.lastID, name, area_of_interest, available_time });
    }
  );
});

// Insert session route
app.post("/sessions", async (req, res) => {
  const { studentName, mentorName, duration, sessionTime } = req.body;
  console.log(req.body);

  const student_id = await db.get(
    `SELECT studentId from students WHERE studentName = "${studentName}"`
  );
  console.log(student_id);

  await db.run(
    "INSERT INTO sessions (student_id, mentor_id, duration, session_time) VALUES (?, ?, ?, ?)",
    [student_id.studentId, mentorName, duration, sessionTime]
  );

  res.status(200).json("Session Booking Successfull");
});

// Insert student route
app.post("/students", (req, res) => {
  const { name, area_of_interest } = req.body;
  db.run(
    "INSERT INTO students (studentName, area_of_interest) VALUES (?, ?)",
    [name, area_of_interest],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json({ id: this.lastID, name, area_of_interest });
    }
  );
});

module.exports = app;
