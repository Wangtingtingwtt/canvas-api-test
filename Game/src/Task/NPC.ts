interface Observer {
    onchange(task: Task);
}

class NPC extends engine.DisplayObjectContainer implements Observer {
    private NPCField: engine.DisplayObjectContainer;
    private _name: string;
    private _id: string;
    private _role: Role;
    private _tasklist: Task[] = [];
    private taskresponse: engine.Bitmap;
    private namelabel: engine.TextField;


    public static NPC_LIST: { [index: string]: { name: string, Flashlist: number } } = {
        "01": { name: "甘宁", Flashlist: 6 },//甘宁
        "02": { name: "陆逊", Flashlist: 4 } //陆逊
    }


    public constructor(id: string) {
        super();
        this.NPCField = new engine.DisplayObjectContainer();
        this._id = id;
        //NPC形象加载  图片格式有要求305*280；
        this._role = new Role();
        this._role.call(this.CreatNPC(id), this.CreatNPC(id));
        this._role.x = 170
        this._role.y = 170;
        this.NPCField.addChild(this._role);
        this.NPCField.width = this._role.width;
        this.NPCField.height = this._role.height;
        this._name = NPC.NPC_LIST[id].name
        //NPC头上任务反馈
        this.taskresponse = new engine.Bitmap();
        this.taskresponse.scaleX = 0.5;
        this.taskresponse.scaleY = 0.5;
        this.taskresponse.x = -50;
        this.taskresponse.y = -180;
        this.NPCField.addChild(this.taskresponse);
        //namelabel相关设置
        this.namelabel = new engine.TextField();
        this.namelabel.x = -30;
        this.namelabel.y = 70;
        this.namelabel.color="0X00000";
        this.namelabel.fontSize = 40;
        this.NPCField.addChild(this.namelabel);
        this.addChild(this.NPCField);
    }
    //调用函数
    public call() {
        this.namelabel.text = this._name;
        this.getTask();
        this.responseTask();
        this.clickNPC();
        //this.addChild(this.dialogue);
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, this.dialogue);
    }
    //鼠标点击
    public clickNPC() {
        this._role.touchEnable = true;
        this._role.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            // this.getTask();
            // this.responseTask();
            var list = new CommandList();
            var walk = new WalkCommand(this.x - GameScene.mapOffsetX, this.y);///////////////////////////////////////////////////
            var talk = new TalkCommand(this);
            list.addCommand(walk);
            list.addCommand(talk);
            list.execute();
            //console.log("this.role chick");
            this.getTask();
            this.responseTask();
        })
    }
    //打开对话框
    private dialogue = new DialoguePanel();
    private IsDialogueOpen = false;
    public OpenDialogue() {
        var task = this.getOptimalTask();
        var fromself: boolean = false;
        var toself: boolean = false;
        if (task.getfromNpcId() == this._id) fromself = true;
        if (task.gettoNpcId() == this._id) toself = true;

        // this.dialogue.anchorOffsetX = this.dialogue.width / 2;
        // this.dialogue.anchorOffsetY = this.dialogue.height / 2;
        // this.dialogue.x = this.parent.stage.width / 2 - this.x;
        // this.dialogue.y = this.parent.stage.height / 2 - this.y;

        this.dialogue.call(task, fromself, toself);
        //this.addChild(this.dialogue._container);
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, this.dialogue._container);
        this.IsDialogueOpen = true;
        this.getTask();
        this.responseTask();
    }
    public closeDialogue() {
        if (this.IsDialogueOpen = true)
            // this.removeChild(this.dialogue._container);
            GameManager.getInstance().UIManager.removeLayer(LayerType.UILayer, this.dialogue._container);
        else
            console.error("对话框并没有打开，无法关闭");
    }
    private getOptimalTask(): Task {
        var task: Task;
        for (var s = 0; s < this._tasklist.length; s++) {
            //优先查找自己能结算的任务
            if (this._tasklist[s].gettoNpcId() == this._id) {
                switch (this._tasklist[s].getstatus()) {
                    case statusType.Unacceptable:
                        break;
                    case statusType.Acceptable:
                        break;
                    case statusType.Cancomplete:
                        task = this._tasklist[s];
                        //console.log("结算");
                        break;
                    case statusType.Complete:
                        //task=this._tasklist[s];
                        break;
                    case statusType.Working:
                        //task=this._tasklist[s];
                        break;
                }

            }
        }
        if (task == null) {
            for (var s = 0; s < this._tasklist.length; s++) {
                //次选查找自己能发送的任务
                if (this._tasklist[s].getfromNpcId() == this._id) {
                    switch (this._tasklist[s].getstatus()) {
                        case statusType.Unacceptable:
                            break;
                        case statusType.Acceptable:
                            task = this._tasklist[s];
                            //console.log("提交");
                            break;
                        case statusType.Cancomplete:
                            break;
                        case statusType.Complete:
                            break;
                        case statusType.Working:
                            break;
                    }
                }
            }
        }
        //身上既没有能发出的任务也没有能结算的任务，随意一个任务
        if (task == null) {
            task = this._tasklist[0];
        }
        return task;
    }

    private CreatNPC(id: string): string[] {
        var Animationlist: string[] = [];
        for (var s = 0; s < NPC.NPC_LIST[id].Flashlist; s++) {
            if (s < 10) Animationlist.push("NPC" + id + "_0" + s + "" + "_png");
            if (s > 10) Animationlist.push("NPC" + id + "_" + s + "" + "_png");
        }
        return Animationlist;
    }

    private getTask() {

        var NPCRule: Function = (tasklist): Task[] => {
            var temptasklist: Task[] = [];
            for (var id in tasklist) {
                var task: Task = tasklist[id];
                if (task.gettoNpcId() == this._id) {
                    temptasklist.push(task);
                }
                if (task.getfromNpcId() == this._id) {
                    temptasklist.push(task);
                }
            }
            return temptasklist;
        }
        this._tasklist = TaskService.getIntance().getTaskByCustomRule(NPCRule);
    }

    public onchange(task: Task) {
        // for(var s of this._tasklist){
        //     if(s.getid()==task.getid()){
        //         if(s.getfromNpcId() == this._id)
        //             console.log(this._name+":发出任务");
        //         if(s.gettoNpcId() == this._id)
        //             console.log(this._name+":完成任务");
        //     }
        // }
        this.getTask()
        this.responseTask();
    }

    // public addTask(task:Task){
    //     this._tasklist.push(task);
    // }
    //是否身上有未发出的任务
    private hasSendTask(): boolean {
        for (var s of this._tasklist) {
            if (s.getfromNpcId() == this._id && s.getstatus() == statusType.Acceptable) {
                return true;
            }
        }
        return false;
    }
    //是否身上有未提交的任务
    private hasReceiveTask(): boolean {
        for (var s of this._tasklist) {
            // if(s.gettoNpcId()==this._id && s.getstatus()==statusType.Working){
            //    return true;
            // }
            if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Cancomplete) {
                return true;
            }
        }
        return false;
    }

    public responseTask() {
        /**缺最优算法 */
        var s = this.getOptimalTask();
        //任务发出不可接受，没有表情
        if (s.getstatus() == statusType.Unacceptable) {
            this.taskresponse.src ="0_png";
            //console.log("0.png");
        }
        //任务发出可接受，蓝色问号
        if (s.getfromNpcId() == this._id && s.getstatus() == statusType.Acceptable) {
            this.taskresponse.src ="1_png";
            //console.log("1.png");
        }
        //任务进行中，灰色问号
        if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Working) {
            this.taskresponse.src = "2_png";
            //console.log("2.png");
        }
        //任务可完成但没提交，金色问号
        if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Cancomplete) {
            this.taskresponse.src = "3_png";
            //console.log("3.png");
        }
        //任务提交完成，没有表情
        if (s.gettoNpcId() == this._id && s.getstatus() == statusType.Complete) {
            this.taskresponse.src = "0_png";
            //console.log("0.png");
        }
        if (!this.hasSendTask() && !this.hasReceiveTask())
            this.taskresponse.src = "0_png";
    }
}
