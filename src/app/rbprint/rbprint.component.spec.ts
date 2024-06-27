import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbprintComponent } from './rbprint.component';

describe('RbprintComponent', () => {
  let component: RbprintComponent;
  let fixture: ComponentFixture<RbprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RbprintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RbprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
