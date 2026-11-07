/* ===================================================================
   Siva Prasad Reddy - Online Donation Management System
   Common JavaScript Functions & Utilities
   =================================================================== */

// Global Toast Notification Helper
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : '⚠️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Format Currency to Indian Rupee
function formatCurrency(amount) {
  const num = parseFloat(amount || 0);
  return '₹' + num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
}

// Format Date string
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// Check MySQL Health and update UI badge
async function checkMySQLStatus() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    const pill = document.getElementById('mysqlStatusPill');
    if (pill) {
      if (data.status === 'success') {
        pill.innerHTML = `<span class="pulse-dot"></span> MySQL Connected: <strong>${data.db_name}</strong>`;
        pill.style.background = 'rgba(16, 185, 129, 0.2)';
        pill.style.color = '#a7f3d0';
      } else {
        pill.innerHTML = `⚠️ MySQL Disconnected`;
        pill.style.background = 'rgba(239, 68, 68, 0.2)';
        pill.style.color = '#fca5a5';
      }
    }
  } catch (err) {
    console.warn('MySQL Health Check error:', err);
  }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('show');
    });
  }
  checkMySQLStatus();
});
