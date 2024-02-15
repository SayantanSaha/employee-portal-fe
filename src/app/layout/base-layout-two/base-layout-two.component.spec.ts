import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutTwoComponent } from './base-layout-two.component';

describe('BaseLayoutTwoComponent', () => {
  let component: BaseLayoutTwoComponent;
  let fixture: ComponentFixture<BaseLayoutTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseLayoutTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseLayoutTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
