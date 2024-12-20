import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import {
  Injectable,
  Injector,
  StaticProvider,
  TemplateRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ModalConfig } from './modal';
import { ModalContainerComponent } from '../../components/modal-container/modal-container.component';
import { ModalRef } from './modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
  ) { }

  open<T, D = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: ModalConfig<D>
  ): ModalRef<T> {
    const defaultConfig = new ModalConfig();
    config = config ? Object.assign(defaultConfig, config) : defaultConfig;

    const overlayRef = this._createOverlay(config);
    const container = this._createContainer(overlayRef, config);
    const modalRef = this._createContent(componentOrTemplateRef, container, overlayRef, config);

    this._registerListeners<T>(modalRef, config, container);

    return modalRef;
  }

  private _createOverlay(config: ModalConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(modalConfig: ModalConfig): OverlayConfig {
    const config = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      hasBackdrop: modalConfig.backdrop,
      backdropClass: '-backdrop',
    });

    return config;
  }

  private _createContainer(
    overlayRef: OverlayRef,
    config: ModalConfig
  ): ModalContainerComponent {
    const portal = new ComponentPortal(ModalContainerComponent, null, this._injector);
    const containerRef = overlayRef.attach(portal);
    containerRef.instance._config = config;
    return containerRef.instance;
  }

  private _createContent<T>(
    componentOrTemplate: ComponentType<T> | TemplateRef<T>,
    container: ModalContainerComponent,
    overlayRef: OverlayRef,
    config: ModalConfig
  ): ModalRef<T> {
    const modalRef = new ModalRef(overlayRef, container);

    if (componentOrTemplate instanceof TemplateRef) {
      container.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplate, config.viewContainerRef!, {
          $implicit: config.data,
          modalRef,
        } as any)
      );
    } else {
      const injector = this._createInjector<T>(config, modalRef, container);
      const contentRef = container.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplate, config.viewContainerRef, injector)
      );

      if (config.data) {
        Object.assign(contentRef.instance as any, { ...config.data });
      }
    }

    return modalRef;
  }

  private _createInjector<T>(
    config: ModalConfig,
    modalRef: ModalRef<T>,
    container: ModalContainerComponent
  ): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    // The dialog container should be provided as the dialog container and the dialog's
    // content are created out of the same `ViewContainerRef` and as such, are siblings
    // for injector purposes. To allow the hierarchy that is expected, the dialog
    // container is explicitly provided in the injector.
    const providers: StaticProvider[] = [
      { provide: ModalContainerComponent, useValue: container },
      { provide: ModalRef, useValue: modalRef },
    ];

    return Injector.create({ parent: userInjector || this._injector, providers });
  }

  private _registerListeners<T>(
    modalRef: ModalRef<T>,
    config: ModalConfig,
    container: ModalContainerComponent
  ): void {
    container.backdropClick$.pipe(take(1)).subscribe(() => {
      modalRef.close();
    });

    if (config.keyboard) {
      fromEvent(container._elementRef.nativeElement, 'keydown')
        .pipe(
          filter((event: KeyboardEvent | unknown) => {
            if (event instanceof KeyboardEvent) {
              return event.key === 'Escape';
            }
            return false;
          }),
          take(1)
        )
        .subscribe(() => {
          modalRef.close();
        });
    }
  }
}
