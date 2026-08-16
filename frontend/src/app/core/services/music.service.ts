import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio('/assets/audio/gamemusic.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.5;
  }

  playBackgroundMusic(): void {
    if (this.audio.paused) {
      this.audio.play().catch(error => {
        console.error('Error playing music:', error);
      });
    }
  }

  stopMusic(): void {
    if (!this.audio.paused) {
      this.audio.pause();
    }
  }

  pauseMusic(): void {
    this.audio.pause();
  }

  resumeMusic(): void {
    if (this.audio.paused) {
      this.audio.play().catch(error => {
        console.error('Error resuming music:', error);
      });
    }
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.audio.volume;
  }

  isPlaying(): boolean {
    return !this.audio.paused;
  }
}
