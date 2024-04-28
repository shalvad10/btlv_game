import * as PIXI from 'pixi.js';

export default class Bamboo {

    private posX: number;
    private posY: number;
    private textureURL: string = '../../../assets/bamboo.png';
    public bambooCont!: PIXI.Container;
    private spritesCont!: PIXI.Container;
    private bambooSprite!: PIXI.Sprite;
    private direction: number = 1;
    private ticker = PIXI.Ticker.shared;
    public update: any;

    private textures: any;
    private bombAnimationSprite!: PIXI.AnimatedSprite;
    
    constructor(posX: number, posY: number, el: any) {
        this.posX = posX;
        this.posY = posY;
        this.init(el);
    }

    public async init(el: any) {
        this.bambooCont = new PIXI.Container();
        this.bambooCont.position.x = this.posX;
        this.bambooCont.position.y = this.posY;
        this.bambooCont.zIndex = 0;
        this.spritesCont = new PIXI.Container();
        const texture = await PIXI.Assets.load(this.textureURL);
        this.bambooSprite = new PIXI.Sprite(texture);
        this.bambooSprite.anchor.set(1);
        this.bambooCont.scale = 0.25;
        this.bambooCont.addChild(this.spritesCont);
        this.spritesCont.addChild(this.bambooSprite);
        this.initBomb(this.spritesCont);
        el.addChild(this.bambooCont);
        this.initMaskContainer(this.bambooCont);
        setInterval(() => {
            this.setupAnimation();
        }, 3000);
    }
    public initMaskContainer(el: any) {
        const mask = new PIXI.Graphics().rect(-this.bambooSprite.width,50,this.bambooSprite.width,this.bambooSprite.height + 60).fill(0x2c3e50);
        el.addChild(mask);
        el.mask = null;
    }

    public initBomb(el: any) {
        this.loadTextures('bomb').then(
            () => {
                this.bombAnimationSprite = new PIXI.AnimatedSprite(this.textures.animations['bomb-anim']);
                // this.bombAnimationSprite.play();
                this.bombAnimationSprite.loop = true;
                this.bombAnimationSprite.x = -115;
                this.bombAnimationSprite.y = -325;
                this.bombAnimationSprite.scale.set(0.9);
                this.bombAnimationSprite.animationSpeed = 0.3;
                el.addChild(this.bombAnimationSprite);
            }
        );
    }

    private async loadTextures(textureName: string) {
        this.textures = await PIXI.Assets.load(`../../../assets/anims/${textureName}.json`);
    }

    public stopAnimation() {
        this.ticker.remove(this.update);
    }

    setupAnimation() {
        let destinationY = this.spritesCont.position.y + (230 * this.direction);
        
        let duration = 120; // 60 frames at 60 frames per second (1 second)
        let velocityY = (destinationY - this.spritesCont.position.y) / duration;
        let currentEl = this.spritesCont;

        let changeDirection = () => {
            this.direction = -this.direction;
        }

        let thisTicker = () => {
            return this.ticker;
        }
    
        this.update = () => {
            currentEl.y += velocityY;
            if (Math.abs(currentEl.y - destinationY) < 1) {
                thisTicker().remove(this.update);
                    changeDirection();
                }
        }

        this.ticker.add(this.update);
 
        this.ticker.start();     
    }

}