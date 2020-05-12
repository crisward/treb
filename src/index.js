import Matter from "matter-js"
import decomp from "poly-decomp"
import { Runner } from "matter-js";
window.decomp = decomp

var {Engine,Render,World,Bodies,Constraint,MouseConstraint,Composites,Composite} = Matter;

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
var slinglength = 40

function createTreb(){
  
  engine.constraintIterations = 5
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
  var arm = Bodies.rectangle(left,400,300,10,{ collisionFilter: { group: -1 }, density:0.1 })
  var weight = Bodies.rectangle(left+100,400,50,50,{ collisionFilter: { group: -1 }, density:2 })
  var missile = Bodies.circle(left-175,370,15,{density:0.0002,restitution:0.5,friction:1})

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

  var flipper = Bodies.rectangle(left-(200+slinglength),400,10,10,{ density:0.01 })
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
  // run the engine
  runner = Engine.run(engine);
  // run the renderer
  Render.run(render);
}

createTreb()

// button
document.querySelector("#replay").addEventListener("click",function(){
  World.clear(engine.world);
  Engine.clear(engine);
  Render.stop(render);
  Runner.stop(runner)
  createTreb()
  console.log("updating")
})