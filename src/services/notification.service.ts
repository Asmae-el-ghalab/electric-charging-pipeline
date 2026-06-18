// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationAction {
  label: string;
  callback: () => void;
  class?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  dismissible?: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Obtenir le flux des notifications
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  /**
   * Afficher une notification
   */
  show(notification: Notification): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
  }

  /**
   * Notification de succès
   */
  success(message: string, title?: string, duration: number = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'success',
      title: title || 'Succès',
      message,
      duration,
      dismissible: true,
      createdAt: new Date()
    });
  }

  /**
   * Notification d'erreur
   */
  error(message: string, title?: string, duration: number = 7000): void {
    this.show({
      id: this.generateId(),
      type: 'error',
      title: title || 'Erreur',
      message,
      duration,
      dismissible: true,
      createdAt: new Date()
    });
  }

  /**
   * Notification d'avertissement
   */
  warning(message: string, title?: string, duration: number = 5000): void {
    this.show({
      id: this.generateId(),
      type: 'warning',
      title: title || 'Attention',
      message,
      duration,
      dismissible: true,
      createdAt: new Date()
    });
  }

  /**
   * Notification d'information
   */
  info(message: string, title?: string, duration: number = 4000): void {
    this.show({
      id: this.generateId(),
      type: 'info',
      title: title || 'Information',
      message,
      duration,
      dismissible: true,
      createdAt: new Date()
    });
  }

  /**
   * Notification avec actions
   */
  showWithActions(
    message: string,
    actions: NotificationAction[],
    type: NotificationType = 'info',
    title?: string,
    duration: number = 10000
  ): void {
    this.show({
      id: this.generateId(),
      type,
      title: title || 'Action requise',
      message,
      actions,
      duration,
      dismissible: true,
      createdAt: new Date()
    });
  }

  /**
   * Notification persistante
   */
  showPersistent(message: string, type: NotificationType = 'info', title?: string): void {
    this.show({
      id: this.generateId(),
      type,
      title: title || 'Information',
      message,
      duration: 0,
      dismissible: true,
      createdAt: new Date()
    });
  }

  /**
   * Fermer une notification
   */
  dismiss(id: string): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter(n => n.id !== id));
  }

  /**
   * Fermer toutes les notifications
   */
  dismissAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Générer un ID unique
   */
  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Mettre à jour une notification
   */
  updateNotification(id: string, updates: Partial<Notification>): void {
    const current = this.notificationsSubject.value;
    const index = current.findIndex(n => n.id === id);
    
    if (index !== -1) {
      const updated = { ...current[index], ...updates };
      const newList = [...current];
      newList[index] = updated;
      this.notificationsSubject.next(newList);
    }
  }

  /**
   * Obtenir le nombre de notifications
   */
  getCount(): number {
    return this.notificationsSubject.value.length;
  }

  /**
   * Vérifier s'il y a des notifications
   */
  hasNotifications(): boolean {
    return this.notificationsSubject.value.length > 0;
  }
}