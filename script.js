// LOGIN FORM HANDLING
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Get values from login form
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        // Store in localStorage
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentEmail", email);
        
        // Simple validation (just for show)
        if(name && email && password) {
            alert("Login successful! Redirecting...");
            window.location.href = "recommend.html";
        } else {
            alert("Please fill all fields");
        }
    });
}

// RECOMMENDATION FORM
const studentForm = document.getElementById("studentForm");
if (studentForm) {
    studentForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const name = document.getElementById("studentName").value;
        const classLevel = document.getElementById("class").value;
        const subject = document.getElementById("subject").value;
        const goal = document.getElementById("goal").value;
        
        const resultDiv = document.getElementById("result");
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "Processing... Please wait";
        
        try {
            const response = await fetch('/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: name, 
                    classLevel: parseInt(classLevel), 
                    subject: subject, 
                    goal: goal 
                })
            });
            
            const data = await response.json();
            resultDiv.innerHTML = data.message.replace(/\n/g, '<br>');
            resultDiv.innerHTML += '<br><br><button onclick="window.location.href=\'dashboard.html\'" class="dash-btn">Go to Dashboard</button>';
            
        } catch (error) {
            resultDiv.innerHTML = "Error connecting to server. Using demo mode.";
            resultDiv.innerHTML += '<br><br><button onclick="window.location.href=\'dashboard.html\'" class="dash-btn">Go to Dashboard</button>';
        }
    });
}

// DASHBOARD FUNCTIONS
// Display username in dashboard
window.onload = function() {
    const userDisplay = document.getElementById("userDisplay");
    if(userDisplay) {
        const name = localStorage.getItem("studentName") || "Student";
        userDisplay.innerHTML = "Welcome, " + name + " | ";
    }
}

function showSection(section) {
    const content = document.getElementById("content");
    const name = localStorage.getItem("studentName") || "Student";
    const email = localStorage.getItem("studentEmail") || "Not provided";
    
    if (section === "profile") {
        content.innerHTML = `
            <h3>Student Profile</h3>
            <div class="info-row">
                <p><strong>Full Name:</strong> ${name}</p>
                <p><strong>Email ID:</strong> ${email}</p>
                <p><strong>Class:</strong> 10 (Demo)</p>
                <p><strong>Roll No:</strong> 2026</p>
                <p><strong>Department:</strong> Science</p>
            </div>
        `;
    } 
    else if (section === "videos") {
        content.innerHTML = `
            <h3>Video Lectures</h3>
            <p>Coming Soon...</p>
            <p>Video content is being prepared for:</p>
            <ul>
                <li>Mathematics - Algebra Basics</li>
                <li>Physics - Newton's Laws</li>
                <li>Chemistry - Periodic Table</li>
            </ul>
            <p class="note">*Content will be available from next week</p>
        `;
    }
    else if (section === "tests") {
        content.innerHTML = `
            <h3>Practice Tests</h3>
            <p>Coming Soon...</p>
            <p>Upcoming tests:</p>
            <ul>
                <li>Mathematics Mock Test - Next Monday</li>
                <li>Physics Weekly Test - Next Wednesday</li>
                <li>Chemistry Quiz - Next Friday</li>
            </ul>
            <p class="note">*Test schedule will be announced soon</p>
        `;
    }
    else if (section === "ebooks") {
        content.innerHTML = `
            <h3>E-Books & Materials</h3>
            <p>Coming Soon...</p>
            <p>Available soon:</p>
            <ul>
                <li>Mathematics Reference Guide</li>
                <li>Physics Formula Handbook</li>
                <li>Chemistry Quick Notes</li>
            </ul>
            <p class="note">*Materials are being uploaded</p>
        `;
    }
}