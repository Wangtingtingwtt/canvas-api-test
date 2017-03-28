class Equipment extends engine.DisplayObjectContainer implements Objectdetail {
    static Id = 0;
    quality: equipmentQualitySort;
    crystals: Crystal[];
    static crystalsLimit = 5;
    crystalsCurrent = 0;
    properties: Property;
    getClassName(): String {
        return "Equipment";
    }

    getQualityDescript(): String {
        return equipmentQualitySort[this.quality];
    }

    get Atk() {
        var result = 0;
        this.crystals.forEach(crystal => result += crystal.Atk)
        switch (this.quality) {
            case equipmentQualitySort.Common:
                result = result * 0.8;
                break;
            case equipmentQualitySort.Rare:
                result = result * 0.9;
                break;
            case equipmentQualitySort.Epic:
                result = result * 1.0;
                break;
            case equipmentQualitySort.Story:
                result = result * 1.2;
                break;
        }
        result += this.properties.initialAtk;
        return result;
    }
    get Def() {
        var result = 0;
        this.crystals.forEach(crystal => result += crystal.Def)
        switch (this.quality) {
            case equipmentQualitySort.Common:
                result = result * 0.8;
                break;
            case equipmentQualitySort.Rare:
                result = result * 0.9;
                break;
            case equipmentQualitySort.Epic:
                result = result * 1.0;
                break;
            case equipmentQualitySort.Story:
                result = result * 1.2;
                break;
        }
        result += this.properties.initialDef;
        return result;
    }
    // private _cacheEquipmentFightPower = 0;

    get fightPower() {
        var result = this.Atk * 1.2 + this.Def * 0.8;
        return result;
    }
    tempid = 0;
    constructor() {
        super();
        this.crystals = [];
        Equipment.Id++;
        this.tempid = Equipment.Id;
        this.properties = new Property();
        GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, this.properties._bitmap);
        // this.addChild(this.properties._bitmap);
    }
    setinformation(id: string, atk: number, def: number, name: string, quality: equipmentQualitySort, bitmap: engine.Bitmap) {
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
        this.quality = quality;
    }
    addCrystal(user: User, crystal: Crystal) {
        if (this.crystalsCurrent > Equipment.crystalsLimit)
            console.error("宝石超过上限，不能镶嵌");
        else {
            this.crystals.push(crystal);
            user.flag = true;
            this.crystalsCurrent++;
        }
    }
    removeCrystal(user: User, crystal: Crystal) {
        if (this.crystalsCurrent < 0)
            console.error(this.properties.name + "没有宝石，不能卸载");
        else {
            var index = this.crystals.indexOf(crystal);
            this.crystals.splice(index);
            user.flag = true;
            this.crystalsCurrent--;
        }
    }
}

