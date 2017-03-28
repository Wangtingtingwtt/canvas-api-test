class Walk implements State {
      private Walklist: string[];
      private Walkcount = -1;
      private person: Role;
      private i: number = 0;
      public constructor(pperson: Role, walk: string[]) {
            this.person = pperson;
            this.Walklist = walk;
      }
      onEnter() {
            engine.startTick(this.PlayWalk);
            //           console.log("EnterWalk");
      }

      onExit() {

            engine.stopTick(this.PlayWalk);
      }
      private PlayWalk(): boolean {
            this.Walkcount++;
            this.i++;
            if (this.Walkcount >= this.Walklist.length)
                  this.Walkcount = 0;
            if (this.i == 10) {
                  this.person._role.src = this.Walklist[this.Walkcount];
                  this.i = 0;
            }
            //  console.log("Walk");
            //  console.log(this.Walklist[this.Walkcount]);
            return true;
      }
}