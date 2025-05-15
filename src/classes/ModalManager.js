export class ModalManager {
    constructor() {
        this.modal = document.getElementById('image-modal');
        this.modalImg = document.getElementById('modal-img');
        this.caption = document.getElementById('caption');
        this.closeBtn = document.querySelector('.close');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Fermeture avec le bouton X
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // Fermeture en cliquant en dehors
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Fermeture avec Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    showModal(title, description, imageUrl) {
        this.modalImg.src = imageUrl;
        this.caption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        this.modal.style.display = 'block';
        
        // Ajouter la classe visible après un court délai pour l'animation
        setTimeout(() => {
            this.modal.classList.add('visible');
        }, 10);
    }

    closeModal() {
        this.modal.classList.remove('visible');
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }
} 