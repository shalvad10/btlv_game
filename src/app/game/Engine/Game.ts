import * as PIXI from 'pixi.js';
import Player from './Player';
import Ladder from './Ladder';
import Ground from './Ground';

export default class Game {

    public game!: PIXI.Application;

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
    }

    public generateLadder() {
        const player = new Player(150,160, this.game.stage);
        const ladder = new Ladder(265,170, this.game.stage);
        const ground1 = new Ground(0,430, this.game.stage);
        const ground2 = new Ground(0,315, this.game.stage);
        const ground3 = new Ground(0,190, this.game.stage);
        const ground4 = new Ground(0,70, this.game.stage);
    }
}