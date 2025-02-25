import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportUpdateComponent } from './sport-update.component';

describe('SportUpdateComponent', () => {
  let component: SportUpdateComponent;
  let fixture: ComponentFixture<SportUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SportUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
