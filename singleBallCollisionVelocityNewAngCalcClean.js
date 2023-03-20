"use strict";
/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 600);

let oneTimeSwitch = true;

let vector;
let diffX;
let diffY;

const ballRadius = 20;

let collision = false;
const lineWidth = 0;

const angle0 = (150 / 180) * Math.PI;
let angle1;

let colLocRef;
let posXLocRef;
let posYLocRef;

// init the unrotated hitter (red) - initial value
const hitterXi = canvas.width / 2 + 150,
  hitterYi = canvas.height / 2 - 100;

//set variables from intial values
let hitterX = hitterXi;
let hitterY = hitterYi;

//init the unrotated hittee (blue)
let hitteeX = canvas.width / 2;
let hitteeY = canvas.height / 2;

const numberOfBalls = 4;

let hitteeXRot;
let hitteeYRot;

//init the rotated hitter (pink)
let hitterXRot = canvas.height / 2 - 200;
let hitterYRot = canvas.height / 2 + 100;

let velocities;

let rotDeflectAngle;
const vel1Init = 2;

const velocityModel = function (vel1Init, angle) {
  //dimensional collisions - Conservation of Momentum
  let mass1;
  let mass2;
  /* let vel1Init = 10; */
  let vel2Init;
  /* let angle1 = (30 / 180) * Math.PI;
  let angleB = (45 / 180) * Math.PI; */
  let angleA = angle;
  angleA = angleA + Math.PI / 2;
  console.log("angleA = " + angleA);
  let angleB = angle;
  console.log("angleB = " + angleB);

  let vel1Fin;
  let vel1FinX;
  let vel1FinY;
  let vel2Fin;
  let vel2FinX;
  let vel2FinY;

  //calc x basis
  vel1FinX = Math.cos(angleA);
  console.log(vel1FinX);
  vel2FinX = Math.cos(angleB);
  console.log(vel2FinX);
  vel1FinY = Math.sin(angleA);
  console.log(vel1FinY);
  vel2FinY = Math.sin(angleB);
  console.log(vel2FinY);

  let vel1FinYAdj = 1 / vel1FinY;
  vel2FinY = vel2FinY * vel1FinYAdj;
  console.log(vel2FinY);

  vel2Fin = vel1Init / (vel1FinX * vel2FinY - vel2FinX);
  vel1Fin = vel2FinY * vel2Fin;

  console.log("vel1Fin = " + vel1Fin);
  console.log("vel2Fin = " + vel2Fin);
  return [vel1Fin /*  * -1 */, vel2Fin * -1];
};

const update = function () {
  //collision detection - calculate vector magnitude between both unrotated balls
  diffX = hitteeX - hitterX;
  diffY = hitteeY - hitterY;

  vector = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  /* console.log(diffX);
  console.log(diffY); */

  if (vector <= ballRadius * 2 + lineWidth) {
    collision = true;
  }
  //if no collision - both hitters (rotated and unrotated are moving from initial position)
  if (collision == false) {
    //movement of unrotated hitter
    hitterX += Math.cos(angle0) * vel1Init;
    hitterY += Math.sin(angle0) * vel1Init;
  }
  //deflection code
  else {
    //only calculate angle between the rotated balls once
    if (oneTimeSwitch == true) {
      //##########################################################################################
      //creation of the model in the background that sets the terms of the collision, based on the
      //trajectory of the hitter which is travelling at angle 0 (left to right), so as to simplify the
      //outcomes.
      //##########################################################################################

      //calculate the angle difference between the angle of motion of the unrotated hitter and angle 0
      console.log("hitterX = " + hitterX);
      console.log("hitterY = " + hitterY);
      console.log("hitteeX = " + hitteeX);
      console.log("hitteeY = " + hitteeY);

      console.log("diffX = " + diffX);
      console.log("diffY = " + diffY);
      console.log(
        "angle1 BEFORE modification = " +
          (Math.atan(diffY / diffX) * 180) / Math.PI
      );

      if (diffX >= 0) {
        angle1 = Math.atan(diffY / diffX);
        console.log("diffX option 1");
      }
      //adjust atan result to output angles > 90 degrees || < -90 degrees
      /* if (diffX < 0) { */
      else {
        angle1 = Math.atan(diffY / diffX) + Math.PI;
        console.log("diffX option 2");
      }

      //console.log(angle1);

      //offset the angle of the postion of the rotated hittee in terms of rotated hitter that is in motion at angle 0
      let angle1F = angle1 - angle0;
      //console.log("angle1F BEFORE modification = " + angle1F);
      console.log("angle1 AFTER modification = " + (angle1 * 180) / Math.PI);

      hitteeXRot = hitterXRot + Math.cos(angle1F) * vector;
      hitteeYRot = hitterYRot + Math.sin(angle1F) * vector;
      //position the rotated hitter next to the rotated hittee at point of collision

      const xDiffRot = hitteeXRot - hitterXRot;
      const YDiffRot = hitteeYRot - hitterYRot;

      //adjust atan result to output angles over 90 degrees
      //for velocity usage
      rotDeflectAngle = Math.atan(YDiffRot / xDiffRot);

      console.log("rotDeflectAngle = " + (rotDeflectAngle * 180) / Math.PI);
      //##########################################################################################
      //end of background rotational model
      //##########################################################################################

      console.log("posXLocRef = " + posXLocRef);
      console.log("colLocRef = " + colLocRef);

      console.log("hitterYRot = " + hitterYRot);
      console.log("hitteeYRot = " + hitteeYRot);

      velocities = velocityModel(vel1Init, rotDeflectAngle);
      console.log(velocities);

      oneTimeSwitch = false;
    }

    hitterX += Math.cos(angle1 + Math.PI / 2) * velocities[0];
    hitterY += Math.sin(angle1 + Math.PI / 2) * velocities[0];
    hitteeX += Math.cos(angle1) * velocities[1];
    hitteeY += Math.sin(angle1) * velocities[1];
  }
};
const draw = function () {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.beginPath();
  ctx.arc(hitterX, hitterY, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#ff0000";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(hitteeX, hitteeY, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#0000ff";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  /* ctx.beginPath();
  ctx.arc(hitterXRot, hitterYRot, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#ffc0cb";
  ctx.lineWidth = 1;

  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(hitteeXRot, hitteeYRot, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#add8e6";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke(); */
};

function animate() {
  update();
  draw();

  requestAnimationFrame(animate);
}
animate();
