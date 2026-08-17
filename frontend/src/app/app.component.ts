import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { MusicService } from './core/services/music.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // this.musicService.playBackgroundMusic();
  }
}
