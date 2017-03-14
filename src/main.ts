window.onload = () => {

    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    var context = canvas.getContext("2d");

    var container = new DisplayObjectContainer();
    container.alpha = 1;

    var image = new Bitmap();
    image.alpha = 0.5;
    image.src = "captain.jpg";
    image.scaleX = 2;
    image.scaleY = 1;
    image.x = 0;
    image.y = 0;
    image.rotation = 30;

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
    container.draw(context);

    setInterval(() => {

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        image.rotation++;
        container.x++;
        container.draw(context);

    }, 30)

};

interface Drawable {
    draw(context: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable {
    x = 0;
    y = 0;
    scaleX = 1;
    scaleY = 1;
    rotation = 0;
    alpha = 1;
    globalAlpha = 1;

    parent: DisplayObjectContainer;

    relativeMatrix: Matrix;     //相对矩阵
    overallMatrix: Matrix;      //全局矩阵

    draw(context: CanvasRenderingContext2D) {
        this.relativeMatrix = new Matrix();
        this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);

        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.overallMatrix = matrixAppendMatrix(this.parent.overallMatrix, this.relativeMatrix);
        } else {
            this.globalAlpha = this.alpha;
            this.overallMatrix = this.relativeMatrix;
        }

        context.globalAlpha = this.globalAlpha;
        this.render(context);
    }

    render(context: CanvasRenderingContext2D) { }
}

class DisplayObjectContainer extends DisplayObject {
    list: DisplayObject[] = [];

    render(context: CanvasRenderingContext2D) {
        console.log("相对矩阵：" + this.relativeMatrix.tx);
        console.log("全局矩阵：" + this.overallMatrix.tx);

        for (let displayObject of this.list) {
            displayObject.draw(context);
        }
    }

    addChild(child: DisplayObject) {
        this.list.push(child);
        child.parent = this;
    }

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
        console.log("相对矩阵：" + this.relativeMatrix.tx);
        console.log("全局矩阵：" + this.overallMatrix.tx);

    }
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
                console.log("相对矩阵：" + this.relativeMatrix.tx);
                console.log("全局矩阵：" + this.overallMatrix.tx);
            }
        }
    }
}



class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function pointAppendMatrix(point: Point, m: Matrix): Point {
    var x = m.a * point.x + m.c * point.y + m.tx;
    var y = m.b * point.x + m.d * point.y + m.ty;
    return new Point(x, y);

}

/**
 * 使用伴随矩阵法求逆矩阵
 * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
 */
function invertMatrix(m: Matrix): Matrix {


    var a = m.a;
    var b = m.b;
    var c = m.c;
    var d = m.d;
    var tx = m.tx;
    var ty = m.ty;

    var determinant = a * d - b * c;
    var result = new Matrix(1, 0, 0, 1, 0, 0);
    if (determinant == 0) {
        throw new Error("no invert");
    }

    determinant = 1 / determinant;
    var k = result.a = d * determinant;
    b = result.b = -b * determinant;
    c = result.c = -c * determinant;
    d = result.d = a * determinant;
    result.tx = -(k * tx + c * ty);
    result.ty = -(b * tx + d * ty);
    return result;

}

function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix {

    var result = new Matrix();
    result.a = m1.a * m2.a + m1.b * m2.c;
    result.b = m1.a * m2.b + m1.b * m2.d;
    result.c = m2.a * m1.c + m2.c * m1.d;
    result.d = m2.b * m1.c + m1.d * m2.d;
    result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
    result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
    return result;
}

var PI = Math.PI;
var HalfPI = PI / 2;
var PacPI = PI + HalfPI;
var TwoPI = PI * 2;
var DEG_TO_RAD: number = Math.PI / 180;


class Matrix {

    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    public a: number;

    public b: number;

    public c: number;

    public d: number;

    public tx: number;

    public ty: number;

    public toString(): string {
        return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
    }

    updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number) {
        this.tx = x;
        this.ty = y;
        var skewX, skewY;
        skewX = skewY = rotation / 180 * Math.PI;

        var u = Math.cos(skewX);
        var v = Math.sin(skewX);
        this.a = Math.cos(skewY) * scaleX;
        this.b = Math.sin(skewY) * scaleX;
        this.c = -v * scaleY;
        this.d = u * scaleY;

    }
}


