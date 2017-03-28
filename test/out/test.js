window.onload = function () {
    var canvas = document.getElementById("context");
    var stage = engine.run(canvas);
    var textfield = new engine.TextField();
    textfield.x = 100;
    textfield.scaleX = 0.5;
    // textfield.scaleY = 5;
    textfield.alpha = 1;
    textfield.y = 50;
    textfield.color = "#FF0000";
    textfield.fontSize = 200;
    textfield.fontName = "sans-serif";
    textfield.text = "Hello,world";
    var bitmap1 = new engine.Bitmap();
    //  bitmap1.rotation = 90;//旋转会涉及到锚点问题
    bitmap1.x = 0;
    bitmap1.y = 0;
    bitmap1.alpha = 0.8;
    bitmap1.scaleX = 1.2;
    bitmap1.scaleY = 0.5;
    bitmap1.src = "/test/bitmap/weapan001.png";
    stage.addChild(bitmap1);
    stage.addChild(textfield);
    //container.draw(context2d);
    stage.x = 200;
    stage.y = 200;
    //container.rotation =0;
    // console.log("test:" + bitmap1.width);
    // console.log(bitmap1.img.naturalWidth);
    // console.log(bitmap1.scaleX);
    bitmap1.touchEnable = true;
    textfield.touchEnable = true;
    stage.touchEnable = true;
    bitmap1.addEventListener(engine.MyTouchEvent.TouchClick, function () { console.log("bitmap1 touched"); });
    textfield.addEventListener(engine.MyTouchEvent.TouchDown, function () { console.log("textfield touched"); });
    stage.addEventListener(engine.MyTouchEvent.TouchDown, function () { console.log("stage touched 冒泡"); });
    stage.addEventListener(engine.MyTouchEvent.TouchDown, function () { console.log("stage touched 捕获"); }, true);
    // engine.Tween.get(bitmap1).to({x:500},2000);
    //    engine.startTick(()=>{console.log(bitmap1.x)})
    // var prevY: number;
    // bitmap1.addEventListener(engine.MyTouchEvent.TOUCH_BEGIN, ( )=> {
    //     bitmap1.addEventListener(engine.MyTouchEvent.TOUCH_MOVE, move);
    // })
    // function move(e: engine.MyTouchEvent) {
    //     console.log("bitmap1.move");
    // }
    // bitmap1.addEventListener(engine.Event.ENTER_FRAME, () => { bitmap1.x++; });
    // textfield.addEventListener(engine.Event.ENTER_FRAME, function () { textfield.x--; });
    // stage.addEventListener(engine.Event.ENTER_FRAME, function () { stage.x--; });
    engine.startTick(function () {
        bitmap1.x++;
    });
    // engine.Ticker.Instance.register((deltaTime) => {
    //     // console.log("Ticker register");
    //     bitmap1.x++;
    //     // console.log("test:" + bitmap1.width);
    //     // console.log(bitmap1.img.naturalWidth);
    //     // console.log(bitmap1.scaleX);
    // });
};
//# sourceMappingURL=test.js.map