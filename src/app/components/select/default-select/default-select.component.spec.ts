import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSelectComponent } from './default-select.component';

describe('DefaultSelectComponent', () => {
  let component: DefaultSelectComponent;
  let fixture: ComponentFixture<DefaultSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
