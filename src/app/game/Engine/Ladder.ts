import * as PIXI from 'pixi.js';

export default class Ladder {

    private posX: number;
    private posY: number;
    public ladderCont!: PIXI.Container;
    public ladderSprite!: PIXI.Sprite;
    private textureURL: string = '../../../assets/ladder.png';
    
    constructor(posX: number, posY: number, el: any) {
        this.posX = posX;
        this.posY = posY;
        this.init(el);
    }

    public async init(el: any) {
        this.ladderCont = new PIXI.Container();
        this.ladderCont.position.x = this.posX;
        this.ladderCont.position.y = this.posY;
        const texture = await PIXI.Assets.load(this.textureURL);
        this.ladderSprite = new PIXI.Sprite(texture);
        this.ladderCont.scale = 0.5;
        this.ladderCont.zIndex=1;
        this.ladderCont.addChild(this.ladderSprite);
        el.addChild(this.ladderCont);
    }

}