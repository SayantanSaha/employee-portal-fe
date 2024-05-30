import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempchangesdataComponent } from './tempchangesdata.component';

describe('TempchangesdataComponent', () => {
  let component: TempchangesdataComponent;
  let fixture: ComponentFixture<TempchangesdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempchangesdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempchangesdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
