import map from './map.js';

let turn = 0;
function tick(game) {
    turn++;
    let plantsCheckedForGrowth = [];
    game.entities.forEach(el => {
        if (el.typeDef.gravity) {
            let below = map.getObjectAt(el.x, el.y - 1, el.z)
            if (!below) {
                map.moveObject(el, el.x, el.y - 1, el.z);
            }
        }

        if (turn % 3 == 0 && (el.typeDef.name == "plant" || el.typeDef.name=="wood")&& !plantsCheckedForGrowth.includes(el)) {
            let below = map.getObjectAt(el.x, el.y - 1, el.z)
            if (below && below.typeDef.name == "dirt" && checkIfSpaceToGrow(el.x,el.y,el.z) ) {
                // console.log("Found dirt under",below)
                let plantSize = 0;
                const treeStartsAt = 3;
                const maxSize=7;
                let plantObjects=[el];
                while (true) {
                    plantSize++;
                    // console.log(plantSize)
                    if (plantSize > maxSize) break;
                    if (plantSize == maxSize){
                        console.log("MAX SIZE")
                        if (!checkIfSpaceToGrow(el.x,el.y+plantSize-1,el.z)) break;
                        let newPlantObject=map.createObject(2, el.x+1, el.y + plantSize-1, el.z);
                        plantsCheckedForGrowth.push(newPlantObject);
                        newPlantObject=map.createObject(2, el.x, el.y + plantSize-1, el.z+1);
                        plantsCheckedForGrowth.push(newPlantObject);
                        newPlantObject=map.createObject(2, el.x-1, el.y + plantSize-1, el.z);
                        plantsCheckedForGrowth.push(newPlantObject);
                        newPlantObject=map.createObject(2, el.x, el.y + plantSize-1, el.z-1);
                        plantsCheckedForGrowth.push(newPlantObject);

                    }
                    let above = map.getObjectAt(el.x, el.y + plantSize, el.z);
                    if (!above && checkIfSpaceToGrow(el.x,el.y+plantSize,el.z)) {
                        let newPlantObject=map.createObject(2, el.x, el.y + plantSize, el.z)
                        plantsCheckedForGrowth.push(newPlantObject);
                        plantObjects.push(newPlantObject)
                        if (plantSize>treeStartsAt-1){
                            let changeToWoodID=plantSize-treeStartsAt;
                            let changed
                            changed=map.changeObjectType(plantObjects[changeToWoodID],6)
                            console.log(changeToWoodID,plantSize,treeStartsAt,changed,plantObjects);
                        }
                        break;
                    }
                    
                    if (above && checkIfSpaceToGrow(el.x,el.y+plantSize,el.z) && (above.typeDef.name == "plant" || above.typeDef.name=="wood") ) {
                        plantsCheckedForGrowth.push(above);
                        plantObjects.push(above)
                    }
                    else {
                        break;
                    }
                }
            }
        }
    })
}
function checkIfSpaceToGrow(x, y, z) {
    return ![
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
    ].some( coords=>{
        let [dx,dz]=coords;
        return map.getObjectAt(x+dx,y,z+dz)
    })
}
export default {
    tick
}