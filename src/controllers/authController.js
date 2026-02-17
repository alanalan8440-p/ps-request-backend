const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// STUDENT REGISTER
// ======================
exports.registerStudent = async (req, res) => {
    try {
        const { registration, name, department, year, section, password } = req.body;

        const existing = await prisma.student.findUnique({
            where: { registration }
        });

        if (existing) {
            return res.status(400).json({ message: "Student already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await prisma.student.create({
            data: {
                registration,
                name,
                department,
                year,
                section,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: "Student registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// STUDENT LOGIN
// ======================
exports.loginStudent = async (req, res) => {
    try {
        const { registration, password } = req.body;

        const student = await prisma.student.findUnique({
            where: { registration }
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
    {
        id: student.id,
        role: "STUDENT"   // 👈 add role here
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);

res.json({
    message: "Login successful",
    token
});


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
