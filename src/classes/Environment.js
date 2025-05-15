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
        this.createPath();
        this.createTrees();
        this.createRocks();
        this.createBushes();
        this.createDecorations();
    }

    setupBoundaries() {
        this.boundaries = {
            minX: -23.6,
            maxX: 24.6,
            minZ: -25,
            maxZ: 26
        };
    }

    getBoundaries() {
        return this.boundaries;
    }

    getCollisionObjects() {
        return this.collisionObjects;
    }

    createPath() {
        // Create a cross-shaped path using path straith.glb
        const pathPositions = [
            // Vertical path
            { x: 0, z: -20, rotation: 0 },
            { x: 0, z: -15, rotation: 0 },
            { x: 0, z: -5, rotation: 0 },
            { x: 0, z: 5, rotation: 0 },
            { x: 0, z: 15, rotation: 0 },
            { x: 0, z: 20, rotation: 0 },
            { x: 0, z: 21, rotation: 0 },
            // Horizontal path
            { x: -18, z: 0, rotation: Math.PI / 2 },
            { x: -15, z: 0, rotation: Math.PI / 2 },
            { x: -5, z: 0, rotation: Math.PI / 2 },
            { x: 5, z: 0, rotation: Math.PI / 2 },
            { x: 15, z: 0, rotation: Math.PI / 2 },
            { x: 20, z: 0, rotation: Math.PI / 2 }
        ];

        pathPositions.forEach(pos => {
            this.loader.load(
                '/models/Path Straight.glb', // Corrected path
                (gltf) => {
                    const path = gltf.scene;
                    path.position.set(pos.x, -0.1, pos.z);
                    path.rotation.y = pos.rotation;
                    path.scale.set(2, 1, 10);
                    path.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(path);
                }
            );
        });
    }

    createTrees() {
        const treePositions = [
            { x: -15, z: -15, type: 'Tree.glb' },
            { x: 15, z: -15, type: 'Tree2.glb' },
            { x: -18, z: 5, type: 'Twisted Tree.glb' },
            { x: 18, z: -5, type: 'Tree.glb' },
            { x: -15, z: 15, type: 'Tree2.glb' },
            { x: 15, z: 15, type: 'Twisted Tree.glb' },
            { x: 20, z: -20, type: 'Tree.glb' },
            { x: -20, z: 20, type: 'Tree2.glb' }
        ];

        treePositions.forEach(pos => {
            this.collisionObjects.push({
                position: new THREE.Vector3(pos.x, 0, pos.z),
                radius: 1,
                type: 'cylinder'
            });

            // Load tree model
            this.loader.load(
                `/models/${pos.type}`,
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(pos.x, 0, pos.z);
                    model.scale.set(1.5, 0.5, 1.5);
                    model.rotation.y = Math.random() * Math.PI * 2;
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

    createRocks() {
        const rockPositions = [
            { x: -12, z: -18, scale: 1 },
            { x: 12, z: -18, scale: 0.8 },
            { x: -18, z: -12, scale: 1.2 },
            { x: 18, z: -12, scale: 1 },
            { x: -12, z: 18, scale: 1.5 },
            { x: 12, z: 18, scale: 1.3 },
            { x: -18, z: 12, scale: 1.4 },
            { x: 18, z: 12, scale: 1.2 }
        ];

        rockPositions.forEach(pos => {
            this.collisionObjects.push({
                position: new THREE.Vector3(pos.x, 0, pos.z),
                radius: pos.scale,
                type: 'sphere'
            });

            // Load rock model
            this.loader.load(
                '/models/Rock Medium.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(pos.x, 0, pos.z);
                    model.scale.set(pos.scale, pos.scale, pos.scale);
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

    createBushes() {
        const bushPositions = [
            { x: -8, z: -15, type: 'Bush.glb' },
            { x: 8, z: -15, type: 'Bush with Flowers.glb' },
            { x: -15, z: -8, type: 'Bush.glb' },
            { x: 15, z: -8, type: 'Bush with Flowers.glb' },
            { x: -8, z: 15, type: 'Bush.glb' },
            { x: 8, z: 15, type: 'Bush with Flowers.glb' },
            { x: -15, z: 8, type: 'Bush.glb' },
            { x: 15, z: 8, type: 'Bush with Flowers.glb' }
        ];

        bushPositions.forEach(pos => {
            this.loader.load(
                `/models/${pos.type}`,
                (gltf) => {
                    const bush = gltf.scene;
                    bush.position.set(pos.x, 0, pos.z);
                    bush.scale.set(1, 1, 1);
                    bush.rotation.y = Math.random() * Math.PI * 2;
                    bush.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(bush);
                }
            );
        });
    }

    createDecorations() {
        // Street lights 
        const lightPositions = [
            { x: 2, z: -20, rotation: -Math.PI / 2 }, 
            { x: 2, z: 20, rotation: -Math.PI / 2 }  
        ];

        lightPositions.forEach(pos => {
            this.loader.load(
                '/models/Street Light.glb',
                (gltf) => {
                    const light = gltf.scene;
                    light.position.set(pos.x, 0, pos.z);
                    light.scale.set(1, 0.5, 1);
                    light.rotation.y = pos.rotation;
                    light.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(light);
                }
            );
        });

        // Fences
        const fencePositions = [
            // Côté nord
            { x: -22, z: -25, rotation: 0 },
            { x: -19, z: -25, rotation: 0 },
            { x: -16, z: -25, rotation: 0 },
            { x: -13, z: -25, rotation: 0 },
            { x: -10, z: -25, rotation: 0 },
            { x: -7, z: -25, rotation: 0 },
            { x: -4, z: -25, rotation: 0 },
            { x: -1, z: -25, rotation: 0 },
            { x: 2, z: -25, rotation: 0 },
            { x: 5, z: -25, rotation: 0 },
            { x: 8, z: -25, rotation: 0 },
            { x: 11, z: -25, rotation: 0 },
            { x: 14, z: -25, rotation: 0 },
            { x: 17, z: -25, rotation: 0 },
            { x: 20, z: -25, rotation: 0 },
            { x: 23, z: -25, rotation: 0 },
            // Côté est
            { x: 24.6, z: -23.5, rotation: Math.PI / 2 },
            { x: 24.6, z: -20.5, rotation: Math.PI / 2 },
            { x: 24.6, z: -17.5, rotation: Math.PI / 2 },
            { x: 24.6, z: -14.5, rotation: Math.PI / 2 },
            { x: 24.6, z: -11.5, rotation: Math.PI / 2 },
            { x: 24.6, z: -8.5, rotation: Math.PI / 2 },
            { x: 24.6, z: -5.5, rotation: Math.PI / 2 },
            { x: 24.6, z: -2.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 0.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 3.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 6.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 9.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 12.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 15.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 18.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 21.5, rotation: Math.PI / 2 },
            { x: 24.6, z: 24.5, rotation: Math.PI / 2 },
            // Côté sud
            { x: 23, z: 26, rotation: Math.PI },
            { x: 20, z: 26, rotation: Math.PI },
            { x: 17, z: 26, rotation: Math.PI },
            { x: 14, z: 26, rotation: Math.PI },
            { x: 11, z: 26, rotation: Math.PI },
            { x: 8, z: 26, rotation: Math.PI },
            { x: 5, z: 26, rotation: Math.PI },
            { x: 2, z: 26, rotation: Math.PI },
            { x: -1, z: 26, rotation: Math.PI },
            { x: -4, z: 26, rotation: Math.PI },
            { x: -7, z: 26, rotation: Math.PI },
            { x: -10, z: 26, rotation: Math.PI },
            { x: -13, z: 26, rotation: Math.PI },
            { x: -16, z: 26, rotation: Math.PI },
            { x: -19, z: 26, rotation: Math.PI },
            { x: -22, z: 26, rotation: Math.PI },
            // Côté ouest
            { x: -23.6, z: 24.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 21.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 18.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 15.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 12.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 9.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 6.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 3.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: 0.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -2.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -5.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -8.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -11.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -14.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -17.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -20.5, rotation: -Math.PI / 2 },
            { x: -23.6, z: -23.5, rotation: -Math.PI / 2 }
        ];

        fencePositions.forEach(pos => {
            this.loader.load(
                '/models/Metal Fence.glb',
                (gltf) => {
                    const fence = gltf.scene;
                    fence.position.set(pos.x, 0, pos.z);
                    fence.rotation.y = pos.rotation;
                    fence.scale.set(0.85, 1, 1);
                    fence.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.scene.add(fence);
                }
            );
        });
    }
}