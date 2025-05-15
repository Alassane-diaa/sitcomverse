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
        this.isStarted = true;
        this.startGame();
    }

    startGame() {
        this.scene = new Scene();
        this.floor = new Floor(this.scene.scene);
        this.environment = new Environment(this.scene.scene);
        this.character = new Character(this.scene.scene, this.scene.camera, this.environment);
        this.inputManager = new InputManager();
        this.modalManager = new ModalManager();
        
        // Création des points d'intérêt à partir du JSON
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
        this.animate();
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
        requestAnimationFrame(this.animate.bind(this));
        
        const deltaTime = this.clock.getDelta();
        
        this.character.update(deltaTime, this.inputManager.keys, this.scene.camera);
        this.checkInteractions();
        this.scene.render();
    }
}

// Démarrer le jeu
new Game(); 