const numberInput = document.getElementById('numberInput');
const roundingSelect = document.getElementById('roundingSelect');
const canvas = document.getElementById('numberLineCanvas');
const ctx = canvas.getContext('2d');
const lowerBoundSpan = document.getElementById('lowerBound');
const upperBoundSpan = document.getElementById('upperBound');
const roundedValueSpan = document.getElementById('roundedValue');
const explanationDiv = document.getElementById('explanation');

// Update on any input change
numberInput.addEventListener('input', update);
roundingSelect.addEventListener('change', update);

// Initial update
window.addEventListener('load', update);

function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

function update() {
    const numberVal = parseFloat(numberInput.value);
    const placeValue = parseInt(roundingSelect.value);

    if (isNaN(numberVal)) {
        clearCanvas();
        lowerBoundSpan.textContent = '-';
        upperBoundSpan.textContent = '-';
        roundedValueSpan.textContent = '-';
        explanationDiv.textContent = 'Por favor ingresa un número válido.';
        return;
    }

    // Calculate bounds
    // We want the range [k * placeValue, (k+1) * placeValue] that contains the number
    // Or closer logic. Usually for rounding, we look at the floor and ceil at that precision.
    
    // Example: 123, round to 10 (Decena).
    // 123 / 10 = 12.3 -> floor 12 -> 120.
    // lower = 120.
    // upper = 120 + 10 = 130.
    
    const lowerBound = Math.floor(numberVal / placeValue) * placeValue;
    const upperBound = lowerBound + placeValue;
    
    // Standard rounding (nearest neighbor)
    // If exactly halfway, usually rounds up (Math.round does this for positive numbers .5)
    const roundedValue = Math.round(numberVal / placeValue) * placeValue;

    // Display values
    lowerBoundSpan.textContent = formatNumber(lowerBound);
    upperBoundSpan.textContent = formatNumber(upperBound);
    roundedValueSpan.textContent = formatNumber(roundedValue);

    // Explanation
    const placeName = roundingSelect.options[roundingSelect.selectedIndex].text;
    const midPoint = lowerBound + (placeValue / 2);
    
    let explanationHTML = `<p>El número <strong>${formatNumber(numberVal)}</strong> se encuentra entre <strong>${formatNumber(lowerBound)}</strong> y <strong>${formatNumber(upperBound)}</strong>.</p>`;
    
    if (numberVal < midPoint) {
        explanationHTML += `<p>Como está más cerca de ${formatNumber(lowerBound)}, se redondea a <strong>${formatNumber(lowerBound)}</strong> (redondeo hacia abajo).</p>`;
    } else if (numberVal > midPoint) {
        explanationHTML += `<p>Como está más cerca de ${formatNumber(upperBound)}, se redondea a <strong>${formatNumber(upperBound)}</strong> (redondeo hacia arriba).</p>`;
    } else {
         explanationHTML += `<p>Está justo en el medio (${formatNumber(midPoint)}). Por convención, se redondea hacia arriba a <strong>${formatNumber(upperBound)}</strong>.</p>`;
    }
    
    explanationDiv.innerHTML = explanationHTML;

    drawNumberLine(numberVal, lowerBound, upperBound, roundedValue, placeValue);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawNumberLine(current, min, max, rounded, step) {
    clearCanvas();

    const padding = 60;
    const width = canvas.width - (padding * 2);
    const yLine = 100;
    
    // Helper to map value to x coordinate
    function getX(val) {
        // Linear interpolation
        // val - min  /  max - min  =  percent
        const percent = (val - min) / (max - min);
        return padding + (percent * width);
    }

    // Draw main line
    ctx.beginPath();
    ctx.moveTo(padding - 20, yLine);
    ctx.lineTo(canvas.width - padding + 20, yLine);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw arrows at ends
    // Left arrow
    ctx.beginPath();
    ctx.moveTo(padding - 20, yLine);
    ctx.lineTo(padding - 10, yLine - 5);
    ctx.lineTo(padding - 10, yLine + 5);
    ctx.fill();
    
    // Right arrow
    ctx.beginPath();
    ctx.moveTo(canvas.width - padding + 20, yLine);
    ctx.lineTo(canvas.width - padding + 10, yLine - 5);
    ctx.lineTo(canvas.width - padding + 10, yLine + 5);
    ctx.fill();

    // Draw Ticks (Start, Middle, End)
    const mid = min + (step / 2);
    const ticks = [
        { val: min, label: formatNumber(min), color: '#333' },
        { val: mid, label: formatNumber(mid), color: '#999', small: true },
        { val: max, label: formatNumber(max), color: '#333' }
    ];

    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ticks.forEach(t => {
        const x = getX(t.val);
        const tickHeight = t.small ? 10 : 20;
        
        ctx.beginPath();
        ctx.moveTo(x, yLine - tickHeight);
        ctx.lineTo(x, yLine + tickHeight);
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = t.color;
        ctx.fillText(t.label, x, yLine + tickHeight + 5);
    });

    // Draw Current Value Position
    const currentX = getX(current);
    
    // Clamp visual position to canvas bounds just in case, though logic should keep it inside
    // Actually, if number is exactly max, it's on right edge.
    
    // Draw point
    ctx.beginPath();
    ctx.arc(currentX, yLine, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c'; // Red color for the number
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Label for current value
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(formatNumber(current), currentX, yLine - 35);


    // Draw curve to rounded value
    const roundedX = getX(rounded);
    
    // Don't draw curve if we are exactly on the spot
    if (Math.abs(current - rounded) > (step / 1000)) {
        ctx.beginPath();
        ctx.moveTo(currentX, yLine);
        
        // Control point for quadratic curve (arch)
        const midX = (currentX + roundedX) / 2;
        const midY = yLine - 40; // Arch height
        
        ctx.quadraticCurveTo(midX, midY, roundedX, yLine);
        
        ctx.strokeStyle = '#3498db'; // Blue for action
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Arrow head for curve
        // We need angle at the end
        // Simple approximation: draw arrow at roundedX
        // pointing towards it from the curve direction?
        // Let's just draw a circle at the target
        ctx.beginPath();
        ctx.arc(roundedX, yLine, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
    } else {
        // If it is already on the rounded value (e.g. 100 rounded to 100)
        // Highlight it differently?
        ctx.beginPath();
        ctx.arc(roundedX, yLine, 12, 0, Math.PI * 2);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
