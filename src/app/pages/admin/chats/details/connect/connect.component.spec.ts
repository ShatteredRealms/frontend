import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConnectComponent } from './connect.component';

describe('ChatConnectComponent', () => {
  let component: ChatConnectComponent;
  let fixture: ComponentFixture<ChatConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatConnectComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
