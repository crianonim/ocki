import * as THREE from 'three';
const source = 
    
{
    "-3,1,2": 0,
    "-2,1,2": 1,
    "-1,1,2": 1,
    "0,0,3": 1,
    "0,0,4": 0,
    "-1,0,4": 0,
    "-2,0,4": 0,
    "-3,0,4": 0,
    "-4,0,4": 0,
    "-1,0,3": 0,
    "-2,0,3": 0,
    "-3,0,3": 0,
    "-4,0,3": 0,
    "-4,1,2": 0,
    "-1,0,5": 0,
    "0,0,5": 0,
    "-2,0,5": 0,
    "-3,0,5": 0,
    "-4,0,5": 0,
    "0,0,6": 0,
    "-1,0,6": 0,
    "-2,0,6": 0,
    "-3,0,6": 0,
    "-4,0,6": 0,
    "-1,3,7": 0,
    "-1,4,7": 4,
    "-1,1,4": 2,
    "-3,1,3": 2,
    "-3,1,6": 2,
    "-3,1,7": 0,
    "-3,2,7": 0,
    "-3,3,7": 0,
    "-4,0,7": 0,
    "-5,0,7": 0,
    "-3,4,7": 0,
    "-3,5,7": 0,
    "-3,6,7": 0,
    "-4,6,7": 0,
    "-5,6,7": 0,
    "-5,1,7": 2
   }
let game, SIZE
let basicCubeGeometry;
const types = [
    { color: 0x857c55, name: "dirt" }, // dirt
    { color: 0x6a6344, name: "wet dirt" }, // dirt watered
    { color: 0x34b334, name: "plant" }, // green
    { color: 0x24c324, name: "plant intense" }, // green saturated
    { color: 0x00ffff, name: "water", gravity: true }, // aqua
    { color: 0xb8b8b8, name: "stone" },
]
const materials = types.map(type => {
    return new THREE.MeshLambertMaterial({ color: type.color, name: "NOT" })
});

const selectedMaterials = types.map(type => {
    return new THREE.MeshLambertMaterial({ color: type.color, opacity: 0.5, transparent: true,/*wireframe: true,name:"SEL" */ })
});
function init(gameOBJ, SIZE_DEF) {
    game = gameOBJ;
    SIZE = SIZE_DEF;
    game.entities = [];
    game.meshes = [];
    basicCubeGeometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
    Object.entries(source).forEach(el => {
        // console.log(el)
        let [position, type] = el;
        let [x, y, z] = position.split(',').map(Number);
        createObject(type, x, y, z);
    })
    console.log(game)
}
function createObject(type, x, y, z) {
    let mesh = new THREE.Mesh(basicCubeGeometry, materials[type]);
    mesh.position.x = x * SIZE + SIZE / 2;
    mesh.position.y = y * SIZE + SIZE / 2;
    mesh.position.z = z * SIZE + SIZE / 2;
    game.scene.add(mesh);
    let object={ x, y, z, mesh, type, typeDef: types[type] }
    game.entities.push(object)
    game.meshes.push(mesh);
    return object;
    
}
function removeObject(object){
    game.meshes=game.meshes.filter(el=>el!=object.mesh);
    game.scene.remove(object.mesh);
    game.entities=game.entities.filter(el=>el!=object);
}
function changeObjectType(object,type){
    object.type=type;
    object.mesh.material=materials[type];
    return object;
}

function findObjectByMesh(mesh) {
    return game.entities.find(el => el.mesh == mesh)
}


function makeMeshSelected(mesh) {
    let { type } = findObjectByMesh(mesh);
    mesh.material = selectedMaterials[type];
    game.selectedMesh = mesh;
}
function makeMeshDeselected() {
    if (!game.selectedMesh) return
    let { type } = findObjectByMesh(game.selectedMesh)
    game.selectedMesh.material = materials[type];
    game.selectedMesh = null
}

function getAdjacentObj(obj) {
    let adj = {};
    adj.down = game.entities.find(el => el.x == obj.x && el.z == obj.z && el.y == obj.y - 1)

    return adj;
}
function getObjectAt(x,y,z){
    return game.entities.find(el=>el.x==x && el.y==y && el.z==z)
}
function moveObject(obj, x, y, z) {
    // console.log("MOVE",obj,x,y,z)
    obj.mesh.position.set(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2, z * SIZE + SIZE / 2);
    obj.x = x;
    obj.y = y;
    obj.z = z;

    if (obj.y < -10 ) {
        removeObject(obj)
    }
}
function serializeMap() {
    let obj = {}
    game.entities.forEach(el => obj[[el.x, el.y, el.z].join(',')] = el.type)
    return JSON.stringify(obj, null, 1);
}
export default {
    init,
    // removeMesh,
    makeMeshSelected,
    makeMeshDeselected,
    getAdjacentObj,
    serializeMap,
    
    createObject,
    removeObject,
    moveObject,
    changeObjectType,
    
    findObjectByMesh,
    getObjectAt,

    types,
}