import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelsAndRoundsComponent } from './levels-and-rounds.component';

describe('LevelsAndRoundsComponent', () => {
  let component: LevelsAndRoundsComponent;
  let fixture: ComponentFixture<LevelsAndRoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelsAndRoundsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LevelsAndRoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
