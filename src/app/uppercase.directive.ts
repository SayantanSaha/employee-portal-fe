import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any): void {
    const inputElement = this.el.nativeElement;
    const originalValue = inputElement.value;
    const newValue = originalValue.toUpperCase();
    if (originalValue !== newValue) {
      inputElement.value = newValue;
      event.stopPropagation();
    }
  }
}
