import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Level, Card } from '../interfaces/level-data.interface';
import PuzzleData from '../interfaces/puzzle-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PuzzleGameCardsDataService {
  private http: HttpClient = inject(HttpClient);

  // resultPuzzles$ = new Subject<Array<string>>();

  // sourcePuzzles$ = new Subject<Array<string>>();

  resultPuzzles$ = new Subject<Array<PuzzleData>>();

  sourcePuzzles$ = new Subject<Array<PuzzleData>>();

  currentSentence = signal(['']);

  level = signal(1);

  round = signal(0);

  sentenceNumber = signal(0);

  sentenceTranslation = signal<string>('');

  audioHint = signal<string>('');

  imageHint = signal<string>('');

  backgroundImagePath = signal<string>('');

  isClikedImageHint = signal<boolean>(false); //??

  correctSentences = signal<string[][]>([]);

  isCorrect = signal<boolean>(false);

  isDisabled = signal<boolean>(true);

  isCorrectWordsOrder = signal<boolean>(false);

  correctLineBgImage = signal<string>('');

  bgPositonTop = signal<number>(0);

  getCardsData(round: number): Observable<Level> {
    return this.http.get(
      `/api/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel${round}.json`,
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    ).pipe(
      map((data) => {
        const parsedData = this.parsePuzzleGameData(data);
        return parsedData;
      }),
    );
  }

  getWordsData(level: number, round: number, sentenceNumber: number) {
    return this.http.get(
      `/api/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel${level}.json`,
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    ).pipe(
      map((data) => {
        const parsedData = this.parsePuzzleGameData(data);
        const sentence = parsedData.rounds[round].words[sentenceNumber].textExample;
        const sentenceTranslation =
        parsedData.rounds[round].words[sentenceNumber].textExampleTranslate;

        // const wordsArr = sentence.split(' ');
        // const reducedCurrentWordsArr: string[] = wordsArr.reduce((acc: string[], item, i) => {
        //   const randomNumber = this.getRandomInt(wordsArr.length);
        //   [acc[i], acc[randomNumber]] = [acc[randomNumber], acc[i]];
        //   return acc;
        // }, wordsArr);
        // const randomizedWordsArr = reducedCurrentWordsArr;

        this.currentSentence.set(sentence.split(' '));

        const puzzleDataObject = this.currentSentence().reduce((acc: PuzzleData[], item, i) => {
          let left = i * 75; // change + top
          // let top = i * this.bgPositonTop();
          acc.push(
            {
            word: item,
            image: this.backgroundImagePath(),
            backgroundPosition: `top -${this.bgPositonTop()}px left -${left}px`});
          return acc;
        }, []);

        this.sentenceTranslation.set(sentenceTranslation);
        const audioHint = parsedData.rounds[this.round()].words[this.sentenceNumber()].audioExample;
        this.audioHint.set(audioHint);
        const imagePath = parsedData.rounds[this.round()].levelData.cutSrc;
        this.imageHint.set(imagePath);

        // this.currentSentence.set(sentence.split(' '));
        this.sourcePuzzles$.next(puzzleDataObject);

        return puzzleDataObject;
        // return randomizedWordsArr;
      }),
    );
  }

  getAudioFile(audioPath: string) {
    return this.http.get(
      `/api/rolling-scopes-school/rss-puzzle-data/main/${audioPath}`,
      {
        responseType: 'blob',
      }
    )
  }

  getImageFile(imagePath: string) {
    return this.http.get(
      `/api/rolling-scopes-school/rss-puzzle-data/main/images/${imagePath}`,
      {responseType: 'blob'}
    ).pipe(
      map((data) => {
        const imageUrl = URL.createObjectURL(data);
        this.backgroundImagePath.update((value) => value = imageUrl);
        this.correctLineBgImage.update((value) => value = imageUrl);
        return this.backgroundImagePath;
      })
    )
  }

  movePuzzles(
    // arrToPush: string[],
    // arrToDelete: string[],
    arrToPush: PuzzleData[],
    arrToDelete: PuzzleData[],
    // word: string,
    puzzle: PuzzleData,
    currentSentenceLength: number,
    // observableToPush: Subject<string[]>,
    // observableToDelete: Subject<string[]>,
    observableToPush: Subject<PuzzleData[]>,
    observableToDelete: Subject<PuzzleData[]>,
  ) {
    // const formattedWord = word.replaceAll('\n', '').trim();
    // const wordToDelete = arrToDelete.indexOf(formattedWord);
    const puzzleToMove = arrToDelete.findIndex((x) => x.word === puzzle.word);
    console.log(puzzleToMove);

    const newArrToDelete = [...arrToDelete];
    // newArrToDelete.splice(wordToDelete, 1);
    console.log(newArrToDelete);
    if(puzzleToMove !== -1) {
      newArrToDelete.splice(puzzleToMove, 1);
      observableToDelete.next(newArrToDelete);
    }

    let newArrToPush = [...arrToPush];
    if (this.isCorrect()) {
      newArrToPush = [];
      observableToPush.next(newArrToPush);
    } else {
      newArrToPush.push(puzzle); //
      observableToPush.next(newArrToPush);
    }
  }

  pushInResultsBlock(
    // resultArr: string[],
    // sourceArr: string[],
    // word: string,
    resultArr: PuzzleData[],
    sourceArr: PuzzleData[],
    puzzle: PuzzleData,
    currentSentenceLength: number,
  ) {
    return this.movePuzzles(
      resultArr,
      sourceArr,
      // word,
      puzzle,
      currentSentenceLength,
      this.resultPuzzles$,
      this.sourcePuzzles$,
    );
  }

  pushInSourceBlock(
    // sourceArr: string[],
    // resultArr: string[],
    // word: string,
    sourceArr: PuzzleData[],
    resultArr: PuzzleData[],
    puzzle: PuzzleData,
    currentSentenceLength: number,
  ) {
    return this.movePuzzles(
      sourceArr,
      resultArr,
      // word,
      puzzle,
      currentSentenceLength,
      this.sourcePuzzles$,
      this.resultPuzzles$,
    );
  }

  parsePuzzleGameData(data: unknown): Level {
    const dataToString = JSON.stringify(data);
    const typedData: Level = JSON.parse(dataToString);
    return typedData;
  }

  // getRandomInt(max: number) {
  //   return Math.floor(Math.random() * max);
  // }
}
