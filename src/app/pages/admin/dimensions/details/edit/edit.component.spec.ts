import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDimensionComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditDimensionComponent;
  let fixture: ComponentFixture<EditDimensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDimensionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
