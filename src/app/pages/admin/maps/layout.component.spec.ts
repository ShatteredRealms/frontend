import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMapLayout } from './layout.component';

describe('chatsLayoutComponent', () => {
  let component: AdminMapLayout;
  let fixture: ComponentFixture<AdminMapLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMapLayout]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminMapLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
