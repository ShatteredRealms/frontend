import { Injectable, Injector, TemplateRef } from '@angular/core';
import { NotificationConfig } from './notification';
import { ComponentType, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { NotificationRef } from './notification';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { NotificationContainerComponent } from '../../components/notification-container/notification-container.component';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  timeout: any;
  toasts: NotificationRef[] = [];
  config: NotificationConfig = new NotificationConfig();

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
  ) { }

  open<T, D = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    newConfig?: NotificationConfig<D>
  ): NotificationRef {
    const defaultConfig = new NotificationConfig();
    this.config = newConfig ? Object.assign(defaultConfig, newConfig) : defaultConfig;

    const overlayRef = this._createOverlay(this.config);
    const container = this._createContainer(overlayRef, this.config);
    const toastRef = this._createContent(
      componentOrTemplateRef,
      container,
      overlayRef,
      this.config
    );

    if (this.config.stacking) {
      this.toasts.push(toastRef);
    }

    if (this.config.autohide) {
      this.autohide(overlayRef, container, toastRef);
    }

    return toastRef;
  }

  autohide(
    overlayRef: OverlayRef,
    container: NotificationContainerComponent,
    toastRef: NotificationRef
  ): void {
    this.timeout = setTimeout(() => {
      if (container.hover) {
        container._mouseLeave$.pipe(first()).subscribe(() => {
          this.autohide(overlayRef, container, toastRef);
        });
        return;
      }

      container._hidden$.pipe(first()).subscribe(() => {
        if (this.config.stacking) {
          this.updateToast(toastRef);
        }
        overlayRef.detach();
        overlayRef.dispose();
      });

      container.state = 'hidden';
      container.detectChanges();
    }, this.config.delay);
  }

  updateToast(toastRef: any): void {
    this.toasts.splice(this.toasts.indexOf(toastRef), 1);

    this.toasts.forEach((toast, index) => {
      toast.overlayRef.updatePositionStrategy(
        this._getPositionStrategy(this.config, index - 1),
      );
    });
  }


  private _createOverlay(config: NotificationConfig): OverlayRef {
    return this._overlay.create(
      this._getOverlayConfig(config),
    );
  }
  private _offset(config: NotificationConfig, index?: number): number {
    const vDir = config.position!.startsWith('top') ? 'bottom' : 'top';
    const adjustment = vDir === 'top' ? window.innerHeight : 0;
    if (this.toasts.length === 0 || (index && index <= -1)) {
      return config.offset || 0;
    } else if (index || index === 0) {
      return Math.abs(adjustment - this.toasts[index].position()[vDir]);
    } else {
      return Math.abs(
        adjustment - (this.toasts.at(-1)!.position()[vDir] * (index || 1)),
      );
    }
  }

  private _getOverlayConfig(notificationConfig: NotificationConfig): OverlayConfig {
    const config = new OverlayConfig({
      positionStrategy: this._getPositionStrategy(notificationConfig),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      height: 'fit-content',
      width: notificationConfig.width,
    });

    return config;
  }

  private _getPositionStrategy(
    config: NotificationConfig,
    index?: number
  ): PositionStrategy {
    const yOffset = `${this._offset(config, index)}px`;
    const xOffset = `${config.offset}px`;
    const pos = this._overlay.position().global();
    switch (config.position) {
      case 'top-center':
        return pos.top(yOffset).centerHorizontally();
      case 'top-left':
        return pos.top(yOffset).left(xOffset);
      case 'top-right':
        return pos.top(yOffset).right(xOffset);
      case 'bottom-center':
        return pos.bottom(yOffset).centerHorizontally();
      case 'bottom-left':
        return pos.bottom(yOffset).left(xOffset);
      case 'bottom-right':
        return pos.bottom(yOffset).right(xOffset);
      default:
        return this._overlay.position().global().centerVertically().centerHorizontally();
    }
  }

  private _createContainer(
    overlayRef: OverlayRef,
    config: NotificationConfig
  ): NotificationContainerComponent {
    const portal = new ComponentPortal(
      NotificationContainerComponent,
      config.ref,
      this._injector,
    );
    const containerRef = overlayRef.attach(portal);
    containerRef.instance.config = config;
    return containerRef.instance;
  }
  private _createContent<T>(
    item: ComponentType<T> | TemplateRef<T>,
    container: NotificationContainerComponent,
    overlayRef: OverlayRef,
    config: NotificationConfig,
  ) {
    const notificationRef = new NotificationRef(overlayRef, this, container);
    if (item instanceof TemplateRef) {
      container.attachTemplate(
        new TemplatePortal<T>(item, config.ref!, {
          $implicit: config.data,
          notificationRef,
        } as any),
      );
    } else {
      const injector = Injector.create({
        parent: config && config.ref && config.ref.injector || this._injector,
        providers: [
          { provide: NotificationRef, useValue: notificationRef },
          { provide: NotificationContainerComponent, useValue: container },
        ],
      });
      const contentRef = container.attachComponent<T>(
        new ComponentPortal(item, config.ref, injector),
      );
      if (config.data) {
        Object.assign(contentRef.instance as any, { ...config.data });
      }
    }

    return notificationRef;
  }
}
