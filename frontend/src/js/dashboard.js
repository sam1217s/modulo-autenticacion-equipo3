/**
 * Dashboard Module
 * Handles dashboard-specific functionality and UI interactions
 */

// ========================================
// DASHBOARD STATE
// ========================================

class DashboardManager {
  constructor() {
    this.data = null;
    this.isLoading = false;
    this.refreshInterval = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateGreeting();
    this.loadDashboardData();
    
    // Update greeting every minute
    setInterval(() => this.updateGreeting(), 60000);
    
    // Auto-refresh data every 5 minutes
    this.refreshInterval = setInterval(() => this.loadDashboardData(true), 300000);
  }

  setupEventListeners() {
    // Navigation menu
    this.setupNavigation();
    
    // User menu dropdown
    this.setupUserMenu();
    
    // Mobile menu
    this.setupMobileMenu();
    
    // Search functionality
    this.setupSearch();
    
    // Quick actions
    this.setupQuickActions();
  }

  setupNavigation() {
    const navLinks = Utils.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        Utils.querySelectorAll('.nav-item').forEach(item => {
          Utils.removeClass(item, 'active');
        });
        
        Utils.addClass(link.parentElement, 'active');
        
        // Handle navigation
        const section = link.dataset.section;
        if (section) {
          this.handleNavigation(section);
        }
      });
    });
  }

  setupUserMenu() {
    const userMenuContainer = Utils.querySelector('.user-menu');
    const userMenuTrigger = Utils.querySelector('.user-menu-trigger');
    const userMenuDropdown = Utils.querySelector('.user-menu-dropdown');
    
    if (userMenuContainer && userMenuTrigger && userMenuDropdown) {
      let hoverTimeout;
      let isHoverEnabled = true;
      
      // Detectar si es dispositivo táctil
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      if (!isTouchDevice) {
        // COMPORTAMIENTO HOVER PARA DESKTOP
        
        // Mouse enter en el contenedor del menú
        userMenuContainer.addEventListener('mouseenter', () => {
          if (!isHoverEnabled) return;
          
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            Utils.addClass(userMenuDropdown, 'show');
            window.devLog('Menu opened by hover');
          }, 150);
        });
        
        // Mouse leave del contenedor del menú
        userMenuContainer.addEventListener('mouseleave', () => {
          if (!isHoverEnabled) return;
          
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            Utils.removeClass(userMenuDropdown, 'show');
            window.devLog('Menu closed by hover out');
          }, 200);
        });
        
        // Prevenir cierre cuando el mouse está sobre el dropdown
        userMenuDropdown.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
        });
        
        userMenuDropdown.addEventListener('mouseleave', () => {
          if (!isHoverEnabled) return;
          
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            Utils.removeClass(userMenuDropdown, 'show');
            window.devLog('Menu closed by leaving dropdown');
          }, 100);
        });
        
      } else {
        // COMPORTAMIENTO CLICK PARA DISPOSITIVOS TÁCTILES
        isHoverEnabled = false;
      }
      
      // COMPORTAMIENTO CLICK (siempre activo como fallback)
      userMenuTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (isTouchDevice || !isHoverEnabled) {
          // En dispositivos táctiles, toggle normal
          Utils.toggleClass(userMenuDropdown, 'show');
          window.devLog('Menu toggled by click');
        } else {
          // En desktop, si está cerrado, abrirlo inmediatamente
          if (!Utils.hasClass(userMenuDropdown, 'show')) {
            clearTimeout(hoverTimeout);
            Utils.addClass(userMenuDropdown, 'show');
            window.devLog('Menu opened by click');
          }
        }
      });
      
      // Cerrar al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!userMenuContainer.contains(e.target)) {
          Utils.removeClass(userMenuDropdown, 'show');
          window.devLog('Menu closed by outside click');
        }
      });
      
      // Prevenir cierre al hacer click dentro del dropdown
      userMenuDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      // Limpiar timeout al destruir
      window.addEventListener('beforeunload', () => {
        clearTimeout(hoverTimeout);
      });
    }
  }

  setupMobileMenu() {
    const mobileMenuBtn = Utils.querySelector('.mobile-menu-btn');
    const sidebar = Utils.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        Utils.toggleClass(sidebar, 'open');
      });
      
      // Close sidebar when clicking outside
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
          Utils.removeClass(sidebar, 'open');
        }
      });
    }
  }

  setupSearch() {
    const searchInput = Utils.querySelector('.search-input');
    
    if (searchInput) {
      const debouncedSearch = Utils.debounce((query) => {
        this.performSearch(query);
      }, 300);
      
      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
    }
  }

  setupQuickActions() {
    const quickActionBtns = Utils.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.textContent.trim();
        this.handleQuickAction(action);
      });
    });
  }

  updateGreeting() {
    const greetingElement = Utils.querySelector('.greeting-text');
    if (greetingElement) {
      greetingElement.textContent = Utils.getGreeting();
    }
  }

  async loadDashboardData(isRefresh = false) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      if (!isRefresh) {
        Utils.showLoading('Cargando dashboard...');
      }
      
      const result = await window.AuthFunctions.getDashboardData();
      
      if (result.success) {
        this.data = result.data;
        this.populateDashboard(result.data);
        
        if (isRefresh) {
          Utils.showAlert('Dashboard actualizado', 'success', 2000);
        }
      } else {
        if (result.shouldRedirect) {
          // Token expirado o inválido - logout automático
          window.AuthFunctions.emergencyLogout(result.message);
        } else {
          this.showErrorState();
          Utils.showAlert(result.message, 'error');
        }
      }
    } catch (error) {
      window.handleError(error, 'Dashboard data loading');
      this.loadMockData();
    } finally {
      this.isLoading = false;
      if (!isRefresh) {
        Utils.hideLoading();
      }
    }
  }

  populateDashboard(data) {
    this.updateUserInfo(data.user);
    this.updateStats(data);
    this.updateInvoices(data.recentInvoices);
    this.updateProjects(data.yourProjects);
    this.updateRecommendedProject(data.recommendedProject);
  }

  updateUserInfo(user) {
    // Update user avatar and name
    const userAvatar = Utils.getElementById('userAvatar');
    const userName = Utils.getElementById('userName');
    const headerUserName = Utils.getElementById('headerUserName');
    const headerAvatar = Utils.getElementById('headerAvatar');

    if (userAvatar) {
      userAvatar.src = user.avatar || Utils.generateAvatarUrl(user.name);
      userAvatar.alt = `Avatar de ${user.name}`;
    }
    
    if (headerAvatar) {
      headerAvatar.src = user.avatar || Utils.generateAvatarUrl(user.name);
      headerAvatar.alt = `Avatar de ${user.name}`;
    }
    
    if (userName) userName.textContent = user.name;
    if (headerUserName) headerUserName.textContent = user.name;
  }

  updateStats(data) {
    // Update earnings
    const earningsAmount = Utils.getElementById('earningsAmount');
    const earningsChange = Utils.getElementById('earningsChange');

    if (earningsAmount) {
      Utils.animateNumber(earningsAmount, data.earnings.amount, 2000);
    }
    
    if (earningsChange) {
      earningsChange.innerHTML = `
        <i class="fas fa-arrow-${data.earnings.trend === 'up' ? 'up' : 'down'}"></i>
        ${data.earnings.change}
      `;
      earningsChange.className = `card-change ${data.earnings.trend === 'up' ? 'positive' : 'negative'}`;
    }

    // Update rank
    const rankNumber = Utils.getElementById('rankNumber');
    const rankDescription = Utils.getElementById('rankDescription');
    
    if (rankNumber) {
      Utils.animateNumber(rankNumber, data.rank.position, 1500);
    }
    
    if (rankDescription) {
      rankDescription.textContent = data.rank.description;
    }

    // Update projects
    const projectsNumber = Utils.getElementById('projectsNumber');
    const projectsPending = Utils.getElementById('projectsPending');
    const projectsCompleted = Utils.getElementById('projectsCompleted');
    
    if (projectsNumber) {
      Utils.animateNumber(projectsNumber, data.projects.total, 1000);
    }
    
    if (projectsPending) {
      projectsPending.textContent = data.projects.pending;
    }
    
    if (projectsCompleted) {
      projectsCompleted.textContent = data.projects.completed;
    }
  }

  updateInvoices(invoices) {
    const container = Utils.getElementById('invoicesList');
    if (!container || !invoices) return;

    container.innerHTML = invoices.map(invoice => `
      <div class="invoice-item">
        <img src="${invoice.avatar}" alt="${invoice.client}" class="invoice-avatar" loading="lazy">
        <div class="invoice-info">
          <div class="invoice-client">${invoice.client}</div>
          <div class="invoice-company">${invoice.company}</div>
        </div>
        <div>
          <div class="invoice-amount">€ ${Utils.formatNumber(invoice.amount)}</div>
          <span class="invoice-status ${invoice.status.toLowerCase()}">${invoice.status}</span>
        </div>
      </div>
    `).join('');
  }

  updateProjects(projects) {
    const container = Utils.getElementById('projectsList');
    if (!container || !projects) return;

    container.innerHTML = projects.map(project => `
      <div class="project-item">
        <img src="${project.avatar}" alt="${project.title}" class="project-avatar" loading="lazy">
        <div class="project-info">
          <div class="project-title">${project.title}</div>
          <div class="project-days">${project.daysRemaining} días restantes</div>
        </div>
      </div>
    `).join('');
  }

  updateRecommendedProject(project) {
    const container = Utils.getElementById('recommendedProject');
    if (!container || !project) return;

    container.innerHTML = `
      <img src="${project.avatar}" alt="${project.client}" class="recommended-avatar" loading="lazy">
      <div class="recommended-content">
        <div class="recommended-header">
          <div>
            <div class="recommended-client">${project.client}</div>
            <div class="recommended-company">${project.company}</div>
          </div>
          <span class="recommended-status">${project.status}</span>
        </div>
        <h4 class="recommended-title">${project.title}</h4>
        <p class="recommended-description">${project.description}</p>
        <div class="recommended-footer">
          <div class="recommended-budget">${Utils.formatNumber(project.budget)}</div>
          <span class="full-time-tag">Full time</span>
        </div>
      </div>
    `;
  }

  showErrorState() {
    const content = Utils.querySelector('.dashboard-content');
    if (content) {
      content.innerHTML = `
        <div style="text-align: center; padding: 4rem; color: #64748b;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #f59e0b;"></i>
          <h3>Error al cargar el dashboard</h3>
          <p>No se pudieron cargar los datos. Verifica tu conexión e inténtalo de nuevo.</p>
          <button onclick="window.Dashboard.loadDashboardData()" 
                  style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Reintentar
          </button>
        </div>
      `;
    }
  }

  loadMockData() {
    window.devLog('Loading mock data for development');
    
    const mockData = {
      user: {
        name: window.Auth.user?.username || 'Usuario Demo',
        avatar: Utils.generateAvatarUrl(window.Auth.user?.username || 'Usuario Demo')
      },
      earnings: { 
        amount: 8350, 
        change: '+10% desde el mes pasado', 
        trend: 'up' 
      },
      rank: { 
        position: 98, 
        description: 'en top 100' 
      },
      projects: { 
        total: 32, 
        pending: 'mobile app', 
        completed: 'branding' 
      },
      recentInvoices: [
        {
          client: 'Alexander Williams',
          company: 'AX creations',
          amount: 1200.87,
          status: 'Paid',
          avatar: Utils.generateAvatarUrl('Alexander Williams', '10b981')
        },
        {
          client: 'John Phillips',
          company: 'design studio',
          amount: 12989.88,
          status: 'Late',
          avatar: Utils.generateAvatarUrl('John Phillips', 'ef4444')
        }
      ],
      yourProjects: [
        {
          title: 'Logo design for Bakery',
          daysRemaining: 3,
          avatar: Utils.generateAvatarUrl('Bakery', 'f59e0b')
        },
        {
          title: 'Personal branding project',
          daysRemaining: 5,
          avatar: Utils.generateAvatarUrl('Branding', '8b5cf6')
        }
      ],
      recommendedProject: {
        client: 'Thomas Martin',
        company: 'Upside Designs',
        title: 'Need a designer to form branding essentials for my business.',
        description: 'Looking for a talented brand designer to create all the branding materials for my new bakery.',
        budget: 8700,
        status: 'Design',
        avatar: Utils.generateAvatarUrl('Thomas Martin')
      }
    };

    setTimeout(() => {
      this.populateDashboard(mockData);
      Utils.hideLoading();
      
      Utils.showAlert('Usando datos de demostración', 'warning', 3000);
    }, 1500);
  }

  handleNavigation(section) {
    window.devLog('Navigating to section:', section);
    
    // Here you would implement actual navigation logic
    // For now, just show a message
    Utils.showAlert(`Navegando a: ${section}`, 'success', 2000);
  }

  performSearch(query) {
    if (!query.trim()) return;
    
    window.devLog('Searching for:', query);
    
    // Here you would implement actual search functionality
    Utils.showAlert(`Buscando: "${query}"`, 'success', 2000);
  }

  handleQuickAction(action) {
    window.devLog('Quick action:', action);
    
    // Here you would implement actual quick action functionality
    Utils.showAlert(`Acción: ${action}`, 'success', 2000);
  }

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Toggle user menu dropdown (called from HTML)
 */
function toggleUserMenu() {
  const dropdown = Utils.getElementById('userMenuDropdown');
  if (dropdown) {
    Utils.toggleClass(dropdown, 'show');
    window.devLog('Menu toggled by HTML onclick');
  }
}

/**
 * Toggle sidebar on mobile
 */
function toggleSidebar() {
  const sidebar = Utils.querySelector('.sidebar');
  if (sidebar) {
    Utils.toggleClass(sidebar, 'open');
  }
}

/**
 * Handle window resize
 */
function handleResize() {
  const sidebar = Utils.querySelector('.sidebar');
  
  // Close mobile sidebar on desktop
  if (window.innerWidth > 768 && sidebar) {
    Utils.removeClass(sidebar, 'open');
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
  // Escape key closes modals/dropdowns
  if (event.key === 'Escape') {
    const userMenuDropdown = Utils.getElementById('userMenuDropdown');
    const sidebar = Utils.querySelector('.sidebar');
    
    if (userMenuDropdown) {
      Utils.removeClass(userMenuDropdown, 'show');
    }
    
    if (sidebar && window.innerWidth <= 768) {
      Utils.removeClass(sidebar, 'open');
    }
  }
  
  // Ctrl/Cmd + K for search
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    const searchInput = Utils.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  // Ctrl/Cmd + L for logout (quick logout shortcut)
  if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
    event.preventDefault();
    if (confirm('¿Cerrar sesión con atajo de teclado?')) {
      window.AuthFunctions.logout();
    }
  }
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the dashboard page
  if (document.body.id === 'dashboard') {
    window.Dashboard = new DashboardManager();
    
    // Setup global event listeners
    window.addEventListener('resize', Utils.throttle(handleResize, 250));
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (window.Dashboard) {
        window.Dashboard.destroy();
      }
    });
  }
});

// Make functions globally available
window.DashboardFunctions = {
  toggleSidebar,
  toggleUserMenu,
  handleResize,
  handleKeyboardShortcuts
};
