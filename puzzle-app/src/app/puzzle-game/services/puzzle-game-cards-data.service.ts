import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Rounds from '../interfaces/level-data.interface';
import { map, Observable } from 'rxjs';
import Level from '../interfaces/level-data.interface';

@Injectable({
  providedIn: 'root'
})
export class PuzzleGameCardsDataService {
  private http: HttpClient = inject(HttpClient)

  getCardsData (round: number): Observable<Rounds> {
    return this.http.get(`/api/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel${round}.json`,
      {
        headers: {
          'Content-type': 'application/json'
        },
      }
    ).pipe(
      map(data =>{
        const parsedData = this.parsePuzzleGameData(data);
        return parsedData;
      }),
    );
  }

  getWordsData(level: number, round: number, sentenceNumber: number) {
    return this.http.get(`/api/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel${level}.json`,
      {
        headers: {
          'Content-type': 'application/json'
        },
      }
    ).pipe(
      map((data) => {
        const parsedData = this.parsePuzzleGameData(data);
        const sentence = parsedData.rounds[round].words[sentenceNumber].textExample;
        return sentence;
      })
    )
  }

  parsePuzzleGameData(data: Object) {
    const dataToString = JSON.stringify(data);
    const typedData: Level = JSON.parse(dataToString);
    return typedData;
  }

}
