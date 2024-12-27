import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFormComponent } from './map-form.component';

describe('MapFormComponent', () => {
  let component: MapFormComponent;
  let fixture: ComponentFixture<MapFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
