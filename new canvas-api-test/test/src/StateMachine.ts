interface State {
    getStateName(): String;
    setStateName(stateName: String);
    onEnter();
    onExit();
}

class StateMachine {

    public x: number;
    public y: number;
    public stage: engine.DisplayObjectContainer;
    public standAnim: engine.MovieClip;
    public walkAnim: engine.MovieClip;
    public currentState: State;
    public playerContainer: engine.DisplayObjectContainer;
    public standState: Standstate;
    public walkState: Movestate;
    public timeOnEnterFrame: number = 0;
    public ratioX: number = 0;
    public ratioY: number = 0;

    constructor(stage: engine.DisplayObjectContainer, standAnim: engine.MovieClip, walkAnim: engine.MovieClip, playerContainer: engine.DisplayObjectContainer) {
        this.stage = stage;
        this.standAnim = standAnim;
        this.walkAnim = walkAnim;
        this.playerContainer = playerContainer;
        this.standState = new Standstate(this);
        this.walkState = new Movestate(this);
        this.currentState = this.standState;
        this.currentState.onEnter();
    }
    setState(s: String) {
        console.log("当前状态：" + this.currentState.getStateName());
        console.log("即将进入状态：" + s);

        if (this.currentState.getStateName() != s) {
            this.currentState.onExit();
            this.currentState.setStateName(s);
            this.currentState.onEnter();
        }
    }
}

class Standstate implements State {
    public stateMachine: StateMachine;
    constructor(stateMachine: StateMachine) {
        this.stateMachine = stateMachine;
    }
    s: String = "stand";
    public getStateName(): String {
        return this.s;
    }
    public setStateName(stateName: String) {
        this.s = stateName;
    }
    public onEnter(): void {
        console.log("进入stand");
        this.stateMachine.walkAnim.alpha = 1;

    }
    public onExit(): void {
        this.stateMachine.walkAnim.alpha = 0;
        this.stateMachine.currentState = this.stateMachine.walkState;
        console.log("退出stand");
    }

}

class Movestate implements State {
    public stateMachine: StateMachine;
    constructor(stateMachine: StateMachine) {
        this.stateMachine = stateMachine;
    }
    s: String = "move";
    public getStateName(): String {
        return this.s;
    }
    public setStateName(stateName: String) {
        this.s = stateName;
    }
    public onEnter(): void {
        this.stateMachine.walkAnim.alpha = 1;
        console.log("进入move");
    }
    public onExit(): void {
        console.log("退出move");
        this.stateMachine.walkAnim.alpha = 0;
        this.stateMachine.currentState = this.stateMachine.standState;
    }

}