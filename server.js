const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session for login
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false
}));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/learningplatform")
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    class: Number,
    parentEmail: String,
    scores: [{
        subject: String,
        score: Number,
        level: String,
        date: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Parent Schema
const parentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    childEmail: String,
    createdAt: { type: Date, default: Date.now }
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
    subject: String,
    level: String,
    class: Number,
    question: String,
    options: [String],
    answer: String
});

const Student = mongoose.model("Student", studentSchema);
const Parent = mongoose.model("Parent", parentSchema);
const Quiz = mongoose.model("Quiz", quizSchema);

// Routes

// Student Registration
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, class: studentClass, parentEmail } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const student = new Student({
            name,
            email,
            password: hashedPassword,
            class: studentClass,
            parentEmail,
            scores: []
        });
        
        await student.save();
        res.json({ success: true, message: "Registration successful!" });
    } catch (error) {
        res.json({ success: false, message: "Email already exists!" });
    }
});

// Student Login
app.post("/student-login", async (req, res) => {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    
    if (student && await bcrypt.compare(password, student.password)) {
        req.session.user = { email: student.email, type: "student", name: student.name, class: student.class };
        res.json({ success: true, redirect: "student-dashboard.html" });
    } else {
        res.json({ success: false, message: "Invalid credentials!" });
    }
});

// Parent Login
app.post("/parent-login", async (req, res) => {
    const { email, password } = req.body;
    const parent = await Parent.findOne({ email });
    
    if (parent && await bcrypt.compare(password, parent.password)) {
        req.session.user = { email: parent.email, type: "parent", name: parent.name };
        res.json({ success: true, redirect: "parent-dashboard.html" });
    } else {
        res.json({ success: false, message: "Invalid credentials!" });
    }
});

// Get Student Data for Dashboard
app.get("/student-data", async (req, res) => {
    if (!req.session.user || req.session.user.type !== "student") {
        return res.json({ success: false });
    }
    
    const student = await Student.findOne({ email: req.session.user.email });
    res.json({ 
        success: true, 
        name: student.name,
        email: student.email,
        class: student.class,
        scores: student.scores 
    });
});

// Get Leaderboard
app.get("/leaderboard", async (req, res) => {
    const students = await Student.find({}, 'name class scores');
    res.json(students);
});

// Submit Quiz Score
app.post("/submit-score", async (req, res) => {
    if (!req.session.user || req.session.user.type !== "student") {
        return res.json({ success: false });
    }
    
    const { subject, score, level } = req.body;
    await Student.findOneAndUpdate(
        { email: req.session.user.email },
        { $push: { scores: { subject, score, level } } }
    );
    
    res.json({ success: true });
});

// Get Quizzes for specific class, subject, level
app.get("/quizzes/:class/:subject/:level", async (req, res) => {
    const quizzes = await Quiz.find({ 
        class: parseInt(req.params.class),
        subject: req.params.subject, 
        level: req.params.level 
    });
    res.json(quizzes);
});

// Setup 10 quizzes per subject/level/class
app.get("/setup-quizzes", async (req, res) => {
    await Quiz.deleteMany({});
    
    const subjects = ["math", "physics", "chemistry"];
    const levels = ["easy", "medium", "hard"];
    const classes = [5,6,7,8,9,10,11,12];
    
    let allQuizzes = [];
    
    subjects.forEach(subject => {
        levels.forEach(level => {
            classes.forEach(classNum => {
                for(let i = 1; i <= 10; i++) {
                    let question, options, answer;
                    
                    if(subject === "math") {
                        if(level === "easy") {
                            question = `Class ${classNum} - Easy Math Q${i}: What is ${i} + ${i}?`;
                            options = [String(i), String(i*2), String(i+5), String(i*3)];
                            answer = String(i*2);
                        } else if(level === "medium") {
                            question = `Class ${classNum} - Medium Math Q${i}: What is ${i} × ${i}?`;
                            options = [String(i), String(i*2), String(i*i), String(i+5)];
                            answer = String(i*i);
                        } else {
                            question = `Class ${classNum} - Hard Math Q${i}: Solve: ${i}x + 5 = ${i*5}`;
                            options = [String(i), String(i-2), String(i+1), String(5)];
                            answer = String(i);
                        }
                    } else if(subject === "physics") {
                        if(level === "easy") {
                            const physicsQ = [
                                "What is the SI unit of force?",
                                "What is the unit of energy?",
                                "What is acceleration due to gravity?",
                                "What is the unit of power?",
                                "What is the formula for speed?"
                            ];
                            question = physicsQ[i % physicsQ.length];
                            options = ["Newton", "Joule", "Watt", "Pascal"];
                            answer = i % 4 === 0 ? "Newton" : i % 4 === 1 ? "Joule" : i % 4 === 2 ? "Watt" : "Pascal";
                        } else {
                            question = `Class ${classNum} - Physics ${level} question ${i}`;
                            options = ["Option A", "Option B", "Option C", "Option D"];
                            answer = "Option A";
                        }
                    } else {
                        const chemQ = [
                            "What is the chemical symbol for water?",
                            "What is the atomic number of oxygen?",
                            "What is the formula for carbon dioxide?",
                            "What gas do plants absorb?",
                            "What is the pH of pure water?"
                        ];
                        question = chemQ[i % chemQ.length];
                        options = ["H2O", "O2", "CO2", "NaCl"];
                        answer = "H2O";
                    }
                    
                    allQuizzes.push({
                        subject,
                        level,
                        class: classNum,
                        question,
                        options,
                        answer
                    });
                }
            });
        });
    });
    
    await Quiz.insertMany(allQuizzes);
    res.send(`Added ${allQuizzes.length} quizzes!`);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});