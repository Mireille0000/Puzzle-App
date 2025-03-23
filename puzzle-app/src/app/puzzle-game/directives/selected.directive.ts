import {
  Directive, ElementRef, inject, Input, Renderer2,
} from '@angular/core';
import { OptionsSelection } from '../interfaces/options-selection';

@Directive({
  selector: '[selectedAttr]',
})
export class SelectedDirective {
  renderer = inject(Renderer2);

  element = inject(ElementRef);

  @Input() set selectedAttr(obj: OptionsSelection) {
    if ((obj.chosenOption) === obj.roundLevel) {
      this.renderer.setAttribute(
        this.element.nativeElement,
        'selected',
        'true',
      );
      this.renderer.setStyle(
        this.element.nativeElement,
        'font-weight',
        '900',
      );
      this.renderer.setStyle(
        this.element.nativeElement,
        'color',
        '#84c9b8',
      );
      this.renderer.setStyle(
        this.element.nativeElement,
        'background-color',
        '#b27474',
      );
    } else {
      this.renderer.removeAttribute(
        this.element.nativeElement,
        'selected',
      );
      this.renderer.removeStyle(
        this.element.nativeElement,
        'font-weight',
      );
      this.renderer.removeStyle(
        this.element.nativeElement,
        'color',
      );
      this.renderer.removeStyle(
        this.element.nativeElement,
        'background-color',
      );
    }
  }
}
