class TileMap extends engine.DisplayObjectContainer {

    public MapSize = 100;
    public _grid: Grid;
    public _astar: Astar;
    constructor() {
        super();
        //this._grid= new Grid(10,10);
        //this._astar=new Astar(this._grid);
        //this.Create();
    }

    private MapInfomation = [
        { x: 0, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 0, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 0, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 0, y: 3, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 0, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 0, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 0, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 0, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 0, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 0, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },

        { x: 1, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 1, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 1, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 1, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 1, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 1, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 1, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 1, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 1, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 1, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },

        { x: 2, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 2, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 2, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 2, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 2, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 2, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 2, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 2, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 2, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 2, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },


        { x: 3, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 3, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 3, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 3, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 3, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 3, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 3, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 3, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 3, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 3, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },

        { x: 4, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 4, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 4, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 4, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 4, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 4, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 4, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 4, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 4, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 4, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },

        { x: 5, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 5, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 5, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 5, y: 3, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 5, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 5, y: 5, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 5, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 5, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 5, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 5, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },

        { x: 6, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 6, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 6, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 6, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 6, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 6, y: 5, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 6, y: 6, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 6, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 6, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 6, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },


        { x: 7, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 1, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 7, y: 4, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 7, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 7, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 7, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },

        { x: 8, y: 0, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 8, y: 1, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 8, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 8, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 8, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 8, y: 5, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 8, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 8, y: 7, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 8, y: 8, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 8, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },

        { x: 9, y: 0, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 9, y: 1, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 9, y: 2, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 9, y: 3, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 9, y: 4, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 9, y: 5, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 9, y: 6, WalkAble: true, image: "/Game/assets/road.jpg" },
        { x: 9, y: 7, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 9, y: 8, WalkAble: false, image: "/Game/assets/water.jpg" },
        { x: 9, y: 9, WalkAble: true, image: "/Game/assets/road.jpg" },
    ];
    public Create() {
        this._grid = new Grid(10, 10);
        var Container = new engine.DisplayObjectContainer();
        for (var i = 0; i < this.MapInfomation.length; i++) {
            var date = this.MapInfomation[i];
            var tile = new Tile(date, this.MapSize, this._grid);
            this.addChild(tile)
        }
        // this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:egret.TouchEvent)=>{
        //     var x=Math.floor(e.stageX/this.MapSize);
        //     var y=Math.floor(e.stageY/this.MapSize);
        //     console.log("鼠标点击点xx:"+x+"yy"+y)
        // },this)
        this._astar = new Astar(this._grid);
        //console.log("AstarCreate");
    }

}


interface TileDate {
    x: number;
    y: number;
    WalkAble: boolean;
    image: string;
}

class Tile extends engine.DisplayObjectContainer {
    date: TileDate;
    MapSize: number;
    constructor(Date: TileDate, mapsize: number, grid: Grid) {
        super();
        this.date = Date;
        this.MapSize = mapsize;
        var Bitmap = new engine.Bitmap();
        Bitmap.src = Date.image;
        Bitmap.x = Date.x * this.MapSize;
        Bitmap.y = Date.y * this.MapSize;
        grid.setWalkAble(Date.x, Date.y, Date.WalkAble);
        this.addChild(Bitmap);
        //grid.OuttoConsole();
    }

}