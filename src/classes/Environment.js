import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Floor } from './Floor.js';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.floor = new Floor(scene);
        this.collisionObjects = [];
        this.setupBoundaries();
        this.createWalls();
        this.createDecorations();
        this.createDecorativePlants();
        this.createLetters();
        this.createSecurityLine(); 
    }

    setupBoundaries() {
        this.boundaries = {
            minX: -24.5,
            maxX: 24.5,
            minZ: -24.5,
            maxZ: 24.5
        };
    }

    getBoundaries() {
        return this.boundaries;
    }

    getCollisionObjects() {
        return this.collisionObjects;
    }

    createLetters() {      
        // Création du matériau argenté 
        const silverMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 0.9,
            roughness: 0.2
        });

        // Placement des lettres pour écrire ALASSANE
        const letterPositions = [
            { letter: 'A', x: -10, y: 2, z: -24.5, rotation: 0 },
            { letter: 'L', x: -9, y: 2, z: -24.5, rotation: 0 },
            { letter: 'A', x: -8.35, y: 2, z: -24.5, rotation: 0 },
            { letter: 'S', x: -7.35, y: 2, z: -24.5, rotation: 0 },
            { letter: 'S', x: -6.5, y: 2, z: -24.5, rotation: 0 },
            { letter: 'A', x: -5.70, y: 2, z: -24.5, rotation: 0 },
            { letter: 'N', x: -4.70, y: 2, z: -24.5, rotation: 0 },
            { letter: 'E', x: -3.70, y: 2, z: -24.5, rotation: 0 }
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

    createDecorations() {
        // All decorative elements positions
        const decorations = [
            // Bookshelves along walls
            { x: -24, z: -10, rotation: Math.PI/2, model: 'bookshelf', scale: 1, collision: true },
            { x: -24, z: 10, rotation: Math.PI/2, model: 'bookshelf', scale: 1, collision: true },
            { x: 24, z: -10, rotation: -Math.PI/2, model: 'bookshelf', scale: 1, collision: true },
            { x: 24, z: 10, rotation: -Math.PI/2, model: 'bookshelf', scale: 1, collision: true },
            { x: -15, z: -24, rotation: 0, model: 'bookshelf', scale: 1, collision: true },
            { x: 10, z: -24, rotation: 0, model: 'bookshelf', scale: 1, collision: true },
            
            // Animal statues
            { x: -23, z: -23, rotation: 0, model: 'fox_statue', scale: 0.8, collision: true },
            { x: 24, z: -25, rotation: 0, model: 'horse_statue', scale: 0.6, collision: true },
            { x: -23, z: 23, rotation: -Math.PI/2, model: 'stag_statue', scale: 0.8, collision: true },
            { x: 23, z: 23, rotation: -Math.PI/2, model: 'fox_statue', scale: 0.8, collision: true },
            
            // Trash cans
            { x: 0, z: -22, rotation: 0, model: 'trashcan', scale: 1, collision: true },
            { x: -22, z: 0, rotation: Math.PI/2, model: 'trashcan', scale: 1, collision: true },
            { x: 22, z: 0, rotation: -Math.PI/2, model: 'trashcan', scale: 1, collision: true }
        ];

        decorations.forEach(dec => {
            if (dec.collision) {
                this.collisionObjects.push({
                    position: new THREE.Vector3(dec.x, 0, dec.z),
                    radius: 0.25,
                    type: 'cylinder'
                });
            }

            this.loader.load(
                `/models/${dec.model}.glb`,
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(dec.x, 0, dec.z);
                    model.rotation.y = dec.rotation;
                    model.scale.set(dec.scale, dec.scale, dec.scale);
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(model);
                }
            );
        });
    }

    createChairs() {
        const benchPositions = [
            { x: -20, z: 0, rotation: Math.PI/2 },
            { x: 20, z: 0, rotation: Math.PI/2 },
            { x: 20, z: 15, rotation: Math.PI/2 },
            { x: -20, z: 15, rotation: Math.PI/2 },
            { x: -20, z: -15, rotation: Math.PI/2 },
            { x: 20, z: -15, rotation: Math.PI/2 }
        ];

        benchPositions.forEach(pos => {
            this.collisionObjects.push({
                position: new THREE.Vector3(pos.x, 0, pos.z),
                radius : 0.5,
                type: 'sphere'
            });

            // Load bench model
            this.loader.load(
                '/models/blue_bench.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(pos.x, 0, pos.z);
                    // model.scale.set(0.025, 0.025, 0.025);
                    model.rotation.y = pos.rotation;
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(model);
                }
            );
        });
    }

    createWalls() {
        // Murs blancs du musée
        const wallGeometry = new THREE.PlaneGeometry(50, 60);
        const marbleTexture = new THREE.TextureLoader().load('/textures/wall_bump_light.jpg');
        
        const wallMaterial = new THREE.MeshStandardMaterial({
            map: marbleTexture,
            roughness: 0.1,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        // Murs périmétriques
        const walls = [
            { pos: [0, 10, -25], scale: [50, 20, 1] }, // Mur nord
            { pos: [-25, 10, 0], scale: [1, 20, 60] }, // Mur ouest
            { pos: [25, 10, 0], scale: [1, 20, 60] }   // Mur est
        ];

        walls.forEach(wall => {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const mesh = new THREE.Mesh(geometry, wallMaterial);
            mesh.position.set(...wall.pos);
            mesh.scale.set(...wall.scale);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
        });
    }

    createStatues() {
        const statuePositions = [
            { x: -23, z: -23},
            { x: 23, z: -23},
            { x: -23, z: 23},
            { x: 23, z: 23}
        ];

        statuePositions.forEach(pos => {
            this.collisionObjects.push({
                position: new THREE.Vector3(pos.x, 0, pos.z),
                radius: 0.75,
                type: 'cylinder'
            });

            this.loader.load(
                '/models/pedestal.glb',
                (gltf) => {
                    const statue = gltf.scene;
                    statue.position.set(pos.x, 0, pos.z);
                    statue.scale.set(1, 2, 1);
                    statue.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(statue);
                }
            );
        });
    }

    createDecorativePlants() {
        const plantPositions = [
            // First type of plants (plant_pot)
            { x: 10, z: -12, model: 'plant_pot', rotation: Math.PI/4 },
            { x: -12, z: 12, model: 'plant_pot', rotation: -Math.PI/4 },
            { x: -10, z: -5, model: 'plant_pot', rotation: Math.PI/6 },
            
            // Second type of plants (plant_pot_2)
            { x: 12, z: 7, model: 'plant_pot_2', rotation: -Math.PI/6 },
            { x: 0, z: 20, model: 'plant_pot_2', rotation: 0 },
            { x: -15, z: 0, model: 'plant_pot_2', rotation: Math.PI/2 },
            { x: 15, z: 0, model: 'plant_pot_2', rotation: -Math.PI/2 }
        ];

        plantPositions.forEach(pos => {
            this.collisionObjects.push({
                position: new THREE.Vector3(pos.x, 0, pos.z),
                radius: 0.1,
                type: 'cylinder'
            });

            this.loader.load(
                `/models/${pos.model}.glb`,
                (gltf) => {
                    const plant = gltf.scene;
                    plant.position.set(pos.x, 0, pos.z);
                    plant.rotation.y = pos.rotation;
                    plant.scale.set(1, 1, 1);
                    plant.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(plant);
                }
            );
        });
    }

    createSecurityLine() {
        // Create security rope posts
        const postPositions = [
            { x: -20, z: 24.5 },
            { x: -16, z: 24.5 },
            { x: -12, z: 24.5 },
            { x: -8, z: 24.5 },
            {x: -4, z: 24.5 },
            { x: 0, z: 24.5 },
            { x: 4, z: 24.5 },
            { x: 8, z: 24.5 },
            { x: 12, z: 24.5 },
            { x: 16, z: 24.5 },
            { x: 20, z: 24.5 },
            { x:24, z: 24.5 }
        ];

        postPositions.forEach((pos, index) => {
            // Load security rope model
            this.loader.load(
                '/models/security_rope.glb',
                (gltf) => {
                    const rope = gltf.scene;
                    rope.position.set(pos.x, 0, pos.z);
                    rope.scale.set(1, 0.3, 0.3);
                    rope.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(rope);
                }
            );
        });
    }

}