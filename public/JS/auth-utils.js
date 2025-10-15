// Authentication utility functions
class AuthUtils {
  
  // Check if user is currently logged in
  static isLoggedIn() {
    const isLoggedIn = localStorage.getItem('isStudentLoggedIn') === 'true';
    const studentData = localStorage.getItem('studentData');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    
    // Check if login is valid and not expired (24 hours)
    if (isLoggedIn && studentData && loginTimestamp) {
      const loginTime = new Date(loginTimestamp);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        return true;
      } else {
        // Session expired, clear localStorage
        this.logout();
        return false;
      }
    }
    
    return false;
  }
  
  // Get current logged in user data
  static getCurrentUser() {
    if (!this.isLoggedIn()) {
      return null;
    }
    
    try {
      return JSON.parse(localStorage.getItem('studentData'));
    } catch (error) {
      console.error('Error parsing student data:', error);
      this.logout();
      return null;
    }
  }
  
  // Show login required modal/alert
  static showLoginRequired(message = "You need to be logged in to perform this action.") {
    // Create a custom modal for better UX
    this.showModal(
      "🔐 Login Required",
      message,
      [
        {
          text: "Login Now",
          className: "btn-primary",
          action: () => {
            window.location.href = "/HTML/login.html";
          }
        },
        {
          text: "Cancel",
          className: "btn-secondary",
          action: () => {
            this.closeModal();
          }
        }
      ]
    );
  }
  
  // Show custom modal
  static showModal(title, message, buttons = []) {
    // Remove existing modal if any
    const existingModal = document.getElementById('auth-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
      <div id="auth-modal" class="auth-modal-overlay" onclick="AuthUtils.closeModal()">
        <div class="auth-modal-content" onclick="event.stopPropagation()">
          <div class="auth-modal-header">
            <h3>${title}</h3>
            <button class="auth-modal-close" onclick="AuthUtils.closeModal()">×</button>
          </div>
          <div class="auth-modal-body">
            <p>${message}</p>
          </div>
          <div class="auth-modal-footer">
            ${buttons.map(btn => 
              `<button class="auth-modal-btn ${btn.className}" onclick="(${btn.action.toString()})()">${btn.text}</button>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add CSS if not already added
    if (!document.getElementById('auth-modal-styles')) {
      const styles = `
        <style id="auth-modal-styles">
          .auth-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
          }
          
          .auth-modal-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease-out;
          }
          
          @keyframes modalSlideIn {
            from {
              transform: scale(0.8) translateY(-20px);
              opacity: 0;
            }
            to {
              transform: scale(1) translateY(0);
              opacity: 1;
            }
          }
          
          .auth-modal-header {
            padding: 20px 20px 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .auth-modal-header h3 {
            margin: 0;
            color: #333;
            font-size: 1.2em;
          }
          
          .auth-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .auth-modal-close:hover {
            background: #f5f5f5;
            color: #666;
          }
          
          .auth-modal-body {
            padding: 20px;
          }
          
          .auth-modal-body p {
            margin: 0;
            color: #666;
            line-height: 1.5;
          }
          
          .auth-modal-footer {
            padding: 10px 20px 20px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }
          
          .auth-modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
          }
          
          .auth-modal-btn.btn-primary {
            background: #4a90e2;
            color: white;
          }
          
          .auth-modal-btn.btn-primary:hover {
            background: #357abd;
          }
          
          .auth-modal-btn.btn-secondary {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #ddd;
          }
          
          .auth-modal-btn.btn-secondary:hover {
            background: #e9ecef;
          }
        </style>
      `;
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }
  
  // Close modal
  static closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.remove();
    }
  }
  
  // Logout user
  static logout() {
    localStorage.removeItem('isStudentLoggedIn');
    localStorage.removeItem('studentData');
    localStorage.removeItem('currentStudentId');
    localStorage.removeItem('loginTimestamp');
  }
  
  // Redirect to login with return URL
  static redirectToLogin(returnUrl = null) {
    const currentUrl = returnUrl || window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    window.location.href = `/HTML/login.html?return=${encodedUrl}`;
  }
  
  // Check authentication and show warning if not logged in
  static requireAuth(action = "perform this action", showModal = true) {
    if (!this.isLoggedIn()) {
      if (showModal) {
        this.showLoginRequired(`Please log in to ${action}.`);
      }
      return false;
    }
    return true;
  }
  
  // Update navigation based on login status
  static updateNavigation() {
    const user = this.getCurrentUser();
    const navBars = document.querySelectorAll('.quick-bar, nav');
    
    navBars.forEach(nav => {
      const loginLink = nav.querySelector('a[href*="login.html"]');
      const registerLink = nav.querySelector('a[href*="register.html"]');
      
      if (user) {
        // User is logged in - show logout option
        if (loginLink) {
          loginLink.innerHTML = `👤 ${user.name || user.studentId}`;
          loginLink.href = '#';
          loginLink.onclick = (e) => {
            e.preventDefault();
            this.showLogoutMenu(e.target);
          };
        }
        if (registerLink) {
          registerLink.style.display = 'none';
        }
      } else {
        // User is not logged in - show login/register
        if (loginLink) {
          loginLink.innerHTML = '🔐 Login';
          loginLink.href = '/HTML/login.html';
          loginLink.onclick = null;
        }
        if (registerLink) {
          registerLink.style.display = 'inline';
          registerLink.innerHTML = '📝 Register';
          registerLink.href = '/HTML/register.html';
        }
      }
    });
  }
  
  // Show logout menu
  static showLogoutMenu(element) {
    const existingMenu = document.getElementById('logout-menu');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }
    
    const user = this.getCurrentUser();
    const menuHTML = `
      <div id="logout-menu" class="logout-menu">
        <div class="logout-menu-header">
          <strong>${user.name || 'Student'}</strong>
          <small>${user.studentId}</small>
        </div>
        <div class="logout-menu-items">
          <a href="/HTML/dashboard.html">📊 Dashboard</a>
          <a href="/HTML/profile.html">👤 Profile</a>
          <hr>
          <a href="#" onclick="AuthUtils.handleLogout()">🚪 Logout</a>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    
    // Position menu
    const rect = element.getBoundingClientRect();
    const menu = document.getElementById('logout-menu');
    menu.style.top = (rect.bottom + 5) + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
    
    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('#logout-menu') && !e.target.closest('a[href="#"]')) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
    
    // Add CSS for logout menu if not already added
    if (!document.getElementById('logout-menu-styles')) {
      const styles = `
        <style id="logout-menu-styles">
          .logout-menu {
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            min-width: 180px;
          }
          
          .logout-menu-header {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            background: #f8f9fa;
          }
          
          .logout-menu-header strong {
            display: block;
            color: #333;
          }
          
          .logout-menu-header small {
            color: #666;
            font-size: 0.8em;
          }
          
          .logout-menu-items {
            padding: 5px 0;
          }
          
          .logout-menu-items a {
            display: block;
            padding: 8px 15px;
            text-decoration: none;
            color: #333;
            transition: background 0.2s;
          }
          
          .logout-menu-items a:hover {
            background: #f8f9fa;
          }
          
          .logout-menu-items hr {
            margin: 5px 0;
            border: none;
            border-top: 1px solid #eee;
          }
        </style>
      `;
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }
  
  // Handle logout
  static handleLogout() {
    this.showModal(
      "🚪 Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Yes, Logout",
          className: "btn-primary",
          action: () => {
            this.logout();
            this.closeModal();
            const logoutMenu = document.getElementById('logout-menu');
            if (logoutMenu) logoutMenu.remove();
            window.location.href = '/HTML/main.html';
          }
        },
        {
          text: "Cancel",
          className: "btn-secondary",
          action: () => {
            this.closeModal();
          }
        }
      ]
    );
  }
}

// Initialize authentication state when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  AuthUtils.updateNavigation();
});

// Export for use in other files
window.AuthUtils = AuthUtils;
