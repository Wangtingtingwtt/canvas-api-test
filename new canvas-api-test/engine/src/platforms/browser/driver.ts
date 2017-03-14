namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

        var stage = new DisplayObjectContainer();
        let context = canvas.getContext("2d");
        let lastNow = Date.now();
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            stage.draw(context);
            context.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        var doMouseEvent = (e: MouseEvent, type: string) => {
            let x = e.offsetX;
            let y = e.offsetY;
            let target = stage.hitTest(x, y);
            let result = target;
            if (result) {
                result.dispatchEvent(type, target, target);
                while (result.parent) {
                    let currentTarget = result.parent;
                    //    let e = { type, target, currentTarget };
                    result.parent.dispatchEvent(type, target, currentTarget);
                    result = result.parent;
                }
                engine.TouchEventListenerManagement.dispatch(e);
            }

        }

        window.onmousedown = (e) => {

            doMouseEvent(e, "mousedown");
            window.onmousemove = (e) => {
                doMouseEvent(e, "mousemove");
            }
            window.onmouseup = (e) => {
                doMouseEvent(e, "mouseup");
                window.onmousemove = () => { }
                window.onmouseup = () => { }
            }

        }

        // setInterval(() => {
        //     context.setTransform(1, 0, 0, 1, 0, 0);
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        //     stage.draw(context);
        // }, 30)

        return stage;

    }

}