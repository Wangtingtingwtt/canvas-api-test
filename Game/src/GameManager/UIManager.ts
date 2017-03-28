enum LayerType {
    UILayer,
    DetailLayer
}

class UIManager extends engine.DisplayObjectContainer {

    private UILayer: engine.DisplayObjectContainer;
    private DetailLayer: engine.DisplayObjectContainer;

    constructor() {
        super();
        this.UILayer = new engine.DisplayObjectContainer();
        this.DetailLayer = new engine.DisplayObjectContainer();
        this.addChild(this.UILayer);
        this.addChild(this.DetailLayer);
    }
    public addLayer(whichType: LayerType, addWhat: any) {
        switch (whichType) {
            case LayerType.DetailLayer:
                this.DetailLayer.addChild(addWhat);
                addWhat.x = GameScene.mapOffsetX;
                break;
            case LayerType.UILayer:
                this.UILayer.addChild(addWhat);
                addWhat.x = GameScene.mapOffsetX;
                break;
        }
    }

    public removeLayer(whichType: LayerType, addWhat: any) {
        switch (whichType) {
            case LayerType.DetailLayer:
                this.DetailLayer.addChild(addWhat);
                this.DetailLayer.removeChild(addWhat);
                break;
            case LayerType.UILayer:
                this.UILayer.addChild(addWhat);
                this.UILayer.removeChild(addWhat);
                break;
        }
    }
    public switchIndex(swithchFrom: LayerType, switchTo: LayerType) {
        //this.swapChildren(LayerType,)
        var from = this.find(swithchFrom);
        var to = this.find(switchTo);
        this.swapChildren(from, to);
    }
    private find(temp: LayerType): engine.DisplayObjectContainer {
        var container = new engine.DisplayObjectContainer();
        switch (temp) {
            case LayerType.DetailLayer:
                container = this.DetailLayer;
                break;
            case LayerType.UILayer:
                container = this.UILayer;
                break;
        }
        return container;
    }
}