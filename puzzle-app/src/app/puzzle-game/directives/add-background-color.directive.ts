import {
  AfterContentChecked, Directive, ElementRef, inject, Input, OnInit, Renderer2, signal,
} from '@angular/core';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';

@Directive({
  selector: '[backgroundColor]',
})
export class BackgroundColorDirective implements OnInit, AfterContentChecked {
  @Input() isCorrectWordsOrder = signal<boolean>(false);

  private renderer = inject(Renderer2);

  private element = inject(ElementRef);

  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  ngOnInit(): void {
    this.isCorrectWordsOrder = this.puzzlesDataService.isCorrectWordsOrder;
  }

  ngAfterContentChecked(): void {
    this.updateBackgroundColor();
  }

  private updateBackgroundColor() {
    if (this.isCorrectWordsOrder()) {
      this.renderer.setStyle(this.element.nativeElement, 'background-color', 'red');
    } else {
      this.renderer.removeStyle(this.element.nativeElement, 'background-color');
    }
  }
}
