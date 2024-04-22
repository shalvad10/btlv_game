import * as PIXI from 'pixi.js';

export default class Player {

    
    private dieTexture =    { name: 'die', frames: 8 };
    private winTexture =    { name: 'win', frames: 8 };
    private moveTexture =   { name: 'run', frames: 9 };
    private climbTexture =  { name: 'climb', frames: 8 };

    private posX: number;
    private posY: number;
    private playerCont!: PIXI.Container;
    private playerAnimatedSprite!: PIXI.AnimatedSprite;
    private textures: any;
    
    constructor(posX: number, posY: number, el: any) {
        this.posX = posX;
        this.posY = posY;
        this.init(el).then(
            () => {
                this.win();
                this.die();
                this.climb();
                this.move();
            }
        );
    }

    public async init(el: any) {
        this.playerCont = new PIXI.Container();
        this.playerCont.width = 100;
        this.playerCont.height = 100;
        this.playerCont.position.x = this.posX;
        this.playerCont.position.y = this.posY;
        this.playerCont.zIndex=1;
        el.addChild(this.playerCont);
    }


    public move() {
        this.loadTextures(this.moveTexture.name).then(
            () => {
                this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations[this.moveTexture.name]);
                this.playerAnimatedSprite.play();
                this.playerAnimatedSprite.loop = true;
                this.playerAnimatedSprite.x = 150;
                this.playerAnimatedSprite.animationSpeed = 0.3;
                this.playerCont.addChild(this.playerAnimatedSprite);
            }
        );
    }

    public async die() {
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

    public climb () {
        this.loadTextures(this.climbTexture.name).then(
            () => {
                this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations[this.climbTexture.name]);
                this.playerAnimatedSprite.play();
                this.playerAnimatedSprite.loop = true;
                this.playerAnimatedSprite.x = 100;
                this.playerAnimatedSprite.animationSpeed = 0.3;
                this.playerCont.addChild(this.playerAnimatedSprite);
            }
        );
    }

    public win () {
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