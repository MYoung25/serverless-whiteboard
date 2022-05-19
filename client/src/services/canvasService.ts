
export class CanvasService {
    canvas?: HTMLCanvasElement
    ctx?: CanvasRenderingContext2D | null
    w = 375
    h = 300

    flag = false
    prevX = 0
    currX = 0
    prevY = 0
    currY = 0
    dot_flag = false
    
    x = 'black'
    y = 2


    init(canvas?: HTMLCanvasElement) {
        if (!canvas) return
        this.canvas = canvas
        this.canvas.width = this.w
        this.canvas.height = this.h

        this.ctx = canvas.getContext('2d')

        const findxy = this.findxy.bind(this)

        this.canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false)
        this.canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        this.canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        this.canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
    }

    findxy(res: string, e: MouseEvent) {
        if (!this.canvas || !this.ctx) return
        if (res == 'down') {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = e.clientX - this.canvas.getBoundingClientRect().left;
            this.currY = e.clientY - this.canvas.getBoundingClientRect().top;

            this.flag = true;
            this.dot_flag = true;
            if (this.dot_flag) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.x;
                this.ctx.fillRect(this.currX, this.currY, 2, 2);
                this.ctx.closePath();
                this.dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            this.flag = false;
        }
        if (res == 'move') {
            if (this.flag) {
                this.prevX = this.currX;
                this.prevY = this.currY;
                this.currX = e.clientX - this.canvas.getBoundingClientRect().left;
                this.currY = e.clientY - this.canvas.getBoundingClientRect().top;
                this.draw();
            }
        }
    }

    draw() {
        if (!this.ctx) return
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = this.x;
        this.ctx.lineWidth = this.y;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    color(color: string) {
        switch (color) {
            case "green":
                this.x = "green";
                break;
            case "blue":
                this.x = "blue";
                break;
            case "red":
                this.x = "red";
                break;
            case "yellow":
                this.x = "yellow";
                break;
            case "orange":
                this.x = "orange";
                break;
            case "black":
                this.x = "black";
                break;
            case "white":
                this.x = "white";
                break;
        }
        if (this.x == "white") this.y = 14;
        else this.y = 2;

    }

}

// function erase() {
//     var m = confirm("Want to clear");
//     if (m) {
//         ctx.clearRect(0, 0, w, h);
//         document.getElementById("canvasimg").style.display = "none";
//     }
// }

// function save() {
//     document.getElementById("canvasimg").style.border = "2px solid";
//     var dataURL = canvas.toDataURL();
//     document.getElementById("canvasimg").src = dataURL;
//     document.getElementById("canvasimg").style.display = "inline";
// }