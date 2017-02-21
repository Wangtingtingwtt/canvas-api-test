

window.onload = () => {

    var c=document.getElementById("myCanvas") as HTMLCanvasElement;
    var cxt=c.getContext("2d");
   
    

    var stage: DisplayObjectContainer = new DisplayObjectContainer();
    var panel = new DisplayObjectContainer();
    panel.x = 120;
    panel.y = 50;
    panel.alpha = 0.5;
    
    setInterval(() => {
        
        cxt.clearRect(0, 0, c.width, c.height);//在显示图片之前先清屏，将之前帧的图片去掉,清屏范围最好设置成画布的宽与高
        stage.draw(cxt);

    }, 100)

  

    var img: Bitmap = new Bitmap();
   
    img.x = 50;
    img.y = 50;
    img.width = 800;
    img.height = 800;
    img.alpha = 0.5;

    var tf: TextField = new TextField();
    tf.text = "picture1";
    tf.x = 50;
    tf.y = 50;
    tf.textColor = "#0000FF"
    tf.alpha = 0.8;
   
        img.image.onload = () => {

        img.width = 400;
        img.height = 400;
        
        panel.addChild(tf);
        stage.addChild(img);
        stage.addChild(panel);

    
    }


 
};

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
}


class Bitmap extends DisplayObject {
    image: HTMLImageElement;
    width : number = 0;
    height : number = 0;
    constructor() {
        
        super();
        this.image = document.createElement("img");
    }

    render(context2D: CanvasRenderingContext2D) {
        
        context2D.drawImage(this.image, 0, 0, this.width, this.height);
        //context2D.drawImage(this.image, 0, 0);
    }

    }



class TextField extends DisplayObject{
    x: number = 0;
    y: number = 0;
    text: string = "";
    textColor: string = "#000000"
   draw(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.textColor;
        context2D.fillText(this.text, this.x, this.y, 100);
    }
}


class DisplayObject implements Drawable{

    x : number = 0;
    y : number = 0;
    scaleX : number = 1;
    scaleY : number = 1;
    rotation : number = 0; 

    matrix : math.Matrix = null;
    globalMatrix : math.Matrix = null;

    alpha : number = 1;
    globalAlpha : number = 1;//全局                             
    parent : DisplayObject = null;

    constructor(){

        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
        
    }
    
    
    //final，所有子类都要执行且不能修改
    draw(context2D: CanvasRenderingContext2D) {
        

        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);//初始化矩阵
        //console.log(this.matrix.toString());


        //Alpha值
        if(this.parent){

            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);

        }else{

            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }

        context2D.globalAlpha = this.globalAlpha;
        //console.log(context2D.globalAlpha);
        
        //变换
        
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);

        //模板方法模式
    }

    //在子类中重写
    render(context2D: CanvasRenderingContext2D){


    }

}



class DisplayObjectContainer extends DisplayObject{
    
    array: DisplayObject[] = [];

    render(context2D : CanvasRenderingContext2D){

        for (let displayObject of this.array) {

            displayObject.draw(context2D);
        }
    }

    addChild(displayObject : DisplayObject){

        this.array.push(displayObject);
        displayObject.parent = this;

    }

    removeChild(displayObject : DisplayObject){

        var tempArray = this.array.concat();
        for(let each of tempArray){

            if(each == displayObject){

                var index = this.array.indexOf(each);
                tempArray.splpicture2(index, 1);
                this.array = tempArray;
                return;
            }
    }}}