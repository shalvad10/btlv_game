import * as PIXI from 'pixi.js';
import Player from './Player';
import Ladder from './Ladder';
import Ground from './Ground';
import Bamboo from './Bamboo';

export default class Game {

    public game!: PIXI.Application;
    public player!: Player;
    public ladder!: Ladder;
    public grounds: Ground[] = [];
    public ladders: Ladder[] = [];
    public bamboos: Bamboo[] = [];
    public activeGroundIndex: number = 0;
    private moveSpeed: number = 2;
    private jumpSpeed: number = 2;

    private groundsArr: any[] = [
        { x: 0, y: 570 },
        { x: 0, y: 450 },
        { x: 0, y: 330 },
        { x: 0, y: 210 },
        { x: 0, y: 90 },
    ];

    constructor(el: HTMLElement) {
        this.init(el);
    }

    public async init(el: HTMLElement) {
        this.game = new PIXI.Application();
            await this.game.init({
                width: 900,
                height: 600,
                backgroundColor: 0x2c3e50
        });            

        el.appendChild(this.game.canvas);
        this.generateComponents();
        this.game.ticker.add(this.downPlayer, this);
        this.game.ticker.start();
        document.addEventListener('keydown', (ev: any) => { 
            if (this.player.isAlive == false || this.player.wonGame) return;
            if (ev.key == 'ArrowLeft') {
                if(this.player.isClimbing) return;
                if (this.player.playerCont.position.x <= 0) { this.player.vX = 0; this.player.stopMoving(); return; }
                this.player.vX = -this.moveSpeed;
                this.player.vY = 0;
                if (this.player.playerAnimatedSprite!.scale.x > 0) {
                    this.player.playerAnimatedSprite!.scale.x *= -1;
                    this.player.playerAnimatedSprite!.position.x += this.player.playerAnimatedSprite!.width;
                }
                this.player.startMoving();
                this.game.ticker.add(this.movePlayer, this);
            } else if (ev.key == 'ArrowRight') {
                if(this.player.isClimbing) return;
                if (this.player.playerCont.position.x + this.player.playerCont.width >= this.game.stage.width) { this.player.vX = 0; this.player.stopMoving(); return; }
                this.player.vX = this.moveSpeed;
                this.player.vY = 0;
                if (this.player.playerAnimatedSprite!.scale.x < 0 ) {
                    this.player.playerAnimatedSprite!.scale.x *= -1;
                    this.player.playerAnimatedSprite!.position.x -= this.player.playerAnimatedSprite!.width;
                }
                this.player.startMoving();
                this.game.ticker.add(this.movePlayer, this);
            }
            if (ev.key == 'ArrowUp') {
                if (!this.canClimb()) {
                    this.player.vY = -this.jumpSpeed;
                    this.game.ticker.add(this.downPlayer, this);
                } else {
                    this.player.vY = -this.moveSpeed;
                    this.player.vX = 0;
                    this.player.startClimbing();
                    this.game.ticker.add(this.movePlayer, this);
                }
            }
        })
        document.addEventListener('keyup', (ev: any) => {
            if (ev.key == 'ArrowLeft' || ev.key == 'ArrowRight') {
                this.player.stopMoving();
                this.game.ticker.remove(this.movePlayer, this);
            }
        })
    }

    public generateComponents() {
        this.player  = new Player(0,0, this.game.stage);
        let oldPos = 0;
        for (let i = 0; i < this.groundsArr.length; i++) {
            oldPos = 900 / (i+2);
            for(let j=0; j<i+1; j++) {
                this.bamboos.push(
                    new Bamboo(
                        oldPos * (j+1),this.groundsArr[i].y, this.game.stage
                    )
                );
            }
            this.grounds.push(
                new Ground(this.groundsArr[i].x,this.groundsArr[i].y, i, this.game.stage)
            );
            if (this.ladders.length < this.groundsArr.length-1) {
                this.ladders.push(
                    new Ladder(i%2 != 0 ? this.groundsArr[i].x + 50 : this.game.canvas.width - 100 ,this.groundsArr[i].y - 110, this.game.stage)
                );
            }
        }
    }
    
    public canClimb() {
       return this.ladders[this.activeGroundIndex] ?
        this.player.playerCont.position.x >= this.ladders[this.activeGroundIndex].ladderCont.position.x &&
       this.player.playerCont.position.x <= this.ladders[this.activeGroundIndex].ladderCont.position.x + this.ladders[this.activeGroundIndex].ladderCont.width : false;
    }

    public downPlayer() {
        this.player.vY = this.player.vY + 0.1;
        this.player.vX = this.player.vX;
        
        this.player.playerCont.position.x += this.player.vX;
        this.player.playerCont.position.y += this.player.vY;
        
        if (this.player.playerCont.position.y + (this.player.containerHeight * this.player.playerScale) >= this.grounds[this.activeGroundIndex].groundCont.y) {
            this.game.ticker.remove(this.downPlayer, this);
        }
    }

    public playerDied() {
        this.bamboos[this.activeGroundIndex].stopAnimation();
        this.player.playerDied();
    }
    public movePlayer() {
        this.player.vY = this.player.vY;
        this.player.vX = this.player.vX;
        
        this.player.playerCont.position.x += this.player.vX;
        this.player.playerCont.position.y += this.player.vY;
        // if (this.bambooColision()) {
        //     this.game.ticker.remove(this.movePlayer, this);
        //     this.playerDied();
        // }
        if(this.canClimb() && this.player.playerCont.position.y <= this.grounds[this.activeGroundIndex+1].groundCont.position.y - this.grounds[this.activeGroundIndex+1].groundCont.height) {
            this.player.stopClimbing();
            this.activeGroundIndex++;
            if (this.checkForWin()) {
                this.player.playerWon();
            }
        }
        this.game.ticker.remove(this.movePlayer, this);
    }

    public bambooColision() {
        return this.player.playerCont.position.x + this.player.playerCont.width >= this.bamboos[this.activeGroundIndex].bambooCont.position.x && 
        this.player.playerCont.position.x + this.player.playerCont.width <= this.bamboos[this.activeGroundIndex].bambooCont.position.x + this.bamboos[this.activeGroundIndex].bambooCont.width;
    }

    public checkForWin() {
        return this.activeGroundIndex == this.groundsArr.length -1;
    }
}