import africanHead from './models/african-head';
import Model from './model';
import { vec2, vec3 } from 'gl-matrix';

const width = 800;
const height = 800;
const zBuffer = new Array(width * height).fill(-Infinity);
const lightSource = vec3.fromValues(0, 0, -1);

const model = new Model(africanHead);
model.setScale(300);
model.setPosition(vec3.fromValues(width / 2, height / 2, 0));

const canvasEle = document.querySelector('.canvas');
const ctx = canvasEle.getContext('2d', { alpha: false });
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, width, height);
const image = ctx.getImageData(0, 0, width, height);
console.log(image.width);
const setPixel = (image, x, y, r, g, b) => {
  var index = (x + y * image.width) * 4;
  image.data[index + 0] = r;
  image.data[index + 1] = g;
  image.data[index + 2] = b;
  image.data[index + 3] = 255;
}

const barycentric = (vertices, x, y) => {
  const u = vec3.create();
  vec3.cross(
    u,
    [vertices[2][0] - vertices[0][0], vertices[1][0] - vertices[0][0], vertices[0][0] - x],
    [vertices[2][1] - vertices[0][1], vertices[1][1] - vertices[0][1], vertices[0][1] - y]
  );

  if (Math.abs(u[2]) < 1) return [-1, 0, 0];
  return vec3.fromValues(1 - (u[0] + u[1]) / u[2], u[1] / u[2], u[0] / u[2]); 
} 

const triangle = (vertices, r, g, b) => {
  const v0 = vertices[0]; 
  const v1 = vertices[1]; 
  const v2 = vertices[2];

  const max = vec2.fromValues(
    Math.max(v0[0], v1[0], v2[0]) << 0,
    Math.max(v0[1], v1[1], v2[1]) << 0,
  );

  const min = vec2.fromValues(
    Math.min(v0[0], v1[0], v2[0]) << 0,
    Math.min(v0[1], v1[1], v2[1]) << 0,
  );

  // var sx1 = v0[0];
  // var sx2 = v1[0];
  // var sx3 = v2[0];
  // var sy1 = v0[1];
  // var sy2 = v1[1];
  // var sy3 = v2[1];

  // var xmax = sx1 > sx2 ? (sx1 > sx3 ? sx1 : sx3) : (sx2 > sx3 ? sx2 : sx3);
  // var ymax = sy1 > sy2 ? (sy1 > sy3 ? sy1 : sy3) : (sy2 > sy3 ? sy2 : sy3);
  // var xmin = sx1 < sx2 ? (sx1 < sx3 ? sx1 : sx3) : (sx2 < sx3 ? sx2 : sx3);
  // var ymin = sy1 < sy2 ? (sy1 < sy3 ? sy1 : sy3) : (sy2 < sy3 ? sy2 : sy3);

  for (let x = min[0]; x <= max[0]; ++x) {
    for (let y = min[1]; y <= max[1]; ++y) {

      const bc = barycentric(vertices, x, y);
      if (bc[0] < 0 || bc[1] < 0 || bc[2] < 0) continue;

      const z = (v0[2] * bc[0]) + (v1[2] * bc[1]) + (v2[2] * bc[2]);
      const index = x + (y * width);

      if (zBuffer[index] < z) {
          zBuffer[index] = z;
          setPixel(image, x, y, r, g, b);
      }
    }
  }
}

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

const renderModel = () => {
  console.time('Render');
  var len = model.faces.length;
  for (let i = 0; i < len; ++i) {
    const face = model.faces[i];
  
    const v0 = model.modelVertices[face[0]]; 
    const v1 = model.modelVertices[face[1]]; 
    const v2 = model.modelVertices[face[2]];
  
    const n = vec3.create();
    const side1 = vec3.create();
    const side2 = vec3.create();
  
    // const side2 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
    // const side1 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

    vec3.subtract(side1, v1, v0);
    vec3.subtract(side2, v2, v0);
    vec3.cross(n, side2, side1);
    vec3.normalize(n, n);
    
    const lightIntensity = vec3.dot(n, lightSource);
  
    if (lightIntensity > 0) {
      const v0 = model.worldVertices[face[0]]; 
      const v1 = model.worldVertices[face[1]]; 
      const v2 = model.worldVertices[face[2]];
      const color = lightIntensity * 255;
      triangle([v0, v1, v2], color, color, color);
    }
  }
  
  ctx.putImageData(image,0,0);
  console.timeEnd('Render');
}

renderModel();

