import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CensusPseComponent } from './census-pse.component';

describe('CensusPseComponent', () => {
  let component: CensusPseComponent;
  let fixture: ComponentFixture<CensusPseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CensusPseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CensusPseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
