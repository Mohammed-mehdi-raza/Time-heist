import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds = {
    pickup: new Audio('assets/sounds/diamond-pickup.mp3'),
    key: new Audio('assets/sounds/key-pickup.mp3'),
    alarm: new Audio('assets/sounds/alarm.mp3'),
    trap: new Audio('assets/sounds/trap.mp3'),
    win: new Audio('assets/sounds/game-win.mp3'),
    gameOver: new Audio('assets/sounds/game-over.mp3'),
    door: new Audio('assets/sounds/door-open.mp3'),
    guardAlert: new Audio('assets/sounds/guard-alert.mp3')
  };

  private backgroundMusic = new Audio('assets/sounds/background-music.mp3');
  private muted = false;

  playPickup(): void {
    this.play(this.sounds.pickup);
  }

  playKey(): void {
    this.play(this.sounds.key);
  }

  playAlarm(): void {
    this.play(this.sounds.alarm);
  }

  playTrap(): void {
    this.play(this.sounds.trap);
  }

  playWin(): void {
    this.play(this.sounds.win);
  }

  playGameOver(): void {
    this.play(this.sounds.gameOver);
  }

  playDoor(): void {
    this.play(this.sounds.door);
  }

  playGuardAlert(): void {
    this.play(this.sounds.guardAlert);
  }

  startMusic(): void {
    if (this.muted) {
      return;
    }

    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;

    this.backgroundMusic.play().catch(error => {
      console.log('Music playback blocked:', error);
    });
  }

  stopMusic(): void {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  toggleMute(): void {
    this.muted = !this.muted;

    if (this.muted) {
      this.backgroundMusic.pause();
    } else {
      this.backgroundMusic.play().catch(error => {
        console.log('Music playback blocked:', error);
      });
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  private play(audio: HTMLAudioElement): void {
    if (this.muted) {
      return;
    }

    audio.currentTime = 0;

    audio.play().catch(error => {
      console.log('Audio playback blocked:', error);
    });
  }
}
