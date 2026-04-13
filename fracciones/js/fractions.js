class Fraction {
    constructor(num, den) {
        if (den === 0) throw new Error("El denominador no puede ser cero.");
        if (den < 0) { num = -num; den = -den; } // Normalizar signo
        this.num = num;
        this.den = den;
    }

    static gcd(a, b) {
        a = Math.abs(a); b = Math.abs(b);
        while (b) { let temp = b; b = a % b; a = temp; }
        return a;
    }

    static lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / Fraction.gcd(a, b);
    }

    simplify() {
        const common = Fraction.gcd(this.num, this.den);
        return new Fraction(this.num / common, this.den / common);
    }

    toMixed() {
        if (this.num < this.den) return null; // No es impropia
        const whole = Math.floor(this.num / this.den);
        const rem = this.num % this.den;
        return { whole, num: rem, den: this.den };
    }

    toString() {
        return `${this.num}/${this.den}`;
    }
    
    toHTML() {
        return `<span class="frac-input-widget" style="margin:0"><span class="f-num">${this.num}</span><span class="f-line"></span><span class="f-den">${this.den}</span></span>`;
    }

    static parseMixed(whole, num, den) {
        const w = parseInt(whole) || 0;
        const n = parseInt(num) || 0;
        const d = parseInt(den) || 1;
        return new Fraction((w * d) + n, d);
    }

    static add(f1, f2) {
        let steps = [];
        let num, den;
        if (f1.den === f2.den) {
            steps.push(`Como los denominadores son iguales (${f1.den}), los mantenemos.`);
            steps.push(`Sumamos los numeradores: ${f1.num} + ${f2.num} = ${f1.num + f2.num}.`);
            num = f1.num + f2.num;
            den = f1.den;
        } else {
            let commonDen = Fraction.lcm(f1.den, f2.den);
            steps.push(`Buscamos el mínimo común múltiplo (MCM) de ${f1.den} y ${f2.den}, que es <strong>${commonDen}</strong>.`);
            let newNum1 = f1.num * (commonDen / f1.den);
            let newNum2 = f2.num * (commonDen / f2.den);
            steps.push(`Convertimos la primera fracción multiplicando arriba y abajo por ${commonDen / f1.den}: <strong>${newNum1}/${commonDen}</strong>.`);
            steps.push(`Convertimos la segunda fracción multiplicando arriba y abajo por ${commonDen / f2.den}: <strong>${newNum2}/${commonDen}</strong>.`);
            steps.push(`Sumamos los nuevos numeradores: ${newNum1} + ${newNum2} = ${newNum1 + newNum2}.`);
            num = newNum1 + newNum2;
            den = commonDen;
        }
        let result = new Fraction(num, den);
        return Fraction._finalizeOperation(result, steps);
    }

    static subt(f1, f2) {
        let steps = [];
        let num, den;
        if (f1.den === f2.den) {
            steps.push(`Como los denominadores son iguales (${f1.den}), los mantenemos.`);
            steps.push(`Restamos los numeradores: ${f1.num} - ${f2.num} = ${f1.num - f2.num}.`);
            num = f1.num - f2.num;
            den = f1.den;
        } else {
            let commonDen = Fraction.lcm(f1.den, f2.den);
            steps.push(`Buscamos el mínimo común múltiplo (MCM) de ${f1.den} y ${f2.den}, que es <strong>${commonDen}</strong>.`);
            let newNum1 = f1.num * (commonDen / f1.den);
            let newNum2 = f2.num * (commonDen / f2.den);
            steps.push(`Convertimos la primera fracción a: <strong>${newNum1}/${commonDen}</strong>.`);
            steps.push(`Convertimos la segunda fracción a: <strong>${newNum2}/${commonDen}</strong>.`);
            steps.push(`Restamos los numeradores: ${newNum1} - ${newNum2} = ${newNum1 - newNum2}.`);
            num = newNum1 - newNum2;
            den = commonDen;
        }
        let result = new Fraction(num, den);
        return Fraction._finalizeOperation(result, steps);
    }

    static multiply(f1, f2) {
        let steps = [];
        steps.push(`La multiplicación es directa: numerador x numerador, y denominador x denominador.`);
        steps.push(`Numeradores: ${f1.num} x ${f2.num} = ${f1.num * f2.num}`);
        steps.push(`Denominadores: ${f1.den} x ${f2.den} = ${f1.den * f2.den}`);
        let result = new Fraction(f1.num * f2.num, f1.den * f2.den);
        return Fraction._finalizeOperation(result, steps);
    }

    static divide(f1, f2) {
        let steps = [];
        steps.push(`Para dividir, multiplicamos formando una "X" (cruzado) o invertimos la segunda fracción.`);
        steps.push(`Multiplicamos el primer numerador por el segundo denominador: ${f1.num} x ${f2.den} = ${f1.num * f2.den}`);
        steps.push(`Multiplicamos el primer denominador por el segundo numerador: ${f1.den} x ${f2.num} = ${f1.den * f2.num}`);
        let result = new Fraction(f1.num * f2.den, f1.den * f2.num);
        return Fraction._finalizeOperation(result, steps);
    }

    static _finalizeOperation(result, steps) {
        let simp = result.simplify();
        if (simp.num !== result.num) {
            steps.push(`¡Atención! Podemos simplificar el resultado dividiendo arriba y abajo para ${Fraction.gcd(result.num, result.den)}. El resultado simplificado es <strong>${simp.toString()}</strong>.`);
        }
        let mixed = simp.toMixed();
        if (mixed && mixed.num !== 0) {
            steps.push(`Además, como el numerador es mayor que el denominador, se puede convertir a número mixto: <strong>${mixed.whole} entero(s) y ${mixed.num}/${mixed.den}</strong>.`);
        } else if (mixed && mixed.num === 0) {
            steps.push(`Esta fracción representa exactamente <strong>${mixed.whole} enteros</strong>.`);
        }
        return { result: simp, steps: steps };
    }
}
