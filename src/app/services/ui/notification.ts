import { first, Observable, Subject } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";
import { ViewContainerRef } from "@angular/core";
import { NotificationService } from "./notification.service";
import { NotificationContainerComponent } from "../../components/notification-container/notification-container.component";

export class NotificationConfig<T = any> {
  position?:
    | 'top-center'
    | 'top-left'
    | 'top-right'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right' = 'top-right';
  width?: string = 'fit-content';
  delay?: number = 5000;
  autohide?: boolean = true;
  stacking?: boolean = true;
  offset?: number = 20;
  ref?: ViewContainerRef;
  data?: T | null = null;
}

export class NotificationRef {
  private readonly onClose$ = new Subject();
  readonly onClose: Observable<any> = this.onClose$.asObservable();

  constructor(
    public overlayRef: OverlayRef,
    private _service: NotificationService,
    private _container: NotificationContainerComponent,
  ) { }

  close(message?: any): void {
    this.onClose$.next(message);
    this.onClose$.complete();
    this._container._hidden$.pipe(first()).subscribe(() => {
      this._service.updateToast(this);
      this.overlayRef.detach();
      this.overlayRef.dispose();
    })
    this._container.state = 'hidden';
  }

  position(): DOMRect {
    const element = this.overlayRef.overlayElement;
    return element ?
      element.getBoundingClientRect() :
      new DOMRect();
  }
}
