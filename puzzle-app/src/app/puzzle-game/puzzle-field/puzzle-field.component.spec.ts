import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleFieldComponent } from './puzzle-field.component';

describe('PuzzleFieldComponent', () => {
  let component: PuzzleFieldComponent;
  let fixture: ComponentFixture<PuzzleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuzzleFieldComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PuzzleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
