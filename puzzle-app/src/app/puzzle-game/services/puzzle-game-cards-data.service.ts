import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  map, Observable, Subject,
} from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Level } from '../interfaces/level-data.interface';
import PuzzleData from '../interfaces/puzzle-data.interface';
import { RoundStatisticsData } from '../../statistics-page/interfaces/round-statistics-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PuzzleGameCardsDataService {
  private http: HttpClient = inject(HttpClient);

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

  isClikedImageHint = signal<boolean>(false); // ??

  correctSentences = signal<string[][]>([]);

  isCorrect = signal<boolean>(false);

  isDisabled = signal<boolean>(true);

  isCorrectWordsOrder = signal<boolean>(false);

  canSeeResults = signal<boolean>(false);

  correctLineBgImage = signal<string>('');

  bgPositonTop = signal<number>(0);

  girdTemplateRowsPuzzle = signal<string>('');

  // ??
  levelsNum = signal<Array<{value: number, option: number}>>([{ value: 0, option: 1 }]);
  // ??

  roundsPerLevel = signal<Array<{value: number, option: number}>>([{ value: 0, option: 1 }]);

  form = signal(new FormGroup({
    level: new FormControl(),
    round: new FormControl(),
  })); //

  gameProgressData = signal<string>('');

  roundStatisticsData$ = new Subject<Array<RoundStatisticsData>>();

  completedRoundsLevelsStorage = signal<Array<{level: number, round: number}>>([]);

  getLevelData(level: number): Observable<Level> {
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
        this.roundsPerLevel.update(
          () => (Array.from(
            { length: parsedData.rounds.length },
            (item, i) => {
              item = { value: i, option: i + 1 };
              return item;
            },
          )as {value: number, option: number}[]),
        );
        this.form().get('round')?.setValue(this.roundsPerLevel()[this.round()]);
        this.canSeeResults.update(() => false);
        if(localStorage.getItem('completedStorage')){
          const lsData = JSON.parse(localStorage.getItem('completedStorage') as string);
          if (lsData.length) {
            this.completedRoundsLevelsStorage.update((value) => [...value, ...lsData]);
          } {
            this.completedRoundsLevelsStorage.update(() => lsData);
          }
        }
        return parsedData;
      }),
    );
  }

  getRoundData(level: number, round: number) {
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
        const chosenCompletedRound = parsedData.rounds[round];

        const dataSource: RoundStatisticsData[] = [];
        for (let i = 0; i < parsedData.rounds[round].words.length; i += 1) {
          dataSource.push({
            id: i + 1,
            sentenceNumber: i + 1,
            sound: parsedData.rounds[round].words[i].audioExample,
            sentence: parsedData.rounds[round].words[i].textExample,
            knownUnknown: 'X'})
        }
        this.roundStatisticsData$.next(dataSource);
        return chosenCompletedRound;
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
        const sentenceTranslation = parsedData
          .rounds[round]
          .words[sentenceNumber]
          .textExampleTranslate;

        this.currentSentence.set(sentence.split(' '));

        const wordsNum = 604 / this.currentSentence().length;
        this.girdTemplateRowsPuzzle.update(
          () => this.currentSentence().map(() => '1fr').join(' '), //
        );

        const puzzleDataObject = this.currentSentence().reduce((acc: PuzzleData[], item, i) => {
          const left = i * wordsNum;
          acc.push(
            {
              word: item,
              image: this.backgroundImagePath(),
              backgroundPosition: `top -${this.bgPositonTop()}px left -${left}px`,
            },
          );
          return acc;
        }, []);

        this.sentenceTranslation.set(sentenceTranslation); // naming of the hint
        const audioHint = parsedData.rounds[this.round()].words[this.sentenceNumber()].audioExample;
        this.audioHint.set(audioHint);
        const imagePath = parsedData.rounds[this.round()].levelData.cutSrc;
        this.imageHint.set(imagePath);

        this.sourcePuzzles$.next(puzzleDataObject);

        return puzzleDataObject;
      }),
    );
  }

  getAudioFile(audioPath: string) {
    return this.http.get(
      `/api/rolling-scopes-school/rss-puzzle-data/main/${audioPath}`,
      {
        responseType: 'blob',
      },
    ).pipe(
      map((data) => {
        const audioUrl = URL.createObjectURL(data);
        const audio = new Audio(audioUrl);
        return audio;
      }),
    );
  }

  getImageFile(imagePath: string) {
    return this.http.get(
      `/api/rolling-scopes-school/rss-puzzle-data/main/images/${imagePath}`,
      { responseType: 'blob' },
    ).pipe(
      map((data) => {
        const imageUrl = URL.createObjectURL(data);
        this.backgroundImagePath.update((value) => {
          let newValue = value;
          newValue = imageUrl;
          return newValue;
        });
        this.correctLineBgImage.update((value) => {
          let newValue = value;
          newValue = imageUrl;
          return newValue;
        });
        return this.backgroundImagePath;
      }),
    );
  }

  movePuzzles(
    arrToPush: PuzzleData[],
    arrToDelete: PuzzleData[],
    puzzle: PuzzleData,
    observableToPush: Subject<PuzzleData[]>,
    observableToDelete: Subject<PuzzleData[]>,
  ) {
    const puzzleToMove = arrToDelete.findIndex((x) => x.word === puzzle.word);

    const newArrToDelete = [...arrToDelete];
    if (puzzleToMove !== -1) {
      newArrToDelete.splice(puzzleToMove, 1);
      observableToDelete.next(newArrToDelete);
    }

    let newArrToPush = [...arrToPush];
    if (this.isCorrect()) {
      newArrToPush = [];
      observableToPush.next(newArrToPush);
    } else {
      newArrToPush.push(puzzle);
      observableToPush.next(newArrToPush);
    }
  }

  pushInResultsBlock(
    resultArr: PuzzleData[],
    sourceArr: PuzzleData[],
    puzzle: PuzzleData,
    currentSentenceLength: number,
  ) {
    return this.movePuzzles(
      resultArr,
      sourceArr,
      puzzle,
      // currentSentenceLength,
      this.resultPuzzles$,
      this.sourcePuzzles$,
    );
  }

  pushInSourceBlock(
    sourceArr: PuzzleData[],
    resultArr: PuzzleData[],
    puzzle: PuzzleData,
    currentSentenceLength: number,
  ) {
    return this.movePuzzles(
      sourceArr,
      resultArr,
      puzzle,
      this.sourcePuzzles$,
      this.resultPuzzles$,
    );
  }

  getLocalStorageProgressData(obj: {level: number, roundIndex: number}) {
    const currentProgressInfo = localStorage.getItem('currentProgress');
    if(currentProgressInfo) {
      localStorage.setItem('currentProgress', JSON.stringify(obj));
      this.gameProgressData.update(() => currentProgressInfo);
    } else {
      localStorage.setItem('currentProgress', JSON.stringify(obj));
    }
  }

  getCompletedRoundsStorage(obj: {level: number, round: number}) {
    const completedStorageData = localStorage.getItem('completedStorage');
    if(completedStorageData) {
      if (this.completedRoundsLevelsStorage().length) {
        this.completedRoundsLevelsStorage.update((value) => {
          const newValue = value;
          return [...newValue, obj].map((item) => JSON.stringify(item))
          .reduce((acc:{level: number, round: number}[], item, i, arr) => {
            if(arr.indexOf(item) === i) {
              acc.push(JSON.parse(item));
            }
            return acc;
          }, [])
        });
        localStorage.setItem('completedStorage', JSON.stringify(this.completedRoundsLevelsStorage()));
        console.log('Service', this.completedRoundsLevelsStorage());
      } else {
        this.completedRoundsLevelsStorage.set([JSON.parse(completedStorageData), obj]);
        localStorage.setItem('completedStorage', JSON.stringify(this.completedRoundsLevelsStorage()));
      }
    } else {
      localStorage.setItem('completedStorage', JSON.stringify(obj));
    }
  }

  parsePuzzleGameData(data: unknown): Level {
    const dataToString = JSON.stringify(data);
    const typedData: Level = JSON.parse(dataToString);
    return typedData;
  }
}
