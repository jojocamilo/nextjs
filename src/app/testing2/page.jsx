'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Play, Pause, RotateCcw, Camera } from 'lucide-react';
import './testing2.css';

export default function CinematicCarScene() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);
  const composerRef = useRef(null);
  const carRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  
  const [cinematicMode, setCinematicMode] = useState('orbit');
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto erstellen
  const createCinematicCar = () => {
    const carGroup = new THREE.Group();

    // Karosserie (Hauptkörper)
    const bodyGeometry = new THREE.BoxGeometry(4, 1.2, 2);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    carGroup.add(body);

    // Windschutzscheibe
    const windshieldGeometry = new THREE.BoxGeometry(3.8, 0.8, 1.9);
    const windshieldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3,
      metalness: 0,
      roughness: 0,
      transmission: 0.9,
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 1.6, 0);
    carGroup.add(windshield);

    // Räder
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.2,
    });

    const wheelPositions = [
      [-1.5, 0.4, -0.8], [1.5, 0.4, -0.8],
      [-1.5, 0.4, 0.8], [1.5, 0.4, 0.8]
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(...pos);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      carGroup.add(wheel);
    });

    // Scheinwerfer
    const headlightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const headlightMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x444444,
      emissiveIntensity: 0.5,
    });

    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(1.9, 0.8, -0.6);
    leftHeadlight.rotation.z = Math.PI / 2;
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(1.9, 0.8, 0.6);
    rightHeadlight.rotation.z = Math.PI / 2;
    carGroup.add(rightHeadlight);

    return carGroup;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const mountElement = mountRef.current;

    // 1. Scene mit cinematischem Himmel
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x262837, 10, 50);
    sceneRef.current = scene;

    // Gradient Himmel
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `;

    const skyGeometry = new THREE.SphereGeometry(100, 32, 15);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xff7700) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // 2. Cinematische Kamera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(8, 3, 8);
    cameraRef.current = camera;

    // 3. Renderer mit erweiterten Einstellungen
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    mountElement.appendChild(renderer.domElement);

    // 4. Postprocessing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.3, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // 5. Cinematische Beleuchtung
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Hauptlicht (Sonne)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(20, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    scene.add(sunLight);

    // Rim Light
    const rimLight = new THREE.DirectionalLight(0x7700ff, 0.8);
    rimLight.position.set(-10, 5, -5);
    scene.add(rimLight);

    // Punktlichter für Dramatik
    const spotLight1 = new THREE.SpotLight(0xff4444, 1, 30, Math.PI / 8, 0.3);
    spotLight1.position.set(5, 8, 5);
    spotLight1.castShadow = true;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0x4444ff, 1, 30, Math.PI / 8, 0.3);
    spotLight2.position.set(-5, 8, -5);
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    // 6. Umgebung
    const roadGeometry = new THREE.PlaneGeometry(60, 60);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.1,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0;
    road.receiveShadow = true;
    scene.add(road);

    // 7. Auto erstellen
    const car = createCinematicCar();
    car.position.y = 0.2;
    scene.add(car);
    carRef.current = car;

    // 8. OrbitControls (standardmäßig deaktiviert für cinematischen Modus)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = false; // Startet im cinematischen Modus
    controlsRef.current = controls;

    // 9. Cinematische Kamera-Modi
    const cinematicModes = {
      orbit: (time) => {
        const radius = 10;
        const speed = 0.3;
        camera.position.x = Math.cos(time * speed) * radius;
        camera.position.z = Math.sin(time * speed) * radius;
        camera.position.y = 3 + Math.sin(time * speed * 0.5) * 2;
        camera.lookAt(0, 1, 0);
      },
      
      chase: (time) => {
        camera.position.x = -8;
        camera.position.y = 2 + Math.sin(time * 0.5) * 0.5;
        camera.position.z = Math.sin(time * 0.3) * 3;
        camera.lookAt(0, 1, 0);
      },
      
      flyby: (time) => {
        const t = (Math.sin(time * 0.4) + 1) * 0.5;
        camera.position.x = THREE.MathUtils.lerp(-15, 15, t);
        camera.position.y = 4 + Math.sin(time * 0.8) * 1;
        camera.position.z = 5 + Math.cos(time * 0.6) * 2;
        camera.lookAt(0, 1, 0);
      },
      
      lowAngle: (time) => {
        const radius = 8;
        camera.position.x = Math.cos(time * 0.4) * radius;
        camera.position.z = Math.sin(time * 0.4) * radius;
        camera.position.y = 0.5;
        camera.lookAt(0, 1.5, 0);
      },
      
      dramatic: (time) => {
        const radius = 12;
        camera.position.x = Math.cos(time * 0.2) * radius;
        camera.position.z = Math.sin(time * 0.2) * radius;
        camera.position.y = 8 + Math.sin(time * 0.7) * 3;
        const lookAtX = Math.sin(time * 0.1) * 2;
        const lookAtZ = Math.cos(time * 0.1) * 2;
        camera.lookAt(lookAtX, 1, lookAtZ);
      }
    };

    // 10. Animation Loop
    const animate = () => {
      if (!isPlaying) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = clockRef.current.getElapsedTime();

      // Cinematische Kamera-Bewegung
      if (cinematicMode !== 'manual' && cinematicModes[cinematicMode]) {
        cinematicModes[cinematicMode](elapsedTime);
        controls.enabled = false;
      } else if (cinematicMode === 'manual') {
        controls.enabled = true;
        controls.update();
      }

      // Auto leicht bewegen für Lebendigkeit
      if (carRef.current) {
        carRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.02;
        carRef.current.position.y = 0.2 + Math.sin(elapsedTime * 2) * 0.01;
      }

      // Postprocessing rendern
      if (composerRef.current) {
        composerRef.current.render();
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // 11. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (composerRef.current) {
        composerRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // 12. Animation starten
    animate();

    console.log('Cinematic Car Scene initialized successfully');

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (controls) {
        controls.dispose();
      }
      
      if (composerRef.current) {
        composerRef.current.dispose();
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [cinematicMode, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const changeCinematicMode = (mode) => {
    setCinematicMode(mode);
  };

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(8, 3, 8);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const cinematicModes = [
    { key: 'orbit', name: 'Orbit', icon: '🌀' },
    { key: 'chase', name: 'Chase', icon: '🏃' },
    { key: 'flyby', name: 'Flyby', icon: '✈️' },
    { key: 'lowAngle', name: 'Low Angle', icon: '📐' },
    { key: 'dramatic', name: 'Dramatic', icon: '🎭' },
    { key: 'manual', name: 'Manual', icon: '🎮' }
  ];

  return (
    <div className="cinematic-scene">
      {/* Three.js Mount Point */}
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      
      {/* Cinematic Controls */}
      <div className="cinematic-controls">
        {/* Play/Pause Button */}
        <button 
          onClick={togglePlayPause}
          className="cinematic-button primary"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        {/* Mode Selection */}
        <div className="mode-selector">
          <h3>Camera Modes</h3>
          <div className="mode-grid">
            {cinematicModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => changeCinematicMode(mode.key)}
                className={`mode-button ${cinematicMode === mode.key ? 'active' : ''}`}
              >
                <span className="mode-icon">{mode.icon}</span>
                <span className="mode-name">{mode.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Additional Controls */}
        <div className="additional-controls">
          <button 
            onClick={resetCamera}
            className="cinematic-button"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          
          <button 
            onClick={() => changeCinematicMode('manual')}
            className="cinematic-button"
          >
            <Camera size={16} />
            Manual
          </button>
        </div>
        
        {/* Info Panel */}
        <div className="info-panel">
          <div className="current-mode">
            Current: <strong>{cinematicModes.find(m => m.key === cinematicMode)?.name}</strong>
          </div>
          {cinematicMode === 'manual' && (
            <div className="manual-help">
              <div>🖱️ Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
              <div>⌨️ Right drag to pan</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Title Overlay */}
      <div className="title-overlay">
        <h1>Cinematic Car Experience</h1>
        <p>Advanced Three.js Car Showcase</p>
      </div>
    </div>
  );
}