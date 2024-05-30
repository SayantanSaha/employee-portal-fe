import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { UppercaseDirective } from './uppercase.directive';

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UppercaseDirective],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }, // Auto-detect changes
      ],
    });

    fixture = TestBed.createComponent(TestComponent); // Create a test component
  });

  it('should create an instance', () => {
    const directive = new UppercaseDirective(fixture.elementRef); // Provide the ElementRef dependency
    expect(directive).toBeTruthy();
  });
});

class TestComponent {}
