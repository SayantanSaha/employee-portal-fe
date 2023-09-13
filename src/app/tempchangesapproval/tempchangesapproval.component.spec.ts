import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempchangesapprovalComponent } from './tempchangesapproval.component';

describe('TempchangesapprovalComponent', () => {
  let component: TempchangesapprovalComponent;
  let fixture: ComponentFixture<TempchangesapprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempchangesapprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempchangesapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
