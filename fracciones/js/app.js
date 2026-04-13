const app = {
    state: {
        name: 'Invitado',
        bestScore: 0
    },

    init() {
        this.loadState();
        this.updateHeader();
        
        // Bind Navigation logic
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.navigate(e.target.dataset.target);
            });
        });

        // Initialize default UI views
        practice.updateOperationUI();
        theory.loadTopic('intro');
    },

    navigate(sectionId) {
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(sectionId).classList.remove('hidden');
        const exactBtn = document.querySelector(`.nav-btn[data-target="${sectionId}"]`);
        if(exactBtn) exactBtn.classList.add('active');
        
        window.scrollTo(0, 0);
    },

    saveName() {
        const input = document.getElementById('input-name').value.trim();
        if (input) {
            this.state.name = input;
            this.syncStorage();
            this.updateHeader();
            alert(`¡Genial ${input}! Ya puedes iniciar algún desafío o labratorio.`);
        }
    },

    saveScore(score) {
        if (score > this.state.bestScore) {
            this.state.bestScore = score;
            this.syncStorage();
            this.updateHeader();
        }
    },

    loadState() {
        const stored = localStorage.getItem('fraccionesState');
        if (stored) {
            this.state = JSON.parse(stored);
        }
    },

    syncStorage() {
        localStorage.setItem('fraccionesState', JSON.stringify(this.state));
    },

    updateHeader() {
        document.getElementById('player-name').innerText = this.state.name;
        document.getElementById('best-score-display').innerText = this.state.bestScore;
    }
};

// Bootstrap
window.onload = () => app.init();
