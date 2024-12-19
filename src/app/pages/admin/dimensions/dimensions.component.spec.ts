import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDimensionsComponent } from './dimensions.component';

describe('DimensionsComponent', () => {
  let component: AdminDimensionsComponent;
  let fixture: ComponentFixture<AdminDimensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDimensionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
