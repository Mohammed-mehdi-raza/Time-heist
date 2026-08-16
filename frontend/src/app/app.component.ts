import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MusicService } from './core/services/music.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.musicService.playBackgroundMusic();
  }
}
