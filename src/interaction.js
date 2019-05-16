import * as THREE from 'three';
import map from './map.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let game,SIZE
function init(gameObj, SIZE_DEF) {
    game=gameObj;
    SIZE=SIZE_DEF;
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click',onClick,false);

}
function onClick(){
    console.log("Click")
    if (game.selectedMesh){
        // console.log("SELECTED is",game.selectedMesh );
        map.removeMesh(game.selectedMesh);
        // game.scene.remove(game.selectedMesh )
    }
}
function onMouseMove(event) {
    event.preventDefault();
    game.selectedMesh=null;
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, game.camera);

    let intersects = raycaster.intersectObjects(game.objects);

    if (intersects.length > 0) {

        let intersect = intersects[0];
        // console.log("OBJ", intersect.object, intersect.face.normal);
        let translation = intersect.face.normal.clone().multiplyScalar(SIZE);
        // console.log("trans", translation);
        game.toolMesh.position.copy(intersect.object.position).add(translation);
        game.selectedMesh=intersect.object;
    }

}
export default {
    init
}