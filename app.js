/**
 * Project AURA - Core Application Logic
 * Manages state, updates calculations, renders interactive charts, and handles simulated Gemini LLM with Semantic Guardrails.
 * Location: d:/Hackathons/IDBI/app.js
 */

// Application State
let appState = {
  monthlyIncome: AURA_MOCK_DATA.monthlyIncome,
  savingsGoal: AURA_MOCK_DATA.user.savingsGoal,
  liabilities: [...AURA_MOCK_DATA.fixedLiabilities],
  transactions: [...AURA_MOCK_DATA.transactions],
  activeTheme: 'dark',
  activeView: 'dashboard',
  // Track redirected leaks
  redirectedLeaks: {},
  chatHistory: [
    {
      sender: 'aura',
      text: `Hello! I am AURA, your 24/7 Digital Wealth Manager. I have analyzed your transaction history for account **${AURA_MOCK_DATA.user.accountNo}**. 

I detected a daily spending threshold that fits your financial profile. What would you like to explore?
- Type **"What is my Safe-to-Spend limit?"**
- Type **"Tell me about my expense leaks"**
- Type **"What IDBI products should I invest in?"**`,
      isGuardrail: false
    }
  ]
};

// Chart References
let historicalPieChart = null;
let cashFlowBarChart = null;
let whatIfLineChart = null;

// Initialize Application on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupNavigation();
  setupThemeToggle();
  initDashboard();
  setupChatHandlers();
  setupSafeToSpendHandlers();
  setupWhatIfHandlers();
  setupProductSimulator();
  
  // Render charts after tabs and visibility are fully established
  setTimeout(() => {
    initCharts();
  }, 100);
});

/* =========================================================================
   Theme Management
   ========================================================================= */
function initTheme() {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  appState.activeTheme = systemPrefersDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', appState.activeTheme);
  
  const toggleCheckbox = document.getElementById('theme-toggle-chk');
  if (toggleCheckbox) {
    toggleCheckbox.checked = appState.activeTheme === 'light';
  }
}

function setupThemeToggle() {
  const toggleCheckbox = document.getElementById('theme-toggle-chk');
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener('change', (e) => {
      appState.activeTheme = e.target.checked ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', appState.activeTheme);
      
      // Force redraw of charts to update grids and labels colors
      if (historicalPieChart && cashFlowBarChart && whatIfLineChart) {
        destroyCharts();
        initCharts();
      }
    });
  }
}

/* =========================================================================
   Navigation & View Swapping
   ========================================================================= */
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active from current
      navItems.forEach(n => n.classList.remove('active'));
      
      // Add active to clicked
      item.classList.add('active');
      
      // Swap views
      const targetView = item.getAttribute('data-view');
      appState.activeView = targetView;
      
      const panels = document.querySelectorAll('.view-panel');
      panels.forEach(p => p.classList.remove('active'));
      
      const targetPanel = document.getElementById(`${targetView}-view`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      // Specific view triggers
      if (targetView === 'dashboard') {
        updateDashboardWidgets();
      } else if (targetView === 'safe-to-spend') {
        renderLiabilitiesList();
        updateSafeToSpendVisualizer();
      } else if (targetView === 'what-if') {
        runWhatIfSimulation();
      }
    });
  });
}

/* =========================================================================
   Dashboard Calculations & Leaks Engine
   ========================================================================= */
function initDashboard() {
  updateDashboardWidgets();
}

function updateDashboardWidgets() {
  const { totalLiabilities, safeToSpend } = calculateSafeToSpendValues();
  const totalLeaks = calculateActiveLeaksSum();
  
  // Set UI Text values
  document.getElementById('dash-income-val').innerText = `₹${appState.monthlyIncome.toLocaleString()}`;
  document.getElementById('dash-liabilities-val').innerText = `₹${totalLiabilities.toLocaleString()}`;
  document.getElementById('dash-safe-spend-val').innerText = `₹${safeToSpend.toLocaleString()}`;
  document.getElementById('dash-leaks-val').innerText = `₹${totalLeaks.toLocaleString()}`;
  
  // Financial Health Score calculation
  // Base 100 - subtract points for leaks and over-liabilities ratios
  let healthScore = 100;
  const liabilityRatio = totalLiabilities / appState.monthlyIncome;
  if (liabilityRatio > 0.5) healthScore -= 20;
  else if (liabilityRatio > 0.3) healthScore -= 10;
  
  const leaksRatio = totalLeaks / appState.monthlyIncome;
  healthScore -= Math.round(leaksRatio * 150); // penalize leaks heavily
  healthScore = Math.max(20, Math.min(100, healthScore));
  
  const scoreEl = document.getElementById('dash-health-score');
  if (scoreEl) {
    scoreEl.innerText = `${healthScore}/100`;
    const scoreCard = scoreEl.closest('.metric-card');
    scoreCard.className = 'metric-card';
    if (healthScore >= 80) {
      scoreCard.classList.add('success');
    } else if (healthScore >= 50) {
      scoreCard.classList.add('warning');
    } else {
      scoreCard.classList.add('danger');
    }
  }

  // Set Safe-to-Spend status in widget card
  const safeSpendCard = document.getElementById('dash-safe-spend-val').closest('.metric-card');
  safeSpendCard.className = 'metric-card';
  if (safeToSpend > 20000) {
    safeSpendCard.classList.add('success');
  } else if (safeToSpend > 5000) {
    safeSpendCard.classList.add('warning');
  } else {
    safeSpendCard.classList.add('danger');
  }

  renderLeaksTable();
}

function calculateSafeToSpendValues() {
  const totalLiabilities = appState.liabilities.reduce((sum, item) => sum + item.amount, 0);
  const safeToSpend = appState.monthlyIncome - totalLiabilities - appState.savingsGoal;
  return { totalLiabilities, safeToSpend };
}

function calculateActiveLeaksSum() {
  return appState.transactions
    .filter(t => t.isLeak && !appState.redirectedLeaks[t.id])
    .reduce((sum, t) => sum + t.amount, 0);
}

function renderLeaksTable() {
  const leaksBody = document.getElementById('leaks-table-body');
  if (!leaksBody) return;
  
  const activeLeaks = appState.transactions.filter(t => t.isLeak && !appState.redirectedLeaks[t.id]);
  
  if (activeLeaks.length === 0) {
    leaksBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--success-color); font-weight: 600; padding: 20px;">🎉 Perfect! All expense leaks redirected to yield assets.</td></tr>`;
    document.getElementById('nudge-banner-box').style.display = 'none';
    return;
  }
  
  document.getElementById('nudge-banner-box').style.display = 'flex';
  
  leaksBody.innerHTML = activeLeaks.map(leak => `
    <tr>
      <td>${leak.date}</td>
      <td class="fw-bold">${leak.description}</td>
      <td class="text-danger fw-bold">₹${leak.amount.toLocaleString()}</td>
      <td>
        <button class="action-btn" onclick="redirectLeakToInvestment('${leak.id}')">Redirect to IDBI SIP</button>
      </td>
    </tr>
  `).join('');
}

// Global action handler for prototype leak redirection simulation
window.redirectLeakToInvestment = function(leakId) {
  const leak = appState.transactions.find(t => t.id === leakId);
  if (!leak) return;
  
  // Set as redirected in app state
  appState.redirectedLeaks[leakId] = true;
  
  // Shift to savings goal dynamically or simulate compounding SIP
  appState.savingsGoal += leak.amount;
  
  // Trigger alert Nudge
  showNotificationToast(`🎯 Budget Optimized! Shifted ${leak.description} (₹${leak.amount}) into IDBI Equity Growth SIP at 14.5% p.a.`);
  
  // Update dashboard and charts
  updateDashboardWidgets();
  if (historicalPieChart && cashFlowBarChart) {
    destroyCharts();
    initCharts();
  }
};

function showNotificationToast(msg) {
  // Simple toast alert implementation for premium UI feel
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.background = 'var(--accent-gradient)';
  toast.style.border = '1px solid var(--accent-hover)';
  toast.style.color = '#fff';
  toast.style.padding = '16px 24px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '600';
  toast.style.maxWidth = '380px';
  toast.style.animation = 'fadeIn 0.3s ease';
  
  toast.innerText = msg;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* =========================================================================
   Data Visualizations (Chart.js Configs)
   ========================================================================= */
function getChartThemeColors() {
  const isLight = appState.activeTheme === 'light';
  return {
    gridColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
    textColor: isLight ? '#475569' : '#94a3b8',
    pieColors: [
      '#f05a28', // IDBI Orange
      '#e11d48', // Red
      '#f59e0b', // Amber
      '#3b82f6', // Blue
      '#8b5cf6', // Violet
      '#ec4899', // Pink
      '#10b981'  // Emerald
    ]
  };
}

function destroyCharts() {
  if (historicalPieChart) {
    historicalPieChart.destroy();
    historicalPieChart = null;
  }
  if (cashFlowBarChart) {
    cashFlowBarChart.destroy();
    cashFlowBarChart = null;
  }
  if (whatIfLineChart) {
    whatIfLineChart.destroy();
    whatIfLineChart = null;
  }
}

function initCharts() {
  const colors = getChartThemeColors();
  
  // 1. PIE CHART: Variable expenses distribution (only non-fixed expenses that are not redirected leaks)
  const pieCtx = document.getElementById('expensePieChart');
  if (pieCtx) {
    const activeExpenses = appState.transactions.filter(t => t.type === 'expense' && !appState.redirectedLeaks[t.id]);
    
    // Group by category
    const categoriesMap = {};
    activeExpenses.forEach(t => {
      categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
    });
    
    const labels = Object.keys(categoriesMap);
    const data = Object.values(categoriesMap);
    
    historicalPieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.pieColors,
          borderWidth: 2,
          borderColor: appState.activeTheme === 'light' ? '#fff' : '#111a24'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.textColor,
              font: { family: 'Outfit', size: 12 }
            }
          }
        }
      }
    });
  }
  
  // 2. BAR CHART: Monthly Cash Flow comparisons (Income vs Total Spend)
  const barCtx = document.getElementById('cashFlowBarChart');
  if (barCtx) {
    const totalIncomeVal = appState.monthlyIncome;
    const totalLiabilitiesVal = appState.liabilities.reduce((sum, item) => sum + item.amount, 0);
    const activeVariableVal = appState.transactions
      .filter(t => t.type === 'expense' && t.category !== 'Housing' && t.category !== 'Debt' && t.category !== 'Utilities' && t.category !== 'Insurance' && !appState.redirectedLeaks[t.id])
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenseVal = totalLiabilitiesVal + activeVariableVal;
    
    cashFlowBarChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Income Credit', 'Total Expenditures'],
        datasets: [{
          label: 'Amount (₹)',
          data: [totalIncomeVal, totalExpenseVal],
          backgroundColor: [colors.pieColors[6], colors.pieColors[0]],
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: colors.gridColor },
            ticks: { color: colors.textColor, font: { family: 'Outfit' } }
          },
          x: {
            grid: { display: false },
            ticks: { color: colors.textColor, font: { family: 'Outfit', weight: 600 } }
          }
        }
      }
    });
  }

  // Initialize What-If line chart directly
  initWhatIfChart();
}

/* =========================================================================
   Chatbot Interface (Simulated Gemini AI with Semantic Guardrails)
   ========================================================================= */
function setupChatHandlers() {
  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input-field');
  
  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleChatSubmit();
    });
  }
  
  // Quick Prompt Pills
  const pills = document.querySelectorAll('.prompt-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const promptText = pill.innerText;
      if (chatInput) {
        chatInput.value = promptText;
        handleChatSubmit();
      }
    });
  });
  
  renderChatMessages();
}

function renderChatMessages() {
  const chatBox = document.getElementById('chat-messages-container');
  if (!chatBox) return;
  
  chatBox.innerHTML = appState.chatHistory.map(msg => {
    let bubbleClass = 'message-bubble aura';
    if (msg.sender === 'user') {
      bubbleClass = 'message-bubble user';
    } else if (msg.isGuardrail) {
      bubbleClass = 'message-bubble guardrail-alert';
    }
    
    // Parse mini markdown for highlights (bold, lists)
    let formattedText = msg.text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-accent" style="text-decoration: underline;">$1</a>');
      
    return `<div class="${bubbleClass}">${formattedText}</div>`;
  }).join('');
  
  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleChatSubmit() {
  const chatInput = document.getElementById('chat-input-field');
  if (!chatInput) return;
  
  const query = chatInput.value.trim();
  if (query === '') return;
  
  // Add User Message to State
  appState.chatHistory.push({
    sender: 'user',
    text: query,
    isGuardrail: false
  });
  
  chatInput.value = '';
  renderChatMessages();
  
  // Trigger loading or simulated typing state
  setTimeout(() => {
    processSemanticGuardrail(query);
  }, 600);
}

function processSemanticGuardrail(query) {
  const cleanQuery = query.toLowerCase();
  
  // 1. Semantic Check: Verify intent falls under financial domain
  const hasFinanceKeyword = AURA_MOCK_DATA.semanticGuardrail.financialKeywords.some(keyword => 
    cleanQuery.includes(keyword)
  );
  
  let responseText = "";
  let isGuardrailAlert = false;
  
  if (hasFinanceKeyword) {
    // 2. Identify custom matches in mock config
    let matchedQA = AURA_MOCK_DATA.semanticGuardrail.defaultQAs.find(qa => {
      const q = qa.question.toLowerCase();
      // Match key triggers in query
      if (q.includes("safe-to-spend") && cleanQuery.includes("spend")) return true;
      if (q.includes("leaks") && cleanQuery.includes("leak")) return true;
      if (q.includes("products") && (cleanQuery.includes("product") || cleanQuery.includes("invest") || cleanQuery.includes("mutual fund") || cleanQuery.includes("fd"))) return true;
      if (q.includes("who are you") && (cleanQuery.includes("who are you") || cleanQuery.includes("hello") || cleanQuery.includes("aura"))) return true;
      return false;
    });
    
    if (matchedQA) {
      responseText = matchedQA.answer;
    } else {
      // Custom generative response matching query keywords
      responseText = `AURA Advisor: That is an excellent query regarding **"${query}"**. Based on your current income of ₹${appState.monthlyIncome.toLocaleString()}, I recommend keeping fixed expenses under 50%. You can use the **What-If Planner** tab to project this scenario onto your 12-month wealth trajectory, or review specific **IDBI high-yield products** below.`;
    }
  } else {
    // Query triggers Semantic Guardrail (Safety Filter Reject)
    isGuardrailAlert = true;
    const redirects = AURA_MOCK_DATA.semanticGuardrail.safetyFilterRedirects;
    responseText = redirects[Math.floor(Math.random() * redirects.length)];
  }
  
  // Append response
  appState.chatHistory.push({
    sender: 'aura',
    text: responseText,
    isGuardrail: isGuardrailAlert
  });
  
  renderChatMessages();
}

/* =========================================================================
   Safe-to-Spend Tracker Editor
   ========================================================================= */
function setupSafeToSpendHandlers() {
  const liabilityForm = document.getElementById('add-liability-form');
  if (liabilityForm) {
    liabilityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('liability-name');
      const amountInput = document.getElementById('liability-amount');
      const categorySelect = document.getElementById('liability-category');
      
      const name = nameInput.value.trim();
      const amount = parseFloat(amountInput.value);
      const category = categorySelect.value;
      
      if (!name || isNaN(amount) || amount <= 0) return;
      
      // Add new liability
      const newLiability = {
        id: 'liability_' + Date.now(),
        name: name,
        amount: amount,
        category: category
      };
      
      appState.liabilities.push(newLiability);
      
      // Reset inputs
      nameInput.value = '';
      amountInput.value = '';
      
      // Refresh views
      renderLiabilitiesList();
      updateSafeToSpendVisualizer();
      updateDashboardWidgets();
      
      // Redraw charts
      if (historicalPieChart && cashFlowBarChart) {
        destroyCharts();
        initCharts();
      }
      
      showNotificationToast(`Added liability: ${name} (₹${amount.toLocaleString()})`);
    });
  }

  // Update Savings Goal slider changes
  const savingsSlider = document.getElementById('savings-goal-range');
  if (savingsSlider) {
    savingsSlider.addEventListener('input', (e) => {
      appState.savingsGoal = parseFloat(e.target.value);
      document.getElementById('savings-goal-slider-val').innerText = `₹${appState.savingsGoal.toLocaleString()}`;
      updateSafeToSpendVisualizer();
      updateDashboardWidgets();
    });
  }
}

function renderLiabilitiesList() {
  const listEl = document.getElementById('liabilities-list-items');
  if (!listEl) return;
  
  if (appState.liabilities.length === 0) {
    listEl.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No fixed liabilities defined.</p>`;
    return;
  }
  
  listEl.innerHTML = appState.liabilities.map(item => `
    <div class="liability-item">
      <div class="name-cat">
        <h5>${item.name}</h5>
        <p>${item.category}</p>
      </div>
      <div class="amount-delete">
        <span>₹${item.amount.toLocaleString()}</span>
        <button class="delete-btn-icon" onclick="deleteLiability('${item.id}')">
          <svg style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

window.deleteLiability = function(id) {
  appState.liabilities = appState.liabilities.filter(item => item.id !== id);
  renderLiabilitiesList();
  updateSafeToSpendVisualizer();
  updateDashboardWidgets();
  
  if (historicalPieChart && cashFlowBarChart) {
    destroyCharts();
    initCharts();
  }
  
  showNotificationToast("Fixed liability removed");
};

function updateSafeToSpendVisualizer() {
  const { totalLiabilities, safeToSpend } = calculateSafeToSpendValues();
  
  // Set numeric trackers
  document.getElementById('calc-income-text').innerText = `₹${appState.monthlyIncome.toLocaleString()}`;
  document.getElementById('calc-liabilities-text').innerText = `₹${totalLiabilities.toLocaleString()}`;
  document.getElementById('calc-savings-text').innerText = `₹${appState.savingsGoal.toLocaleString()}`;
  document.getElementById('calc-safespend-text').innerText = `₹${safeToSpend.toLocaleString()}`;
  
  // Percentages for bars
  const liabilitiesPct = Math.min(100, (totalLiabilities / appState.monthlyIncome) * 100);
  const savingsPct = Math.min(100, (appState.savingsGoal / appState.monthlyIncome) * 100);
  const safeSpendPct = Math.max(0, 100 - liabilitiesPct - savingsPct);
  
  // Fill bars
  document.getElementById('bar-liabilities-fill').style.width = `${liabilitiesPct}%`;
  document.getElementById('bar-savings-fill').style.width = `${savingsPct}%`;
  document.getElementById('bar-safespend-fill').style.width = `${safeSpendPct}%`;
  
  // Color code safe-to-spend text indicators
  const alertEl = document.getElementById('safe-spend-alert-message');
  if (safeToSpend < 0) {
    alertEl.style.display = 'block';
    alertEl.innerHTML = `🚨 **AURA Alarm (Deficit)**: Your fixed liabilities and savings goal exceed monthly income by **₹${Math.abs(safeToSpend).toLocaleString()}**! Consider optimizing fixed liabilities or scaling back your savings target temporarily.`;
    alertEl.className = 'nudge-alert-box text-danger';
    alertEl.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    alertEl.style.background = 'rgba(239, 68, 68, 0.1)';
  } else if (safeToSpend < 5000) {
    alertEl.style.display = 'block';
    alertEl.innerHTML = `⚠️ **AURA Advice (Tight Budget)**: Your spending bandwidth is below ₹5,000 this month. Watch out for discretionary purchases to protect your savings goal!`;
    alertEl.className = 'nudge-alert-box text-warning';
    alertEl.style.borderColor = 'var(--nudge-border)';
    alertEl.style.background = 'var(--nudge-bg)';
  } else {
    alertEl.style.display = 'none';
  }
}

/* =========================================================================
   Predictive "What-If" Simulation Engine
   ========================================================================= */
function setupWhatIfHandlers() {
  const incomeChangeInput = document.getElementById('whatif-income-change');
  const expenseChangeInput = document.getElementById('whatif-expense-change');
  const monthTriggerSelect = document.getElementById('whatif-month-trigger');
  const redirectLeaksChk = document.getElementById('whatif-redirect-leaks');

  if (incomeChangeInput && expenseChangeInput && monthTriggerSelect && redirectLeaksChk) {
    // Trigger simulation redraw on inputs
    [incomeChangeInput, expenseChangeInput, monthTriggerSelect, redirectLeaksChk].forEach(ctrl => {
      ctrl.addEventListener('input', runWhatIfSimulation);
    });
  }
}

function initWhatIfChart() {
  const colors = getChartThemeColors();
  const ctx = document.getElementById('whatIfLineChart');
  if (!ctx) return;
  
  // Set up blank datasets (will be filled by simulation)
  whatIfLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Baseline Trajectory',
          data: [],
          borderColor: colors.textColor,
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.1,
          borderWidth: 2
        },
        {
          label: 'Simulated Scenario',
          data: [],
          borderColor: '#0d9488', // teal Accent
          backgroundColor: 'rgba(13, 148, 136, 0.05)',
          fill: true,
          tension: 0.2,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: colors.textColor,
            font: { family: 'Outfit', size: 12 }
          }
        }
      },
      scales: {
        y: {
          grid: { color: colors.gridColor },
          ticks: { 
            color: colors.textColor, 
            font: { family: 'Outfit' },
            callback: function(value) { return '₹' + (value/1000) + 'K'; }
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: colors.textColor, font: { family: 'Outfit' } }
        }
      }
    }
  });
  
  runWhatIfSimulation();
}

function runWhatIfSimulation() {
  if (!whatIfLineChart) return;
  
  // 1. Gather Simulator state variables
  const deltaIncome = parseFloat(document.getElementById('whatif-income-change').value) || 0;
  const deltaExpense = parseFloat(document.getElementById('whatif-expense-change').value) || 0;
  const targetMonthIndex = parseInt(document.getElementById('whatif-month-trigger').value) || 0;
  const isRedirectingLeaks = document.getElementById('whatif-redirect-leaks').checked;
  
  const totalLeaks = calculateActiveLeaksSum();
  
  // Months list for simulation
  const months = ['Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27', 'Jun 27'];
  
  // 2. Perform projection logic
  let baselineSavings = 50000; // Starting baseline savings (represented by default data)
  let simulatedSavings = 50000;
  
  const baselineData = [];
  const simulatedData = [];
  
  // Baseline monthly increment = Savings Goal (₹15,000) + any pre-redirected leaks
  const baselineIncrement = appState.savingsGoal;
  
  // Compound calculations matching IDBI Mutual Fund returns (14.5% / 12 monthly return multiplier)
  const monthlyRateMultiplier = 1 + (0.145 / 12);
  
  for (let i = 0; i < months.length; i++) {
    // Baseline growth path
    baselineSavings = (baselineSavings + baselineIncrement) * monthlyRateMultiplier;
    baselineData.push(Math.round(baselineSavings));
    
    // Simulated growth path calculation
    let monthlyAdditions = appState.savingsGoal;
    
    // Apply simulated income change starting at target month
    if (i >= targetMonthIndex) {
      monthlyAdditions += deltaIncome;
    }
    
    // Deduct simulated one-time large expense in the exact target month
    let monthlyDeduction = 0;
    if (i === targetMonthIndex) {
      monthlyDeduction = deltaExpense;
    }
    
    // If user opts to automatically redirect existing active leaks to compounding wealth
    if (isRedirectingLeaks) {
      monthlyAdditions += totalLeaks;
    }
    
    // Perform simulated compound step
    simulatedSavings = (simulatedSavings + monthlyAdditions - monthlyDeduction);
    
    // Ensure balance does not drop below zero in simulation
    simulatedSavings = Math.max(0, simulatedSavings);
    simulatedSavings = simulatedSavings * monthlyRateMultiplier;
    
    simulatedData.push(Math.round(simulatedSavings));
  }
  
  // 3. Update chart series
  whatIfLineChart.data.labels = months;
  whatIfLineChart.data.datasets[0].data = baselineData;
  whatIfLineChart.data.datasets[1].data = simulatedData;
  whatIfLineChart.update();
  
  // Render analytical summary text below simulator
  const finalBaseline = baselineData[baselineData.length - 1];
  const finalSimulated = simulatedData[simulatedData.length - 1];
  const deltaText = finalSimulated - finalBaseline;
  
  const summaryEl = document.getElementById('whatif-projection-summary');
  if (summaryEl) {
    if (deltaText >= 0) {
      summaryEl.innerHTML = `🚀 **AURA Forecast**: Implementing these changes yields a 12-month wealth trajectory of **₹${finalSimulated.toLocaleString()}**, which is **₹${deltaText.toLocaleString()}** more than your baseline trajectory.`;
      summaryEl.className = 'nudge-alert-box text-success';
      summaryEl.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      summaryEl.style.background = 'rgba(16, 185, 129, 0.1)';
    } else {
      summaryEl.innerHTML = `⚠️ **AURA Forecast**: Your simulated large expense causes a net decrease in 12-month wealth trajectory by **₹${Math.abs(deltaText).toLocaleString()}** compared to baseline. AURA suggests offsetting this by increasing monthly SIP savings by ₹${Math.round(Math.abs(deltaText)/12).toLocaleString()} leading up to month ${targetMonthIndex + 1}.`;
      summaryEl.className = 'nudge-alert-box text-warning';
      summaryEl.style.borderColor = 'var(--nudge-border)';
      summaryEl.style.background = 'var(--nudge-bg)';
    }
  }
}

/* =========================================================================
   IDBI Products Returns Calculator
   ========================================================================= */
function setupProductSimulator() {
  const calcBtn = document.getElementById('calc-returns-btn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const amountInput = document.getElementById('calc-amount');
      const tenureSelect = document.getElementById('calc-tenure');
      const productSelect = document.getElementById('calc-product-select');
      const resultBox = document.getElementById('calc-results-output');
      
      const principal = parseFloat(amountInput.value);
      const years = parseInt(tenureSelect.value);
      const productType = productSelect.value;
      
      if (isNaN(principal) || principal <= 0) {
        resultBox.innerText = "Please enter a valid investment amount.";
        return;
      }
      
      let rate = 0.0725; // default FD
      let rateText = "7.25% p.a.";
      let calculationType = "compound";
      
      if (productType === 'sip') {
        rate = 0.145; // SIP
        rateText = "14.5% p.a.";
        calculationType = "sip";
      } else if (productType === 'nps') {
        rate = 0.095; // NPS
        rateText = "9.5% p.a.";
        calculationType = "sip";
      }
      
      let totalAccumulated = 0;
      let interestEarned = 0;
      let totalInvested = 0;
      
      if (calculationType === 'sip') {
        // Monthly compounding SIP formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
        const i = rate / 12;
        const n = years * 12;
        totalInvested = principal * n;
        totalAccumulated = principal * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        interestEarned = totalAccumulated - totalInvested;
      } else {
        // Fixed Deposit quarterly compounding
        totalInvested = principal;
        totalAccumulated = principal * Math.pow(1 + (rate / 4), 4 * years);
        interestEarned = totalAccumulated - principal;
      }
      
      resultBox.innerHTML = `
        <div style="background: var(--bg-primary); border: 1px solid var(--bg-glass-border); border-radius: 12px; padding: 16px; margin-top: 14px; animation: fadeIn 0.3s ease;">
          <h4 style="color: var(--accent-color); margin-bottom: 10px;">Simulation Results (${rateText})</h4>
          <p style="margin-bottom: 6px;">Total Invested: <span class="fw-bold">₹${Math.round(totalInvested).toLocaleString()}</span></p>
          <p style="margin-bottom: 6px;">Interest Earned: <span class="fw-bold text-success">₹${Math.round(interestEarned).toLocaleString()}</span></p>
          <p style="font-size: 16px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--bg-glass-border);">Estimated Corpus: <span class="fw-bold text-accent" style="font-size: 20px;">₹${Math.round(totalAccumulated).toLocaleString()}</span></p>
        </div>
      `;
    });
  }
}
