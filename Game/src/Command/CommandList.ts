class CommandList {
    private _list: Command[] = [];
    private currentCommand: Command;
    private _frozen = false;

    addCommand(command: Command) {
        this._list.push(command);
    }

    cancel() {
        this._frozen = true;
        var command = this.currentCommand;
        engine.setTimeout(() => {
            if (this._frozen) {
                this._frozen = false;
            }

        }, 2000);
        if (command) {
            command.cancel(() => {
                this._frozen = false;
            });
            this._list = [];
        }

    }

    execute() {
        if (this._frozen) {
            engine.setTimeout(this.execute,100);
            return;
        }

        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            //console.log("执行下一命令", command)
            command.execute(() => {
                this.execute()
            })

        }
        else {
            //console.log("全部命令执行完毕")
        }
    }
}