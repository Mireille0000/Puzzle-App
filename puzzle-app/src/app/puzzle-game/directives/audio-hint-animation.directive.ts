import {
  Directive, ElementRef, HostListener, inject, Renderer2,
} from '@angular/core';

@Directive({
  selector: 'span[audioHintAnimation]',
})
export class AudioHintAnimationDirective {
  element = inject(ElementRef);

  renderer = inject(Renderer2);

  @HostListener('click', ['$event.target'])
  onClick() {
    this.renderer.setStyle(this.element.nativeElement, 'color', '#cb1e8c');
    this.renderer.setStyle(this.element.nativeElement, 'transition', '2s');
    this.renderer.addClass(this.element.nativeElement, 'fadein');
    this.renderer.addClass(this.element.nativeElement, 'animation-duration-1000');
    this.renderer.addClass(this.element.nativeElement, 'animation-iteration-infinite');
    console.log('hint');
  }
}
