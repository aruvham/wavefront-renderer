const fs = require('fs');
const url = 'african-head.obj';

fs.readFile(url, 'utf8',(err, data) => {
    const file = data;
    const model = new Model(file);
});

