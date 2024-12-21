import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbLayoutComponent } from './breadcrumb.component';

describe('BreadcrumbLayoutComponent', () => {
  let component: BreadcrumbLayoutComponent;
  let fixture: ComponentFixture<BreadcrumbLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbLayoutComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
