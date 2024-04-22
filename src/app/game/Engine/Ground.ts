import * as PIXI from 'pixi.js';

export default class Ground {

    private posX!: number;
    private posY!: number;
    private groundCont!: PIXI.Container;
    private textureURL: string = '../../../assets/ground.png';

    constructor(posX: number, posY: number, el: any) {
        this.posX = posX;
        this.posY = posY;
        this.init(el);
    }
    

    public async init(el: any) {
        this.groundCont = new PIXI.Container();
        this.groundCont.width = 100;
        this.groundCont.height = 100;
        this.groundCont.position.x = this.posX;
        this.groundCont.position.y = this.posY;
        this.groundCont.zIndex=0;
        const texture = await PIXI.Assets.load(this.textureURL);
        const groundSprite = new PIXI.Sprite(texture);
        groundSprite.width = window.innerWidth/2 + 10;
        groundSprite.scale.y = 0.7;
        this.groundCont.addChild(groundSprite);
        el.addChild(this.groundCont);
    }
}