class Task implements TaskConditionContext {
    private _toTaskid:string;
    private _id: string;
    private _name: string;
    private _dris: string;
    private _status: statusType;
    private _current: number = 0;
    private _total: number = -1;
    private _fromNpcId: string;
    private _toNpcId: string;
    public _condition: TaskCondition;
// preid:string,

    public static Task_LIST:{[index:string]:{name:string,dris:string,fromNPCid:string,toNPCid:string,
                        TaskCondition:{type:string,target:string,total:number},toid:string}} = {
        "001":{ name:"初识冒险者",
                dris:"和陆逊对话",
                fromNPCid:"01",
                toNPCid:"02",
                TaskCondition:{type:"NPCTalkTaskCondition",target:null,total:1},
                toid:"002"},//甘宁
        "002":{ name:"战斗",
                dris:"攻打强敌1次",
                fromNPCid:"02",
                toNPCid:"01",
                //total:10,
                TaskCondition:{type:"KillMonsterTaskCondition",target:"monster001",total:1},
                toid:null} //陆逊
    }
    constructor(id: string, name: string, dris: string, fromNpcId: string, 
                    toNpcId: string,total:number,condition:TaskCondition,toTaskid:string) {
        this._toTaskid=toTaskid;
        this._id = id;
        this._name = name;
        this._dris = dris;
        this._fromNpcId = fromNpcId;
        this._toNpcId = toNpcId;
        this._total = total;
        this._current = 0;
        this._condition=condition;
        this._status = statusType.Unacceptable;
        
    }
    // private setstatus(){
    //     if(this._preid==null)
    //         this._status = statusType.Acceptable;
    //     if(this._preid!=null){
    //         var task=new Task()
    //         if()
    //         this._status = statusType.Acceptable;
    //     }
    // }

    public getdris(): string {
        return this._dris;
    }
    public getid(): string {
        return this._id;
    }
    public getname(): string {
        return this._name;
    }
    public getfromNpcId(): string {
        return this._fromNpcId;
    }
    public gettoNpcId(): string {
        return this._toNpcId;
    }
    public getstatus(): statusType {
        return this._status;
    }
    public finish() {
        // console.log(this._status);
        this._status = statusType.Complete;
        // console.log(this._status);
     //   this._condition.onsubmit(this);
     if(this._toTaskid!=null){
        TaskService.getIntance().Canaccept(this._toTaskid);
     }
    }

    public accept() {
        // console.log(this._status);
         this._status = statusType.Working;
        // console.log(this._status);
        this._condition.onAccept(this);
    }
    public Canaccept() {
        // console.log(this._status);
        this._status = statusType.Acceptable;
        // console.log(this._status);
    }
    public Canfinish() {
        // console.log(this._status);
        this._status = statusType.Cancomplete;
        // console.log(this._status);
    }
    public getcurrent(): number {
        return this._current;
    }
    public setcurrent() {
        this._current ++;
        this.CheckStatus();

    }
    private em:EventEmitter;


    public CheckStatus() {
        if(this._status==statusType.Acceptable)
            this._status=statusType.Working;
        if(this._status==statusType.Working){
            if (this._current >= this._total) {
                console.error(this._name + "的this._current>this._total");
                this._status = statusType.Cancomplete;
            }
           TaskService.getIntance().notify(this._id);
        }
    }
}



interface EventEmitter {
    addconditionObserver(conditionObserver: conditionObserver);

    notify(id: string);
}


interface conditionObserver{
    onchange(monsterID:string);
}




interface TaskConditionContext {
    getcurrent(): number;
    setcurrent(): void;
}

interface TaskCondition {
    onAccept(task: TaskConditionContext);

    //onsubmit(task: TaskConditionContext);
}


class NPCTalkTaskCondition implements TaskCondition {

    constructor(){}
    onAccept(task: TaskConditionContext) {
        task.setcurrent();
    //    console.log(task.getcurrent());
    }

    // onsubmit(task: TaskConditionContext) {
       
    // }
}
class KillMonsterTaskCondition implements TaskCondition,conditionObserver{
    monsterID:string;
    task:TaskConditionContext;
    constructor(monsterID:string){this.monsterID=monsterID;}
    onAccept(task: TaskConditionContext) {
        this.task=task;
        GameManager.getInstance().secneManager.currentScene.addconditionObserver(this);
    }

    // onsubmit(task: TaskConditionContext) {
        
    // }
    onchange(monsterID:string){
        if(this.monsterID==monsterID)
            this.task.setcurrent();
    }
}
enum statusType {
    Unacceptable,
    Acceptable,
    Working,
    Cancomplete,
    Complete
}