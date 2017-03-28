class Idle implements State{
        public constructor(pperson:Role,idle:string[]) {
            this.person=pperson;
            this.Idlelist=idle;
        }
        private person:Role;
        private Idlelist:string[];
        private count:number=-1;
        private i:number=0;

        public onEnter(){
            engine.startTick(this.PlayIdle);
        }

        public onExit(){
            engine.stopTick(this.PlayIdle);
            //console.log("IdleExit");
        }

        private PlayIdle():boolean{
          this.count++;
          this.i++;
          if(this.count>=this.Idlelist.length)
              this.count=0;
          //var na=(i+10000).toString()+"_png";
          //console.log("Idle");
          if(this.i==10){
             this.person._role.src=this.Idlelist[this.count];
             this.i=0;
          }
          return true;
        }
}