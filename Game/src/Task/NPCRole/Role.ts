class Role extends engine.DisplayObjectContainer{
      public _role:engine.Bitmap=new engine.Bitmap();
      private _State:State;
      private idlelist:string[]=[];
      private walklist:string[]=[];
      public constructor() {
            super();
      }
      public SetState(e:State){
            if(this._State!=e){
                this._State.onExit();
            }
            this._State=e;
            this._State.onEnter();
      }
      public call(idlelist:string[],walklist:string[]){
            this.idlelist=idlelist;
            this.walklist=walklist;

            this._role.src="/Game/assets/10000.png";
            tool.anch(this._role);
            this.addChild(this._role);
            var idle:Idle=new Idle (this,this.idlelist);
            this._State=idle;
            this._State.onEnter();
      }

}