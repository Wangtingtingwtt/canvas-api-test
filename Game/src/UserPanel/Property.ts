class Property {
    configId: string;
    identityID: number = 0;
    name: string;
    initialAtk: number = 0;
    initialDef: number = 0;
    _bitmap: engine.Bitmap;
    get atkDiscript() {
        return "ATK:   ";
    }

    get defDiscript() {
        return "DEF:   ";
    }
    constructor() {
        this._bitmap = new engine.Bitmap();
        this._bitmap = new engine.Bitmap();
        this._bitmap.scaleX = 1.5;
        this._bitmap.scaleY = 1.5;
        this._bitmap.x = 0;
        this._bitmap.y = 0;
    }
    setInformation(configId: string, identityID: number,
                     name: string, initialAtk: number,
                     initialDef: number, _bitmap: engine.Bitmap) {
        this.configId = configId;
        this.identityID = identityID;
        this.name = name;
        this.initialAtk = initialAtk;
        this.initialDef = initialDef;
        this._bitmap.img = _bitmap.img;
        tool.anch(this._bitmap);
    }
}