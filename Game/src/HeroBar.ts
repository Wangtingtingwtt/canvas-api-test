class HeroBar extends engine.DisplayObjectContainer {
    background: engine.Bitmap;
    container: engine.DisplayObjectContainer;

    constructor() {
        super();
        this.container = new engine.DisplayObjectContainer();
        //this.addChild(this.container);

        this.background = new engine.Bitmap();
        this.scaleX = 1.2;
        this.scaleY = 1.2;
        this.container.addChild(this.background);

        var returnButton = new engine.Bitmap();
        returnButton.src = "/Game/assets/return.png";
        tool.anch(returnButton);
        returnButton.x = 370;
        returnButton.y = 210;
        this.container.addChild(returnButton);

        returnButton.touchEnable = true;
        returnButton.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            this.removeChild(this.container);
        });
        this.inithero();
    }
    private grids: HeroGrid[];
    private gridX = 90;
    private gridY = 120;
    private gridOffset = 20;
    private inithero() {
        this.grids = [];
        for (var i = 0; i < User.heroesInTeamLimit; i++) {
            var grid = new HeroGrid();
            this.grids.push(grid);
        }
        this.grids[0].x = this.gridX;
        this.grids[0].y = this.gridY;
        this.grids[0].scaleY = 1.8;
        this.grids[0].scaleX = 1.2;
        this.container.addChild(this.grids[0]);
        for (var i = 1; i < User.heroesInTeamLimit; i++) {
            this.grids[i].scaleY = 1.8;
            this.grids[i].scaleX = 1.2;
            this.grids[i].x = this.grids[i - 1].x + this.grids[i].border.img.width + this.gridOffset;
            this.grids[i].y = this.gridY;
            this.container.addChild(this.grids[i]);
        }
    }


    setInformation(user: User) {
        this.background.src = "/Game/assets/bg.png";
        for (var i = 0; i < User.heroesInTeamLimit; i++) {
            this.grids[i].call(user.heroesInTeam[i]);
        }
        for (var i = 0; i < User.heroesInTeamLimit; i++) {
            this.grids[i].Tap(user.heroesInTeam[i]);
        }
        this.addChild(this.container);
    }

}

class HeroGrid extends engine.DisplayObjectContainer {
    border: engine.Bitmap;

    contentBitmap: engine.Bitmap;

    content: any;
    constructor() {
        super();
        this.border = new engine.Bitmap();
        this.addChild(this.border);
        this.contentBitmap = new engine.Bitmap();
        this.addChild(this.contentBitmap);
        this.border.src = "/Game/assets/Border.png";
        tool.anch(this.border);
    }
    call(content: any) {
        if (content == null) { return; }
        this.content = content;
        this.contentBitmap.img = content.properties._bitmap.texture;
        tool.anch(this.contentBitmap);
        var scale = this.border.img.width / this.contentBitmap.img.width;
        this.contentBitmap.scaleX = scale;
        this.contentBitmap.scaleY = scale;
        this.border.src = "/Game/assets/null.png";
    }
    Tap(hero: Hero) {
        var heroStatusBar = new HeroStatusBar();
        this.contentBitmap.touchEnable = true;
        this.contentBitmap.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            heroStatusBar.setInformation(hero);
            GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, heroStatusBar);
        });
    }


}