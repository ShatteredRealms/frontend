import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsPage } from './admin-settings.component';

describe('AdminSettingsComponent', () => {
  let component: AdminSettingsPage;
  let fixture: ComponentFixture<AdminSettingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettingsPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
