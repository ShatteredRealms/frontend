import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionFormComponent } from './dimension-form.component';

describe('DimensionFormComponent', () => {
  let component: DimensionFormComponent;
  let fixture: ComponentFixture<DimensionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimensionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimensionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
