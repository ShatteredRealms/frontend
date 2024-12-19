import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { CdkPortalOutlet, ComponentPortal, Portal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ElementRef, EmbeddedViewRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationConfig } from '../../services/ui/notification';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    PortalModule,
    OverlayModule,
  ],
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('150ms linear')),
      transition(':enter', [style({ opacity: 0 }), animate('150ms linear')]),
    ]),
  ],
})
export class NotificationContainerComponent {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet!: CdkPortalOutlet;

  readonly _destroy$ = new Subject<void>();
  readonly _hidden$ = new Subject<void>();
  readonly _mouseLeave$ = new Subject<void>();

  private readonly _bodyClasses: string[] = ['notification-open'];

  state:
    | 'visible'
    | 'hidden' = 'visible';
  hover = false;
  config: NotificationConfig = new NotificationConfig();

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public elementRef: ElementRef,
    private _renderer: Renderer2,
    private _cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this._bodyClasses.forEach((className) => {
      this._renderer.addClass(this._document.body, className);
    });
  }

  ngOnDestroy() {
    this._bodyClasses.forEach((className) => {
      this._renderer.removeClass(this._document.body, className);
    });
  }

  attachComponent<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplate<T>(portal: TemplatePortal<T>): EmbeddedViewRef<T> {
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  detectChanges(): void {
    this._cdRef.detectChanges();
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (event.toState === 'hidden') {
      this._hidden$.next();
    }
  }

  onMouseEnter(): void {
    this.hover = true;
  }

  onMouseLeave(): void {
    this.hover = false;
    this._mouseLeave$.next();
  }
}
