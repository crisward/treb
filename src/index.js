import Matter from "matter-js"
import decomp from "poly-decomp"
import { Runner } from "matter-js";
window.decomp = decomp

var {Engine,Render,World,Bodies,Body,Constraint,MouseConstraint,Composites,Composite} = Matter;

// create an engine
var engine = Engine.create();
let runner

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    element: document.querySelector("#sim"),
    options: {
      width: 1200,
      height: 600,
      showAngleIndicator: true,
      showCollisions: true,
      showVelocity: true
  }
});

var left = 250

function createTreb(slinglength,speed,load){
  console.log("createTreb",slinglength,speed)
  engine.constraintIterations = 10
  engine.world.gravity.scale = 0.001
  render.options.wireframes = true
  // stage
  World.add(engine.world, [
    Bodies.rectangle(600, 610, 1240, 60, { isStatic: true }), // floor
    Bodies.rectangle(-40, 310, 50, 620, { isStatic: true }), // left wall
    Bodies.rectangle(1200, 310, 50, 620, { isStatic: true }), // right wall
    MouseConstraint.create(engine,{constraint:{angularStiffness:0}})
  ])

  var frame = Bodies.fromVertices(left,485,[
    {x:0,y:0},
    {x:100,y:210},
    {x:80,y:210},
    {x:0,y:40},
    {x:-80,y:210},
    {x:-100,y:210}
  ],{ collisionFilter: { group: -1 }, isStatic: true})
  var arm = Bodies.rectangle(left-20,440,300,10,{ collisionFilter: { group: -1 }, density:0.1 })
  var weight = Bodies.rectangle(left+42,310,50,50,{ collisionFilter: { group: -1 }, density:load })
  var missile = Bodies.circle(left-50,440,15,{density:0.0002,restitution:0.5,friction:1})


  var armPivot = Constraint.create({
    pointA: { x: left, y: 400 },
    pointB: { x: 50, y: 0 },
    bodyB: arm,
    length:0,
    stiffness:1
  })

  var armWeightJoint = Constraint.create({
    bodyA: weight,
    pointA: { x: 0, y: 0 },
    bodyB: arm,
    pointB: { x: 150, y: 0 },
    length:0,
    stiffness:1
  })

  var flipper = Bodies.rectangle(left-(80+slinglength),580,10,10,{ density:0.1 })
 
  var flipperPivot = Constraint.create({
    bodyA: flipper,
    pointA: { x: 0, y: 0 },
    bodyB: arm,
    pointB: { x: -155, y: 0 },
    length:slinglength,
    stiffness:1
  })
  World.add(engine.world,[flipper,flipperPivot])
  World.add(engine.world, [arm,weight,armPivot,missile,armWeightJoint,frame]);

  Body.rotate( arm, -Math.PI/2.8 );
  // run the engine
  runner = Engine.run(engine);
  // run the renderer
  engine.timing.timeScale = speed;
  Render.run(render);
}

createTreb(40,1,2)

function reset(){

}

// button
document.querySelector("#replay").addEventListener("click",function(){
  let slinglength = +document.querySelector("#slinglength").value
  let load = +document.querySelector("#load").value
  World.clear(engine.world);
  Engine.clear(engine);
  Render.stop(render);
  Runner.stop(runner)
  createTreb(slinglength,1,load)
})

// doesn't work
// document.querySelector("#slowmo").addEventListener("click",function(){
//   let load = +document.querySelector("#load").value
//   let slinglength = +document.querySelector("#slinglength").value
//   World.clear(engine.world);
//   Engine.clear(engine);
//   Render.stop(render);
//   Runner.stop(runner)
//   createTreb(slinglength,0.1,load)
// })