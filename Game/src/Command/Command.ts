interface Command {
    execute(callback: Function): void;

    cancel(callback: Function): void;
}

class WalkCommand implements Command {
    private x;
    private y;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    execute(callback: Function): void {
        GameManager.getInstance().secneManager.currentScene.moveTo(this.x, this.y, function () {
            callback();
        })
    }

    cancel(callback: Function) {
        GameManager.getInstance().secneManager.currentScene.stopMove(function () {
            callback();
        })
    }
}


class FightCommand implements Command {
    /**
     * 所有的 Command 都需要有这个标记，应该如何封装处理这个问题呢？
     */
    private _hasBeenCancelled = false;
    private sceneService: GameScene = GameManager.getInstance().secneManager.currentScene;
    //i = 0;
    execute(callback: Function): void {
        //this.i++;
        //this.sceneService.notify("002");
        //console.log(this.i);
        // console.log("开始战斗")
        engine.setTimeout(() => {
            if (!this._hasBeenCancelled) {
                // console.log("结束战斗")
                callback();
            }
        }, 500)
    }

    cancel(callback: Function) {
        console.log("脱离战斗")
        this._hasBeenCancelled = true;
        engine.setTimeout(function () {
            callback();
        }, 100)

    }
}

class TalkCommand implements Command {
    AimNPC: NPC;
    constructor(AimNPC: NPC) {
        this.AimNPC = AimNPC;
    }
    execute(callback: Function): void {
        this.AimNPC.OpenDialogue();
        //console.log("打开对话框")
        engine.setTimeout(function () {
            //console.log("结束对话")
            callback();
        },500)
    }

    cancel(callback: Function) {
        this.AimNPC.closeDialogue();
    }
}