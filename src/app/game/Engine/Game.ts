import * as PIXI from 'pixi.js';
import Player from './Player';
import Ladder from './Ladder';
import Ground from './Ground';

export default class Game {

    public game!: PIXI.Application;
    public player!: Player;
    public ladder!: Ladder;
    public grounds: Ground[] = [];
    public ladders: Ladder[] = [];
    public activeGroundIndex: number = 0;
    private moveSpeed: number = 2;
    private jumpSpeed: number = 2;

    private groundsArr: any[] = [
        { x: 0, y: 430 },
        { x: 0, y: 315 },
        { x: 0, y: 195 },
        { x: 0, y: 70 },
    ];

    constructor(el: HTMLElement) {
        this.init(el);
    }

    public async init(el: HTMLElement) {
        this.game = new PIXI.Application();
            await this.game.init({
                width: window.innerWidth/2,
                height: window.innerHeight/2,
                backgroundColor: 0x2c3e50
        });            

        el.appendChild(this.game.canvas);
        this.generateLadder();
        this.game.ticker.add(this.downPlayer, this);
        this.game.ticker.start();
        document.addEventListener('keydown', (ev: any) => { 
            if (ev.key == 'ArrowLeft') {
                if (this.player.playerCont.position.x <= 0) { this.player.vX = 0; this.player.stopMoving(); return; }
                this.player.vX = -this.moveSpeed;
                this.player.vY = 0;
                if (this.player.playerAnimatedSprite.scale.x > 0) {
                    this.player.playerAnimatedSprite.scale.x *= -1;
                    this.player.playerAnimatedSprite.position.x += this.player.playerAnimatedSprite.width;
                }
                this.player.startMoving();
                this.game.ticker.add(this.movePlayer, this);
            } else if (ev.key == 'ArrowRight') {
                console.error(this.game.stage.width)
                if (this.player.playerCont.position.x + this.player.playerCont.width >= this.game.stage.width) { this.player.vX = 0; this.player.stopMoving(); return; }
                this.player.vX = this.moveSpeed;
                this.player.vY = 0;
                if (this.player.playerAnimatedSprite.scale.x < 0 ) {
                    this.player.playerAnimatedSprite.scale.x *= -1;
                    this.player.playerAnimatedSprite.position.x -= this.player.playerAnimatedSprite.width;
                }
                this.player.startMoving();
                this.game.ticker.add(this.movePlayer, this);
            }
            if (ev.key == 'ArrowUp') {
                if (!this.canClimb()) {
                    this.player.vY = -this.jumpSpeed;
                    this.game.ticker.add(this.downPlayer, this);
                } else {
                    console.warn('here');
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

    public generateLadder() {
        this.player  = new Player(0,0, this.game.stage);
        // this.ladder  = new Ladder(265,170, this.game.stage);
        for (let i = 0; i < this.groundsArr.length; i++) {
            this.grounds.push(
                new Ground(this.groundsArr[i].x,this.groundsArr[i].y, i, this.game.stage)
            );
            if (this.ladders.length < this.groundsArr.length-1) {
                console.warn(this.game.canvas.width)
                this.ladders.push(
                    new Ladder(i%2 != 0 ? this.groundsArr[i].x + 50 : this.game.canvas.width - 100 ,this.groundsArr[i].y - 110, this.game.stage)
                );
            }
            
        }
    }
    
    public canClimb() {
       return this.player.playerCont.position.x >= this.ladders[this.activeGroundIndex].ladderCont.position.x;
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

    public movePlayer() {
        this.player.vY = this.player.vY;
        this.player.vX = this.player.vX;
        
        this.player.playerCont.position.x += this.player.vX;
        this.player.playerCont.position.y += this.player.vY;
        this.game.ticker.remove(this.movePlayer, this);
    }
}