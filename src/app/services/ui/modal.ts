import { ViewContainerRef } from "@angular/core";
import { ModalContainerComponent } from "../../components/modal-container/modal-container.component";
import { OverlayRef } from "@angular/cdk/overlay";
import { Subject } from "rxjs";

export class ModalConfig<D = any> {
  animation?: boolean = true;
  backdrop?: boolean = true;
  ignoreBackdropClick?: boolean = false;
  keyboard?: boolean = true;
  modalClass?: string = '';
  containerClass?: string = '';
  viewContainerRef?: ViewContainerRef;
  data?: D | null = null;
}

export class ModalRef<T = any> {
  private readonly _close$ = new Subject<any>();
  readonly onClose = this._close$.asObservable();

  constructor(
    private _overlayRef: OverlayRef,
    private _container: ModalContainerComponent,
  ) {
  }

  close(result?: any): void {
    this._container._close();
    setTimeout(() => {
      this._container._restoreScrollbar();
      if (result) {
        this._close$.next(result);
      }
      this._close$.complete();
      this._overlayRef.detach();
      this._overlayRef.dispose();
    }, this._container.MODAL_TRANSITION);
  }
}
