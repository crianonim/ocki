import * as THREE from 'three'
import { FlyControls as Controls } from 'three/examples/jsm/controls/FlyControls';
import map from './map.js';
import interaction from './interaction.js';
import tick from './tick.js'





const game={
    toolPosition:[0,0,0],
    toolMesh:null,
    scene:null,
    camera:null,
}
const SIZE = 50;

const container = document.createElement('div');
document.body.appendChild(container);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(500, 800, 1300);
camera.lookAt(new THREE.Vector3());
game.camera=camera;



const scene = new THREE.Scene();
game.scene=scene;
scene.background = new THREE.Color(0xf0f0f0);

// tool

const toolGeo = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
const toolMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
game.toolMesh = new THREE.Mesh(toolGeo, toolMaterial);
// game.toolMesh.position.addScalar(SIZE/2);
game.toolMesh.visible=false;
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


const controls = new Controls(camera,renderer.domElement);
controls.dragToLook=true;
controls.movementSpeed=1;
controls.rollSpeed=0.0005;
// controls.domElement=renderer.domElement

window.addEventListener('resize', onWindowResize, false);


map.init(game,SIZE);
interaction.init(game,SIZE);

let lastUpdate;
let dir=-1;
let accumulatedDelta=0;
const TICK_SIZE=1000;
render(0);


function render(ts) {
    if (!lastUpdate) lastUpdate=ts;
    let delta=ts-lastUpdate;
    lastUpdate=ts;
    accumulatedDelta+=delta;
    // console.log("RENDER",delta,accumulatedDelta)
    controls.update(delta)
    window.requestAnimationFrame(render);
    if (accumulatedDelta>TICK_SIZE){
        accumulatedDelta-=TICK_SIZE;
        // tick.tick(game);
    }
    if(game.selectedMesh){
        if (game.selectedMesh.material.opacity<.2){
            dir=1;
        } else if (game.selectedMesh.material.opacity>0.8){
            dir=-1;
        }
        game.selectedMesh.material.opacity+=((delta/1000)*dir);
        // console.log(dir,game.selectedMesh.material.opacity,((delta/1000)*dir))
    }
    renderer.render(scene, camera);
    // console.log(delta)
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

