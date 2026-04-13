const theoryData = {
    intro: {
        title: "¿Qué es una fracción?",
        content: `
            <p>Una fracción representa una <strong>parte de un todo</strong>. Cuando dividimos algo en partes iguales, como una pizza o un pastel, usamos fracciones para decir cuántas porciones tenemos.</p>
            <ul>
                <li><strong>Numerador (Número de arriba):</strong> Indica cuántas partes tomamos.</li>
                <li><strong>Denominador (Número de abajo):</strong> Indica en cuántas partes IGUALES se dividió el total.</li>
            </ul>
            <div id="theory-canvas-1" style="display:flex; justify-content:center;"></div>
            <p style="text-align:center;">Ejemplo: <strong>3/4</strong>. Una pizza cortada en 4 partes, y solo quedan 3.</p>
        `,
        visuals: [{ id: "theory-canvas-1", n: 3, d: 4, c: "#f59e0b" }]
    },
    equivalent: {
        title: "Fracciones Equivalentes",
        content: `
            <p>Son fracciones que se escriben diferente, ¡pero valen exactamente lo mismo! Ocupan el mismo espacio.</p>
            <p>Por ejemplo, si tienes media pizza <strong>(1/2)</strong>, es lo mismo que si la cortas en 4 partes y te comes dos <strong>(2/4)</strong>.</p>
            <div style="display:flex; justify-content:space-around;">
               <div id="theory-canvas-2"></div>
               <div id="theory-canvas-3"></div>
            </div>
            <p style="text-align:center;">1/2 es igual a 2/4</p>
        `,
        visuals: [
            { id: "theory-canvas-2", n: 1, d: 2, c: "#10b981" },
            { id: "theory-canvas-3", n: 2, d: 4, c: "#3b82f6" }
        ]
    },
    mixed: {
        title: "Números Mixtos y Fracciones Impropias",
        content: `
            <p>Una <strong>fracción propia</strong> es cuando el numerador es menor que el denominador (Ej. 1/4). ¡Es menos de un pastel entero!</p>
            <p>Una <strong>fracción impropia</strong> es cuando el numerador es MAYOR que el denominador (Ej. 5/4). ¡Esto significa que tienes más de un pastel entero!</p>
            <p>Puedes escribir una fracción impropia como un <strong>número mixto</strong>, separando el entero. 5/4 sería igual a 1 entero y 1/4 (1 ¼).</p>
            <div id="theory-canvas-4" style="display:flex; justify-content:center;"></div>
        `,
        visuals: [{ id: "theory-canvas-4", n: 5, d: 4, c: "#f59e0b" }]
    },
    addsub: {
        title: "Suma y Resta de Fracciones",
        content: `
            <p>Para sumar o restar fracciones, la regla de oro es: <strong>¡Los denominadores deben ser iguales!</strong></p>
            <p>Si son iguales, simplemente dejas el denominador y sumas/restas los números de arriba (numeradores).</p>
            <p>Si son diferentes, debes averiguar un número común para ambos denominadores, que se llama <strong>Mínimo Común Múltiplo (MCM)</strong>. Luego de transformar las fracciones a equivalentes, ya puedes sumar.</p>
        `,
        visuals: []
    },
    muldiv: {
        title: "Multiplicación y División",
        content: `
            <p><strong>Multiplicar:</strong> Es lo más fácil. Se multiplica de forma directa (numerador x numerador) y (denominador x denominador).</p>
            <p><strong>Dividir:</strong> Cruzamos los números. Multiplicamos el primer numerador por el segundo denominador, y viceversa, formando una X.</p>
        `,
        visuals: []
    }
};

const theory = {
    loadTopic(topicId) {
        document.querySelectorAll('.side-btn').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');

        const content = document.getElementById('theory-content');
        const data = theoryData[topicId];
        
        content.innerHTML = `<h2>${data.title}</h2>${data.content}`;

        if (data.visuals && data.visuals.length > 0) {
            // Need a tiny timeout to let DOM render
            setTimeout(() => {
                data.visuals.forEach(v => {
                    visualEngine.drawFractionPie(v.id, v.n, v.d, v.c);
                });
            }, 50);
        }
    }
};
