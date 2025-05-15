import * as THREE from 'three';

export class Scene {
    constructor() {
        // Création de la scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Ciel bleu clair

        // Configuration de la caméra
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);

        // Configuration du renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Ajout des lumières
        // Lumière ambiante principale
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Lumière directionnelle principale (soleil)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Lumière hémisphérique pour un éclairage plus naturel
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        this.scene.add(hemisphereLight);

        // Une seule lumière ponctuelle au centre
        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(0, 10, 0);
        pointLight.castShadow = false;
        this.scene.add(pointLight);

        // Création du curseur
        this.createCursor();

        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
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