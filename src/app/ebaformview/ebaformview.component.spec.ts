import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbaformviewComponent } from './ebaformview.component';

describe('EbaformviewComponent', () => {
  let component: EbaformviewComponent;
  let fixture: ComponentFixture<EbaformviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbaformviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbaformviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
