import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbaFormComponent } from './eba-form.component';

describe('EbaFormComponent', () => {
  let component: EbaFormComponent;
  let fixture: ComponentFixture<EbaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
