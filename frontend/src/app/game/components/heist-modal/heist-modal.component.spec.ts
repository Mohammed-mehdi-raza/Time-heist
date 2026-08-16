import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeistModalComponent } from './heist-modal.component';

describe('HeistModalComponent', () => {
  let component: HeistModalComponent;
  let fixture: ComponentFixture<HeistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeistModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
