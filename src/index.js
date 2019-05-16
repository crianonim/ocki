import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const game={
    toolPosition:[0,0,0],
    toolMesh:null,
}
const SIZE = 50;

const container = document.createElement('div');
document.body.appendChild(container);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(500, 800, 1300);
camera.lookAt(new THREE.Vector3());

const controls = new OrbitControls(camera);
controls.keys = {
    RIGHT: 68,
    LEFT: 65,
    UP: 87,
    DOWN: 83,
}
controls.domElement = container;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.MIDDLE,
    MIDDLE: null,
    RIGHT: null
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// tool

const toolGeo = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
const toolMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
game.toolMesh = new THREE.Mesh(toolGeo, toolMaterial);
game.toolMesh.position.addScalar(SIZE/2);
scene.add(game.toolMesh);


const gridHelper = new THREE.GridHelper(1000, 20);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 0.75, 0.5).normalize();
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);


window.addEventListener('resize', onWindowResize, false);
render();

function render() {
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
