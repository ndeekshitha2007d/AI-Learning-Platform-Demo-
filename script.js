// Tab Switching
function showTab(type) {
    document.getElementById('student-login').style.display = type === 'student' ? 'block' : 'none';
    document.getElementById('parent-login').style.display = type === 'parent' ? 'block' : 'none';
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function showRegister() {
    document.getElementById('student-login').style.display = 'none';
    document.getElementById('student-register').style.display = 'block';
}

// Student Registration
const registerForm = document.getElementById('studentRegisterForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            class: document.getElementById('reg-class').value,
            parentEmail: document.getElementById('reg-parent').value
        };
        
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        alert(result.message);
        if (result.success) showTab('student');
    });
}

// Student Login
const studentLogin = document.getElementById('studentLoginForm');
if (studentLogin) {
    studentLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            email: document.getElementById('student-email').value,
            password: document.getElementById('student-password').value
        };
        
        const response = await fetch('/student-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            window.location.href = result.redirect;
        } else {
            alert(result.message);
        }
    });
}

// Load Leaderboard
async function loadLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    if (!leaderboardDiv) return;
    
    const response = await fetch('/leaderboard');
    const students = await response.json();
    
    const scores = students.map(s => ({
        name: s.name,
        class: s.class,
        total: s.scores.reduce((sum, score) => sum + score.score, 0)
    })).sort((a, b) => b.total - a.total);
    
    let html = '<table><tr><th>Rank</th><th>Name</th><th>Class</th><th>Total Score</th></tr>';
    scores.forEach((s, index) => {
        html += `<tr>
            <td>#${index + 1}</td>
            <td>${s.name}</td>
            <td>Class ${s.class}</td>
            <td>${s.total}</td>
        </tr>`;
    });
    html += '</table>';
    
    leaderboardDiv.innerHTML = html;
}

// Dashboard Functions
function showSection(section) {
    const content = document.getElementById('content');
    
    if (section === 'profile') {
        content.innerHTML = `
            <h3>My Profile</h3>
            <div class="profile-box">
                <p><strong>Name:</strong> <span id="profile-name"></span></p>
                <p><strong>Class:</strong> <span id="profile-class"></span></p>
                <p><strong>Email:</strong> <span id="profile-email"></span></p>
                <p><strong>Total Quizzes Taken:</strong> <span id="profile-quizzes"></span></p>
            </div>
        `;
        
        fetch('/student-data')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('profile-name').textContent = data.name;
                    document.getElementById('profile-class').textContent = data.class;
                    document.getElementById('profile-email').textContent = data.email;
                    document.getElementById('profile-quizzes').textContent = data.scores.length;
                }
            });
    }
    
    else if (section === 'videos') {
        content.innerHTML = `
            <h3>Video Lectures</h3>
            <div class="video-controls">
                <select id="video-subject">
                    <option value="math">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                </select>
                <select id="video-level">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                <button onclick="loadVideos()">Show Videos</button>
            </div>
            <div id="video-list" class="video-grid"></div>
        `;
    }
    
    else if (section === 'quizzes') {
        content.innerHTML = `
            <h3>Take a Quiz (Microsoft Forms Style)</h3>
            <div class="quiz-setup">
                <select id="quiz-subject">
                    <option value="math">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                </select>
                <select id="quiz-level">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button onclick="startQuiz()">Start Quiz (10 Questions)</button>
            </div>
            <div id="quiz-container" class="quiz-container" style="display:none;">
                <div class="quiz-header">
                    <h4 id="quiz-title">Quiz</h4>
                    <div class="quiz-progress">
                        Question <span id="current-q">1</span>/<span id="total-q">10</span>
                    </div>
                </div>
                <div id="question-area" class="question-area"></div>
                <div id="options-area" class="options-area"></div>
                <div class="quiz-footer">
                    <button id="next-btn" onclick="nextQuestion()" style="display:none;">Next</button>
                </div>
            </div>
            <div id="quiz-result" style="display:none;" class="quiz-result"></div>
        `;
    }
    
    else if (section === 'games') {
        content.innerHTML = `
            <h3>Learning Games</h3>
            <div class="games-grid">
                <div class="game-card" onclick="startGame('math-racer')">
                    <h4>Math Racer</h4>
                    <p>Solve quick math problems</p>
                </div>
                <div class="game-card" onclick="startGame('word-scramble')">
                    <h4>Word Scramble</h4>
                    <p>Unscramble science words</p>
                </div>
                <div class="game-card" onclick="startGame('true-false')">
                    <h4>True or False</h4>
                    <p>Quick science facts</p>
                </div>
                <div class="game-card" onclick="startGame('formula-match')">
                    <h4>Formula Match</h4>
                    <p>Match formulas</p>
                </div>
            </div>
            <div id="game-area" class="game-area"></div>
        `;
    }
    
    else if (section === 'ebooks') {
        content.innerHTML = `
            <h3>E-Books & Study Materials</h3>
            <div class="ebooks-grid">
                <div class="ebook-card">
                    <h4>Mathematics Guide</h4>
                    <p>Class 8-10</p>
                    <button onclick="downloadEbook('math-guide')">Download PDF</button>
                </div>
                <div class="ebook-card">
                    <h4>Physics Formulas</h4>
                    <p>Class 9-12</p>
                    <button onclick="downloadEbook('physics-formulas')">Download PDF</button>
                </div>
                <div class="ebook-card">
                    <h4>Chemistry Notes</h4>
                    <p>Class 8-10</p>
                    <button onclick="downloadEbook('chemistry-notes')">Download PDF</button>
                </div>
                <div class="ebook-card">
                    <h4>Python Basics</h4>
                    <p>Beginners</p>
                    <button onclick="downloadEbook('python-basics')">Download PDF</button>
                </div>
            </div>
        `;
    }
    
    else if (section === 'progress') {
        content.innerHTML = `
            <h3>My Progress</h3>
            <div id="progress-stats"></div>
            <div id="score-history"></div>
        `;
        loadProgress();
    }
}

// Quiz Variables
let currentQuiz = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let selectedAnswers = [];

// Microsoft Forms Style Quiz
async function startQuiz() {
    const subject = document.getElementById('quiz-subject').value;
    const level = document.getElementById('quiz-level').value;
    
    const studentData = await fetch('/student-data').then(res => res.json());
    const studentClass = studentData.class;
    
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-title').textContent = `${subject} - ${level} (Class ${studentClass})`;
    
    const response = await fetch(`/quizzes/${studentClass}/${subject}/${level}`);
    currentQuiz = await response.json();
    
    if (currentQuiz.length === 0) {
        alert('No quizzes available for this combination!');
        return;
    }
    
    currentQuestionIndex = 0;
    quizScore = 0;
    selectedAnswers = new Array(currentQuiz.length).fill(null);
    
    document.getElementById('total-q').textContent = currentQuiz.length;
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        showQuizResult();
        return;
    }
    
    const q = currentQuiz[currentQuestionIndex];
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    
    let optionsHtml = '';
    q.options.forEach((opt, index) => {
        const letter = String.fromCharCode(65 + index);
        const checked = selectedAnswers[currentQuestionIndex] === opt ? 'checked' : '';
        optionsHtml += `
            <div class="option-item">
                <input type="radio" name="quiz-option" value="${opt}" id="opt${index}" ${checked} onchange="selectAnswer('${opt}')">
                <label for="opt${index}">${letter}. ${opt}</label>
            </div>
        `;
    });
    
    document.getElementById('question-area').innerHTML = `<p class="question-text">${q.question}</p>`;
    document.getElementById('options-area').innerHTML = optionsHtml;
    
    if (currentQuestionIndex === currentQuiz.length - 1) {
        document.getElementById('next-btn').textContent = 'Submit Quiz';
    } else {
        document.getElementById('next-btn').textContent = 'Next Question';
    }
    document.getElementById('next-btn').style.display = 'block';
}

function selectAnswer(answer) {
    selectedAnswers[currentQuestionIndex] = answer;
}

function nextQuestion() {
    if (!selectedAnswers[currentQuestionIndex]) {
        alert('Please select an answer');
        return;
    }
    
    if (selectedAnswers[currentQuestionIndex] === currentQuiz[currentQuestionIndex].answer) {
        quizScore += 10;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuiz.length) {
        showQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    
    const percentage = (quizScore / (currentQuiz.length * 10)) * 100;
    let grade = '';
    if (percentage >= 80) grade = 'A - Excellent!';
    else if (percentage >= 60) grade = 'B - Good job!';
    else if (percentage >= 40) grade = 'C - Keep practicing';
    else grade = 'D - Need more practice';
    
    document.getElementById('quiz-result').innerHTML = `
        <h3>Quiz Complete!</h3>
        <div class="score-circle">
            <div class="score-number">${quizScore}/${currentQuiz.length * 10}</div>
            <div class="score-percent">${percentage}%</div>
        </div>
        <p class="score-grade">${grade}</p>
        <button onclick="saveQuizScore()">Save Score</button>
        <button onclick="startQuiz()">Take Another Quiz</button>
    `;
    
    fetch('/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subject: document.getElementById('quiz-subject').value,
            score: quizScore,
            level: document.getElementById('quiz-level').value
        })
    });
}

function saveQuizScore() {
    alert('Score saved!');
    loadLeaderboard();
}

// Games
function startGame(game) {
    const gameArea = document.getElementById('game-area');
    
    if (game === 'math-racer') {
        let num1 = Math.floor(Math.random() * 10);
        let num2 = Math.floor(Math.random() * 10);
        gameArea.innerHTML = `
            <h4>Math Racer</h4>
            <p>Solve as fast as you can!</p>
            <p>${num1} + ${num2} = ?</p>
            <input type="number" id="game-answer">
            <button onclick="checkMathRacer(${num1+num2})">Submit</button>
            <p id="game-result"></p>
        `;
    }
    else if (game === 'word-scramble') {
        const words = ['ELECTRON', 'PROTON', 'NEUTRON', 'ATOM', 'MOLECULE'];
        const word = words[Math.floor(Math.random() * words.length)];
        const scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
        gameArea.innerHTML = `
            <h4>Word Scramble</h4>
            <p>Unscramble: <strong>${scrambled}</strong></p>
            <input type="text" id="game-answer">
            <button onclick="checkWordScramble('${word}')">Submit</button>
            <p id="game-result"></p>
        `;
    }
    else if (game === 'true-false') {
        const questions = [
            { q: 'Electrons are positively charged', a: false },
            { q: 'Water boils at 100°C', a: true },
            { q: 'Python is a programming language', a: true }
        ];
        const q = questions[Math.floor(Math.random() * questions.length)];
        gameArea.innerHTML = `
            <h4>True or False</h4>
            <p>${q.q}</p>
            <button onclick="checkTrueFalse(true, ${q.a})">True</button>
            <button onclick="checkTrueFalse(false, ${q.a})">False</button>
            <p id="game-result"></p>
        `;
    }
    else if (game === 'formula-match') {
        gameArea.innerHTML = `
            <h4>Formula Match</h4>
            <p>Force = ?</p>
            <button onclick="checkFormula('mass * acceleration')">mass × acceleration</button>
            <button onclick="checkFormula('mass * velocity')">mass × velocity</button>
            <button onclick="checkFormula('mass / acceleration')">mass / acceleration</button>
            <p id="game-result"></p>
        `;
    }
}

function checkMathRacer(correct) {
    const answer = parseInt(document.getElementById('game-answer').value);
    const result = document.getElementById('game-result');
    if (answer === correct) {
        result.innerHTML = '✅ Correct! +10 points';
        result.style.color = 'green';
    } else {
        result.innerHTML = '❌ Wrong! Try again';
        result.style.color = 'red';
    }
}

function checkWordScramble(correct) {
    const answer = document.getElementById('game-answer').value.toUpperCase();
    const result = document.getElementById('game-result');
    if (answer === correct) {
        result.innerHTML = '✅ Correct! +10 points';
        result.style.color = 'green';
    } else {
        result.innerHTML = '❌ Wrong! The word was ' + correct;
        result.style.color = 'red';
    }
}

function checkTrueFalse(selected, correct) {
    const result = document.getElementById('game-result');
    if (selected === correct) {
        result.innerHTML = '✅ Correct! +10 points';
        result.style.color = 'green';
    } else {
        result.innerHTML = '❌ Wrong!';
        result.style.color = 'red';
    }
}

function checkFormula(answer) {
    const result = document.getElementById('game-result');
    if (answer === 'mass * acceleration') {
        result.innerHTML = '✅ Correct! Force = mass × acceleration';
        result.style.color = 'green';
    } else {
        result.innerHTML = '❌ Wrong! Force = mass × acceleration';
        result.style.color = 'red';
    }
}

// E-Books
function downloadEbook(book) {
    alert('Download started: ' + book + '.pdf');
}

// Load Progress
function loadProgress() {
    fetch('/student-data')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.scores.length > 0) {
                let history = '<h4>Recent Scores</h4><ul>';
                data.scores.slice(-5).forEach(score => {
                    history += `<li>${score.subject} (${score.level}): ${score.score} points</li>`;
                });
                history += '</ul>';
                document.getElementById('score-history').innerHTML = history;
                
                let total = data.scores.reduce((sum, s) => sum + s.score, 0);
                let avg = total / data.scores.length;
                document.getElementById('progress-stats').innerHTML = `
                    <p><strong>Total Score:</strong> ${total}</p>
                    <p><strong>Average:</strong> ${avg.toFixed(1)}</p>
                    <p><strong>Quizzes Taken:</strong> ${data.scores.length}</p>
                `;
            } else {
                document.getElementById('score-history').innerHTML = '<p>No quizzes taken yet</p>';
            }
        });
}

// Load YouTube Videos
function loadVideos() {
    const subject = document.getElementById('video-subject').value;
    const level = document.getElementById('video-level').value;
    const videoList = document.getElementById('video-list');
    
    const videoIds = {
        math: ['LwCRRUa8yTU', 'yUjV4fCqCbQ', '1Rq2JWqIuqw'],
        physics: ['OoO5d5P0Jn4', 'iJp7iCJv4Ps', 'wW2pA9hJkzU'],
        chemistry: ['FSyAehMdpyI', 'Rc6D3H3qQ7c', 'bka20Q9TN6M']
    };
    
    let html = '';
    (videoIds[subject] || []).forEach(id => {
        html += `
            <div class="video-card">
                <iframe width="100%" height="200" 
                    src="https://www.youtube.com/embed/${id}" 
                    frameborder="0" allowfullscreen>
                </iframe>
                <p>${subject} - ${level}</p>
            </div>
        `;
    });
    
    videoList.innerHTML = html || '<p>Videos coming soon!</p>';
}

// Load on page start
window.onload = function() {
    loadLeaderboard();
    
    const userDisplay = document.getElementById('userDisplay');
    if(userDisplay) {
        fetch('/student-data')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    userDisplay.innerHTML = 'Welcome, ' + data.name + ' | ';
                }
            });
    }
}