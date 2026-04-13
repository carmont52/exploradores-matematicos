const quiz = {
    questions: [],
    currentQ: 0,
    score: 0,
    mistakes: [],
    
    start() {
        this.score = 0;
        this.currentQ = 0;
        this.mistakes = [];
        this.questions = this.generateQuestions(10);
        
        document.getElementById('quiz-intro').classList.add('hidden');
        document.getElementById('quiz-reports').classList.add('hidden');
        document.getElementById('quiz-active').classList.remove('hidden');
        
        this.showQuestion();
    },
    
    generateQuestions(amount) {
        let qList = [];
        for (let i=0; i<amount; i++) {
            let type = Math.floor(Math.random() * 4); // 0: visual, 1: sum, 2: convert, 3: simplify
            let q = { id: i, answers: [] };
            
            if (type === 0) {
                // Visual question
                let n = Math.floor(Math.random() * 5) + 1;
                let d = Math.floor(Math.random() * 4) + n; // proper/improper
                q.title = `¿Qué fracción representa la imagen?`;
                q.visual = { n, d, c: '#a855f7' };
                q.correctObj = new Fraction(n, d);
                q.correctAnswer = q.correctObj.toString();
                q.explanation = [`La imagen está dividida en pedazos de 1/${d}. Existen ${n} pedazos pintados. Resultado: ${n}/${d}`];
                
                // Gen dummies
                q.answers.push(q.correctAnswer);
                q.answers.push(`${d}/${n}`);
                q.answers.push(`${n+1}/${d}`);
                q.answers.push(`${n}/${d+1}`);
            } else if (type === 1) {
                // Suma/Resta con mismo den
                let d = Math.floor(Math.random() * 6) + 3;
                let n1 = Math.floor(Math.random() * 4) + 1;
                let n2 = Math.floor(Math.random() * 4) + 1;
                let isSum = Math.random() > 0.5;
                if (!isSum && n1 < n2) { let t = n1; n1 = n2; n2 = t; } // Evitar negativos
                
                q.title = `¿Cuánto es ${n1}/${d} ${isSum?'+':'-'} ${n2}/${d}?`;
                let resObj = isSum ? Fraction.add(new Fraction(n1,d), new Fraction(n2,d)) : Fraction.subt(new Fraction(n1,d), new Fraction(n2,d));
                q.correctAnswer = resObj.result.toString();
                q.explanation = resObj.steps;
                
                q.answers.push(q.correctAnswer);
                q.answers.push(new Fraction(Math.abs(n1+(isSum?-1:1)), d).simplify().toString());
                q.answers.push(new Fraction(n1+n2, d*2).toString()); // Error comun
                q.answers.push(new Fraction(Math.abs(n1-n2), d*2).toString());
            } else if (type === 2) {
                // Convert mixed
                let w = Math.floor(Math.random() * 3) + 1;
                let d = Math.floor(Math.random() * 3) + 3;
                let n = Math.floor(Math.random() * (d-1)) + 1;
                let f = Fraction.parseMixed(w, n, d);
                
                q.title = `Convertir el número mixto ${w} enteros y ${n}/${d} a fracción impropia.`;
                q.correctAnswer = f.toString();
                q.explanation = [
                    `Multiplicamos el entero por el denominador: ${w} x ${d} = ${w*d}.`,
                    `Sumamos al numerador: ${w*d} + ${n} = ${(w*d)+n}.`,
                    `El denominador se mantiene: ${(w*d)+n}/${d}`
                ];
                
                q.answers.push(q.correctAnswer);
                q.answers.push(`${(w*n)+d}/${d}`);
                q.answers.push(`${(w*d)-n}/${d}`);
                q.answers.push(`${(w+n)}/${d}`);
            } else {
                // Simplify
                let n = Math.floor(Math.random() * 5) + 2;
                let d = Math.floor(Math.random() * 5) + n + 1;
                let f = new Fraction(n*2, d*2); // Asegurar que es simplificable
                
                q.title = `Simplifica la fracción ${f.toString()}`;
                let simpObj = f.simplify();
                q.correctAnswer = simpObj.toString();
                q.explanation = [
                    `El máximo común divisor entre ${f.num} y ${f.den} es ${Fraction.gcd(f.num, f.den)}.`,
                    `Al dividirlos ambos por ese número obtenemos ${simpObj.toString()}`
                ];
                
                q.answers.push(q.correctAnswer);
                q.answers.push(new Fraction(f.num/2, f.den).toString());
                q.answers.push(`${f.num-1}/${f.den-1}`);
                q.answers.push(new Fraction(f.num, f.den/2).toString());
            }
            
            // Randomize answers y quitar duplicados usando set si los hay, o solo shuffle simple
            q.answers = [...new Set(q.answers)];
            while(q.answers.length < 4) q.answers.push(`${Math.floor(Math.random()*10)+1}/${Math.floor(Math.random()*10)+2}`); // fill if set reduced
            q.answers.sort(() => Math.random() - 0.5);
            
            qList.push(q);
        }
        return qList;
    },
    
    showQuestion() {
        let q = this.questions[this.currentQ];
        document.getElementById('quiz-progress-text').innerText = `Pregunta ${this.currentQ + 1} de 10`;
        document.getElementById('quiz-progress-fill').style.width = `${((this.currentQ+1)/10)*100}%`;
        document.getElementById('quiz-question-title').innerText = q.title;
        
        let visualContainer = document.getElementById('quiz-visual-hint');
        visualContainer.innerHTML = '';
        if (q.visual) {
            let canvasId = 'quiz-canvas-hint';
            visualContainer.innerHTML = `<div id="${canvasId}"></div>`;
            visualEngine.drawFractionPie(canvasId, q.visual.n, q.visual.d, q.visual.c);
        }
        
        let optsHtml = '';
        q.answers.forEach(ans => {
            optsHtml += `<button class="opt-btn" onclick="quiz.selectAnswer(this, '${ans}')">${ans}</button>`;
        });
        document.getElementById('quiz-options').innerHTML = optsHtml;
    },
    
    selectAnswer(btn, answer) {
        document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true); // Bloquear doble click
        let q = this.questions[this.currentQ];
        
        if (answer === q.correctAnswer) {
            btn.classList.add('correct');
            this.score++;
        } else {
            btn.classList.add('wrong');
            // Buscar y marcar color verde al correcto
            document.querySelectorAll('.opt-btn').forEach(b => {
                if(b.innerText === q.correctAnswer) b.classList.add('correct');
            });
            this.mistakes.push(q);
        }
        
        setTimeout(() => {
            this.currentQ++;
            if (this.currentQ < 10) {
                this.showQuestion();
            } else {
                this.endQuiz();
            }
        }, 1500); // 1.5s delay for review
    },
    
    endQuiz() {
        document.getElementById('quiz-active').classList.add('hidden');
        document.getElementById('quiz-reports').classList.remove('hidden');
        document.getElementById('quiz-final-score').innerText = `${this.score}/10`;
        
        // Guardar score
        app.saveScore(this.score);
        
        // Render mistakes
        let mistHtml = '';
        if (this.mistakes.length === 0) {
            mistHtml = '<p style="color:#10b981; font-weight:bold; font-size:1.2rem; text-align:center;">¡Felicidades, lograste un puntaje perfecto! No tienes errores por corregir.</p>';
        } else {
            this.mistakes.forEach(m => {
                let stepsHtml = m.explanation.map(e => `<li>${e}</li>`).join('');
                mistHtml += `
                    <div class="mistake-card">
                        <h4>Error en: "${m.title}"</h4>
                        <p>La respuesta correcta era <strong>${m.correctAnswer}</strong>.</p>
                        <p><strong>Desarrollo Paso a Paso:</strong></p>
                        <ol>${stepsHtml}</ol>
                    </div>
                `;
            });
        }
        document.getElementById('quiz-mistakes').innerHTML = mistHtml;
    }
}
