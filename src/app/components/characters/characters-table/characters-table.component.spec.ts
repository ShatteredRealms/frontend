import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersTableComponent } from './characters-table.component';

describe('CharactersTableComponent', () => {
  let component: CharactersTableComponent;
  let fixture: ComponentFixture<CharactersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharactersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
