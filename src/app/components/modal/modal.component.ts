import { Component } from '@angular/core';
import { ModalRef } from '../../services/ui/modal';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  title: string | null = null;
  message: string | null = null;
  cancelText: string | null = 'Cancel';
  submitText: string = 'Submit';
  isWarning: boolean = false;
  constructor(
    protected modalRef: ModalRef<ModalComponent>,
  ) { }
}
