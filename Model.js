class Model {
  constructor(file, format = 'wavefront') {
    this.vertices = [];
    this.faces = [];
    
    if (format === 'wavefront') {
      this.parseWavefront(file);
    }
  }
  
  parseWavefront(file) {
    let lines = file.split('\n');
    lines = lines.map(line => line.split(' '));
    
    lines.forEach(line => {
      if (line[0] === 'v') {
        this.vertices.push({
          x: (parseFloat(line[1]) * 350) + 400,
          y: -(parseFloat(line[2]) * 350) + 400,
          z: parseFloat(line[3]),
        });
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