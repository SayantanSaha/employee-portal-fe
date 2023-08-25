import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveemployeelistComponent } from './approveemployeelist.component';

describe('ApproveemployeelistComponent', () => {
  let component: ApproveemployeelistComponent;
  let fixture: ComponentFixture<ApproveemployeelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveemployeelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveemployeelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
