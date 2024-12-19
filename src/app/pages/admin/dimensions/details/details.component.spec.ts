import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionDetailsComponent } from './dimension-details.component';

describe('DimensionDetailsComponent', () => {
  let component: DimensionDetailsComponent;
  let fixture: ComponentFixture<DimensionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimensionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimensionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
