import { Component, inject, OnInit, signal } from '@angular/core';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'pzl-puzzle-field',
  imports: [NgFor],
  templateUrl: './puzzle-field.component.html',
  styleUrl: './puzzle-field.component.scss'
})
export class PuzzleFieldComponent implements OnInit{
  private puzzlesDataService = inject(PuzzleGameCardsDataService);
  sourceBlock: string[] = [];
  resultBlock: string[] = [];
  currentSentence = signal(['']); // ?

  ngOnInit(): void {
    this.currentSentence = this.puzzlesDataService.currentSentence$;
    this.puzzlesDataService.sourcePuzzles$.subscribe(data => {
      this.sourceBlock = Array.from(new Set(data));
    });
    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultBlock = Array.from(new Set(data));
    })
  }

  movePuzzleToPuzzlesBlock(event: Event) {
    const clickedPuzzle = event.target as HTMLElement;
    const word = clickedPuzzle.innerHTML;
    clickedPuzzle.innerHTML = '';

    this.puzzlesDataService.pushInSourceBlock(this.sourceBlock, this.resultBlock, word, this.currentSentence().length); // result arr
    console.log(`source block, puzzle field ${this.sourceBlock}`);
    console.log(`results, puzzle field component ${this.resultBlock}`);
  }
}
