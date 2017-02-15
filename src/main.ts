

window.onload = () => {

    var c=document.getElementById("myCanvas") as HTMLCanvasElement;
    var cxt=c.getContext("2d");
    cxt.fillText("picture2", 50, 50);
    var image = new Image();
    image.src = "picture2.png";
    image.onload = () => {
        cxt.clearRect(0,0,c.width,c.height);
        cxt.drawImage(image, 0, 0);
    } 
    

    var stage: DisplayObjectContainer = new DisplayObjectContainer();
    setInterval(() => {
        cxt.clearRect(0, 0, c.width, c.height);
        stage.draw(cxt);
    }, 30);

    var img: Bitmap = new Bitmap();
    img.name = "picture1.png"
    img.x = 50;
    img.y = 50;
    

    var tf: TextField = new TextField();
    tf.text = "picture1";
    tf.x = 50;
    tf.y = 50;
    tf.textColor = "#0000FF"
   
  
    stage.addChild(img);
    stage.addChild(tf);
};

interface Drawable {
    draw(context2D: CanvasRenderingContext2D);
}


class DisplayObjectContainer implements Drawable {
    array: Drawable[] = [];
    
    draw(context2D: CanvasRenderingContext2D) {
        for (let drawable of this.array) {
            drawable.draw(context2D);
        }
    }
    addChild(child: Drawable) {
        this.array.push(child);
    }

}



class Bitmap implements Drawable {
    x: number = 0;
    y: number = 0;
    width: number = -1;
    height: number = -1;
    name: string = "";
    draw(context2D: CanvasRenderingContext2D) {
        var image = document.createElement("img");
        image.src = this.name;
        context2D.drawImage(image, this.x, this.y);
        image.onload = () => {context2D.drawImage(image, this.x, this.y);} 
        }
    }



class TextField implements Drawable {
    x: number = 0;
    y: number = 0;
    text: string = "";
    textColor: string = "#000000"
   draw(context2D: CanvasRenderingContext2D) {
        this.toggleCase();
        context2D.fillStyle = this.textColor;
        context2D.fillText(this.text, this.x, this.y, 100);
    }

    private toggleCase() {
        this.textColor.toLocaleUpperCase();
    }
}
