import {
  Component, inject, OnInit, Signal, signal,
} from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import PuzzleData from '../interfaces/puzzle-data.interface';

@Component({
  selector: 'pzl-puzzles-block',
  imports: [NgFor, NgStyle  /* BackgroundImageDirective */],
  templateUrl: './puzzles-block.component.html',
  styleUrl: './puzzles-block.component.scss',
})
export class PuzzlesBlockComponent implements OnInit {
  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  words: PuzzleData[] = [];

  resultArr: PuzzleData[] = [];

  currentSentence = signal(['']);

  level = signal(1);

  round = signal(0);

  sentenceNumber = signal(0);

  isCorrect = signal<boolean>(false);

  isDisabled = signal<boolean>(true);

  backgroundImagePath = signal<string>('');

  currentImageHint = signal<string>(''); //

  isClickedImageHint = signal<boolean>(false);

  bgPositionTop = signal<number>(0);

 girdTemplateRowsPuzzle = signal<string>('')

  ngOnInit(): void {
    this.isCorrect = this.puzzlesDataService.isCorrect;
    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;
    this.isDisabled = this.puzzlesDataService.isDisabled;

    this.isClickedImageHint = this.puzzlesDataService.isClikedImageHint;

    this.backgroundImagePath = this.puzzlesDataService.backgroundImagePath; //

    this.puzzlesDataService.getWordsData(
      this.level(),
      this.round(),
      this.sentenceNumber(),
    ).subscribe(() => {
      this.currentSentence = this.puzzlesDataService.currentSentence;
      this.currentImageHint = this.puzzlesDataService.imageHint;
      this.bgPositionTop = this.puzzlesDataService.bgPositonTop;
      this.girdTemplateRowsPuzzle = this.puzzlesDataService.girdTemplateRowsPuzzle;

      this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
        this.words = data;
        this.words.reduce((acc: PuzzleData[], item, i) => {
          const randomNumber = this.getRandomInt(this.words.length);
          [acc[i], acc[randomNumber]] = [acc[randomNumber], acc[i]];
          return acc;
        }, this.words);
        this.puzzlesDataService.getImageFile(this.currentImageHint()).subscribe(() => {
          this.backgroundImagePath.update((value) => value = this.puzzlesDataService.backgroundImagePath());
          this.words = this.words.reduce(
            (acc:
               PuzzleData[],
               item,
               i) =>
              {
            acc.push(
              {word: item.word,
              image: this.backgroundImagePath(),
              backgroundPosition: item.backgroundPosition,
              }
             );
            return acc;
          }, []);
        })
      });
    });

    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultArr = data;
    });

    // this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
    //   this.words = data;
    // });
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  movePuzzles(index: number, puzzle: PuzzleData) {
    if (index !== -1) {
      this.puzzlesDataService
          .pushInResultsBlock(
            this.resultArr,
            this.words,
            puzzle,
            this.currentSentence().length,
          );
    }
  }

  movePuzzleToPuzzleField(puzzle: PuzzleData) {
    const word = puzzle.word;
    const puzzleIndex = this.words.findIndex((x) => x.word === word);

    if (this.isCorrect()) {
      this.isCorrect.update(() => false);
      this.resultArr = [];
      this.movePuzzles(puzzleIndex, puzzle);
    } else {
      this.movePuzzles(puzzleIndex, puzzle);
    }

    if (this.words.length === 0) {
      this.isDisabled.update(() => false);
    } else {
      this.isDisabled.update(() => true);
    }

    console.log(this.isDisabled(), this.words);
    console.log(puzzle.word);
    console.log(`puzzle block, words arr, subscription to soucePuzzle: `, this.words);
    console.log(`puzzle block, words arr, subscription to results: `, this.resultArr);
  }
}
