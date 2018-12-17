import africanHead from './models/african-head';
import Model from './model';
import { vec3 } from 'gl-matrix';

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
        const v0 = model.vertices[face[j]]; 
        const v1 = model.vertices[face[(j + 1) % 3]];
        
        // const x0 = (v0.x * 200) + 250;
        // const y0 = -(v0.y * 200) + 250;
        // const x1 = (v1.x * 200) + 250;
        // const y1 = -(v1.y * 200) + 250;
        
        // ctx.moveTo(x0, y0);
        // ctx.lineTo(x1, y1);
        ctx.moveTo(v0.x, v0.y);
        ctx.lineTo(v1.x, v1.y);
    }
}
ctx.stroke();
console.timeEnd('render');

