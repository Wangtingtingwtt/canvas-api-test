class HeroStatusBar extends engine.DisplayObjectContainer {
    background: engine.Bitmap;
    role: engine.Bitmap;
    barname: engine.TextField;
    equipmentField: engine.DisplayObjectContainer;
    propertyField: engine.DisplayObjectContainer;
    container: engine.DisplayObjectContainer;

    constructor() {
        super();
        this.container = new engine.DisplayObjectContainer();
        //this.addChild(this.container);

        this.background = new engine.Bitmap();
        this.scaleX = 1.2;
        this.scaleY = 1.2;
        this.container.addChild(this.background);
        this.role = new engine.Bitmap();
        this.role.x = 30;
        this.role.y = 30;
        this.role.scaleX = 0.7;
        this.role.scaleY = 0.7;
        this.container.addChild(this.role);
        this.barname = new engine.TextField();
        this.barname.color = "0X000000";
        this.barname.y = 240;
        this.barname.x = 50;
        this.container.addChild(this.barname);

        this.equipmentField = new engine.DisplayObjectContainer();
        this.initEquipmentField();
        this.equipmentField.x = 50;
        this.equipmentField.y = 20;
        this.container.addChild(this.equipmentField);

        this.propertyField = new engine.DisplayObjectContainer();
        this.propertyField.x = 120;
        this.propertyField.y = 120;
        this.container.addChild(this.propertyField);


        var returnButton = new engine.Bitmap();
        returnButton.src="/Game/assets/return.png";
        tool.anch(returnButton);
        returnButton.x = 370;
        returnButton.y = 210;
        this.container.addChild(returnButton);

        returnButton.touchEnable = true;
        returnButton.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            this.removeChild(this.container);
        });

    }

    private initPropertyField(hero: Hero) {
        var level = new engine.TextField();
        level.text = "Level:  " + hero.level.toString();
        level.color = "0X000000";
        level.scaleX = 0.7;
        level.scaleY = 0.7;
        this.propertyField.addChild(level);

        var quality = new engine.TextField();
        quality.text = "Quality:  " + heroQualitySort[hero.quality];
        quality.color = "0X000000";
        quality.x = 110;
        quality.scaleX = 0.7;
        quality.scaleY = 0.7;
        this.propertyField.addChild(quality);

        var atk = new engine.TextField();
        atk.text = hero.properties.atkDiscript + hero.Atk.toString();
        atk.color = "0X000000";
        atk.y = 50;
        atk.scaleX = 0.7;
        atk.scaleY = 0.7;
        this.propertyField.addChild(atk);

        var def = new engine.TextField();
        def.text = hero.properties.defDiscript + hero.Def.toString();
        def.color = "0X000000";
        def.x = 110;
        def.y = 50;
        def.scaleX = 0.7;
        def.scaleY = 0.7;
        this.propertyField.addChild(def);

        var FightPower = new engine.TextField();
        FightPower.text = "FighrPower:   " + hero.fightPower.toString();
        FightPower.color = "0X000000";
        FightPower.y = 100;
        FightPower.scaleX = 0.7;
        FightPower.scaleY = 0.7;
        this.propertyField.addChild(FightPower);

    }

    private grids: ObjectGrid[];
    private gridX = 90;
    private gridY = 60;
    private gridOffset = 10;
    private initEquipmentField() {
        this.grids = [];
        for (var i = 0; i < Hero.equipmentLimit; i++) {
            var grid = new ObjectGrid();
            this.grids.push(grid);
        }
        this.grids[0].x = this.gridX;
        this.grids[0].y = this.gridY;
        this.equipmentField.addChild(this.grids[0]);
        for (var i = 1; i < Hero.equipmentLimit; i++) {
            this.grids[i].x = this.grids[i - 1].x + this.grids[i].border.img.width + this.gridOffset;
            this.grids[i].y = this.gridY;
            this.equipmentField.addChild(this.grids[i]);
        }
    }


    setInformation(hero: Hero) {
        this.background.src = "/Game/assets/bg.png";

        this.role.img = hero.properties._bitmap.img;
        tool.anch(this.role);
        this.role.x = 90;
        this.role.y = 160;
        this.barname.text = hero.properties.name;
        this.initPropertyField(hero);

        for (var i = 0; i < hero.equipmentCurrent; i++) {
            this.grids[i].call(hero.equipments[i]);
        }
        for (var i = 0; i < hero.equipmentCurrent; i++) {
            this.grids[i].Tap();
        }
        this.addChild(this.container);
    }

}

class ObjectGrid extends engine.DisplayObjectContainer {
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
        this.content = content;
        this.contentBitmap.img = content.properties._bitmap.texture;
        tool.anch(this.contentBitmap);
        var scale = this.border.img.width / this.contentBitmap.img.width;
        this.contentBitmap.scaleX = scale;
        this.contentBitmap.scaleY = scale;
        //console.log(scale);


    }
    Tap() {
        var details = new Details();
        this.contentBitmap.touchEnable = true;
        this.contentBitmap.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            details.setInformation(this.content);
            //this.addChild(details);
            GameManager.getInstance().UIManager.addLayer(LayerType.DetailLayer, details);
            //this.swapChildren(details,content.parent)
            //console.log("123456789123446587");
        });
    }


}