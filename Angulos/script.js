// Navigation
function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });
    const section = document.getElementById(sectionId);
    section.style.display = 'block';
    section.classList.add('active');

    if(sectionId === 'angles') drawAngle();
    if(sectionId === 'triangles') generateRandomTriangle();
}

// --- Angles Section ---

const angleInput = document.getElementById('angleInput');
const angleValueDisplay = document.getElementById('angleValue');
const angleCanvas = document.getElementById('angleCanvas');
const angleCtx = angleCanvas.getContext('2d');
const angleDesc = document.getElementById('angleDescription');

angleInput.addEventListener('input', () => {
    angleValueDisplay.textContent = angleInput.value;
    drawAngle();
});

function drawAngle() {
    const angle = parseInt(angleInput.value);
    const w = angleCanvas.width;
    const h = angleCanvas.height;
    const cx = w / 2;
    const cy = h / 2 + 50;
    const radius = 100;

    angleCtx.clearRect(0, 0, w, h);

    // Draw baseline
    angleCtx.beginPath();
    angleCtx.moveTo(cx, cy);
    angleCtx.lineTo(cx + radius, cy);
    angleCtx.strokeStyle = '#333';
    angleCtx.lineWidth = 3;
    angleCtx.stroke();

    // Draw angled line
    const radian = (angle * Math.PI) / 180;
    const endX = cx + radius * Math.cos(-radian);
    const endY = cy + radius * Math.sin(-radian);

    angleCtx.beginPath();
    angleCtx.moveTo(cx, cy);
    angleCtx.lineTo(endX, endY);
    angleCtx.strokeStyle = '#e74c3c';
    angleCtx.stroke();

    // Draw angle arc
    angleCtx.beginPath();
    angleCtx.arc(cx, cy, 30, 0, -radian, true);
    angleCtx.strokeStyle = '#3498db';
    angleCtx.lineWidth = 2;
    angleCtx.stroke();

    // Draw vertex point
    angleCtx.beginPath();
    angleCtx.arc(cx, cy, 5, 0, 2 * Math.PI);
    angleCtx.fillStyle = '#2c3e50';
    angleCtx.fill();

    // Update Description
    let type = '';
    if (angle < 90) type = 'Agudo';
    else if (angle === 90) type = 'Recto';
    else if (angle < 180) type = 'Obtuso';
    else if (angle === 180) type = 'Llano';
    else if (angle < 360) type = 'Cóncavo (Reflejo)';
    else if (angle === 360) type = 'Completo';

    angleDesc.innerHTML = `Ángulo: ${angle}° - Tipo: <span style="color:#e74c3c">${type}</span>`;
}

drawAngle();


// --- Triangles Section ---

const triCanvas = document.getElementById('triangleCanvas');
const triCtx = triCanvas.getContext('2d');
const triDesc = document.getElementById('triangleDescription');

function generateRandomTriangle() {
    const w = triCanvas.width;
    const h = triCanvas.height;
    // Ensure points are centered somewhat
    const cx = w/2;
    const cy = h/2;
    
    // Generate around center
    const Ax = cx + (Math.random() - 0.5) * 200;
    const Ay = cy - 50 - Math.random() * 80;
    
    const Bx = cx - 50 - Math.random() * 100;
    const By = cy + 50 + Math.random() * 50;
    
    const Cx = cx + 50 + Math.random() * 100;
    const Cy = cy + 50 + Math.random() * 50;

    drawTriangle(Ax, Ay, Bx, By, Cx, Cy);
}

function setTriangle(type) {
    const w = triCanvas.width;
    const h = triCanvas.height;
    const cx = w/2;
    const cy = h/2 + 30; // Move down a bit to have space

    if (type === 'equilateral') {
        const size = 150;
        const hTri = size * Math.sqrt(3) / 2;
        // A top, B left, C right
        drawTriangle(cx, cy - hTri, cx - size/2, cy, cx + size/2, cy);
    } else if (type === 'isosceles') {
        // Base narrower than sides or diff
        drawTriangle(cx, cy - 150, cx - 50, cy, cx + 50, cy);
    } else if (type === 'right') {
        // Right angle at B
        drawTriangle(cx - 50, cy - 150, cx - 50, cy, cx + 100, cy);
    } else if (type === 'scalene') {
        drawTriangle(cx, cy - 150, cx - 80, cy, cx + 120, cy + 20); // slightly off horizontal base
    } else if (type === 'acute') {
        // Just an acute triangle. Equilateral is acute, but let's make a generic acute.
        // E.g. 50, 60, 70 degrees roughly.
        // A=(0,0), B=(200, 0). C at (100, 150)?
        // Center it.
        drawTriangle(cx, cy - 140, cx - 70, cy, cx + 80, cy);
    } else if (type === 'obtuse') {
        // One angle > 90.
        // Base, and C pushed far to one side.
        drawTriangle(cx - 100, cy - 80, cx - 40, cy, cx + 80, cy);
    }
}

function drawTriangle(Ax, Ay, Bx, By, Cx, Cy) {
    triCtx.clearRect(0, 0, triCanvas.width, triCanvas.height);

    triCtx.beginPath();
    triCtx.moveTo(Ax, Ay);
    triCtx.lineTo(Bx, By);
    triCtx.lineTo(Cx, Cy);
    triCtx.closePath();
    
    triCtx.fillStyle = 'rgba(26, 188, 156, 0.2)';
    triCtx.fill();
    triCtx.strokeStyle = '#16a085';
    triCtx.lineWidth = 3;
    triCtx.stroke();

    const a = dist(Bx, By, Cx, Cy); 
    const b = dist(Ax, Ay, Cx, Cy); 
    const c = dist(Ax, Ay, Bx, By); 

    const angA = Math.acos((b*b + c*c - a*a) / (2*b*c)) * (180 / Math.PI);
    const angB = Math.acos((a*a + c*c - b*b) / (2*a*c)) * (180 / Math.PI);
    const angC = 180 - angA - angB;

    let sideType = '';
    const epsilon = 1.0; 
    
    let equalSides = 0;
    if (Math.abs(a - b) < epsilon) equalSides++;
    if (Math.abs(b - c) < epsilon) equalSides++;
    if (Math.abs(a - c) < epsilon) equalSides++;

    if (equalSides === 3 || (Math.abs(a-b)<epsilon && Math.abs(b-c)<epsilon)) sideType = 'Equilátero';
    else if (equalSides >= 1) sideType = 'Isósceles';
    else sideType = 'Escaleno';

    let angleType = '';
    // Check if any angle is approx 90
    if (Math.abs(angA - 90) < 1 || Math.abs(angB - 90) < 1 || Math.abs(angC - 90) < 1) angleType = 'Rectángulo';
    else if (angA > 90 || angB > 90 || angC > 90) angleType = 'Obtusángulo';
    else angleType = 'Acutángulo';

    triDesc.innerHTML = `
        Lados: ${a.toFixed(0)}, ${b.toFixed(0)}, ${c.toFixed(0)} <br>
        Ángulos: ${angA.toFixed(0)}°, ${angB.toFixed(0)}°, ${angC.toFixed(0)}° <br>
        <strong>${sideType} - ${angleType}</strong>
    `;
    
    triCtx.fillStyle = '#000';
    triCtx.font = "14px Arial";
    triCtx.fillText("A", Ax - 5, Ay - 10);
    triCtx.fillText("B", Bx - 15, By + 15);
    triCtx.fillText("C", Cx + 5, Cy + 15);
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}


// --- Quiz Section ---

let currentQuestion = 0;
let score = 0;
const questions = [];
const TOTAL_QUESTIONS = 5;

function startQuiz() {
    score = 0;
    currentQuestion = 0;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('result-area').style.display = 'none';
    document.getElementById('canvas-quiz-container').style.display = 'block';
    generateQuestions();
    showQuestion();
}

function generateQuestions() {
    questions.length = 0;
    for(let i=0; i<TOTAL_QUESTIONS; i++) {
        if (Math.random() > 0.5) {
            questions.push(generateAngleQuestion());
        } else {
            questions.push(generateTriangleQuestion());
        }
    }
}

function generateAngleQuestion() {
    const angle = Math.floor(Math.random() * 180) + 1; 
    let type;
    
    if (angle < 90) type = 'Agudo';
    else if (angle === 90) type = 'Recto';
    else if (angle < 180) type = 'Obtuso';
    else type = 'Llano';

    const allTypes = ['Agudo', 'Recto', 'Obtuso', 'Llano'];
    const distractors = allTypes.filter(t => t !== type);
    
    return {
        mode: 'angle',
        value: angle,
        correct: type,
        options: shuffle([type, ...distractors]).slice(0, 4)
    };
}

function generateTriangleQuestion() {
    const types = ['Equilátero', 'Isósceles', 'Escaleno', 'Rectángulo'];
    const target = types[Math.floor(Math.random() * types.length)];
    
    let a, b, c;
    
    if (target === 'Equilátero') { a=60; b=60; c=60; }
    else if (target === 'Rectángulo') { a=90; b=30; c=60; }
    else if (target === 'Isósceles') { a=70; b=70; c=40; }
    else { a=40; b=60; c=80; } 

    return {
        mode: 'triangle',
        angles: [a, b, c],
        correct: target,
        options: shuffle(['Equilátero', 'Isósceles', 'Escaleno', 'Rectángulo'])
    };
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
    const q = questions[currentQuestion];
    const qText = document.getElementById('question-text');
    const optionsDiv = document.getElementById('options');
    const quizCanvas = document.getElementById('quizCanvas');
    const ctx = quizCanvas.getContext('2d');
    
    optionsDiv.innerHTML = '';
    
    // Clear canvas
    ctx.clearRect(0,0, quizCanvas.width, quizCanvas.height);

    if (q.mode === 'angle') {
        qText.textContent = `Pregunta ${currentQuestion + 1}: ¿Qué tipo de ángulo es este? (${q.value}°)`;
        drawQuizAngle(ctx, q.value);
    } else {
        qText.textContent = `Pregunta ${currentQuestion + 1}: Si un triángulo tiene ángulos de ${q.angles.join('°, ')}°, ¿qué tipo es?`;
        drawQuizTriangle(ctx, q.angles);
    }

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(opt, q.correct);
        optionsDiv.appendChild(btn);
    });
}

function drawQuizAngle(ctx, angle) {
    const cx = 150, cy = 150;
    const r = 80;
    const rad = (angle * Math.PI) / 180;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r, cy);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(-rad), cy + r * Math.sin(-rad));
    ctx.strokeStyle = '#e74c3c';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, -rad, true);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawQuizTriangle(ctx, angles) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    
    const degToRad = Math.PI/180;
    const A = angles[0] * degToRad;
    const B = angles[1] * degToRad;
    const C = angles[2] * degToRad;

    // Relative vertices.
    // V1 at (0,0), V2 at (1,0). Side c=1.
    // Side b = sin(B)/sin(C). V3 = (b*cos(A), b*sin(A)).
    const side_b = Math.sin(B) / Math.sin(C);
    
    const xs = [0, 1, side_b * Math.cos(A)];
    const ys = [0, 0, side_b * Math.sin(A)];
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const bw = maxX - minX;
    const bh = maxY - minY;
    
    // Scale to fit 70% of canvas
    const scale = Math.min(w * 0.7 / bw, h * 0.7 / bh);
    
    const cx = w/2;
    const cy = h/2 + 20; 
    
    const mapX = (x) => cx + (x - (minX + bw/2)) * scale;
    const mapY = (y) => cy - (y - (minY + bh/2)) * scale;
    
    const v1 = {x: mapX(xs[0]), y: mapY(ys[0])};
    const v2 = {x: mapX(xs[1]), y: mapY(ys[1])};
    const v3 = {x: mapX(xs[2]), y: mapY(ys[2])};
    
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.closePath();
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(angles[0]+"°", v1.x - 10, v1.y + 15);
    ctx.fillText(angles[1]+"°", v2.x + 5, v2.y + 15);
    ctx.fillText(angles[2]+"°", v3.x - 10, v3.y - 10);
}

function checkAnswer(selected, correct) {
    const optionsDiv = document.getElementById('options');
    const btns = optionsDiv.querySelectorAll('button');
    
    btns.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) btn.classList.add('correct');
        else if (btn.textContent === selected) btn.classList.add('incorrect');
    });
    
    if (selected === correct) {
        score++;
    }
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < TOTAL_QUESTIONS) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    document.getElementById('question-area').innerHTML = ''; 
    const resultArea = document.getElementById('result-area');
    resultArea.style.display = 'block';
    const scoreText = document.getElementById('score-text');
    scoreText.innerHTML = `Juego Terminado.<br>Tu puntuación: ${score} / ${TOTAL_QUESTIONS}`;
    
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Jugar de nuevo';
    restartBtn.onclick = () => location.reload();
    restartBtn.style.cssText = "margin-top:20px; padding:10px 20px; background:#2c3e50; color:white; border:none; cursor:pointer; font-size:1.1rem; border-radius:4px;";
    resultArea.appendChild(restartBtn);
}
