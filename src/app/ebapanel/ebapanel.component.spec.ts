import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbapanelComponent } from './ebapanel.component';

describe('EbapanelComponent', () => {
  let component: EbapanelComponent;
  let fixture: ComponentFixture<EbapanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbapanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbapanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
