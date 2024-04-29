import * as PIXI from 'pixi.js';

export default class Player {

    public posX: number;
    public posY: number;
    public isAlive: boolean = true;
    public wonGame: boolean = false;
    public isClimbing: boolean = false;
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

    public startMoving() { this.playerAnimatedSprite?.play(); }
    public stopMoving()  { this.playerAnimatedSprite?.stop(); }
    public startClimbing() { if(this.isClimbing == false) this.climb(); }
    public stopClimbing()  {
        this.isClimbing = false;
        this.playerAnimatedSprite.stop();
        this.playerCont.removeChild(this.playerAnimatedSprite);
        if(this.wonGame == false) this.move();
    }
    public playerWon()  { this.win(); }
    public playerDied() {
        this.playerAnimatedSprite.stop();
        this.playerCont.removeChild(this.playerAnimatedSprite);
        setTimeout(() => {
            this.die();
        }, 10);
    }

    private move() {
        this.loadTextures('run').then(
            () => {
                setTimeout( () => {
                    this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations['run']);
                    this.playerAnimatedSprite.loop = true;
                    this.playerAnimatedSprite.animationSpeed = 0.3;
                    this.playerCont.addChild(this.playerAnimatedSprite);
                },10);
            }
        );
    }

    private die() {
        this.playerCont.removeChild(this.playerAnimatedSprite);
        this.isAlive = false;
            this.loadTextures('die').then(
                () => {
                    setTimeout( () => {
                        this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations['die']);
                        this.playerAnimatedSprite.play();
                        this.playerAnimatedSprite.loop = false;
                        this.playerAnimatedSprite.animationSpeed = 0.3;
                        this.playerCont.addChild(this.playerAnimatedSprite);
                    },10);
                }
            );
    }

    private climb () {
        this.playerCont.removeChild(this.playerAnimatedSprite);
        this.isClimbing = true;
        this.loadTextures('climb').then(
            () => {
                setTimeout( () => {
                    this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations['climb']);
                    this.playerAnimatedSprite.play();
                    this.playerAnimatedSprite.loop = true;
                    this.playerAnimatedSprite.animationSpeed = 0.3;
                    this.playerCont.addChild(this.playerAnimatedSprite);
                },10);
            }
        );
    }

    private win () {
        this.playerCont.removeChild(this.playerAnimatedSprite);
        this.wonGame = true;
        this.loadTextures('win').then(
            () => {
                setTimeout( () => {
                    this.playerAnimatedSprite = new PIXI.AnimatedSprite(this.textures.animations['win']);
                    this.playerAnimatedSprite.play();
                    this.playerAnimatedSprite.loop = true;
                    this.playerAnimatedSprite.animationSpeed = 0.3;
                    this.playerCont.addChild(this.playerAnimatedSprite);
                },10);
            }
        );
    }

    private async loadTextures(textureName: string) {
        this.textures = await PIXI.Assets.load(`../../../assets/anims/${textureName}.json`);
    }

}