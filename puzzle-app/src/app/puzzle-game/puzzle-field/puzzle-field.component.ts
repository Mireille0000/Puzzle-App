import {
  Component, inject, OnInit, signal,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';

@Component({
  selector: 'pzl-puzzle-field',
  imports: [NgFor],
  templateUrl: './puzzle-field.component.html',
  styleUrl: './puzzle-field.component.scss',
})
export class PuzzleFieldComponent implements OnInit {
  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  sourceBlock: string[] = [];

  resultBlock: string[] = [];

  currentSentence = signal(['']);

  ngOnInit(): void {
    this.currentSentence = this.puzzlesDataService.currentSentence$;
    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.sourceBlock = data;
    });
    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultBlock = data;
    });
  }

  movePuzzleToPuzzlesBlock(word: string) {
    const wordIndex = this.resultBlock.indexOf(word);
    if (wordIndex !== -1) {
      this.puzzlesDataService
      .pushInSourceBlock(
        this.sourceBlock,
        this.resultBlock,
        word,
        this.currentSentence().length,
      );
    }
    console.log(`source block, puzzle field ${this.sourceBlock}`);
    console.log(`results, puzzle field component ${this.resultBlock}`);
  }
}
