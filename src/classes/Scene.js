import * as THREE from 'three';

export class Scene {
    constructor() {
        this.scene = new THREE.Scene();
        // Fond gris clair pour l'intérieur
        this.scene.background = new THREE.Color(0xf5f5f5);

        // Configuration de la caméra
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);

        // Configuration du renderer avec SSAO
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild(this.renderer.domElement);

        // Éclairage de musée
        this.setupLights();
        this.createCursor();

        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupLights() {
        // Lumière ambiante douce
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
        this.scene.add(ambientLight);

        // Spots directionnels pour l'effet musée
        const spotPositions = [
            { x: -10, y: 15, z: -10 },
            { x: 10, y: 15, z: -10 },
            { x: -10, y: 15, z: 10 },
            { x: 10, y: 15, z: 10 }
        ];

        spotPositions.forEach(pos => {
            const spotLight = new THREE.SpotLight(0xffffff, 1);
            spotLight.position.set(pos.x, pos.y, pos.z);
            spotLight.angle = Math.PI / 6;
            spotLight.penumbra = 0.5;
            spotLight.decay = 2;
            spotLight.distance = 30;
            spotLight.castShadow = true;
            this.scene.add(spotLight);
        });
    }

    createCursor() {
        // Création d'un groupe pour le curseur
        this.cursorGroup = new THREE.Group();
        
        // Cercle extérieur
        const outerCircleGeometry = new THREE.RingGeometry(0.02, 0.03, 32);
        const outerCircleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        this.outerCircle = new THREE.Mesh(outerCircleGeometry, outerCircleMaterial);
        this.cursorGroup.add(this.outerCircle);

        // Point central
        const dotGeometry = new THREE.CircleGeometry(0.005, 32);
        const dotMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        this.dot = new THREE.Mesh(dotGeometry, dotMaterial);
        this.cursorGroup.add(this.dot);

        // Positionnement du curseur
        this.cursorGroup.position.z = -0.5;
        this.camera.add(this.cursorGroup);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}