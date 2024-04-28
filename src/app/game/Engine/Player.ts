import * as PIXI from 'pixi.js';

export default class Player {

    
    private dieTexture =    { name: 'die', frames: 8 };
    private winTexture =    { name: 'win', frames: 8 };
    private moveTexture =   { name: 'run', frames: 9 };
    private climbTexture =  { name: 'climb', frames: 8 };

    public posX: number;
    public posY: number;
    public vX: number = 0;
    public vY: number = 0;
    public containerWidth: number = 38;
    public containerHeight: number = 47;
    public playerScale: number = 1.2;
    public playerCont!: PIXI.Container;
    public playerAnimatedSprite!: PIXI.AnimatedSprite;
    private textures: any;
    
    constructor(posX: number, posY: number, el: any) {
        this.posX = posX;
        this.posY = posY;
        this.playerCont = new PIXI.Container();
        this.playerCont.width = this.containerWidth;
        this.playerCont.height = this.containerHeight;
        this.playerCont.scale.set(this.playerScale);
        this.playerCont.position.x = 0;
        this.playerCont.position.y = this.posY;
        this.playerCont.zIndex=2;
        this.move();
        el.addChild(this.playerCont);
    }

    private move() {
        this.loadTextures(this.moveTexture.name).then(
            () => {
                this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations[this.moveTexture.name]);
                this.playerAnimatedSprite.loop = true;
                this.playerAnimatedSprite.x = 0;
                this.playerAnimatedSprite.animationSpeed = 0.3;
                this.playerCont.addChild(this.playerAnimatedSprite);
            }
        );
    }

    public startMoving() { this.playerAnimatedSprite.play(); }
    public stopMoving()  { this.playerAnimatedSprite.stop(); }
    public startClimbing() { this.climb(); this.playerAnimatedSprite.play(); }
    public stopClimbing()  { this.move(); this.playerAnimatedSprite.stop(); }

    private die() {
        this.loadTextures(this.dieTexture.name).then(
            () => {
                this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations[this.dieTexture.name]);
                this.playerAnimatedSprite.play();
                this.playerAnimatedSprite.loop = true;
                this.playerAnimatedSprite.animationSpeed = 0.3;
                this.playerCont.addChild(this.playerAnimatedSprite);
            }
        );
    }

    private climb () {
        this.loadTextures(this.climbTexture.name).then(
            () => {
                this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations[this.climbTexture.name]);
                this.playerAnimatedSprite.loop = true;
                this.playerAnimatedSprite.x = 0;
                this.playerAnimatedSprite.animationSpeed = 0.3;
            }
        );
    }

    private win () {
        this.loadTextures(this.winTexture.name).then(
            () => {
                this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations[this.winTexture.name]);
                this.playerAnimatedSprite.play();
                this.playerAnimatedSprite.loop = true;
                this.playerAnimatedSprite.x = 50;
                this.playerAnimatedSprite.animationSpeed = 0.3;
                this.playerCont.addChild(this.playerAnimatedSprite);
            }
        );
    }

    private async loadTextures(textureName: string) {
        this.textures = await PIXI.Assets.load(`../../../assets/anims/${textureName}.json`);
    }

}