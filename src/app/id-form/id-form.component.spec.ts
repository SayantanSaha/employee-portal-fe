import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdFormComponent } from './id-form.component';

describe('IdFormComponent', () => {
  let component: IdFormComponent;
  let fixture: ComponentFixture<IdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
