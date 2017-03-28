class Details extends engine.DisplayObjectContainer {
    background: engine.Bitmap;
    role: engine.Bitmap;
    contentField: engine.DisplayObjectContainer;
    constructor() {
        super();
        this.contentField = new engine.DisplayObjectContainer();
    }
    setInformation(content: any) {

        var background = new engine.Bitmap();
        background.src="/Game/assets/detailbg.png";
        background.scaleX = 1.2;
        background.scaleY = 1.3;
        background.y = 190;
        background.x = 220;
        //tool.anch(background);
        this.contentField.addChild(background);

        this.role = new engine.Bitmap()
        this.role = content.properties._bitmap;
        this.role.x=150;
        this.role.y=200;
        this.contentField.addChild(this.role);

        var quality = new engine.TextField();
        quality.text = "Quality:  " + content.getQualityDescript();
        quality.color = "0X000000";
        quality.x = 220;
        quality.y = 350;
        quality.scaleX = 0.7;
        quality.scaleY = 0.7;
        this.contentField.addChild(quality);

        var atk = new engine.TextField();
        atk.text = content.properties.atkDiscript + content.Atk.toString();
        atk.color = "0X000000";
        atk.x = 220;
        atk.y = 200;
        atk.scaleX = 0.7;
        atk.scaleY = 0.7;
        this.contentField.addChild(atk);

        var def = new engine.TextField();
        def.text = content.properties.defDiscript + content.Def.toString();
        def.color = "0X000000";
        def.x = 220;
        def.y = 250;
        def.scaleX = 0.7;
        def.scaleY = 0.7;
        this.contentField.addChild(def);

        var FightPower = new engine.TextField();
        FightPower.text = "FighrPower:   " + content.fightPower.toString();
        FightPower.color = "0X000000";
        FightPower.x = 220;
        FightPower.y = 300;
        FightPower.scaleX = 0.7;
        FightPower.scaleY = 0.7;
        this.contentField.addChild(FightPower);

        var returnButton = new engine.Bitmap();
        returnButton.src="/Game/assets/return.png";
        tool.anch(returnButton);
        returnButton.x = 370;
        returnButton.y = 210;
        this.contentField.addChild(returnButton);


        //LayoutController.getIntance().addLayer(LayerType.DetailLayer, this.contentField);
        this.addChild(this.contentField);

        returnButton.touchEnable = true;
        returnButton.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            this.removeChild(this.contentField);
        });
    }
}