import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Floor {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.materialCache = new Map(); 
        this.create();
    }

    create() {
        // Sol en marbre
        const groundGeometry = new THREE.PlaneGeometry(50, 60);
        const marbleTexture = new THREE.TextureLoader().load('/textures/marble_floor.jpg');
        marbleTexture.wrapS = THREE.RepeatWrapping;
        marbleTexture.wrapT = THREE.RepeatWrapping;
        marbleTexture.repeat.set(8, 8);
        
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: marbleTexture,
            roughness: 0.1,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Création des textes sur le sol
        this.createFloorText("↑↓←→ : Se déplacer", new THREE.Vector3(-5, 0.1, 5), 7);
        this.createFloorText("ESPACE : Interagir ", new THREE.Vector3(-5, 0.1, 7), 7);

            }

    createFloorText(text, position, size) {
        // Créer un canvas pour le texte
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 256;

        // Configurer le style du texte
        context.fillStyle = '#000000';
        context.font = 'bold 60px Arial';  
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Dessiner le cadre
        context.strokeStyle = '#000000';
        context.lineWidth = 8;
        context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Dessiner le texte
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Créer la texture à partir du canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        // Créer le matériau avec la texture
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        // Créer la géométrie pour le texte
        const geometry = new THREE.PlaneGeometry(size, size / 4);
        const textMesh = new THREE.Mesh(geometry, material);

        // Positionner le texte
        textMesh.position.copy(position);
        textMesh.rotation.x = -Math.PI / 2;

        // Ajouter le texte à la scène
        this.scene.add(textMesh);
    }
}