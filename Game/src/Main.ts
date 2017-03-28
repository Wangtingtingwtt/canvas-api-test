//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends engine.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */

    public constructor(stage: engine.Stage) {
        super();
        this.stage = stage;
        this.createGameScene();
    }


    //生成任务条件 
    private creatTaskCondition(type: string, target: string) {
        var taskCondition = null;
        if (type == "NPCTalkTaskCondition")
            taskCondition = new NPCTalkTaskCondition();
        if (type == "KillMonsterTaskCondition")
            taskCondition = new KillMonsterTaskCondition(target);
        return taskCondition;
    }

    //生成任务
    private creatTask(id: string): Task {
        var taskCondition = null;
        taskCondition = this.creatTaskCondition(Task.Task_LIST[id].TaskCondition.type, Task.Task_LIST[id].TaskCondition.target);
        var task = new Task(id,
            Task.Task_LIST[id].name,
            Task.Task_LIST[id].dris,
            Task.Task_LIST[id].fromNPCid,
            Task.Task_LIST[id].toNPCid,
            Task.Task_LIST[id].TaskCondition.total,
            taskCondition,
            Task.Task_LIST[id].toid);
        return task;
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    // private _player: Role;

    public stage: engine.Stage;

    private user: User;
    private map: TileMap;
    private _container: engine.DisplayObjectContainer;
    //private gameManager:GameManager;
    // private _grid:Grid;
    // private _path:Array<MapNode>=new Array;
    private createGameScene(): void {

        this._container = new engine.DisplayObjectContainer();
        //this.gameManager = GameManager.getInstance();

        this.map = new TileMap();
        this._container.addChild(this.map);
        this.map.Create();

        var gameScene = new GameScene(this.map);
        GameManager.getInstance().secneManager.addScene(gameScene);

        this.user = User.getInstance();
        //this._container.addChild(this.user.container)
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, this.user.container)
        this.user.setinformation("982049377", User.idlelist, User.walklist)

        //this.addChild(this._container);

        this.walkByTap();
        //this.mapMove();



        var guanyu = new Hero();
        var bitmap = new engine.Bitmap();
        bitmap.src = "/Game/assets/001.png";
        guanyu.setinformation("001", "关羽", 95, 85, heroQualitySort.S, bitmap);
        this.user.addHero(guanyu);
        this.user.inToTeam(guanyu);
        var qinglongyanyuedao = new Equipment();
        bitmap.src = "/Game/assets/weapan001.png";
        qinglongyanyuedao.setinformation("we001", 10, 0, "青龙偃月刀", equipmentQualitySort.Story, bitmap);
        // var atkCrystal = new Crystal();
        // bitmap = this.createBitmapByName("atk001_png");
        // atkCrystal.setinformation("atk001", 5, 0, "攻击宝石", bitmap)
        // var defCrystal = new Crystal();
        // bitmap = this.createBitmapByName("def001_png");
        // defCrystal.setinformation("def001", 0, 5, "防御宝石", bitmap)

        guanyu.addEquipment(this.user, qinglongyanyuedao);
        //qinglongyanyuedao.addCrystal(this.user, atkCrystal);
        //qinglongyanyuedao.addCrystal(this.user, defCrystal);



        var taskService: TaskService = TaskService.getIntance();
        var task: Task = this.creatTask("001");
        var task2: Task = this.creatTask("002");

        taskService.addTask(task);
        taskService.addTask(task2);

        var NPC1 = new NPC("01");
        var NPC2 = new NPC("02");
        taskService.addObserver(NPC1);
        taskService.addObserver(NPC2);
        taskService.Canaccept("001");
        NPC1.call();
        NPC2.call();
        // taskService.accept(task.getid());

        // this._container.addChild(NPC1);
        // this._container.addChild(NPC2);
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, NPC1);
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, NPC2);
        NPC1.x = 500; NPC1.y = 400;
        NPC2.x = 900; NPC2.y = 900;

        var TaskPanelLogo: engine.Bitmap = new engine.Bitmap();
        TaskPanelLogo.src = "/Game/assets/TaskPanelLogo.png";
        TaskPanelLogo.x = 350;
        TaskPanelLogo.y = 1000;
        TaskPanelLogo.scaleX = 0.5;
        TaskPanelLogo.scaleY = 0.5;
        //this._container.addChild(TaskPanelLogo);
        //GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, TaskPanelLogo);
        //GameManager.getInstance().secneManager.currentScene.addChild(TaskPanelLogo);

        TaskPanelLogo.touchEnable = true;
        var taskPanel = new TaskPanel();
        TaskPanelLogo.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            //var taskPanel=new TaskPanel();
            taskPanel.call();
            //this._container.addChild(taskPanel);
            GameManager.getInstance().UIManager.addLayer(LayerType.DetailLayer, taskPanel);
            // taskPanel.x = 100;
            // taskPanel.y = 600;
        });


        var monster = new Monster();
        var bit = new engine.Bitmap();
        bit.src = "/Game/assets/Monster.png";
        monster.call("monster001", "黄巾贼", 60, 50, bit, 50);

        monster.x = 400;
        monster.y = 900;
        monster.scaleX = 0.5;
        monster.scaleY = 0.5;
        //this._container.addChild(monster);
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, monster);


        this._container.addChild(GameManager.getInstance().UIManager);
        this.stage.addChild(this._container);
        this.stage.addChild(TaskPanelLogo);//为了能移动
    }
    /***
     * 不合理的地方AStar和地图耦合性强，只能在main里面调用
     * 虽然用了UI层级管理器但监听还是很恶心
     * hero打开hero状态面板和后面的装备打开装备面板相同，就没做了
     */

    private walkByTap() {
        function ss() { }
        this.map.touchEnable = true;
        this.map.addEventListener(engine.MyTouchEvent.TouchClick, (evt: engine.MyTouchEvent) => {
            var walkCommand = new WalkCommand(evt.stageX, evt.stageY);
            walkCommand.execute(ss);
            //console.log("x"+evt.stageX+"y"+evt.stageY);
        });
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */

}
