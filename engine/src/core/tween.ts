namespace engine {
    export class Tween {
        private static _tweens: Tween[] = [];
        private static NONE = 0;
		/**
         * 循环
		 * @constant {number} egret.Tween.LOOP
         * @private
		 */
        private static LOOP = 1;
		/**
         * 倒序
		 * @constant {number} egret.Tween.REVERSE
         * @private
		 */
        private static REVERSE = 2;
        private static IGNORE = {};
        private static _plugins = {};
        private static _inited = false;
        private _target: any = null;
        private _useTicks: boolean = false;
        /**
         * @private全局暂停
         */
        private ignoreGlobalPause: boolean = false;
        private loop: boolean = false;
        private pluginData = null;
        private _curQueueProps;
        private _initQueueProps;
        private _steps: any[] = null;
        private paused: boolean = false;
        private duration: number = 0;
        private _prevPos: number = -1;
        private position: number = null;
        private _prevPosition: number = 0;
        private _stepPosition: number = 0;
        private passive: boolean = false;

        static get(object: DisplayObject) {
            var tween = new Tween(object);
            return tween;
        }
        static removeTweens(target: any) {
            if (!target.tween_count) {
                return;
            }
            let tweens: Tween[] = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        }

        static removeAllTweens() {
            let tweens: Tween[] = Tween._tweens;
            tweens.forEach(tween => {
                tween._target.tweenjs_count = 0;
            });
            tweens.length = 0;
        }

        constructor(target: any) {
            this.initialize(target);
        }
        private initialize(target: any) {
            this._target = target;
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            Tween._register(this, true);
        }
        private static _lastTime: number = 0;
        private static _register(tween: Tween, value: boolean): void {
            let target: any = tween._target;
            let tweens: Tween[] = Tween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                Tween._lastTime = engine.getTimer();
                engine.startTick(Tween.tick);
            } else {
                if (target) {
                    target.tween_count--;
                }
                let i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        }
        static tick(timeStamp: number, paused = false): boolean {
            let delta = timeStamp - Tween._lastTime;
            Tween._lastTime = timeStamp;

            let tweens: Tween[] = Tween._tweens.concat();
            for (let i = tweens.length - 1; i >= 0; i--) {
                let tween: Tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.$tick(tween._useTicks ? 1 : delta);
            }

            return false;
        }
        public $tick(delta: number): void {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }

        public setPosition(value: number, actionsMode: number = 1): boolean {
            if (value < 0) {
                value = 0;
            }

            //正常化位置
            let t: number = value;
            let end: boolean = false;
            if (t >= this.duration) {
                if (this.loop) {
                    var newTime = t % this.duration;
                    if (t > 0 && newTime === 0) {
                        t = this.duration;
                    } else {
                        t = newTime;
                    }
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }

            if (end) {
                this.setPaused(true);
            }

            let prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;

            if (this._target) {
                if (this._steps.length > 0) {
                    // 找到新的tween
                    let l = this._steps.length;
                    let stepIndex = -1;
                    for (let i = 0; i < l; i++) {
                        if (this._steps[i].type == "step") {
                            stepIndex = i;
                            if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t) {
                                break;
                            }
                        }
                    }
                    for (let i = 0; i < l; i++) {
                        if (this._steps[i].type == "action") {
                            //执行actions
                            if (actionsMode != 0) {
                                if (this._useTicks) {
                                    this._runAction(this._steps[i], t, t);
                                }
                                else if (actionsMode == 1 && t < prevPos) {
                                    if (prevPos != this.duration) {
                                        this._runAction(this._steps[i], prevPos, this.duration);
                                    }
                                    this._runAction(this._steps[i], 0, t, true);
                                }
                                else {
                                    this._runAction(this._steps[i], prevPos, t);
                                }
                            }
                        }
                        else if (this._steps[i].type == "step") {
                            if (stepIndex == i) {
                                let step = this._steps[stepIndex];
                                this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                            }
                        }
                    }
                }
            }

            return end;
        }

        private _runAction(action: any, startPos: number, endPos: number, includeStart: boolean = false) {
            let sPos: number = startPos;
            let ePos: number = endPos;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
            }
            let pos = action.t;
            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                action.f.apply(action.o, action.p);
            }
        }

        private _updateTargetProps(step: any, ratio: number) {
            let p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            } else {
                this.passive = !!step.v;
                //不更新props.
                if (this.passive) {
                    return;
                }
                //使用ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }

            for (let n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                } else {
                    v = v0 + (v1 - v0) * ratio;
                }

                let ignore = false;
                if (arr = Tween._plugins[n]) {
                    for (let i = 0, l = arr.length; i < l; i++) {
                        let v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    this._target[n] = v;
                }
            }

        }
        public setPaused(value: boolean): Tween {
            this.paused = value;
            Tween._register(this, !value);
            return this;
        }
        private _cloneProps(props: any): any {
            let o = {};
            for (let n in props) {
                o[n] = props[n];
            }
            return o;
        }
        private _addStep(o): Tween {
            if (o.d > 0) {
                o.type = "step";
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        }
        private _appendQueueProps(o): any {
            let arr, oldValue, i, l, injectProps;
            for (let n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    //设置plugins
                    if (arr = Tween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                } else {
                    oldValue = this._curQueueProps[n];
                }
            }

            for (let n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = Tween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        }
        private _addAction(o): Tween {
            o.t = this.duration;
            o.type = "action";
            this._steps.push(o);
            return this;
        }

        private _set(props: any, o): void {
            for (let n in props) {
                o[n] = props[n];
            }
        }


        public wait(duration: number, passive?: boolean): Tween {
            if (duration == null || duration <= 0) {
                return this;
            }
            let o = this._cloneProps(this._curQueueProps);
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        }

        public to(props: any, duration?: number, ease: Function = undefined) {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
            //加入一步set，防止游戏极其卡顿时候，to后面的call取到的属性值不对
            return this.set(props);
        }
        // to(props: any, duration?: number) {
        //     this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
        //     //加入一步set，防止游戏极其卡顿时候，to后面的call取到的属性值不对
        //     return this.set(props);
        // }
        public call(callback: Function, thisObj: any = undefined, params: any[] = undefined): Tween {
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        }

        public set(props: any, target = null): Tween {
            //更新当前数据，保证缓动流畅性
            this._appendQueueProps(props);
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        }
        public play(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        }
        public pause(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        }



        public static pauseTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens: engine.Tween[] = engine.Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        }
        public static resumeTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens: engine.Tween[] = engine.Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = false;
                }
            }
        }
    }

    export function setTimeout(func: Function, time: number) {
        window.setTimeout(func, time);
    }

}