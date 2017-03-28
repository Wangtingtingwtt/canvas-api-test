window.onload = () => {

    var canvas = document.getElementById("context") as HTMLCanvasElement;
    var stage = engine.run(canvas);
    var main = new Main(stage);
}