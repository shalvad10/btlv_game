import * as PIXI from 'pixi.js';

export default class Bamboo {

    public posX: number;
    public posY: number;
    private textureURL: string = '../../../assets/bamboo.png';
    public bambooCont!: PIXI.Container;
    private spritesCont!: PIXI.Container;
    private bambooSprite!: PIXI.Sprite;
    private direction: number = 1;
    public isUp: boolean = true;
    public bombExploded: boolean = false;
    private ticker = new PIXI.Ticker;
    public update: any;
    public groundIndex!: number;

    private textures: any;
    private bombAnimationSprite!: PIXI.AnimatedSprite;
    
    constructor(posX: number, posY: number, groundIndex: number, el: any) {
        this.groundIndex = groundIndex;
        this.posX = posX;
        this.posY = posY;
        this.init(el);
    }

    public async init(el: any) {
        this.bambooCont = new PIXI.Container();
        this.bambooCont.position.x = this.posX;
        this.bambooCont.position.y = this.posY;
        this.bambooCont.zIndex = -1;
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
                this.bombAnimationSprite.loop = false;
                this.bombAnimationSprite.x = -115;
                this.bombAnimationSprite.y = -325;
                this.bombAnimationSprite.scale.set(0.9);
                this.bombAnimationSprite.animationSpeed = 0.3;
                el.addChild(this.bombAnimationSprite);
            }
        );
    }

    public explodeBomb() {
        this.bombExploded = true;
        this.bombAnimationSprite.play();
        this.spritesCont.position.y = 0;
        setTimeout(() => {
            if (this.ticker) {
                this.ticker.stop();
                this.ticker.destroy();
            }
        }, 10);
    }

    private async loadTextures(textureName: string) {
        this.textures = await PIXI.Assets.load(`../../../assets/anims/${textureName}.json`);
    }

    setupAnimation() {
        let destinationY = this.spritesCont.position.y + (230 * this.direction);
        
        let duration = 120; // 60 frames at 60 frames per second (1 second)
        let velocityY = (destinationY - this.spritesCont.position.y) / duration;
        let currentEl = this.spritesCont;

        let changeDirection = () => {
            this.direction = -this.direction;
        }
        let changeHeight = (val: boolean) => {
            this.isUp = val;
        }

        let thisTicker = () => {
            return this.ticker;
        }
    
        this.update = () => {
            currentEl.y += velocityY;
            if (this.direction > 0) {
                if (destinationY - currentEl.y < destinationY - Math.abs(currentEl.y / 2) && this.isUp !== false) {
                    changeHeight(false);
                }
            } else {
                if (currentEl.y - destinationY > currentEl.y - Math.abs(destinationY / 2) && this.isUp !== true) {
                    changeHeight(true);
                }
            }
            if (Math.abs(currentEl.y - destinationY) < 1) {
                thisTicker().remove(this.update);
                changeDirection();
            }
        }

        if (this.ticker && !this.bombExploded) {
            this.ticker.add(this.update);
     
            this.ticker.start(); 
        }    
    }

}