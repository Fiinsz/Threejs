import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.createElement('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cinematic three-point lighting
// Key light
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(10, 10, 10);
scene.add(keyLight);

// Fill light
const fillLight = new THREE.DirectionalLight(0x88aaff, 0.6);
fillLight.position.set(-10, 5, 10);
scene.add(fillLight);

// Back light (rim light)
const backLight = new THREE.DirectionalLight(0xffccaa, 0.8);
backLight.position.set(0, 10, -10);
scene.add(backLight);

// Optional: subtle ambient for soft shadows
const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

// Load GLB model
const loader = new GLTFLoader();
let mixer;
let modelRoot = null;
loader.load(
  'model.glb', // Make sure model.glb is in your public or src directory
  function (gltf) {
    modelRoot = gltf.scene;
    scene.add(modelRoot);
    // Set up animation mixer if animations exist
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(modelRoot);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
  },
  undefined,
  function (error) {
    console.error('An error happened loading the model:', error);
  }
);

// Cursor interaction variables
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function handlePointerMove(event) {
  let clientX, clientY;
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  mouseX = (clientX - windowHalf.x) / windowHalf.x;
  mouseY = (clientY - windowHalf.y) / windowHalf.y;
}
window.addEventListener('mousemove', handlePointerMove);
window.addEventListener('touchmove', handlePointerMove);

// Camera position
camera.position.z = 5;

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  // Interactive model rotation with limits
  targetX += (mouseX - targetX) * 0.1;
  targetY += (mouseY - targetY) * 0.1;
  // Clamp rotation to keep the face visible
  const minY = -0.4; // up/down limit (radians)
  const maxY = 0.4;
  const minX = -0.7; // left/right limit (radians)
  const maxX = 0.7;
  let rotY = targetX * 0.3;
  let rotX = targetY * 0.15;
  rotY = Math.max(minX, Math.min(maxX, rotY));
  rotX = Math.max(minY, Math.min(maxY, rotX));
  if (modelRoot) {
    modelRoot.rotation.y = rotY;
    modelRoot.rotation.x = rotX;
  }
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});