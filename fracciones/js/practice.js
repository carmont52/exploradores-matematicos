const practice = {
    updateOperationUI() {
        const op = document.getElementById('practice-operation').value;
        const container = document.getElementById('practice-input-area');
        
        let html = '';
        if (op === 'toMixed' || op === 'simplify') {
            html += `<div class="frac-input-widget">
                        <input type="number" id="pf1-num" class="f-num" placeholder="Num" value="5">
                        <div class="f-line"></div>
                        <input type="number" id="pf1-den" class="f-den" placeholder="Den" value="4">
                     </div>`;
        } else if (op === 'toImproper') {
            html += `<div class="mixed-wrapper">
                        <input type="number" id="pf1-whole" class="f-whole" placeholder="Ent" value="1">
                        <div class="frac-input-widget" style="margin:0">
                            <input type="number" id="pf1-num" class="f-num" placeholder="Num" value="1">
                            <div class="f-line"></div>
                            <input type="number" id="pf1-den" class="f-den" placeholder="Den" value="4">
                        </div>
                     </div>`;
        } else {
            // Operaciones binarias
            let sign = '+';
            if(op === 'subtract') sign = '-';
            if(op === 'multiply') sign = 'x';
            if(op === 'divide') sign = '÷';
            
            html += `<div class="frac-input-widget">
                        <input type="number" id="pf1-num" class="f-num" placeholder="N" value="1">
                        <div class="f-line"></div>
                        <input type="number" id="pf1-den" class="f-den" placeholder="D" value="2">
                     </div>
                     <span class="op-item" id="practice-sign">${sign}</span>
                     <div class="frac-input-widget">
                        <input type="number" id="pf2-num" class="f-num" placeholder="N" value="1">
                        <div class="f-line"></div>
                        <input type="number" id="pf2-den" class="f-den" placeholder="D" value="4">
                     </div>`;
        }
        container.innerHTML = html;
        document.getElementById('practice-results').classList.add('hidden');
    },

    calculateAndShow() {
        const op = document.getElementById('practice-operation').value;
        const resultsBox = document.getElementById('practice-results');
        const visualF1 = document.getElementById('visual-f1');
        const visualF2 = document.getElementById('visual-f2');
        const visualOp = document.getElementById('visual-op');
        const visualEq = document.getElementById('visual-eq');
        const visualRes = document.getElementById('visual-res');
        const stepsList = document.getElementById('steps-list');
        const finalAns = document.getElementById('final-answer-text');
        
        try {
            // Limpiar área
            visualF1.innerHTML = ''; visualF2.innerHTML = ''; visualRes.innerHTML = '';
            visualOp.innerText = ''; visualEq.innerText = '=';
            stepsList.innerHTML = ''; finalAns.innerHTML = '';
            
            let f1, f2, rezObj;
            
            if (op === 'toImproper') {
                const w = parseInt(document.getElementById('pf1-whole').value) || 0;
                const n = parseInt(document.getElementById('pf1-num').value) || 0;
                const d = parseInt(document.getElementById('pf1-den').value) || 1;
                if(d===0) throw new Error("Denominador 0");
                f1 = new Fraction(n, d);
                
                let steps = [
                    `Tenemos un número mixto: ${w} enteros y ${f1.toString()}.`,
                    `Para convertirlo a impropio, multiplicamos el entero por el denominador: ${w} x ${d} = ${w * d}.`,
                    `Sumamos ese número al numerador actual: ${w*d} + ${n} = ${(w*d)+n}.`,
                    `El denominador se mantiene igual (${d}).`
                ];
                let fRes = Fraction.parseMixed(w, n, d);
                
                visualEngine.drawFractionPie('visual-f1', fRes.num, fRes.den, '#3b82f6');
                visualOp.innerText = 'es igual a';
                visualEngine.drawFractionPie('visual-res', fRes.num, fRes.den, '#10b981');
                
                steps.forEach(s => stepsList.innerHTML += `<li>${s}</li>`);
                finalAns.innerHTML = `Resultado: ${fRes.toString()}`;
                
            } else if (op === 'toMixed' || op === 'simplify') {
                const n = parseInt(document.getElementById('pf1-num').value) || 0;
                const d = parseInt(document.getElementById('pf1-den').value) || 1;
                f1 = new Fraction(n, d);
                visualEngine.drawFractionPie('visual-f1', f1.num, f1.den, '#3b82f6');
                visualOp.innerText = 'se convierte en';
                
                if (op === 'toMixed') {
                    let mx = f1.toMixed();
                    if (!mx) {
                        stepsList.innerHTML = `<li>La fracción ${f1.toString()} es PROPIA. No alcanza a completar 1 entero, así que no se puede convertir a mixto.</li>`;
                        finalAns.innerHTML = `Mismo resultado: ${f1.toString()}`;
                        visualEngine.drawFractionPie('visual-res', f1.num, f1.den, '#10b981');
                    } else {
                        stepsList.innerHTML = `
                            <li>Dividimos el numerador (${n}) para el denominador (${d}).</li>
                            <li>La división nos da ${mx.whole} entero(s).</li>
                            <li>El residuo (lo que sobra) es ${mx.num}. Esa será nuestra nueva fracción propia.</li>
                        `;
                        let resTxt = mx.num === 0 ? `${mx.whole} entero(s) exactos.` : `${mx.whole} entero(s) y ${mx.num}/${mx.den}`;
                        finalAns.innerHTML = `Resultado: ${resTxt}`;
                        visualEngine.drawFractionPie('visual-res', f1.num, f1.den, '#10b981'); // Mismo dibujo visual
                    }
                } else {
                    let simp = f1.simplify();
                    stepsList.innerHTML = `
                        <li>Buscamos el máximo divisor común entre ${n} y ${d}, que es ${Fraction.gcd(n,d)}.</li>
                        <li>Dividimos ambos por ese número. Nos queda ${simp.toString()}.</li>
                    `;
                    finalAns.innerHTML = `Fracción Simplificada: ${simp.toString()}`;
                    visualEngine.drawFractionPie('visual-res', simp.num, simp.den, '#10b981');
                }
            } else {
                // Operaciones de 2 fracciones
                const n1 = parseInt(document.getElementById('pf1-num').value) || 0;
                const d1 = parseInt(document.getElementById('pf1-den').value) || 1;
                const n2 = parseInt(document.getElementById('pf2-num').value) || 0;
                const d2 = parseInt(document.getElementById('pf2-den').value) || 1;
                f1 = new Fraction(n1, d1);
                f2 = new Fraction(n2, d2);
                
                visualEngine.drawFractionPie('visual-f1', f1.num, f1.den, '#3b82f6');
                visualEngine.drawFractionPie('visual-f2', f2.num, f2.den, '#f59e0b');
                
                if(op === 'add') { visualOp.innerText = '+'; rezObj = Fraction.add(f1, f2); }
                if(op === 'subtract') { visualOp.innerText = '-'; rezObj = Fraction.subt(f1, f2); }
                if(op === 'multiply') { visualOp.innerText = 'x'; rezObj = Fraction.multiply(f1, f2); }
                if(op === 'divide') { visualOp.innerText = '÷'; rezObj = Fraction.divide(f1, f2); }
                
                visualEngine.drawFractionPie('visual-res', rezObj.result.num, rezObj.result.den, '#10b981');
                rezObj.steps.forEach(s => stepsList.innerHTML += `<li>${s}</li>`);
                finalAns.innerHTML = `Resultado Final: ${rezObj.result.toString()}`;
            }
            resultsBox.classList.remove('hidden');
        } catch (e) {
            alert('Asegúrate de ingresar números válidos, ¡y no uses cero en el denominador (parte de abajo)!');
        }
    }
};
