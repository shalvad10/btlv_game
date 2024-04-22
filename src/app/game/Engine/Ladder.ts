import * as PIXI from 'pixi.js';

export default class Ladder {

    private posX: number;
    private posY: number;
    private textureURL: string = '../../../assets/ladder.png';
    
    constructor(posX: number, posY: number, el: any) {
        this.posX = posX;
        this.posY = posY;
        this.init(el);
    }

    public async init(el: any) {
        const ladderCont = new PIXI.Container();
        ladderCont.position.x = this.posX;
        ladderCont.position.y = this.posY;
        const texture = await PIXI.Assets.load(this.textureURL);
        const ladderSprite = new PIXI.Sprite(texture);
        ladderSprite.anchor.set(0.5);
        ladderCont.scale = 0.4;
        ladderCont.zIndex=0;
        ladderCont.addChild(ladderSprite);
        el.addChild(ladderCont);
    }

}