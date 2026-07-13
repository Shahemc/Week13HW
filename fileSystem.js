import fs from "fs/promises"

async function readStudents() {
    try {
        const data = await fs.readFile("students.json", "utf-8")
        const students = JSON.parse(data)
        console.log(students)
    } catch (err) {
        console.log("Error reading file:", err)
    }
}

const students = [
    { id: 1, name: "Stacey", grade: "A" },
    { id: 2, name: "Tyler", grade: "B" },
    { id: 3, name: "Miguel", grade: "A" },
]

await fs.writeFile("students.json", JSON.stringify(students, null, 2))