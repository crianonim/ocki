import * as THREE from 'three';
import map from './map.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let game,SIZE
function init(gameObj, SIZE_DEF) {
    game=gameObj;
    SIZE=SIZE_DEF;
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click',placeSelectedType,false);
    document.addEventListener('contextmenu',remove,false);
    game.selectedType=1;
    updateGUI();    

}
function updateGUI(){
    let div=document.getElementById('ui');
    let s="";
    map.types.forEach( (type,i)=>{
        s+="<div class='type"+ (i==game.selectedType?" selected":"") +"' style='background-color:#"+type.color.toString(16).padStart(6,"0")+"'data-type='"+i+"'>"+type.name+"</div>"
    })
    s+="<button id='dumpMap'>DumpMap</button><textarea id='dumpArea'></textarea>"
    div.innerHTML=s
    document.querySelectorAll('#ui .type').forEach(type=>type.addEventListener('click',(event)=>{
        game.selectedType=Number(event.target.dataset.type);
        console.log(game.selectedType)
        updateGUI();
    }));
    document.getElementById('dumpMap').addEventListener('click',()=>{
        let area=document.getElementById('dumpArea')
        area.value=map.serializeMap();
        area.focus();
        area.select();

    })
}
function placeSelectedType(){
    if (!game.selectedMesh) return;
    let object=map.findObjectByMesh(game.selectedMesh);
    let normal=game.selectedFace.normal;
    let x=object.x+normal.x;
    let y=object.y+normal.y;
    let z=object.z+normal.z;
    map.createObject(game.selectedType,x,y,z);
    map.makeMeshDeselected();
    game.toolMesh.visible = false;
}

function cloneSelected(){
    if (!game.selectedMesh) return;
    let object=map.findObjectByMesh(game.selectedMesh);
    let normal=game.selectedFace.normal;
    console.log(object,normal)
    let x=object.x+normal.x;
    let y=object.y+normal.y;
    let z=object.z+normal.z;
    map.createObject(object.type,x,y,z);
    map.makeMeshDeselected()
    game.toolMesh.visible = false;
    
}
function remove(event){
    if (game.selectedMesh){
        let mesh=game.selectedMesh;
        map.makeMeshDeselected()
        map.removeObject(map.findObjectByMesh(mesh));
        onMouseMove(event)
    }
}
function onMouseMove(event) {
    event.preventDefault();
    if (game.selectedMesh){
        map.makeMeshDeselected(game.selectedMesh)
        // game.selectedMesh.material.wireframe=false;
    }
    game.toolMesh.visible=false;
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, game.camera);

    let intersects = raycaster.intersectObjects(game.meshes);

    if (intersects.length > 0) {

        let intersect = intersects[0];
        // console.log("OBJ", intersect.object, intersect.face.normal);
        let translation = intersect.face.normal.clone().multiplyScalar(SIZE);
        // console.log("trans", translation);
        game.toolMesh.position.copy(intersect.object.position).add(translation);
        game.toolMesh.visible=true;
        game.selectedFace=intersect.face;
        map.makeMeshSelected(intersect.object)
        game.selectedMesh=intersect.object;
        // game.selectedMesh.material.wireframe=true;
    }

}
export default {
    init
}