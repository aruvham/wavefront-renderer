import africanHead from './models/african-head';
import Model from './model';
import { vec3 } from 'gl-matrix';
// console.log(vec3, vec3.fromValues(1, 2, 3), vec3.fromValues(4, 5, 6))

const model = new Model(africanHead);
const canvasEle = document.querySelector('.canvas');
const ctx = canvasEle.getContext('2d', { alpha: false });

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 800, 800);

ctx.strokeStyle = '#FFF';
console.time('render');
ctx.beginPath();
for (let i = 0; i < model.faces.length; i++) {
    const face = model.faces[i];

    for (let j = 0; j < 3; j++) {
        const v0 = model.worldVertices[face[j]]; 
        const v1 = model.worldVertices[face[(j + 1) % 3]];
        
        // const x0 = (v0.x * 200) + 250;
        // const y0 = -(v0.y * 200) + 250;
        // const x1 = (v1.x * 200) + 250;
        // const y1 = -(v1.y * 200) + 250;
        
        // ctx.moveTo(x0, y0);
        // ctx.lineTo(x1, y1);
        ctx.moveTo(v0[0], v0[1]);
        ctx.lineTo(v1[0], v1[1]);
    }
}
ctx.stroke();
console.timeEnd('render');

