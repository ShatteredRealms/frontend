import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsTableComponent } from './maps-table.component';

describe('MapsTableComponent', () => {
  let component: MapsTableComponent;
  let fixture: ComponentFixture<MapsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
