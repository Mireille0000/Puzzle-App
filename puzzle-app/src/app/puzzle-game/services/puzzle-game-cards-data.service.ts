import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuzzleGameCardsDataService {

  constructor(private http: HttpClient) { }

  getCardsData () {
    return this.http.get('/api/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel1.json',
      {
        headers: {
          'Content-type': 'application/json'
        },
      }
    )
  }
}
