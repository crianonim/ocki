import * as THREE from 'three';
const source = {
    "1,2,0": 1,
    "1,2,1": 2,
    "1,2,2": 2,
    "2,2,2": 2,
    "-3,1,2":0,
    "-4,2,2":3,

}
const map=[

];
let basicCubeGeometry;
const materials = [
    new THREE.MeshLambertMaterial({ color: 0x00bbbb }),
    new THREE.MeshLambertMaterial({ color: 0xbb0000 }),
    new THREE.MeshLambertMaterial({ color: 0x0000bb }),
    new THREE.MeshLambertMaterial({ color: 0x00bb00 }),

]
function init(game, SIZE) {
    game.map=[]
    basicCubeGeometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
    Object.entries(source).forEach(el => {
        console.log(el)
        let [position, type] = el;
        let [x, y, z] = position.split(',').map(Number);
        let mesh = new THREE.Mesh(basicCubeGeometry, materials[type]);
        mesh.position.x = x * SIZE + SIZE/2;
        mesh.position.y = y * SIZE+ SIZE/2;
        mesh.position.z = z * SIZE+ SIZE/2;
        // console.log("Adding",mesh,"to",game.scene)
        game.scene.add(mesh);
        game.map.push({x,y,z,mesh,type})
    })
    console.log(game)
}
export default {
    init,
}