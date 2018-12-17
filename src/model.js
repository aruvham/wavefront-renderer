import { vec2, vec3 } from 'gl-matrix';
import { runInThisContext } from 'vm';

export default class Model {
  constructor(file, scale = 1, position = vec2.fromValues(0, 0)) {
    this.scale = scale;
    this.position = position;
    this.modelVertices = [];
    this.worldVertices = [];
    this.faces = [];
    this.file = file;
    this.parseFile();
  }

  setScale(scale) {
    this.scale = scale;
    this.updateWorldVertices();
  }

  setPosition(position) {
    this.position = position;
    this.updateWorldVertices();
  } 

  updateWorldVertices() {
    this.worldVertices = [];

    for (let i = 0; i < this.modelVertices.length; i++) {
      const vertex = this.modelVertices[i];
      this.worldVertices.push(vec3.fromValues(
        (vertex[0] * this.scale) + this.position[0],
        -(vertex[1] * this.scale) + this.position[1],
        (vertex[2] * this.scale) + this.position[2],
      ));
    }
  }
  
  parseFile() {
    let lines = this.file.split('\n');
    lines = lines.map(line => line.split(' '));
    
    lines.forEach(line => {
      if (line[0] === 'v') {
        this.modelVertices.push(vec3.fromValues(line[1], line[2], line[3]));
        this.worldVertices.push(vec3.fromValues(
          (line[1] * this.scale) + this.position[0],
          -(line[2] * this.scale) + this.position[1],
          (line[2] * this.scale) + this.position[2],
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
