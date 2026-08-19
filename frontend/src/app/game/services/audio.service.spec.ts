import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play pickup sound', () => {
    spyOn(HTMLAudioElement.prototype, 'play').and.returnValue(Promise.resolve());
    service.playPickup();
    expect(HTMLAudioElement.prototype.play).toHaveBeenCalled();
  });

  it('should toggle mute', () => {
    expect(service.isMuted()).toBeFalse();
    service.toggleMute();
    expect(service.isMuted()).toBeTrue();
  });

  it('should not play sounds when muted', () => {
    service.toggleMute();
    spyOn(HTMLAudioElement.prototype, 'play').and.returnValue(Promise.resolve());
    service.playPickup();
    // Play should not be called when muted
  });

  it('should start and stop music', () => {
    spyOn(HTMLAudioElement.prototype, 'play').and.returnValue(Promise.resolve());
    spyOn(HTMLAudioElement.prototype, 'pause');
    
    service.startMusic();
    expect(HTMLAudioElement.prototype.play).toHaveBeenCalled();
    
    service.stopMusic();
    expect(HTMLAudioElement.prototype.pause).toHaveBeenCalled();
  });
});
