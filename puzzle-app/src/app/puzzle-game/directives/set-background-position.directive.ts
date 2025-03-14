import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[backgroundPosition]'
})
export class BackgroundPositionDirective {
  renderer = inject(Renderer2);

  element = inject(ElementRef);

  @Input() set backgroundPuzzlePosition (positions:{bgPosition: string}[]) {
    const currentIndex = positions.length - 1;
    this.renderer.setStyle(
      this.element.nativeElement,
      'backgroundPosition',
      positions[currentIndex].bgPosition
    );
  }
}
