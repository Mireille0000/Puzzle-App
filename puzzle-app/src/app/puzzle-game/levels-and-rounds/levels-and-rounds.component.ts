import {
  Component, inject, OnInit, signal,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { SelectedDirective } from '../directives/selected.directive';
import { OptionsSelection } from '../interfaces/options-selection';
import { CompletedDirective } from '../directives/completed.directive';

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

  completedRoundsLevelsStorage = signal<Array<{level: number, round: number}>>([{level: this.level(), round: this.round()}]);


  ngOnInit(): void {
    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;

    this.canSeeResults = this.puzzlesDataService.canSeeResults;

    this.levelsNum = Array.from({ length: 6 }, (item, i) => {
      item = { value: i, option: i + 1 };
      return item;
    }) as {value: number, option: number}[];

    this.puzzlesDataService.getLevelData(this.level()).subscribe(() => {
      this.roundsPerLevel = this.puzzlesDataService.roundsPerLevel;
      this.roundsPerLevel.update(() => this.puzzlesDataService.roundsPerLevel());
      this.renewLocalStorage();
      console.log(this.roundsPerLevel().length);

      this.form = this.puzzlesDataService.form;
      this.form().get('level')?.setValue(this.levelsNum[this.level() - 1]);
      this.form().get('round')?.setValue(this.roundsPerLevel()[this.round()]);
      console.log(this.form());
    });
  }

  renewLocalStorage() {
    if(localStorage.getItem('completedStorage')) {
      const completedRoundsLS = localStorage.getItem('completedStorage');
      const parsed = JSON.parse(completedRoundsLS as string);
      this.completedRoundsLevelsStorage = this.puzzlesDataService.completedRoundsLevelsStorage;
      this.completedRoundsLevelsStorage.set(parsed);
    }
  }

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
      // this.roundsPerLevel.update(() => this.puzzlesDataService.roundsPerLevel());
      this.renewLocalStorage();
      this.form = this.puzzlesDataService.form;
      console.log(this.form());
      // this.form().get('round')?.setValue(this.roundsPerLevel()[this.round()]);
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
      this.renewLocalStorage();
      const getChosenRound = (item: {level: number, round: number}) => item.level === this.level() && item.round === this.round();
      if(this.completedRoundsLevelsStorage().some(getChosenRound)) {
        this.canSeeResults.update(() => true);
        localStorage.setItem('chosenRound', `${this.round() + 1}`);
        console.log('Already completed!');
      } else {
        this.canSeeResults.update(() => false);
        console.log('Not completed yet!');
      }
    });
    this.puzzlesDataService
      .getWordsData(this.level(), this.round(), this.sentenceNumber())
      .subscribe((data) => data);
    console.log(this.completedRoundsLevelsStorage());
  }
}
