const express = require("express");
const fs = require("fs/promises");
const app = express();

app.use(express.json());

let students = [
    {id: 1, name: "chris", grade: "A"},
    {id: 2, name: "john", grade: "B"},
    {id: 3, name: "jane", grade: "A"},
];

// app.get("/", (req, res)=>{
//     res.json("Hello World");
// });
app.get("/students", (req, res)=>{
    res.json(students);
});

// GET all students
app.get("/students", async (req, res) => {
  try {
    const data = await fs.readFile("students.json", "utf-8")
    const students = JSON.parse(data)
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error reading students" })
  }
});
// GET a single student by ID
app.get("/students/:id", async (req, res) => {
  try {
    const data = await fs.readFile("students.json", "utf-8")
    const students = JSON.parse(data)
    const id = parseInt(req.params.id)
    const student = students.find(s => s.id === id)
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: "Error reading students" })
  }
})

//post request
app.post("/students", (req, res)=>{
    const {name, grade} = req.body;

  try {
    const { name, grade } = req.body;

    if (!name || !grade) {
      return res.status(400).json({ message: "Name and grade are required" })
    }

    const data = await fs.readFile("students.json", "utf-8")
    const students = JSON.parse(data);

    const newStudent = {
      id: students.length + 1,
      name,
      grade
    }

    students.push(newStudent) // Typically this is a DB Update

    await fs.writeFile("students.json", JSON.stringify(students, null, 2))

    res.status(201).json(newStudent)
  } catch (err) {
    res.status(500).json({ message: "Error reading students" })
  }
})

//put request
    students.push(newStudent);
    res.status(201).json(newStudent);

 
app.listen(5000, ()=>{
    console.log("Server is running on port 5000");
});

 