import * as THREE from 'three';
import { ModalManager } from './ModalManager.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class InterestPoint {
    constructor(scene, position, title, description, imageUrl) {
        this.scene = scene;
        this.position = position;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.loader = new GLTFLoader();
        
        this.createMarker();
        this.createImageSprite();
        
        // Créer une instance unique du ModalManager
        if (!InterestPoint.modalManager) {
            InterestPoint.modalManager = new ModalManager();
        }
    }

    createMarker() {
        // Création d'un groupe pour contenir tous les éléments du marqueur
        this.markerGroup = new THREE.Group();
        
        this.loader.load(
            '/models/holovision.glb',
            (gltf) => {
                const holovision = gltf.scene;
                holovision.position.y = -1;
                holovision.scale.set(0.25, 0.5, 0.25);
                holovision.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.markerGroup.add(holovision);
            }
        );

        this.markerGroup.position.copy(this.position);
        this.scene.add(this.markerGroup);
    }

    createImageSprite() {
        // Chargement de la texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            this.imageUrl, 
            (texture) => {
                // Calcul du ratio pour maintenir les proportions de l'image
                const imageRatio = texture.image.width / texture.image.height;
                const spriteWidth = 3; // Largeur fixe
                const spriteHeight = spriteWidth / imageRatio;

                const material = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0.9
                });
                
                this.imageSprite = new THREE.Sprite(material);
                this.imageSprite.scale.set(spriteWidth, spriteHeight, 1);
                this.imageSprite.position.copy(this.position);
                this.imageSprite.position.y += 0.5;
                this.scene.add(this.imageSprite);

                // Démarrer l'animation une fois l'image chargée
                this.animate();
            },
            undefined,
            (error) => {
                console.error('Erreur lors du chargement de l\'image:', error);
            }
        );
    }

    animate() {
        // Animation de pulsation de l'image
        const pulse = () => {
            if (this.imageSprite) {
                const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
                this.imageSprite.scale.x = 3 * scale;
                this.imageSprite.scale.y = (3 / (this.imageSprite.material.map.image.width / this.imageSprite.material.map.image.height)) * scale;
            }
            requestAnimationFrame(pulse);
        };
        pulse();
    }

    isNear(cameraPosition) {
        return this.position.distanceTo(cameraPosition) < 3;
    }

    showInfo() {
        InterestPoint.modalManager.showModal(this.title, this.description, this.imageUrl);
    }
}