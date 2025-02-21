import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintsBlockComponent } from './hints-block.component';

describe('HintsBlockComponent', () => {
  let component: HintsBlockComponent;
  let fixture: ComponentFixture<HintsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HintsBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HintsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
