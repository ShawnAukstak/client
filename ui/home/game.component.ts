import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as countdown from 'countdown';
import * as app from 'electron';
import { CivDef, GAMES, PcsProfileMap } from 'pydt-shared';

import { PlayTurnState } from '../playTurn/playTurnState.service';
import { Game, GamePlayer } from '../swagger/api';

@Component({
  selector: 'pydt-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  @Input() game: Game;
  @Input() gamePlayerProfiles: PcsProfileMap;
  @Input() yourTurn: boolean;
  @Input() discoursePostNumber: number;
  @Output() smackRead = new EventEmitter<number>();
  gamePlayers: GamePlayer[] = [];
  civDefs: CivDef[] = [];
  private now: Date;
  updateDateHandle: any;

  constructor(private router: Router, private playTurnState: PlayTurnState) {}

  ngOnInit() {
    // Save current date to prevent "changed after it was checked" bugs
    this.now = new Date();

    for (let i = 0; i < this.game.slots; i++) {
      if (this.game.players.length > i) {
        this.gamePlayers.push(this.game.players[i]);
        this.civDefs.push(this.civGame.leaders.find(leader => {
          return leader.leaderKey === this.game.players[i].civType;
        }));
      } else {
        this.gamePlayers.push(null);
        this.civDefs.push(null);
      }
    }
    
    this.updateDateHandle = setInterval(() => this.now = new Date(), 30 * 1000);
  }

  ngOnDestroy() {
    clearInterval(this.updateDateHandle);
  }

  get civGame() {
    return GAMES.find(x => x.id === this.game.gameType);
  }

  playTurn() {
    this.playTurnState.game = this.game;
    this.router.navigate(['/playTurn']);
  }

  openGameOnWeb() {
    app.ipcRenderer.send('opn-url', 'https://playyourdamnturn.com/game/' + this.game.gameId);
  }

  readSmack() {
    app.ipcRenderer.send('opn-url', 'https://discourse.playyourdamnturn.com/t/' + this.game.discourseTopicId);
    this.smackRead.emit(this.game.latestDiscoursePostNumber);
  }

  get newDiscoursePost() {
    return this.game.latestDiscoursePostNumber && this.game.latestDiscoursePostNumber > (this.discoursePostNumber || 0);
  }

  get lastTurn() {
    const lastTurnDate: any = this.game.lastTurnEndDate || this.game.updatedAt;
    // tslint:disable-next-line:no-bitwise
    return countdown(Date.parse(lastTurnDate), this.now, countdown.HOURS | countdown.MINUTES);
  }

  get timerExpires() {
    const lastTurnDate: any = this.game.lastTurnEndDate || this.game.updatedAt;
    const expirationDate = new Date(Date.parse(lastTurnDate) + this.game.turnTimerMinutes * 60 * 1000);

    if (expirationDate.getTime() - this.now.getTime() < 0) {
      return 'soon...';
    }

    // tslint:disable-next-line:no-bitwise
    return 'in ' + countdown(this.now, expirationDate, countdown.HOURS | countdown.MINUTES);
  }
}
