import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbaapprovalComponent } from './ebaapproval.component';

describe('EbaapprovalComponent', () => {
  let component: EbaapprovalComponent;
  let fixture: ComponentFixture<EbaapprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbaapprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbaapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
