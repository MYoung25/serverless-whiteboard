import { WebsocketService } from "./WebSocketService"

interface drawObject {
    moveTo: {
        x: number, y: number
    }
    lineTo: {
        x: number, y: number
    }
    strokeStyle: string
    lineWidth: number
}

export class CanvasService {
    websocketService: WebsocketService

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
    
    color = 'black'
    lineWidth = 2

    constructor (websocketService: WebsocketService) {
        this.websocketService = websocketService
    }

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

        this.websocketService.registerListeners([
            {
                eventName: 'message',
                handler: (message: MessageEvent) => {
                    try {
                        const event = JSON.parse(message.data)
                        console.log(event);
                        if (event.type === 'whiteboard/LOADED') {
                            if (event.data.length === 0 && this.ctx) {
                                this.ctx.clearRect(0, 0, this.w, this.h)
                                return
                            }

                            event.data.forEach((object: drawObject) => {
                                this.draw(object, true)
                            })
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            },
            {
                eventName: 'open',
                handler: () => {
                    console.log('load!')
                    this.websocketService.emit({ type: 'load' })
                }
            },
            {
                eventName: 'close',
                handler: () => {
                    console.log('close')
                }
            }
        ])
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
                this.ctx.fillStyle = this.color;
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

                const drawObject = {
                    moveTo: {
                        x: this.prevX, y: this.prevY
                    },
                    lineTo: {
                        x: this.currX, y: this.currY
                    },
                    strokeStyle: this.color,
                    lineWidth: this.lineWidth
                }

                this.draw(drawObject);
            }
        }
    }

    draw(object: drawObject, fromServer = false) {
        if (!this.ctx || !this.canvas) return
        try {
            const path = new Path2D()
            path.moveTo(object.moveTo.x, object.moveTo.y);
            path.lineTo(object.lineTo.x, object.lineTo.y);
            path.closePath();
            this.ctx.strokeStyle = object.strokeStyle;
            this.ctx.lineWidth = object.lineWidth;
            this.ctx.stroke(path);
            
            
            if (!fromServer) {
                this.websocketService.emit({ type: 'addPath', data: object })
            }
        } catch (e) {
            console.error(e)
        }
    }

    setColor(color: string) {
        switch (color) {
            case "green":
                this.color = "green";
                break;
            case "blue":
                this.color = "blue";
                break;
            case "red":
                this.color = "red";
                break;
            case "yellow":
                this.color = "yellow";
                break;
            case "orange":
                this.color = "orange";
                break;
            case "black":
                this.color = "black";
                break;
            case "white":
                this.color = "white";
                break;
        }
        if (this.color == "white") this.lineWidth = 14;
        else this.lineWidth = 2;

    }

}

// this can be used to save an image to R2...
// function save() {
//     document.getElementById("canvasimg").style.border = "2px solid";
//     var dataURL = canvas.toDataURL();
//     document.getElementById("canvasimg").src = dataURL;
//     document.getElementById("canvasimg").style.display = "inline";
// }