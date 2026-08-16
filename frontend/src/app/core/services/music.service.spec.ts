import { TestBed } from '@angular/core/testing';
import { MusicService } from './music.service';

describe('MusicService', () => {
  let service: MusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play background music', () => {
    spyOn(service['audio'], 'play').and.returnValue(Promise.resolve());
    service.playBackgroundMusic();
    expect(service['audio'].play).toHaveBeenCalled();
  });

  it('should pause music', () => {
    spyOn(service['audio'], 'pause');
    service.pauseMusic();
    expect(service['audio'].pause).toHaveBeenCalled();
  });

  it('should set volume', () => {
    service.setVolume(0.7);
    expect(service.getVolume()).toBe(0.7);
  });

  it('should clamp volume between 0 and 1', () => {
    service.setVolume(1.5);
    expect(service.getVolume()).toBe(1);
    
    service.setVolume(-0.5);
    expect(service.getVolume()).toBe(0);
  });

  it('should check if music is playing', () => {
    expect(service.isPlaying()).toBe(false);
  });

  it('should have loop enabled', () => {
    expect(service['audio'].loop).toBe(true);
  });
});
