var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var canvas = document.getElementById("myCanvas");
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
    image.addEventListener("mousemove", function (e) {
        image.y += e.movementY;
        console.log(e.movementY);
    }, false);
    text.addEventListener("mousedown", function (e) {
        console.log("text");
    }, false);
    container.addEventListener("mousedown", function (e) {
        console.log("container");
    }, false);
    stage.draw(context);
    var doMouseEvent = function (e, type) {
        var x = e.offsetX;
        var y = e.offsetY;
        var target = stage.hitTest(x, y);
        var result = target;
        if (result) {
            result.dispatchEvent(type, target, target, e);
            while (result.parent) {
                var currentTarget = result.parent;
                //    let e = { type, target, currentTarget };
                result.parent.dispatchEvent(type, target, currentTarget, e);
                result = result.parent;
            }
            TouchEventListenerManagement.dispatch(e);
        }
    };
    window.onmousedown = function (e) {
        doMouseEvent(e, "mousedown");
        window.onmousemove = function (e) {
            doMouseEvent(e, "mousemove");
        };
        window.onmouseup = function (e) {
            doMouseEvent(e, "mouseup");
            window.onmousemove = function () { };
            window.onmouseup = function () { };
        };
    };
    setInterval(function () {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context);
    }, 30);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.globalAlpha = 1;
        this.isContainer = false;
        this.eventListenerList = [];
    }
    DisplayObject.prototype.draw = function (context) {
        this.relativeMatrix = new Matrix();
        this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.overallMatrix = matrixAppendMatrix(this.relativeMatrix, this.parent.overallMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.overallMatrix = this.relativeMatrix;
        }
        context.globalAlpha = this.globalAlpha;
        this.render(context);
    };
    DisplayObject.prototype.addEventListener = function (type, func, capture) {
        var listener = new TouchEventListener(type, func, capture);
        this.eventListenerList.push(listener);
    };
    ;
    DisplayObject.prototype.dispatchEvent = function (type, target, currentTarget, e) {
        for (var i = 0; i < this.eventListenerList.length; i++) {
            if (this.eventListenerList[i].type == type && this.eventListenerList[i].capture == true) {
                TouchEventListenerManagement.list.unshift(this.eventListenerList[i]);
            }
            else if (this.eventListenerList[i].type == type && this.eventListenerList[i].capture == false) {
                TouchEventListenerManagement.list.push(this.eventListenerList[i]);
            }
        }
    };
    ;
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.isContainer = true;
        this.list = [];
    }
    DisplayObjectContainer.prototype.render = function (context) {
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var displayObject = _a[_i];
            displayObject.draw(context);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (child) {
        this.list.push(child);
        child.parent = this;
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        for (var i = this.list.length - 1; i >= 0; i--) {
            var child = this.list[i];
            var point = new Point(x, y);
            var invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
            var resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
            var hitTestResult = child.hitTest(resultPoint.x, resultPoint.y);
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    };
    ;
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.fontSize = 10;
        this.fontName = "";
    }
    TextField.prototype.render = function (context) {
        context.fillStyle = this.color;
        context.font = this.fontSize.toString() + "px " + this.fontName.toString();
        context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
        context.fillText(this.text, 0, 0 + this.fontSize);
    };
    TextField.prototype.hitTest = function (x, y) {
        var point = new Point(x, y);
        var invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
        var resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
        var rectangle = new Rectangle(0, 0, this.text.length * 10, this.fontSize);
        if (rectangle.isPointInRectangle(resultPoint)) {
            //  console.log(this);
            return this;
        }
        else {
            return null;
        }
    };
    ;
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
        this.image = null;
        this.isLoaded = false;
        this._src = "";
        this.image = document.createElement("img");
    }
    Object.defineProperty(Bitmap.prototype, "src", {
        set: function (value) {
            this._src = value;
            this.isLoaded = false;
        },
        enumerable: true,
        configurable: true
    });
    Bitmap.prototype.render = function (context) {
        var _this = this;
        if (this.isLoaded) {
            context.setTransform(this.overallMatrix.a, this.overallMatrix.b, this.overallMatrix.c, this.overallMatrix.d, this.overallMatrix.tx, this.overallMatrix.ty);
            context.drawImage(this.image, 0, 0);
        }
        else {
            this.image.src = this._src;
            this.image.onload = function () {
                context.setTransform(_this.overallMatrix.a, _this.overallMatrix.b, _this.overallMatrix.c, _this.overallMatrix.d, _this.overallMatrix.tx, _this.overallMatrix.ty);
                context.drawImage(_this.image, 0, 0);
                _this.isLoaded = true;
            };
        }
    };
    Bitmap.prototype.hitTest = function (x, y) {
        var point = new Point(x, y);
        var invertChildRelativeMatrix = invertMatrix(this.relativeMatrix);
        var resultPoint = pointAppendMatrix(point, invertChildRelativeMatrix);
        var rectangle = new Rectangle(0, 0, this.image.width, this.image.height);
        if (rectangle.isPointInRectangle(resultPoint)) {
            // console.log(this);
            return this;
        }
        else {
            return null;
        }
    };
    ;
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=main.js.map