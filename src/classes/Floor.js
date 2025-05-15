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
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x15c139,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Création des textes sur le sol
        this.createFloorText("↑↓←→ : Se déplacer", new THREE.Vector3(-5, 0.1, 5), 7);
        this.createFloorText("ESPACE : Interagir ", new THREE.Vector3(-5, 0.1, 7), 7);

        // Création du matériau argenté 
        const silverMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 0.9,
            roughness: 0.2
        });

        // Placement des lettres pour écrire ALASSANE
        const letterPositions = [
            { letter: 'A', x: -10, y: 0.3, z: -5, rotation: 0 },
            { letter: 'L', x: -9, y: 0.1, z: -5, rotation: 0 },
            { letter: 'A', x: -8.35, y: 0.3, z: -5, rotation: 0 },
            { letter: 'S', x: -7.35, y: 0.1, z: -5, rotation: 0 },
            { letter: 'S', x: -6.5, y: 0.1, z: -5, rotation: 0 },
            { letter: 'A', x: -5.70, y: 0.3, z: -5, rotation: 0 },
            { letter: 'N', x: -4.70, y: 0.1, z: -5, rotation: 0 },
            { letter: 'E', x: -3.70, y: 0.1, z: -5, rotation: 0 }
        ];

        // Chargement parallèle des lettres
        const loadPromises = letterPositions.map(pos => {
            return new Promise((resolve) => {
                this.loader.load(
                    `/models/${pos.letter}.glb`,
                    (gltf) => {
                        const letter = gltf.scene;
                        letter.position.set(pos.x, pos.y, pos.z);
                        letter.rotation.y = pos.rotation;
                        letter.scale.set(1.5, 1.5, 1.5);
                        
                        // Appliquer le matériau à tous les meshes
                        letter.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                                child.material = silverMaterial;
                            }
                        });
                        
                        this.scene.add(letter);
                        resolve();
                    }
                );
            });
        });

            }

    createFloorText(text, position, size) {
        // Créer un canvas pour le texte
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 256;

        // Configurer le style du texte
        context.fillStyle = '#ffffff';
        context.font = 'bold 60px Arial';  
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Dessiner le cadre
        context.strokeStyle = '#ffffff';
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