declare namespace engine {
    class CanvasRenderer {
        private stage;
        private context2D;
        constructor(stage: Stage, context2D: CanvasRenderingContext2D);
        render(): void;
        renderContainer(stage: DisplayObjectContainer): void;
        renderBitmap(bitmap: Bitmap): void;
        renderTextField(textField: TextField): void;
    }
}
declare namespace engine {
    class Tween {
        private static _tweens;
        private static NONE;
        /**
         * 循环
         * @constant {number} egret.Tween.LOOP
         * @private
         */
        private static LOOP;
        /**
         * 倒序
         * @constant {number} egret.Tween.REVERSE
         * @private
         */
        private static REVERSE;
        private static IGNORE;
        private static _plugins;
        private static _inited;
        private _target;
        private _useTicks;
        /**
         * @private全局暂停
         */
        private ignoreGlobalPause;
        private loop;
        private pluginData;
        private _curQueueProps;
        private _initQueueProps;
        private _steps;
        private paused;
        private duration;
        private _prevPos;
        private position;
        private _prevPosition;
        private _stepPosition;
        private passive;
        static get(object: DisplayObject): Tween;
        static removeTweens(target: any): void;
        static removeAllTweens(): void;
        constructor(target: any);
        private initialize(target);
        private static _lastTime;
        private static _register(tween, value);
        static tick(timeStamp: number, paused?: boolean): boolean;
        $tick(delta: number): void;
        setPosition(value: number, actionsMode?: number): boolean;
        private _runAction(action, startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        setPaused(value: boolean): Tween;
        private _cloneProps(props);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
        wait(duration: number, passive?: boolean): Tween;
        to(props: any, duration?: number, ease?: Function): Tween;
        call(callback: Function, thisObj?: any, params?: any[]): Tween;
        set(props: any, target?: any): Tween;
        play(tween?: Tween): Tween;
        pause(tween?: Tween): Tween;
        static pauseTweens(target: any): void;
        static resumeTweens(target: any): void;
    }
    function setTimeout(func: Function, time: number): void;
}
declare namespace engine {
    class Event {
        type: string;
        target: any;
        bubbles: boolean;
        cancelable: boolean;
        static ENTER_FRAME: string;
        static DATE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
    class MyTouchEvent extends Event {
        stageX: number;
        stageY: number;
        static TouchDown: string;
        static TouchUp: string;
        static TouchClick: string;
        static TOUCH_BEGIN: string;
        static TOUCH_END: string;
        static TOUCH_MOVE: string;
        constructor(x: number, y: number, type: string);
    }
    class EventListen {
        type: string;
        func: Function;
        isCapture: boolean;
        constructor(type: string, func: Function, isCapture?: boolean);
    }
}
declare namespace engine {
    class Ticker {
        private static _instance;
        static readonly Instance: Ticker;
        ticker_Listeners: Function[];
        register(listener: Function): void;
        unregister(listener: Function): void;
        clear(): void;
        notify(deltaTime?: number): void;
    }
    function startTick(func: Function): void;
    function stopTick(func: Function): void;
    function getTimer(): number;
}
declare namespace math {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        isPointInRectangle(point: Point): boolean;
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace engine {
    interface HitTestable {
        hitTest(x: number, y: number): any;
    }
    abstract class DisplayObject implements HitTestable {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        alpha: number;
        width: number;
        height: number;
        parent: DisplayObject;
        type: string;
        localAlpha: number;
        matrix: math.Matrix;
        localMatrix: math.Matrix;
        constructor(type: string);
        update(): void;
        abstract hitTest(x: number, y: number): any;
        touchEnable: boolean;
        $dispatchPropagationEvent(Chain: DisplayObject[], touchEvent: MyTouchEvent, isCapture?: boolean): void;
        dispatchEvent(event: Event): void;
        listenerList: EventListen[];
        addEventListener(type: string, func: Function, IsCatch?: boolean): void;
        removeEventListener(type: string, func: Function, IsCatch?: boolean): void;
    }
}
declare namespace engine {
    class DisplayObjectContainer extends DisplayObject {
        DisplayObjects: DisplayObject[];
        constructor(type?: string);
        addChild(child: DisplayObject): void;
        removeChild(child: DisplayObject): void;
        removeAllChild(): void;
        update(): void;
        hitTest(x: number, y: number): DisplayObject[];
        dispatchEvent(event: Event): void;
        swapChildren(from: DisplayObject, to: DisplayObject): void;
    }
}
declare namespace engine {
    class Stage extends DisplayObjectContainer {
        DisplayObjects: DisplayObject[];
        private static instance;
        static context2d: CanvasRenderingContext2D;
        private Isinstance;
        constructor(context2d: CanvasRenderingContext2D);
        static getInstance(): Stage;
    }
}
declare namespace engine {
    class Bitmap extends DisplayObject {
        img: HTMLImageElement;
        isLoaded: boolean;
        constructor();
        _src: string;
        src: string;
        hitTest(x: number, y: number): this;
    }
}
declare namespace engine {
    class TextField extends DisplayObject {
        text: string;
        color: string;
        fontSize: number;
        fontName: string;
        constructor();
        hitTest(x: number, y: number): this;
    }
}
declare namespace engine {
    function run(canvas: HTMLCanvasElement): Stage;
}
