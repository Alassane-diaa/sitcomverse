import * as THREE from 'three';
import seriesData from './data/series.json';
import { Scene } from './classes/Scene.js';
import { Floor } from './classes/Floor.js';
import { Character } from './classes/Character.js';
import { Environment } from './classes/Environment.js';
import { InterestPoint } from './classes/InterestPoint.js';
import { InputManager } from './classes/InputManager.js';
import { ModalManager } from './classes/ModalManager.js';

class Game {
    constructor() {
        this.isLoading = true;
        this.animate = this.animate.bind(this);
        this.createLoadingScreen();
        this.init();
        this.animate();

        // Start hiding loading screen after 3 seconds
        setTimeout(() => {
            this.isLoading = false;
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                loadingScreen.addEventListener('transitionend', (event) => {
                    if (event.target.parentNode) {
                        event.target.remove();
                    }
                });
            }
        }, 3000);
    }

    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';

        const loader = document.createElement('div');
        loader.id = 'loader';

        loadingScreen.appendChild(loader);
        document.body.appendChild(loadingScreen);
    }

    init() {
        this.scene = new Scene();
        this.floor = new Floor(this.scene.scene);
        this.environment = new Environment(this.scene.scene);
        this.character = new Character(this.scene.scene, this.scene.camera, this.environment);
        this.inputManager = new InputManager();
        this.modalManager = new ModalManager();
        
        this.interestPoints = seriesData.series.map(series => 
            new InterestPoint(
                this.scene.scene,
                new THREE.Vector3(series.position.x, series.position.y, series.position.z),
                series.title,
                series.description,
                series.imageUrl
            )
        );

        this.clock = new THREE.Clock();
    }

    checkInteractions() {
        if (this.character.mesh) {
            const isNearPoint = this.interestPoints.some(point => point.isNear(this.character.mesh.position));
            
            if ((this.inputManager.keys.Space || this.inputManager.keys.Enter) && isNearPoint) {
                for (const point of this.interestPoints) {
                    if (point.isNear(this.character.mesh.position)) {
                        point.showInfo();
                        break;
                    }
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        
        // Only update game logic after loading is complete
        if (!this.isLoading) {
            const deltaTime = this.clock.getDelta();
            this.character.update(deltaTime, this.inputManager.keys, this.scene.camera);
            this.checkInteractions();
        }
        
        // Always render the scene
        this.scene.render();
    }
}

new Game();