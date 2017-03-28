class Monster extends engine.DisplayObjectContainer {
    properties: Property;
    private static Id = 0;
    private hp = 0;
    private hpLImit = 0;
    private alive = true;
    constructor() {
        super();
        this.properties = new Property();
        Monster.Id++;
        this.tempid = Monster.Id;
        this.addChild(this.properties._bitmap);
    }

    tempid = 0;
    call(id: string, name: string, atk: number, def: number, bitmap: engine.Bitmap, hp: number) {
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
        this.hp = hp;
        this.hpLImit = hp;
        this.tap();
    }
    tap() {
        this.properties._bitmap.touchEnable = true;
        this.properties._bitmap.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            var list = new CommandList();
            var walk = new WalkCommand(this.x - GameScene.mapOffsetX, this.y);
            var fight = new FightCommand();
            list.addCommand(walk);
            list.addCommand(fight);
            list.execute();
            this.hp -= 50;
            this.checkAlive();
            console.log("战斗");
        });
    }
    private checkAlive() {
        if (this.hp <= this.hpLImit) {
            this.alive = false;
            this.properties._bitmap.touchEnable = false;
            GameManager.getInstance().secneManager.currentScene.notify(this.properties.configId);
        }
        else {
            this.alive = true;
        }

    }
}