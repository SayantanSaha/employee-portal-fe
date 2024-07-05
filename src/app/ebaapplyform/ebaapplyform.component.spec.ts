import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbaapplyformComponent } from './ebaapplyform.component';

describe('EbaapplyformComponent', () => {
  let component: EbaapplyformComponent;
  let fixture: ComponentFixture<EbaapplyformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbaapplyformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EbaapplyformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
