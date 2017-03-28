class TaskService {
    //private _tasklist:Task[]=[];
    private _observerlist: Observer[] = [];
    public static instance: TaskService;// = new TaskService;
    private static count = 0;
    private _tasklist: { [index: string]: Task } = {}

    constructor() {
        TaskService.count++;
        if (TaskService.count > 1)
            throw 'singleton!!';
    }

    public static getIntance() {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }
    public getTaskByCustomRule(Rule: Function): Task[] {
        return Rule(this._tasklist);
    }

    public addTask(task: Task) {
        this._tasklist[task.getid()] = task;
    }

    public addObserver(observer: Observer) {
        this._observerlist.push(observer);
    }
    public finish(id: string) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        if (this._tasklist[id].getstatus() == statusType.Cancomplete) {
            this._tasklist[id].finish();
            this.notify(id);
        }
    }
    public accept(id: string) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        if (this._tasklist[id].getstatus() == statusType.Acceptable) {
            this._tasklist[id].accept();
            this.notify(id);
        }
    }
    public Canaccept(id: string) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        //if(this._tasklist[id].getstatus()==statusType.Unacceptable){
        this._tasklist[id].Canaccept();
        this.notify(id);
        //}
    }

    public Canfinish(id: string) {
        if (this._tasklist[id] == null) {
            throw '没有这个任务';
        }
        if (this._tasklist[id].getstatus() == statusType.Working) {
            this._tasklist[id].Canfinish();
            this.notify(id);
        }
    }
    public notify(id: string) {
        for (var s of this._observerlist)
            s.onchange(this._tasklist[id]);
    }


    // public notifyKillMonster(monsterId:string){
    //     this._tasklist[]._condition.onAccept
    // }

    // public KillMonster(id: string) {
    //     if (this._tasklist[id] == null) {
    //         throw '没有这个任务';
    //     }
    //     this._tasklist[id].setcurrent();
    //     this.notify(id);
    // }

}

