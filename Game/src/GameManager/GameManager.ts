class GameManager {
    public static instance:GameManager;// = new LayoutController;
    private static count = 0;
    secneManager: SecneManager;
    UIManager: UIManager;
    effectManager: EffectManager;
    constructor() {
        GameManager.count++;
        if (GameManager.count > 1)
            throw 'singleton!!';
        this.secneManager = new SecneManager();
        this.UIManager = new UIManager();
        this.effectManager = new EffectManager();
    }
    public static getInstance() {
        if (this.instance == null)
            this.instance = new GameManager();
        return this.instance;
    }

}



class EffectManager {
    constructor() { }

}