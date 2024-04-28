import * as PIXI from 'pixi.js';
import Bamboo from './Bamboo';

export default class Ground {

    private posX!: number;
    private posY!: number;
    public groundCont!: PIXI.Container;
    private textureURL: string = '../../../assets/ground.png';
    public groundIndex!: number;

    constructor(posX: number, posY: number, index: number, el: any) {
        this.groundIndex = index;
        this.posX = posX;
        this.posY = posY;
        this.init(el);
    }
    

    public async init(el: any) {
        this.groundCont = new PIXI.Container();
        this.groundCont.position.x = this.posX;
        this.groundCont.position.y = this.posY;
        this.groundCont.zIndex = 0;
        const texture = await PIXI.Assets.load(this.textureURL);
        const groundSprite = new PIXI.Sprite(texture);
        groundSprite.width = 910;
        groundSprite.scale.y = 0.7;
        this.groundCont.addChild(groundSprite);
        el.addChild(this.groundCont);
    }
}