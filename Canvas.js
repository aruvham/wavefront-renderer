class Canvas {
    constructor(canvasEle, w, h) {
        this.ctx = canvasEle.getContext('2d', { alpha: false });
        this.w = canvasEle.width;
        this.h = canvasEle.height;
    }

    background(color) {
        this.fillStyle(color);
        this.rect(0, 0, this.w, this.h);
    }

    strokeStyle(color) {
        this.ctx.strokeStyle = color;
    }

    fillStyle(color) {
        this.ctx.fillStyle = color;
    }

    rect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h);
    }

    line(x0, y0, x1, y1) {
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    } 
}
