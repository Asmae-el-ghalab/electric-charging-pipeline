// src/app/components/notification/notification.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationType, NotificationAction } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container" 
         [ngClass]="['notification-' + type, { 'dismissible': dismissible }]"
         [class.notification-enter]="true">
      <div class="notification-icon">
        <i class="fas" [ngClass]="getIcon()"></i>
      </div>
      
      <div class="notification-content">
        <div class="notification-header" *ngIf="title">
          <strong>{{ title }}</strong>
          <span class="notification-time">{{ getTime() }}</span>
        </div>
        <div class="notification-message">{{ message }}</div>
        
        <div class="notification-actions" *ngIf="actions && actions.length > 0">
          <button *ngFor="let action of actions" 
                  class="btn-action" 
                  [ngClass]="action.class || ''"
                  (click)="onActionClick(action)">
            {{ action.label }}
          </button>
        </div>
      </div>
      
      <button class="notification-close" *ngIf="dismissible" (click)="onDismiss()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `,
  styles: [`
    .notification-container {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 10px;
      margin-bottom: 10px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid #ccc;
      max-width: 450px;
      min-width: 300px;
      position: relative;
      transition: all 0.3s ease;
      animation: slideInRight 0.3s ease forwards;
    }

    .notification-container:hover {
      transform: translateX(4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .notification-success {
      border-left-color: #4caf50;
    }

    .notification-success .notification-icon {
      color: #4caf50;
    }

    .notification-error {
      border-left-color: #f44336;
    }

    .notification-error .notification-icon {
      color: #f44336;
    }

    .notification-warning {
      border-left-color: #ff9800;
    }

    .notification-warning .notification-icon {
      color: #ff9800;
    }

    .notification-info {
      border-left-color: #2196f3;
    }

    .notification-info .notification-icon {
      color: #2196f3;
    }

    .notification-icon {
      font-size: 20px;
      flex-shrink: 0;
      margin-top: 2px;
      width: 24px;
      text-align: center;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      font-size: 14px;
      color: #333;
    }

    .notification-header strong {
      font-weight: 600;
    }

    .notification-time {
      font-size: 11px;
      color: #999;
      font-weight: 400;
    }

    .notification-message {
      font-size: 14px;
      color: #555;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .notification-actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }

    .btn-action {
      padding: 4px 12px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      background: #f0f0f5;
      color: #333;
    }

    .btn-action:hover {
      background: #e0e0e5;
    }

    .btn-action.primary {
      background: #4a90d9;
      color: white;
    }

    .btn-action.primary:hover {
      background: #357abd;
    }

    .btn-action.danger {
      background: #f44336;
      color: white;
    }

    .btn-action.danger:hover {
      background: #d32f2f;
    }

    .btn-action.success {
      background: #4caf50;
      color: white;
    }

    .btn-action.success:hover {
      background: #388e3c;
    }

    .notification-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      font-size: 16px;
      transition: color 0.2s;
      flex-shrink: 0;
      margin-top: -2px;
    }

    .notification-close:hover {
      color: #333;
    }

    .notification-container.dismissible {
      padding-right: 40px;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
      }
    }

    @media (max-width: 576px) {
      .notification-container {
        max-width: 100%;
        min-width: auto;
        margin: 0 10px 10px 10px;
        padding: 12px 16px;
      }

      .notification-container.dismissible {
        padding-right: 36px;
      }

      .notification-message {
        font-size: 13px;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() type: NotificationType = 'info';
  @Input() title?: string;
  @Input() message!: string;
  @Input() duration: number = 5000;
  @Input() actions: NotificationAction[] = [];
  @Input() dismissible: boolean = true;
  
  @Output() dismiss = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<{ notificationId: string; action: NotificationAction }>();

  private timeoutId: any = null;
  private startTime: Date = new Date();

  ngOnInit(): void {
    if (this.duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.onDismiss();
      }, this.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  getIcon(): string {
    switch (this.type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': default: return 'fa-info-circle';
    }
  }

  getTime(): string {
    const elapsed = new Date().getTime() - this.startTime.getTime();
    const seconds = Math.floor(elapsed / 1000);
    
    if (seconds < 60) {
      return 'À l\'instant';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `Il y a ${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    return `Il y a ${hours}h`;
  }

  onActionClick(action: NotificationAction): void {
    if (action.callback) {
      action.callback();
    }
    this.actionClick.emit({ notificationId: this.id, action });
  }

  onDismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.dismiss.emit(this.id);
  }

  resetTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    if (this.duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.onDismiss();
      }, this.duration);
    }
  }

  extendDuration(extraTime: number = 5000): void {
    if (this.duration > 0) {
      this.duration += extraTime;
      this.resetTimer();
    }
  }

  updateMessage(newMessage: string): void {
    this.message = newMessage;
  }

  updateTitle(newTitle: string): void {
    this.title = newTitle;
  }

  addAction(action: NotificationAction): void {
    this.actions.push(action);
  }

  removeAction(index: number): void {
    this.actions.splice(index, 1);
  }
}