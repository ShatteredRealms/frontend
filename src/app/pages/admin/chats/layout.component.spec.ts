import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChatLayout } from './layout.component';

describe('chatsLayoutComponent', () => {
  let component: AdminChatLayout;
  let fixture: ComponentFixture<AdminChatLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChatLayout]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminChatLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
