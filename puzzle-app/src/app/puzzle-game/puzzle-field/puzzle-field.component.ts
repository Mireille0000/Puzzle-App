import {
  Component, inject, OnInit, signal,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { BackgroundColorDirective } from '../directives/add-background-color.directive';

@Component({
  selector: 'pzl-puzzle-field',
  imports: [NgFor, BackgroundColorDirective],
  templateUrl: './puzzle-field.component.html',
  styleUrl: './puzzle-field.component.scss',
})
export class PuzzleFieldComponent implements OnInit {
  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  sourceBlock: string[] = [];

  resultBlock: string[] = [];

  correctSentences = signal<string[][]>([]);

  currentSentenceNum = signal(0);

  currentSentence = signal(['']);

  isCorrect = signal<boolean>(false);

  isDisabled = signal<boolean>(true);

  isCorrectWordsOrder = signal<boolean>(false);

  ngOnInit(): void {
    this.currentSentence = this.puzzlesDataService.currentSentence;
    this.correctSentences = this.puzzlesDataService.correctSentences;
    this.currentSentenceNum = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect;
    this.isDisabled = this.puzzlesDataService.isDisabled;
    this.isCorrectWordsOrder = this.puzzlesDataService.isCorrectWordsOrder;

    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.sourceBlock = data;
    });
    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultBlock = data;
    });
  }

  movePuzzles(index: number, word: string) {
    if (index !== -1) {
      this.puzzlesDataService
        .pushInSourceBlock(
          this.sourceBlock,
          this.resultBlock,
          word,
          this.currentSentence().length,
        );
    }
  }

  movePuzzleToPuzzlesBlock(word: string) {
    const wordIndex = this.resultBlock.indexOf(word);
    if (this.isCorrect()) {
      this.resultBlock = [];
      this.movePuzzles(wordIndex, word);
      // if (wordIndex !== -1) {
      //   {
      //     this.puzzlesDataService
      //       .pushInSourceBlock(
      //         this.sourceBlock,
      //         this.resultBlock,
      //         word,
      //         this.currentSentence().length,
      //       );
      //   }
      // }
    } else {
      this.movePuzzles(wordIndex, word);
      // {
      //   this.puzzlesDataService
      //     .pushInSourceBlock(
      //       this.sourceBlock,
      //       this.resultBlock,
      //       word,
      //       this.currentSentence().length,
      //     );
      // }
    }

    if (this.sourceBlock.length === 0) {
      this.isDisabled.update(() => false);
    } else {
      this.isDisabled.update(() => true);
    }

    console.log(this.isDisabled(), this.sourceBlock);

    // console.log(`source block, puzzle field ${this.sourceBlock}`);
    // console.log(`results, puzzle field component ${this.resultBlock}`);
  }
}
