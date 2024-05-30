import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbaprintComponent } from './ebaprint.component';

describe('EbaprintComponent', () => {
  let component: EbaprintComponent;
  let fixture: ComponentFixture<EbaprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbaprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbaprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
