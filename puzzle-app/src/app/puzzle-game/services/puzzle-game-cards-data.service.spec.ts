import { TestBed } from '@angular/core/testing';

import { PuzzleGameCardsDataService } from './puzzle-game-cards-data.service';

describe('PuzzleGameCardsDataService', () => {
  let service: PuzzleGameCardsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuzzleGameCardsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
