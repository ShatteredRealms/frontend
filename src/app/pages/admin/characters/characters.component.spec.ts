import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCharactersComponent } from './characters.component';

describe('CharactersComponent', () => {
  let component: AdminCharactersComponent;
  let fixture: ComponentFixture<AdminCharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCharactersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminCharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
