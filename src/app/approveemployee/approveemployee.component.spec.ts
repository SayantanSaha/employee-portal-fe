import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveemployeeComponent } from './approveemployee.component';

describe('ApproveemployeeComponent', () => {
  let component: ApproveemployeeComponent;
  let fixture: ComponentFixture<ApproveemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveemployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
