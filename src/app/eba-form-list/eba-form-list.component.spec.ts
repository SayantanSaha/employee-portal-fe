import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbaFormListComponent } from './eba-form-list.component';

describe('EbaFormListComponent', () => {
  let component: EbaFormListComponent;
  let fixture: ComponentFixture<EbaFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbaFormListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbaFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
