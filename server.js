const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Recommendation Route
app.post("/recommend", (req, res) => {
    const { name, classLevel, subject, goal } = req.body;

    let recommendation = "";
    let duration = "";
    let difficulty = "";

    // Math logic
    if (subject === "math") {
        if (classLevel >= 5 && classLevel <= 8) {
            recommendation = `Class ${classLevel} Mathematics Foundation Program`;
            duration = "4 Weeks";
            difficulty = "Basic";
        } 
        else if (classLevel >= 9 && classLevel <= 10) {
            recommendation = `Class ${classLevel} Board Exam Maths Preparation`;
            duration = "6 Weeks";
            difficulty = "Intermediate";
        } 
        else if (classLevel >= 11 && classLevel <= 12) {
            recommendation = `Class ${classLevel} Advanced Mathematics + Competitive Prep`;
            duration = "8 Weeks";
            difficulty = "Advanced";
        }
    }

    // Physics logic
    else if (subject === "physics") {
        if (classLevel <= 8) {
            recommendation = `Class ${classLevel} Basic Science Foundation`;
            duration = "4 Weeks";
            difficulty = "Basic";
        } 
        else if (classLevel >= 9 && classLevel <= 10) {
            recommendation = `Class ${classLevel} Physics Concept Builder`;
            duration = "6 Weeks";
            difficulty = "Intermediate";
        } 
        else if (classLevel >= 11 && classLevel <= 12) {
            if (goal === "jee") {
                recommendation = `JEE Physics Advanced Problem Solving`;
                duration = "10 Weeks";
                difficulty = "Advanced";
            } else {
                recommendation = `Class ${classLevel} Physics Board Preparation`;
                duration = "8 Weeks";
                difficulty = "Advanced";
            }
        }
    }

    // Python logic
    else if (subject === "python") {
        if (classLevel <= 8) {
            recommendation = "Python Basics for Beginners";
            duration = "4 Weeks";
            difficulty = "Basic";
        } 
        else if (classLevel >= 9 && classLevel <= 10) {
            recommendation = "Intermediate Python with Mini Projects";
            duration = "6 Weeks";
            difficulty = "Intermediate";
        } 
        else {
            recommendation = "Advanced Python + Real World Projects";
            duration = "8 Weeks";
            difficulty = "Advanced";
        }
    }

    // Default
    else {
        recommendation = "Customized Learning Path";
        duration = "6 Weeks";
        difficulty = "Moderate";
    }

    res.json({
        message: `Hello ${name},
Recommended Course: ${recommendation}
Duration: ${duration}
Difficulty Level: ${difficulty}`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});