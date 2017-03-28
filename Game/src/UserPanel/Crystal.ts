class Crystal extends engine.DisplayObjectContainer implements Objectdetail {
    static Id = 0;
    quality: crystalQualitySort;
    properties: Property;
    tempid = 0;
    constructor() {
        super();
        Crystal.Id++;
        this.tempid = Crystal.Id;
        this.properties = new Property();
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer,this.properties._bitmap);
        //this.addChild(this.properties._bitmap);
    }

    getClassName(): String {
        return "Crystal";
    }

    getQualityDescript(): String {
        return crystalQualitySort[this.quality];
    }
    get Atk() {
        return this.properties.initialAtk;
    }
    get Def() {
        return this.properties.initialDef;
    }
    get fightPower() {
        var result = this.properties.initialAtk * 1.2 + this.properties.initialDef * 0.8;
        return result;
    }
    setinformation(id: string, atk: number, def: number, name: string, bitmap: engine.Bitmap) {
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
    }

}