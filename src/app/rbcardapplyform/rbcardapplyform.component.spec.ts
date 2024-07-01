import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbcardapplyformComponent } from './rbcardapplyform.component';

describe('RbcardapplyformComponent', () => {
  let component: RbcardapplyformComponent;
  let fixture: ComponentFixture<RbcardapplyformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RbcardapplyformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RbcardapplyformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
