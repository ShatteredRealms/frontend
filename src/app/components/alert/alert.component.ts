import { Component } from '@angular/core';
import { NotificationRef } from '../../services/ui/notification';
import { NavigationStart, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircleSolid, heroExclamationCircleSolid, heroExclamationTriangleSolid, heroInformationCircleSolid, heroQuestionMarkCircleSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-alert',
  imports: [
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      heroCheckCircleSolid,
      heroInformationCircleSolid,
      heroExclamationTriangleSolid,
      heroExclamationCircleSolid,
      heroQuestionMarkCircleSolid,
    }),
  ],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  message: string = '';
  persist: boolean = false;
  type:
    | 'success'
    | 'info'
    | 'warning'
    | 'error' = 'info';
  constructor(
    protected _notification: NotificationRef,
    protected _router: Router,
  ) { }

  ngOnInit() {
    if (!this.persist) {
      this._router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this._notification.close();
        }
      });
    }
  }

  bgColor(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-50';
      case 'info':
        return 'bg-teal-50'
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50'
      default:
        return 'bg-gray-50';
    }
  }

  iconColor(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-400';
      case 'info':
        return 'text-teal-400'
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-400';
    }
  }

  messageColor(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-800';
      case 'info':
        return 'text-teal-800'
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800'
      default:
        return 'text-gray-800';
    }
  }

  buttonColors(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50"';
      case 'info':
        return 'text-teal-500 hover:bg-teal-100 focus:ring-teal-600 focus:ring-offset-teal-50'
      case 'warning':
        return 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50';
      case 'error':
        return 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
      default:
        return 'text-gray-500 hover:bg-gray-100 focus:ring-gray-600 focus:ring-offset-gray-50';
    }
  }

  icon(): string {
    switch (this.type) {
      case 'success':
        return 'heroCheckCircleSolid';
      case 'info':
        return 'heroInformationCircleSolid'
      case 'warning':
        return 'heroExclamationTriangleSolid';
      case 'error':
        return 'heroExclamationCircleSolid'
      default:
        return 'heroQuestionMarkCircleSolid';
    }
  }

  close() {
    this._notification.close();
  }
}
