import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleGamePageComponent } from './puzzle-game-page.component';

describe('PuzzleGamePageComponent', () => {
  let component: PuzzleGamePageComponent;
  let fixture: ComponentFixture<PuzzleGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuzzleGamePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
