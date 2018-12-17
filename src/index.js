import africanHead from './models/african-head';
import Model from './model';
import { vec2, vec3 } from 'gl-matrix';

const model = new Model(africanHead);
model.setScale(350);
model.setPosition(vec3.fromValues(400, 400, 0));

const canvasEle = document.querySelector('.canvas');
const ctx = canvasEle.getContext('2d', { alpha: false });

const renderWireframe = (model, ctx) => {
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#FFF';
  ctx.fillRect(0, 0, 800, 800);
  
  console.time('Render Wireframe');
  ctx.beginPath();
  for (let i = 0; i < model.faces.length; i++) {
    const face = model.faces[i];
    
    for (let j = 0; j < 3; j++) {
      const v0 = model.worldVertices[face[j]]; 
      const v1 = model.worldVertices[face[(j + 1) % 3]];
      ctx.moveTo(v0[0], v0[1]);
      ctx.lineTo(v1[0], v1[1]);
    }
  }
  ctx.stroke();
  console.timeEnd('Render Wireframe');
}

// renderWireframe(model, ctx);
ctx.fillStyle = '#000';
ctx.strokeStyle = '#FFF';
ctx.fillRect(0, 0, 800, 800);

const lightSource = vec3.fromValues(0, 0, -1);
console.time('Render');
var len = model.faces.length;
for (let i = 0; i < len; i++) {
  const face = model.faces[i];

  const v0 = model.modelVertices[face[0]]; 
  const v1 = model.modelVertices[face[1]]; 
  const v2 = model.modelVertices[face[2]];
  
  var n = vec3.create();
  var side1 = vec3.create();
  var side2 = vec3.create();

  vec3.subtract(side1, v2, v0);
  vec3.subtract(side2, v1, v0);

  vec3.cross(n, side1, side2);
  vec3.normalize(n, n);
  
  var lightIntensity = vec3.dot(n, lightSource);

  // console.log(lightIntensity)

  if (lightIntensity > 0) {
    const v0 = model.worldVertices[face[0]]; 
    const v1 = model.worldVertices[face[1]]; 
    const v2 = model.worldVertices[face[2]];

    ctx.fillStyle = `rgb(${lightIntensity * 255}, ${lightIntensity * 255}, ${lightIntensity * 255})`;
    ctx.beginPath();
    ctx.moveTo(v0[0], v0[1]);
    ctx.lineTo(v1[0], v1[1]);
    ctx.lineTo(v2[0], v2[1]);
    ctx.lineTo(v0[0], v0[1]);
    ctx.fill();
  }
}
console.timeEnd('Render');