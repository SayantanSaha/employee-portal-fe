import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbapendingComponent } from './ebapending.component';

describe('EbapendingComponent', () => {
  let component: EbapendingComponent;
  let fixture: ComponentFixture<EbapendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbapendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbapendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
