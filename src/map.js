import * as THREE from 'three';
const source = {
    "1,2,0": 1,
    "1,2,1": 2,
    "1,2,2": 2,
    "2,2,2": 2,
    "-3,1,2": 0,
    "-4,2,2": 3,

}
const map = [

];
let game, SIZE
let basicCubeGeometry;
const types = [
    { color: 0x00bbbb },
    { color: 0xbb0000 },
    { color: 0x0000bb },
    { color: 0x00bb00 }
]
const materials = types.map(type => {
    return new THREE.MeshLambertMaterial({ color: type.color,name:"NOT" })
});

const selectedMaterials = types.map(type => {
    return new THREE.MeshLambertMaterial({ color: type.color, opacity:0.5,transparent:true,/*wireframe: true,name:"SEL" */})
});
function init(gameOBJ, SIZE_DEF) {
    game = gameOBJ;
    SIZE = SIZE_DEF;
    game.map = [];
    game.objects = [];
    basicCubeGeometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
    Object.entries(source).forEach(el => {
        console.log(el)
        let [position, type] = el;
        let [x, y, z] = position.split(',').map(Number);
        let mesh = new THREE.Mesh(basicCubeGeometry, materials[type]);
        mesh.position.x = x * SIZE + SIZE / 2;
        mesh.position.y = y * SIZE + SIZE / 2;
        mesh.position.z = z * SIZE + SIZE / 2;
        // console.log("Adding",mesh,"to",game.scene)
        game.scene.add(mesh);
        game.map.push({ x, y, z, mesh, type })
        game.objects.push(mesh);
    })
    console.log(game)
}
function removeMesh(mesh) {
    game.objects = game.objects.filter(el => el != mesh);
    game.scene.remove(mesh);
    game.map = game.map.filter(el => el.mesh !== mesh);
}
function selectMesh(mesh) {
    let { type } = game.map.find(el => el.mesh == mesh);
    // console.log(type,selectedMaterials[type]);
    mesh.material = selectedMaterials[type];
    game.selectedMesh=mesh;
}
function deselectMesh(mesh){
    let { type } = game.map.find(el => el.mesh == mesh);
    // console.log(type,selectedMaterials[type]);
    mesh.material = materials[type];
    game.selectedMesh=null
}
function createMesh(){
    if (!game.selectedMesh) return    
    let type=2
    var newMesh = new THREE.Mesh(basicCubeGeometry, materials[type]);
    console.log("OBJ", game.selectedMesh, game.selectedFace.normal);
    let translation = game.selectedFace.normal.clone().multiplyScalar(50);
    console.log("trans", translation);
    newMesh.position.copy(game.selectedMesh.position).add(translation);
    let x,y,z;

    game.objects.push(newMesh)
    let newMapObject={mesh:newMesh,type,x,y,z}
    console.log(newMesh.position,newMapObject)
    game.map.push(newMapObject)
    game.scene.add(newMesh);
}
export default {
    init,
    removeMesh,
    selectMesh,
    deselectMesh,
    createMesh,
}