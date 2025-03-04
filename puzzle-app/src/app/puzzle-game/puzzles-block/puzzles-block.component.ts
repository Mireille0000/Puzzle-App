import {
  Component, inject, OnInit, signal,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';

@Component({
  selector: 'pzl-puzzles-block',
  imports: [NgFor],
  templateUrl: './puzzles-block.component.html',
  styleUrl: './puzzles-block.component.scss',
})
export class PuzzlesBlockComponent implements OnInit {
  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  words: string[] = [];

  resultArr: string[] = [];

  currentSentence = signal(['']);

  level = signal(1);

  round = signal(0);

  sentenceNumber = signal(0);

  isCorrect = signal<boolean>(false);


  ngOnInit(): void {
    this.isCorrect = this.puzzlesDataService.isCorrect;
    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;
    this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber()).subscribe((data) => {
      this.currentSentence = this.puzzlesDataService.currentSentence; // ?
    });

    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultArr = data;
    });

    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.words = data;
    });
  }

  movePuzzleToPuzzleField(word: string) {
    const wordIndex = this.words.indexOf(word);
    if(this.isCorrect()) {
      this.isCorrect.update(() => false);
      this.resultArr = [];
      if (wordIndex !== -1) {
        this.puzzlesDataService
        .pushInResultsBlock(
          this.resultArr,
          this.words,
          word,
          this.currentSentence().length,
        );
      }
    } else {
      if (wordIndex !== -1) {
        this.puzzlesDataService
        .pushInResultsBlock(
          this.resultArr,
          this.words,
          word,
          this.currentSentence().length,
        );
      }
    }

    console.log(`puzzle block, words arr, subscription to soucePuzzle: ${this.words}`);
    console.log(`puzzle block, words arr, subscription to results: ${this.resultArr}`);
  }
}
