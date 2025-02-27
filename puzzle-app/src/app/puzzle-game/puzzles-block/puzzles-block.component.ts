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

  currentSentence = signal(['']); // ?

  words: string[] = [];

  resultArr: string[] = [];

  ngOnInit(): void {
    this.puzzlesDataService.getWordsData(1, 0, 1).subscribe((data) => {
      this.words = data;
      this.currentSentence = this.puzzlesDataService.currentSentence$; // ?
    });

    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultArr = data;
    });

    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.words = data;
    });
  }

  //   randomizeWordsOrder() {
  //     this.httpService.getWordsData(1, 0, 1).subscribe((data) => {
  //       const currentWordsArr = data.split(' ');

  //       const reducedCurrentWordsArr: string[] =
  //         currentWordsArr.reduce((acc: string[], item, i) => {
  //         const randomNumber = this.getRandomInt(currentWordsArr.length);
  //         [acc[i], acc[randomNumber]] = [acc[randomNumber], acc[i]];
  //         return acc;
  //       }, currentWordsArr);

  //       this.words = reducedCurrentWordsArr.
  //           concat(currentWordsArr).
  //           filter((item, i, arr) => arr.indexOf(item) === i);
  //     })
  //   }

  //  getRandomInt(max: number) {
  //     return Math.floor(Math.random() * max);
  //   }

  movePuzzleToPuzzleField(word: string) {
    const wordIndex = this.words.indexOf(word);
    if (wordIndex !== -1) {
      this.puzzlesDataService
      .pushInResultsBlock(
        this.resultArr,
        this.words,
        word,
        this.currentSentence().length,
      );
    }
    console.log(`puzzle block, words arr, subscription to soucePuzzle: ${this.words}`);
    console.log(`puzzle block, words arr, subscription to results: ${this.resultArr}`);
  }
}
