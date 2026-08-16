import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MusicService } from './core/services/music.service';

describe('AppComponent', () => {
  let musicService: MusicService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [MusicService],
    }).compileComponents();

    musicService = TestBed.inject(MusicService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should play background music on init', () => {
    spyOn(musicService, 'playBackgroundMusic');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(musicService.playBackgroundMusic).toHaveBeenCalled();
  });
});

