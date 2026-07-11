// src/app/components/navbar/navbar.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Renderer2,
  ElementRef,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  computed,
  effect
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  filter
} from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbarComponent.html',
  styleUrls: ['./navbarComponent.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, OnDestroy {

  /* =========================
     INJECTIONS
  ========================= */

  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  /* =========================
     ROUTE STATE
     Accueil = transparent
     Autres pages = navbar blanche
  ========================= */

  isHomePage = signal<boolean>(true);

  /* =========================
     AUTH STATE
  ========================= */

  isLoggedIn = signal<boolean>(false);
  userName = signal<string>('');
  userRole = signal<string>('');
  userEmail = signal<string>('');
  userId = signal<string | null>(null);

  /* =========================
     UI STATE
  ========================= */

  menuOpen = signal<boolean>(false);
  dropdownOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  /* =========================
     COMPUTED SIGNALS
  ========================= */

  userInitial = computed(() => {
    const name = this.userName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });

  isAdmin = computed(() => {
    const role = this.userRole();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  });

  isConducteur = computed(() => {
    const role = this.userRole();
    return role === 'CONDUCTEUR' || role === 'ROLE_CONDUCTEUR';
  });

  isPassager = computed(() => {
    const role = this.userRole();
    return role === 'PASSAGER' || role === 'ROLE_PASSAGER';
  });

  /* =========================
     PRIVATE VARIABLES
  ========================= */

  private destroy$ = new Subject<void>();
  private scrollFrame: number | null = null;
  private resizeTimer: any;

  constructor() {
    effect(() => {
      this.checkAuthStatus();
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();

    /* Détecter la page actuelle au démarrage */
    this.updateHomePageState(this.router.url);

    /* Détecter chaque changement de page */
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateHomePageState(event.urlAfterRedirects);
        this.closeMenu();
        this.closeDropdown();
        this.cdr.markForCheck();
      });

    /* Observer les changements de connexion */
    this.authService.user$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.checkAuthStatus();
        this.cdr.markForCheck();
      });

    /* Vérifier scroll au chargement */
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    if (this.scrollFrame !== null && isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.scrollFrame);
    }

    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  /* =========================
     ROUTE METHODS
  ========================= */

 private updateHomePageState(url: string): void {
  const cleanUrl = url.split('?')[0].split('#')[0];

  /* Pages avec navbar transparente en haut : Accueil + À propos */
  const transparentPages = ['/', '', '/bornes'];

  this.isHomePage.set(transparentPages.includes(cleanUrl));

  this.cdr.markForCheck();
}

  /* =========================
     AUTH METHODS
  ========================= */

  checkAuthStatus(): void {
    const loggedIn = this.authService.isLoggedIn();
    this.isLoggedIn.set(loggedIn);

    if (loggedIn) {
      const user = this.authService.getUser();

      if (user) {
        this.userName.set(user.nom || 'Utilisateur');
        this.userRole.set(user.role || '');
        this.userEmail.set(user.email || '');
        this.userId.set(user.id || null);
      } else {
        this.userName.set(this.authService.getUserName() || 'Utilisateur');
        this.userRole.set(this.authService.getUserRole() || '');
        this.userEmail.set(this.authService.getUserEmail() || '');
        this.userId.set(this.authService.getUserId());
      }
    } else {
      this.userName.set('');
      this.userRole.set('');
      this.userEmail.set('');
      this.userId.set(null);
    }

    this.cdr.markForCheck();
  }

  logout(): void {
    this.isLoading.set(true);

    this.dropdownOpen.set(false);
    this.closeMenu();

    this.authService.logout();

    this.isLoggedIn.set(false);
    this.userName.set('');
    this.userRole.set('');
    this.userEmail.set('');
    this.userId.set(null);

    this.isLoading.set(false);

    this.notificationService.success('Déconnexion réussie');

    this.router.navigate(['/']);

    this.cdr.markForCheck();
  }

  /* =========================
     UI METHODS
  ========================= */

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
    this.updateBodyScroll();
    this.updateMobileAuthVisibility();
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.updateBodyScroll();
    this.updateMobileAuthVisibility();
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(value => !value);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  /* =========================
     SCROLL
  ========================= */

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.scrollFrame !== null) {
      cancelAnimationFrame(this.scrollFrame);
    }

    this.scrollFrame = requestAnimationFrame(() => {
      const scrolled = window.scrollY > 50;

      if (this.isScrolled() !== scrolled) {
        this.isScrolled.set(scrolled);
        this.cdr.markForCheck();
      }

      this.scrollFrame = null;
    });
  }

  /* =========================
     RESIZE
  ========================= */

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    clearTimeout(this.resizeTimer);

    this.resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && this.menuOpen()) {
        this.closeMenu();
      }

      this.cdr.markForCheck();
    }, 150);
  }

  /* =========================
     CLICK OUTSIDE
  ========================= */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.user-dropdown') && !target.closest('.mobile-menu-btn')) {
      if (this.dropdownOpen()) {
        this.dropdownOpen.set(false);
        this.cdr.markForCheck();
      }
    }
  }

  /* =========================
     KEYBOARD
  ========================= */

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.dropdownOpen()) {
        this.dropdownOpen.set(false);
      }

      if (this.menuOpen()) {
        this.closeMenu();
      }

      this.cdr.markForCheck();
    }
  }

  /* =========================
     PRIVATE HELPERS
  ========================= */

  private updateBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.menuOpen()) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  private updateMobileAuthVisibility(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const mobileAuth = this.el.nativeElement.querySelector('.mobile-auth');

    if (mobileAuth) {
      if (this.menuOpen()) {
        this.renderer.addClass(mobileAuth, 'active');
      } else {
        this.renderer.removeClass(mobileAuth, 'active');
      }
    }
  }

  /* =========================
     ACCESSIBILITY HELPERS
  ========================= */

  getButtonAriaLabel(): string {
    return this.menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu';
  }

  getDropdownAriaLabel(): string {
    return `Menu utilisateur de ${this.userName()}`;
  }
}