export class InputManager {
    constructor() {
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.keys.Space = true;
                return;
            }
            
            if (e.code in this.keys) {
                this.keys[e.code] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.keys.Space = false;
                return;
            }
            
            if (e.code in this.keys) {
                this.keys[e.code] = false;
            }
        });

        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('image-modal').style.display = "none";
        });
    }
} 