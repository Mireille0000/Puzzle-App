import {
  Component, inject, OnInit, signal,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { SelectedDirective } from '../directives/selected.directive';
import { OptionsSelection } from '../interfaces/options-selection';
import { CompletedDirective } from '../directives/completed.directive';
import { delay } from 'rxjs';

@Component({
  selector: 'pzl-levels-and-rounds',
  imports: [NgFor, CommonModule, ReactiveFormsModule, SelectedDirective, CompletedDirective],
  templateUrl: './levels-and-rounds.component.html',
  styleUrl: './levels-and-rounds.component.scss',
})
export class LevelsAndRoundsComponent implements OnInit {
  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  level = signal<number>(1);

  round = signal<number>(0);

  sentenceNumber = signal<number>(0);

  canSeeResults = signal<boolean>(false);

  levelsNum: {value: number, option: number}[] = [];

  roundsPerLevel = signal<Array<{value: number, option: number}>>([{ value: 0, option: 1 }]);

  form = signal<FormGroup>(new FormGroup({
    level: new FormControl(),
    round: new FormControl(),
  }));

  optionsRounds: OptionsSelection = { chosenOption: 0, roundLevel: 0 };

  optionsLevels: OptionsSelection = { chosenOption: 0, roundLevel: 0 };

  completedRoundsLevelsStorage =
  signal<{level: number, round: number}[]>([]);


  ngOnInit(): void {
    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;

    this.canSeeResults = this.puzzlesDataService.canSeeResults;

    this.levelsNum = Array.from({ length: 6 }, (item, i) => {
      item = { value: i, option: i + 1 };
      return item;
    }) as {value: number, option: number}[];

    this.completedRoundsLevelsStorage = this.puzzlesDataService.completedRoundsLevelsStorage;

    this.puzzlesDataService.getLevelData(this.level()).subscribe(() => {
      this.roundsPerLevel = this.puzzlesDataService.roundsPerLevel;
      this.roundsPerLevel.update(() => this.puzzlesDataService.roundsPerLevel());
      this.completedRoundsLevelsStorage.update(() => this.puzzlesDataService.completedRoundsLevelsStorage());
      // this.renewLocalStorage();
      const completedRoundsLS = localStorage.getItem('completedStorage');
      const parsed = JSON.parse(completedRoundsLS as string);
      console.log(parsed);
      this.completedRoundsLevelsStorage = this.puzzlesDataService.completedRoundsLevelsStorage;
      if(this.completedRoundsLevelsStorage().length && parsed.length) {
        this.completedRoundsLevelsStorage.update((value) => {
          const newValue = value;
          return newValue.map((item) => JSON.stringify(item)).reduce((acc: {level: number, round: number}[], item, i, arr) => {
            if(arr.indexOf(item) === i) {
              acc.push(JSON.parse(item));
            }
            return acc;
          }, [])
        });
        console.log(this.completedRoundsLevelsStorage());
        console.log('first!!!')
      } else if (parsed && !parsed.length) {
        console.log('second!!!')
        this.completedRoundsLevelsStorage.set([parsed]);
      }
      console.log('completedRoundsLevelsStorage', this.completedRoundsLevelsStorage().length);


      this.form = this.puzzlesDataService.form;
      this.form().get('level')?.setValue(this.levelsNum[this.level() - 1]);
      this.form().get('round')?.setValue(this.roundsPerLevel()[this.round()]);
    });
  }

  renewLocalStorage() {
    if(localStorage.getItem('completedStorage')) {
      const completedRoundsLS = localStorage.getItem('completedStorage');
      const parsed = JSON.parse(completedRoundsLS as string);
      console.log('parsed', parsed);
      console.log(this.completedRoundsLevelsStorage());
      this.completedRoundsLevelsStorage = this.puzzlesDataService.completedRoundsLevelsStorage;
      if(this.completedRoundsLevelsStorage().length) {
        const setcompletedRoundsLevelsStorage = new Set(this.completedRoundsLevelsStorage().map((item) => JSON.stringify(item)));
        const completedRoundsLevelsStorage = Array.from(setcompletedRoundsLevelsStorage).map((item) => JSON.parse(item));
        this.completedRoundsLevelsStorage.update((value) => [...value, ...completedRoundsLevelsStorage]);
      } else {
        this.completedRoundsLevelsStorage.set(parsed);
        console.log('completedRoundsLevelsStorage', this.completedRoundsLevelsStorage().length);
      }
    } else {
      this.completedRoundsLevelsStorage.update((value) => {
        console.log('in renewLS',value);
        const newValue = value;
        newValue.push({level: this.level(), round: this.round()})
        return newValue;
      });
    }
  } // refactor

  createRoundOptionsObj(round: number) {
    this.optionsRounds = { chosenOption: this.round() + 1, roundLevel: round };
    return this.optionsRounds;
  } //

  createLevelOptionsObj(level: number) {
    this.optionsLevels = { chosenOption: this.level(), roundLevel: level };
    return this.optionsLevels;
  } //

  chooseLevel() {
    const selectedLevel = this.form().get('level')?.value.option;
    console.log(this.form().get('level'));

    this.level.update((value) => {
      let newValue = value;
      newValue = selectedLevel;
      return newValue;
    });

    this.round.update((value) => {
      let newValue = value;
      newValue = 0;
      return newValue;
    });

    this.puzzlesDataService.getLevelData(this.level()).subscribe((data) => {
      this.roundsPerLevel = this.puzzlesDataService.roundsPerLevel;
      this.completedRoundsLevelsStorage = this.puzzlesDataService.completedRoundsLevelsStorage;
      this.renewLocalStorage();
      localStorage.setItem('chosenLevel', `${this.level()}`);

      this.form = this.puzzlesDataService.form;
      console.log(this.form());
      // add logic to
      return data;
    })
    // value is incrementing...
    this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber())
      .subscribe((data) => data);
  }

  chooseRound() {
    const selectedRound = this.form().get('round')?.value.option;
    this.round.update((value) => {
      let newValue = value;
      newValue = selectedRound - 1;
      return newValue;
    });

    this.puzzlesDataService.getLevelData(this.level()).subscribe(() => {
      this.completedRoundsLevelsStorage = this.puzzlesDataService.completedRoundsLevelsStorage;
      console.log(this.completedRoundsLevelsStorage());
      const completedRoundsLS = localStorage.getItem('completedStorage');
      const chosenRound = JSON.parse(localStorage.getItem('chosenRound') as string);
      if (this.completedRoundsLevelsStorage().length) {
        const getChosenRound = (item: {level: number, round: number}) => item.level === this.level() && item.round === this.round();
        if(this.completedRoundsLevelsStorage().some(getChosenRound)) {
          this.canSeeResults.update(() => true);
          localStorage.setItem('chosenRound', `${this.round() + 1}`);
          // localStorage.setItem('chosenRound', `${+chosenRound + 1}`);
          console.log('Already completed!');
          console.log(this.canSeeResults());
        } else {
          this.canSeeResults.update(() => false);
          console.log('Not completed yet!');
        }
      } else if (completedRoundsLS) {
        const parsed = JSON.parse(completedRoundsLS as string);
        this.completedRoundsLevelsStorage.set([parsed]);
        const getChosenRound = (item: {level: number, round: number}) => item.level === this.level() && item.round === this.round();
        if(this.completedRoundsLevelsStorage().some(getChosenRound)) {
          this.canSeeResults.update(() => true);
          localStorage.setItem('chosenRound', `${this.round() + 1}`);
          console.log('Already completed!');
          console.log(this.canSeeResults());
        } else {
          this.canSeeResults.update(() => false);
          console.log('Not completed yet!');
        }
        console.log(this.completedRoundsLevelsStorage());
      }
    });
    this.puzzlesDataService
      .getWordsData(this.level(), this.round(), this.sentenceNumber())
      .subscribe((data) => data);
  }
}
