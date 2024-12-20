import { CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  HostBinding,
  Inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalConfig } from '../../services/ui/modal';
import { ConfigurableFocusTrapFactory, ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-modal-container',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    PortalModule,
    OverlayModule,
  ],
  templateUrl: './modal-container.component.html',
})
export class ModalContainerComponent {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;
  @ViewChild('dialog', { static: true }) modalDialog: ElementRef;

  readonly _destroy$: Subject<void> = new Subject<void>();
  readonly backdropClick$: Subject<MouseEvent> = new Subject<MouseEvent>();

  _config: ModalConfig;

  BACKDROP_TRANSITION = 150;
  MODAL_TRANSITION = 200;

  private _previouslyFocusedElement: HTMLElement;
  private _focusTrap: ConfigurableFocusTrap;

  @HostBinding('class.modal') modal = true;
  @HostBinding('class.fade')
  get hasAnimation(): boolean {
    return this._config.animation || false;
  }

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _focusTrapFactory: ConfigurableFocusTrapFactory
  ) { }

  ngOnInit(): void {
    this._updateContainerClass();
    this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'block');
    this._previouslyFocusedElement = this._document.activeElement as HTMLElement;
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);

    if (this._config.animation) {
      setTimeout(() => {
        this._renderer.addClass(this._elementRef.nativeElement, 'show');

        setTimeout(() => {
          this._focusTrap.focusInitialElementWhenReady();
        }, this.MODAL_TRANSITION);
      }, this.BACKDROP_TRANSITION);
    } else {
      this._focusTrap.focusInitialElementWhenReady();
    }
  }

  ngAfterViewInit(): void {
    const widthWithVerticalScroll = this._document.body.offsetWidth;
    this._renderer.addClass(this._document.body, 'modal-open');
    const widthWithoutVerticalScroll = this._document.body.offsetWidth;
    this._renderer.setStyle(
      this._document.body,
      'padding-right',
      `${widthWithoutVerticalScroll - widthWithVerticalScroll}px`
    );

    if (!this._config.ignoreBackdropClick) {
      fromEvent(this._elementRef.nativeElement, 'mousedown')
        .pipe(
          filter((event: MouseEvent | unknown) => {
            if (!(event instanceof MouseEvent)) {
              return true;
            }
            const target = event.target as HTMLElement;
            const dialog = this.modalDialog.nativeElement;
            const notDialog = target !== dialog;
            const notDialogContent = !dialog.contains(target);
            console.log(notDialog, notDialogContent);
            return notDialog && notDialogContent;
          }),
          takeUntil(this._destroy$)
        )
        .subscribe((event: MouseEvent | unknown) => {
          if (event instanceof MouseEvent) {
            this.backdropClick$.next(event);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this._previouslyFocusedElement.focus();
    this._focusTrap.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateContainerClass(): void {
    if (
      this._config.containerClass === '' ||
      (this._config.containerClass?.length && this._config.containerClass.length === 0)
    ) {
      return;
    }

    const containerClasses = this._config.containerClass?.split(' ') || [];

    containerClasses.forEach((containerClass) => {
      this._renderer.addClass(this._elementRef.nativeElement, containerClass);
    });
  }

  _close(): void {
    if (this._config.animation) {
      this._renderer.removeClass(this._elementRef.nativeElement, 'show');
    }

    // Pause iframe/video when closing modal
    const iframeElements = Array.from(this._elementRef.nativeElement.querySelectorAll('iframe')) as HTMLIFrameElement[];
    const videoElements = Array.from(this._elementRef.nativeElement.querySelectorAll('video')) as HTMLVideoElement[];

    iframeElements.forEach((iframe: HTMLIFrameElement) => {
      const srcAttribute: any = iframe.getAttribute('src');
      this._renderer.setAttribute(iframe, 'src', srcAttribute);
    });

    videoElements.forEach((video: HTMLVideoElement) => {
      video.pause();
    });
  }

  _restoreScrollbar(): void {
    this._renderer.removeClass(this._document.body, 'modal-open');
    this._renderer.removeStyle(this._document.body, 'padding-right');
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalOutlet.attachTemplatePortal(portal);
  }
}
