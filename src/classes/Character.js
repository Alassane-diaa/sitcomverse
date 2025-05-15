import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {
    constructor(scene, camera, environment) {
        this.scene = scene;
        this.camera = camera;
        this.environment = environment;
        this.mixer = null;
        this.walkAction = null;
        this.idleAction = null;
        this.currentAction = null;
        this.speed = 0.1;
        this.rotationSpeed = 0.05;
        this.collisionRadius = 0.5;
        this.loadModel();
    }

    checkCollision(newPosition) {
        // Check boundary limits first
        const boundaries = this.environment.getBoundaries();
        if (newPosition.x - this.collisionRadius < boundaries.minX ||
            newPosition.x + this.collisionRadius > boundaries.maxX ||
            newPosition.z - this.collisionRadius < boundaries.minZ ||
            newPosition.z + this.collisionRadius > boundaries.maxZ) {
            return true;
        }

        // Check other collision objects
        const collisionObjects = this.environment.getCollisionObjects();
        for (const obj of collisionObjects) {
            const distance = newPosition.distanceTo(obj.position);
            
            if (obj.type === 'cylinder') {
                // For trees, check horizontal distance only
                const horizontalDistance = Math.sqrt(
                    Math.pow(newPosition.x - obj.position.x, 2) +
                    Math.pow(newPosition.z - obj.position.z, 2)
                );
                if (horizontalDistance < obj.radius + this.collisionRadius) {
                    return true;
                }
            } else if (obj.type === 'sphere') {
                // For rocks, check full 3D distance
                if (distance < obj.radius + this.collisionRadius) {
                    return true;
                }
            }
        }
        return false;
    }

    move(direction) {
        const newPosition = this.model.position.clone();
        const moveDistance = this.speed;

        switch(direction) {
            case 'forward':
                newPosition.x += Math.sin(this.model.rotation.y) * moveDistance;
                newPosition.z += Math.cos(this.model.rotation.y) * moveDistance;
                break;
            case 'backward':
                newPosition.x -= Math.sin(this.model.rotation.y) * moveDistance;
                newPosition.z -= Math.cos(this.model.rotation.y) * moveDistance;
                break;
            case 'left':
                newPosition.x -= Math.cos(this.model.rotation.y) * moveDistance;
                newPosition.z += Math.sin(this.model.rotation.y) * moveDistance;
                break;
            case 'right':
                newPosition.x += Math.cos(this.model.rotation.y) * moveDistance;
                newPosition.z -= Math.sin(this.model.rotation.y) * moveDistance;
                break;
        }

        if (!this.checkCollision(newPosition)) {
            this.model.position.copy(newPosition);
            this.camera.position.x = this.model.position.x;
            this.camera.position.z = this.model.position.z + 5;
            this.camera.lookAt(this.model.position);
        }
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            '/models/hoodie_character.glb',
            (gltf) => {
                this.mesh = gltf.scene;
                this.mesh.scale.set(0.75, 0.75, 0.75);
                this.mesh.position.set(-6, 0, 4);
                this.scene.add(this.mesh);

                this.mixer = new THREE.AnimationMixer(this.mesh);
                
                if (gltf.animations && gltf.animations.length) {
                    this.walkAction = this.mixer.clipAction(gltf.animations[16]);
                    if (gltf.animations.length > 1) {
                        this.idleAction = this.mixer.clipAction(gltf.animations[4]);
                        this.idleAction.play();
                        this.currentAction = this.idleAction;
                    }
                }
            }
        );
    }

    update(deltaTime, keys, camera) {
        if (!this.mesh || !this.mixer) return;

        this.mixer.update(deltaTime);

        const direction = new THREE.Vector3();
        let isMoving = false;

        if (keys.ArrowUp || keys.KeyZ) {
            direction.z = -1;
            isMoving = true;
        }
        if (keys.ArrowDown || keys.KeyS) {
            direction.z = 1;
            isMoving = true;
        }
        if (keys.ArrowLeft || keys.KeyQ) {
            direction.x = -1;
            isMoving = true;
        }
        if (keys.ArrowRight || keys.KeyD) {
            direction.x = 1;
            isMoving = true;
        }

        if (isMoving && this.walkAction) {
            this.setAnimation(this.walkAction);
        } else if (this.idleAction) {
            this.setAnimation(this.idleAction);
        }

        direction.normalize();
        
        // Calculate new position
        const newPosition = this.mesh.position.clone();
        newPosition.x += direction.x * this.speed;
        newPosition.z += direction.z * this.speed;

        // Check collision before moving
        if (!this.checkCollision(newPosition)) {
            this.mesh.position.copy(newPosition);
        }

        if (direction.length() > 0) {
            const angle = Math.atan2(direction.x, direction.z);
            this.mesh.rotation.y = angle;
        }

        const cameraOffset = new THREE.Vector3(0, 4, 5);
        camera.position.copy(this.mesh.position).add(cameraOffset);
        camera.lookAt(this.mesh.position);
    }

    setAnimation(newAction) {
        if (this.currentAction !== newAction) {
            if (this.currentAction) {
                this.currentAction.fadeOut(0.5);
            }
            newAction.reset().fadeIn(0.5).play();
            this.currentAction = newAction;
        }
    }
}