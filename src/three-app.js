import * as THREE from 'three';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181c20); // dark background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a colorful torus knot as the interactive shape
const geometry = new THREE.TorusKnotGeometry(1, 0.4, 128, 16);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x00bfff,
  roughness: 0.2,
  metalness: 0.7,
  clearcoat: 0.5,
  iridescence: 0.2,
  sheen: 0.5,
  sheenColor: new THREE.Color(0xff00ff)
});
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// Add lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Camera initial position
camera.position.z = 5;

// Mouse interaction variables
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalf.x) / windowHalf.x;
  mouseY = (event.clientY - windowHalf.y) / windowHalf.y;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // Animate the knot with mouse
  targetX += (mouseX - targetX) * 0.1;
  targetY += (mouseY - targetY) * 0.1;
  knot.rotation.x += 0.01 + targetY * 0.05;
  knot.rotation.y += 0.01 + targetX * 0.05;
  // Animate camera
  camera.position.x = targetX * 2;
  camera.position.y = -targetY * 1.5;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
animate();

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
