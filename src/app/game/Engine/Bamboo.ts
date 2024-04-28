import * as PIXI from 'pixi.js';

export default class Bamboo {

    private posX: number;
    private posY: number;
    private textureURL: string = '../../../assets/bamboo.png';
    private bambooCont!: PIXI.Container;
    private bambooSprite!: PIXI.Sprite;

    private textures: any;
    private bombAnimationSprite!: PIXI.AnimatedSprite;
    
    constructor(posX: number, posY: number, el: any) {
        this.posX = posX;
        this.posY = posY;
        console.warn(el)
        this.init(el);
    }

    public async init(el: any) {
        const maskCont = this.initMaskContainer(el);
        this.bambooCont = new PIXI.Container();
        this.bambooCont.position.x = this.posX;
        this.bambooCont.position.y = this.posY;
        const texture = await PIXI.Assets.load(this.textureURL);
        this.bambooSprite = new PIXI.Sprite(texture);
        this.bambooSprite.anchor.set(1);
        this.bambooCont.scale = 0.25;
        this.bambooCont.addChild(this.bambooSprite);
        this.initBomb(this.bambooCont);
        maskCont.addChild(this.bambooCont);
        setTimeout(() => {
            // this.setupAnimation();
        }, 5000);
    }
    public initMaskContainer(el: any) {
        let mask = new PIXI.Graphics().rect(30,-20,90,110).fill(0xff0000);
        mask.visible = true;
        let maskContainer = new PIXI.Container();
        maskContainer.mask = mask;
        maskContainer.zIndex = 1;
        maskContainer.position.set(4,4);
        el.addChild(maskContainer);
        return maskContainer;
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


    setupAnimation() {
        let destinationY = 100;
        
        const ticker = PIXI.Ticker.shared;
        let duration = 60; // 60 frames at 60 frames per second (1 second)
        let velocityY = (destinationY - this.bambooCont.y) / duration;
        let currentEl = this.bambooCont;

        ticker.add(update);
 
        ticker.start();
    
        function update() {
            currentEl.y += velocityY;
            if (Math.abs(currentEl.y - destinationY) < 1) {
                    ticker.remove(update);
                    destinationY = 0;
                }
        }       
    }

}