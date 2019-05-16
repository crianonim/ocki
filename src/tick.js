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

        if (turn % 2 == 0 && el.typeDef.name == "plant" && !plantsCheckedForGrowth.includes(el)) {
            let below = map.getObjectAt(el.x, el.y - 1, el.z)
            if (below && below.typeDef.name == "dirt" && checkIfSpaceToGrow(el.x,el.y,el.z) ) {
                // console.log("Found dirt under",below)
                let upDelta = 0;
                while (true) {
                    upDelta++;
                    if (upDelta > 3) break;
                    let above = map.getObjectAt(el.x, el.y + upDelta, el.z);

                    if (!above && checkIfSpaceToGrow(el.x,el.y+upDelta,el.z)) {
                        plantsCheckedForGrowth.push(map.createObject(2, el.x, el.y + upDelta, el.z))
                        break;
                    }
                    if (above && checkIfSpaceToGrow(el.x,el.y+upDelta,el.z) && above.typeDef.name == "plant") {
                        plantsCheckedForGrowth.push(above);
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