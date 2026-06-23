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
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbarComponent.html',
  styleUrls: ['./navbarComponent.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})// src/app/components/navbar/navbar.component.ts
// src/app/components/navbar/navbar.component.ts

export class NavbarComponent implements OnInit, OnDestroy {
  // Injections
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  // Signals for reactive state
  isLoggedIn = signal<boolean>(false);
  userName = signal<string>('');
  userRole = signal<string>('');
  userEmail = signal<string>('');
  userId = signal<string | null>(null);
  
  // UI State
  menuOpen = signal<boolean>(false);
  dropdownOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // Computed signals
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

  // Private
  private destroy$ = new Subject<void>();
  private scrollFrame: number | null = null;
  private resizeTimer: any;

  constructor() {
    // Effect to react to auth changes
    effect(() => {
      this.checkAuthStatus();
    });
  }

  ngOnInit(): void {
    // Initial auth check
    this.checkAuthStatus();

    // Subscribe to auth changes
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

    // Initial scroll check
    this.isScrolled.set(window.scrollY > 50);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    
    if (this.scrollFrame !== null) {
      cancelAnimationFrame(this.scrollFrame);
    }

    // Remove body scroll lock
    this.renderer.removeStyle(document.body, 'overflow');
  }

  // ========== AUTH METHODS ==========

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
        // Fallback: get from localStorage directly
        this.userName.set(this.authService.getUserName() || 'Utilisateur');
        this.userRole.set(this.authService.getUserRole() || '');
        this.userEmail.set(this.authService.getUserEmail() || '');
        this.userId.set(this.authService.getUserId());
      }
    } else {
      // Clear state
      this.userName.set('');
      this.userRole.set('');
      this.userEmail.set('');
      this.userId.set(null);
    }

    this.cdr.markForCheck();
  }

  logout(): void {
    // Show loading state
    this.isLoading.set(true);
    
    // Close all menus
    this.dropdownOpen.set(false);
    this.closeMenu();
    
    // Perform logout
    this.authService.logout();
    
    // Update state
    this.isLoggedIn.set(false);
    this.userName.set('');
    this.userRole.set('');
    this.userEmail.set('');
    this.userId.set(null);
    this.isLoading.set(false);
    
    // Notify user
    this.notificationService.success('Déconnexion réussie');
    
    // Navigate to home
    this.router.navigate(['/']);
    
    this.cdr.markForCheck();
  }

  // ========== UI METHODS ==========

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

  // ========== SCROLL HANDLING ==========

  @HostListener('window:scroll')
  onWindowScroll(): void {
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

  // ========== RESIZE HANDLING ==========

  @HostListener('window:resize')
  onResize(): void {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && this.menuOpen()) {
        this.closeMenu();
      }
      this.cdr.markForCheck();
    }, 150);
  }

  // ========== CLICK OUTSIDE ==========

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close dropdown if clicking outside
    if (!target.closest('.user-dropdown') && !target.closest('.mobile-menu-btn')) {
      if (this.dropdownOpen()) {
        this.dropdownOpen.set(false);
        this.cdr.markForCheck();
      }
    }
  }

  // ========== KEYBOARD ACCESSIBILITY ==========

  // ✅ CORRECTION: Utiliser 'keydown' au lieu de 'keydown.escape' pour éviter l'erreur de typage
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Vérifier si la touche est Escape
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

  // ========== PRIVATE HELPERS ==========

  private updateBodyScroll(): void {
    if (this.menuOpen()) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  private updateMobileAuthVisibility(): void {
    const mobileAuth = this.el.nativeElement.querySelector('.mobile-auth');
    if (mobileAuth) {
      if (this.menuOpen()) {
        this.renderer.addClass(mobileAuth, 'active');
      } else {
        this.renderer.removeClass(mobileAuth, 'active');
      }
    }
  }

  // ========== PUBLIC HELPERS ==========

  getButtonAriaLabel(): string {
    return this.menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu';
  }

  getDropdownAriaLabel(): string {
    return `Menu utilisateur de ${this.userName()}`;
  }
}