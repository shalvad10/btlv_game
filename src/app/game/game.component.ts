import { Component, OnInit } from '@angular/core';
import Game from './Engine/Game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  private app: any;

  ngOnInit() {
    const el: any = document.getElementById('game');
    this.app = new Game(el);

  }
}
