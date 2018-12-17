import { vec3 } from 'gl-matrix';

export default class Model {
  constructor(file) {
    this.scale = 350;
    this.offsetX = 400;
    this.offsetY = 400;
    this.modelVertices = [];
    this.worldVertices = [];
    this.faces = [];
    this.parseFile(file);
  }
  
  parseFile(file) {
    let lines = file.split('\n');
    lines = lines.map(line => line.split(' '));
    
    lines.forEach(line => {
      if (line[0] === 'v') {
        this.modelVertices.push(vec3.fromValues(line[1], line[2], line[3]));
        this.worldVertices.push(vec3.fromValues(
          (line[1] * this.scale) + this.offsetX,
          (line[2] * -this.scale) + this.offsetY,
          line[3],
        ));
      } else if (line[0] === 'f') {
        this.faces.push([
          line[1].split('/')[0] - 1,
          line[2].split('/')[0] - 1,
          line[3].split('/')[0] - 1,
        ]);
      }
    });
  }
}
