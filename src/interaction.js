import * as THREE from 'three';
import map from './map.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let game,SIZE
function init(gameObj, SIZE_DEF) {
    game=gameObj;
    SIZE=SIZE_DEF;
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click',map.createMesh,false);
    document.addEventListener('contextmenu',remove,false);


}
function remove(event){
    console.log("REMOVE")
    if (game.selectedMesh){
        let mesh=game.selectedMesh;
        map.deselectMesh()
        map.removeMesh(mesh);
        //so it adjusts
        onMouseMove(event)
    }
}
function onMouseMove(event) {
    event.preventDefault();
    if (game.selectedMesh){
        map.deselectMesh(game.selectedMesh)
        // game.selectedMesh.material.wireframe=false;
    }
    game.toolMesh.visible=false;
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, game.camera);

    let intersects = raycaster.intersectObjects(game.objects);

    if (intersects.length > 0) {

        let intersect = intersects[0];
        // console.log("OBJ", intersect.object, intersect.face.normal);
        let translation = intersect.face.normal.clone().multiplyScalar(SIZE);
        // console.log("trans", translation);
        game.toolMesh.position.copy(intersect.object.position).add(translation);
        game.toolMesh.visible=true;
        game.selectedFace=intersect.face;
        map.selectMesh(intersect.object)
        game.selectedMesh=intersect.object;
        // game.selectedMesh.material.wireframe=true;
    }

}
export default {
    init
}