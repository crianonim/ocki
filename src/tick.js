import map from './map.js';

let turn=0;
function tick(game){
    turn++;
    game.map.forEach(el=>{
        if (el.typeDef.gravity){
            let adj=map.getAdjacentObj(el)
            if (!adj.down){
                map.moveObject(el,el.x,el.y-1,el.z);
            }
            // console.log(el,"is under gravity",adj);
        }
    })
    console.log("TICK",turn)
}
export default {
    tick
}