import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbapppendingComponent } from './rbapppending.component';

describe('RbapppendingComponent', () => {
  let component: RbapppendingComponent;
  let fixture: ComponentFixture<RbapppendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RbapppendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RbapppendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
