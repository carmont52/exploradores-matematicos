const visualEngine = {
    drawFractionPie(containerId, num, den, color = "#3b82f6") {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Limpiar anterior
        
        let piesToDraw = Math.ceil(num / den);
        if (piesToDraw === 0) piesToDraw = 1; // Para dibujar al menos 0/den
        
        let remainingParts = num;
        
        for (let i = 0; i < piesToDraw; i++) {
            const canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            canvas.style.margin = "5px";
            container.appendChild(canvas);
            
            const ctx = canvas.getContext("2d");
            const x = canvas.width / 2;
            const y = canvas.height / 2;
            const radius = 40;
            
            // Dibujar fondo de pastel vacío
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "#e2e8f0";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#1e293b";
            ctx.stroke();
            
            // Dibujar porciones
            const sliceAngle = (2 * Math.PI) / den;
            
            for (let s = 0; s < den; s++) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, radius, s * sliceAngle - Math.PI/2, (s+1) * sliceAngle - Math.PI/2);
                ctx.closePath();
                
                if (remainingParts > 0) {
                    ctx.fillStyle = color;
                    ctx.fill();
                    remainingParts--;
                }
                
                ctx.stroke();
            }
        }
    }
};
