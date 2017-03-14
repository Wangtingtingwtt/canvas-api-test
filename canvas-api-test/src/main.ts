window.onload = () => {

    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    var context = canvas.getContext("2d");

    var container = new DisplayObjectContainer();
    container.alpha = 1;
    container.x = 50;

    var image = new Bitmap();
    image.alpha = 0.5;
    image.src = "captain.jpg";
    image.scaleX = 1;
    image.scaleY = 1;
    image.x = 50;
    image.y = 50;

    var text = new TextField();
    text.x = 50;
    text.y = 50;
    text.scaleY = 1;
    text.alpha = 0.5;
    text.color = "#FF0000";
    text.fontName = "Arial";
    text.fontSize = 20;
    text.text = "Hello World";

    container.addChild(image);
    container.addChild(text);

    var stage = new DisplayObjectContainer();
    stage.addChild(container);

    var imageY = image.y;

    // image.addEventListener("mousedown", (e) => {
    //     console.log("image");
    // }, false)
    image.addEventListener("mousemove", (e) => {
        image.y += e.movementY;
        console.log(e.movementY);
    }, false)
    
    text.addEventListener("mousedown", (e) => {
        console.log("text");
    }, false)
    container.addEventListener("mousedown", (e) => {
        console.log("container");
    }, false)

    stage.draw(context);

    var doMouseEvent = (e: MouseEvent, type: string) => {
        let x = e.offsetX;
        let y = e.offsetY;
        let target = stage.hitTest(x, y);
        let result = target;
        if (result) {
            result.dispatchEvent(type, target, target, e);
            while (result.parent) {
                let currentTarget = result.parent;
                //    let e = { type, target, currentTarget };
                result.parent.dispatchEvent(type, target, currentTarget, e);
                result = result.parent;
            }
            TouchEventListenerManagement.dispatch(e);
        }

    }

    window.onmousedown = (e) => {

        doMouseEvent(e, "mousedown");
        window.onmousemove = (e) => {
            doMouseEvent(e, "mousemove");
        }
        window.onmouseup = (e) => {
            doMouseEvent(e, "mouseup");
            window.onmousemove = ()=>{}
            window.onmouseup = ()=>{}
        }

    }
    
    setInterval(() => {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context);
    }, 30)

};

interface Drawable {
    draw(context: CanvasRenderingContext2D);
}

abstract class DisplayObject implements Drawable {
    x = 0;
    y = 0;
    scaleX = 1;
    scaleY = 1;
    rotation = 0;
    alpha = 1;
    globalAlpha = 1;
    isContainer = false;

    parent: DisplayObjectContainer;

    relativeMatrix: Matrix;     //相对矩阵
    overallMatrix: Matrix;      //全局矩阵

    eventListenerList = [];

    draw(context: CanvasRenderingContext2D) {
        this.relativeMatrix = new Matrix();
        this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);

        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.overallMatrix = matrixAppendMatrix(this.relativeMatrix, this.parent.overallMatrix);
        } else {
            this.globalAlpha = this.alpha;
            this.overallMatrix = this.relativeMatrix;
        }

        context.globalAlpha = this.globalAlpha;
        this.render(context);
    }

    abstract render(context: CanvasRenderingContext2D);
    abstract hitTest(x, y);

    addEventListener(type: string, func: (e?: MouseEvent) => void, capture: boolean) {
        let listener = new TouchEventListener(type, func, capture);
        this.eventListenerList.push(listener);
    };

    dispatchEvent(type: string, target: DisplayObject, currentTarget: DisplayObject, e: MouseEvent) {
        for (var i = 0; i < this.eventListenerList.length; i++) {
            if (this.eventListenerList[i].type == type && this.eventListenerList[i].capture == true) {
                TouchEventListenerManagement.list.unshift(this.eventListenerList[i]);
            }
            else if (this.eventListenerList[i].type == type && this.eventListenerList[i].capture == false) {
                TouchEventListenerManagement.list.push(this.eventListenerList[i]);
            }
        }

    };
}

class DisplayObjectContainer extends DisplayObject {
    isContainer = true;
    list: DisplayObject[] = [];

    render(context: CanvasRenderingContext2D) {

        for (let displayObject of this.list) {
            displayObject.draw(context);
        }
    }

    addChild(child: DisplayObject) {
        this.list.push(child);
        child.parent = this;
    }

    hitTest(x, y): DisplayObject {
        for (let i = this.list.length - 1; i >= 0; i--) {
            let child = this.list[i];
            let point = new Point(x, y);
            let invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
            let resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
            let hitTestResult = child.hitTest(resultPoint.x, resultPoint.y);
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    };

}

class TextField extends DisplayObject {
    text = "";
    color = "";
    fontSize = 10;
    fontName = "";

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.font = this.fontSize.toString() + "px " + this.fontName.toString();
        context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
        context.fillText(this.text, 0, 0 + this.fontSize);

    }

    hitTest(x, y) {
        let point = new Point(x, y);
        let invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
        let resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
        let rectangle = new Rectangle(0, 0, this.text.length * 10, this.fontSize);
        if (rectangle.isPointInRectangle(resultPoint)) {
            //  console.log(this);
            return this;
        } else {
            return null;
        }

    };
}

class Bitmap extends DisplayObject {
    private image: HTMLImageElement = null;
    private isLoaded = false;
    constructor() {
        super();
        this.image = document.createElement("img");
    }
    private _src = "";
    set src(value: string) {
        this._src = value;
        this.isLoaded = false;
    }

    render(context: CanvasRenderingContext2D) {
        if (this.isLoaded) {
            context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
            context.drawImage(this.image, 0, 0);

        }
        else {
            this.image.src = this._src;
            this.image.onload = () => {
                context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
                context.drawImage(this.image, 0, 0);

                this.isLoaded = true;
            }
        }
    }

    hitTest(x, y) {
        let point = new Point(x, y);
        let invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
        let resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
        let rectangle = new Rectangle(0, 0, this.image.width, this.image.height);
        if (rectangle.isPointInRectangle(resultPoint)) {
            // console.log(this);
            return this;
        } else {
            return null;
        }
    };
}






