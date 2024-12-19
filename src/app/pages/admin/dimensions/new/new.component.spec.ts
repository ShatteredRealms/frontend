import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDimensionComponent as NewDimensionComponent } from './new.component';

describe('NewDimensionComponent', () => {
  let component: NewDimensionComponent;
  let fixture: ComponentFixture<NewDimensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDimensionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
