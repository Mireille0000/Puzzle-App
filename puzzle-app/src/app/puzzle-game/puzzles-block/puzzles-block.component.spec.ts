import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzlesBlockComponent } from './puzzles-block.component';

describe('PuzzlesBlockComponent', () => {
  let component: PuzzlesBlockComponent;
  let fixture: ComponentFixture<PuzzlesBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuzzlesBlockComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PuzzlesBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
