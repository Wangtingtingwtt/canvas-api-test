// var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
//     const getter = desc.get;
//     desc.get = function () {
//         //console.log(target);//引用时的类
//         //console.log(propertyName)//接下来的函数
//         //console.log(this);
//         if (this["fightHeroPowerCache"] != null && !this["flag"]) {
//             return this["fightHeroPowerCache"];
//         } else {
//             this["fightHeroPowerCache"] = getter.apply(this);
//             //return getter.apply(this);
//         }
//         //console.log(this["fightHeroPowerCache"]);
//         return this["fightHeroPowerCache"];
//     }
//     return desc;
// }

class Hero extends engine.DisplayObjectContainer implements Objectdetail {
    static Id = 0;
    exp: Bignumber;
    level: number = 0;
    physique: number = 0;//体质
    properties: Property;

    getClassName() { return "Hero"; }

    getQualityDescript() { return heroQualitySort[this.quality]; }

    // getAtkDiscript(){return this.properties.atkDiscript;}

    // getDefDiscript(){return this.properties.defDiscript;}

    get maxHP() {
        var maxhp: number;
        switch (this.quality) {
            case heroQualitySort.A:
                maxhp = this.physique * 0.7;
                break;
            case heroQualitySort.B:
                maxhp = this.physique * 0.6;
                break;
            case heroQualitySort.C:
                maxhp = this.physique * 0.5;
                break;
            case heroQualitySort.S:
                maxhp = this.physique * 0.8;
                break;
        }
        return maxhp;
    }
    get Atk() {
        var atk = 0;
        switch (this.quality) {
            case heroQualitySort.A:
                atk = this.properties.initialAtk + this.level * 0.7;
                break;
            case heroQualitySort.B:
                atk = this.properties.initialAtk + this.level * 0.6;
                break;
            case heroQualitySort.C:
                atk = this.properties.initialAtk + this.level * 0.5;
                break;
            case heroQualitySort.S:
                atk = this.properties.initialAtk + this.level * 0.8;
                break;
        }
        this.equipments.forEach(equipment => atk += equipment.Atk);
        return atk;
    }
    get Def() {
        var def = 0;
        switch (this.quality) {
            case heroQualitySort.A:
                def = this.properties.initialDef + this.level * 0.7;
                break;
            case heroQualitySort.B:
                def = this.properties.initialDef + this.level * 0.6;
                break;
            case heroQualitySort.C:
                def = this.properties.initialDef + this.level * 0.5;
                break;
            case heroQualitySort.S:
                def = this.properties.initialDef + this.level * 0.8;
                break;
        }
        this.equipments.forEach(equipment => def += equipment.Def);
        return def;
    }
    quality: heroQualitySort;
    static equipmentLimit = 5;
    equipmentCurrent = 0;
    equipments: Equipment[];

    isInTeam: boolean;

    // get Atk() {
    //     var result = 0;
    //     this.equipments.forEach(equipment => result += equipment.Atk)
    //     return result;
    // }
    private _cacheHeroFightPower = 0;
    public flag: boolean = false;
    // @Cache
    get fightPower() {
        var result = this.Atk * 1.2 + this.Def * 0.8;//攻击防御已经计算到hero中了
        return result;
    }

    constructor() {
        super();
        this.exp = new Bignumber();
        this.isInTeam = false;
        this.equipments = [];
        Hero.Id++;
        this.properties = new Property();
        this.tempid = Hero.Id;
        //LayoutController.getIntance().addLayer(LayerType.UILayer, this.properties._bitmap);
        this.addChild(this.properties._bitmap);
    }
    tempid = 0;
    setinformation(id: string, name: string, atk: number, def: number, quality: heroQualitySort, bitmap: engine.Bitmap) {
        this.properties.setInformation(id, this.tempid, name, atk, def, bitmap);
        this.quality = quality;
        this.properties._bitmap.touchEnable = true;
        var heroStatusBar = new HeroStatusBar();

        this.properties._bitmap.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            heroStatusBar.setInformation(this);
            heroStatusBar.x = 100;
            heroStatusBar.y = 100;
            GameManager.getInstance().UIManager.addLayer(LayerType.UILayer, heroStatusBar);
            //console.log("点击人物");
            //this.addChild(heroBar);
            //this.swapChildren(heroBar,this._bitmap);
        });
    }
    addEquipment(user: User, equipment: Equipment) {
        if (this.equipmentCurrent < Hero.equipmentLimit) {
            this.equipments.push(equipment);
            user.flag = true;
            this.flag = true;
            this.equipmentCurrent++;
        } else {
            console.error("装备超过上限");
        }

    }
    removeEquipment(user: User, equipment: Equipment) {
        if (this.equipmentCurrent <= 0)
            console.error("没有装备可以卸载");
        else {
            var index = this.equipments.indexOf(equipment);
            this.equipments.splice(index);
            user.flag = true;
            this.flag = true;
        }
    }

}

