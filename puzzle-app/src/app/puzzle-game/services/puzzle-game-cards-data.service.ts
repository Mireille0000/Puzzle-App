import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Level, Card } from '../interfaces/level-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PuzzleGameCardsDataService {
  private http: HttpClient = inject(HttpClient);

  resultPuzzles$ = new Subject<Array<string>>();

  sourcePuzzles$ = new Subject<Array<string>>();

  currentSentence = signal(['']);

  level = signal(1);

  round = signal(0);

  sentenceNumber = signal(0);

  sentences = signal<Card[]>([]); // ?

  sentenceTranslation = signal<string>('');

  audioHint = signal<string>('');

  imageHint = signal<string>('');

  backgroundImagePath = signal<string>('');

  isClikedImageHint = signal<boolean>(false); //??

  correctSentences = signal<string[][]>([]);

  isCorrect = signal<boolean>(false);

  isDisabled = signal<boolean>(true);

  isCorrectWordsOrder = signal<boolean>(false); // ??

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

        const sentencesArr = parsedData.rounds[round].words;
        this.sentences.set(sentencesArr);

        const wordsArr = sentence.split(' ');
        const reducedCurrentWordsArr: string[] = wordsArr.reduce((acc: string[], item, i) => {
          const randomNumber = this.getRandomInt(wordsArr.length);
          [acc[i], acc[randomNumber]] = [acc[randomNumber], acc[i]];
          return acc;
        }, wordsArr);

        const randomizedWordsArr = reducedCurrentWordsArr;

        const audioHint = parsedData.rounds[this.round()].words[this.sentenceNumber()].audioExample;
        this.audioHint.set(audioHint);
        const imagePath = parsedData.rounds[this.round()].levelData.cutSrc;
        this.imageHint.set(imagePath);

        const test = parsedData.rounds[this.round()].levelData;
        console.log(test);

        this.sourcePuzzles$.next(randomizedWordsArr);
        this.currentSentence.set(sentence.split(' '));
        this.sentenceTranslation.set(sentenceTranslation); //???
        return randomizedWordsArr;
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
        return this.backgroundImagePath;
      })
    )
  }

  movePuzzles(
    arrToPush: string[],
    arrToDelete: string[],
    word: string,
    currentSentenceLength: number,
    observableToPush: Subject<string[]>,
    observableToDelete: Subject<string[]>,
  ) {
    const formattedWord = word.replaceAll('\n', '').trim();
    const wordToDeleteFromSource = arrToDelete.indexOf(formattedWord);

    const newArrToDelete = [...arrToDelete];
    newArrToDelete.splice(wordToDeleteFromSource, 1);
    observableToDelete.next(newArrToDelete);

    let newArrToPush = [...arrToPush];
    if (this.isCorrect()) {
      newArrToPush = [];
      observableToPush.next(newArrToPush);
    } else {
      newArrToPush.push(formattedWord);
      observableToPush.next(newArrToPush);
    }
  }

  pushInResultsBlock(
    resultArr: string[],
    sourceArr: string[],
    word: string,
    currentSentenceLength: number,
  ) {
    return this.movePuzzles(
      resultArr,
      sourceArr,
      word,
      currentSentenceLength,
      this.resultPuzzles$,
      this.sourcePuzzles$,
    );
  }

  pushInSourceBlock(
    sourceArr: string[],
    resultArr: string[],
    word: string,
    currentSentenceLength: number,
  ) {
    return this.movePuzzles(
      sourceArr,
      resultArr,
      word,
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

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
