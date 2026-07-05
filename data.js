/**
 * Project AURA - Default Prototype Mock Data
 * Stores transaction history, liabilities, IDBI products, and Semantic Guardrail configurations.
 * Location: d:/Hackathons/IDBI/data.js
 */

const AURA_MOCK_DATA = {
  // User Profile
  user: {
    name: "Aravind Chindi",
    teamName: "Tech Wolf",
    accountNo: "IDBI-6084-2026",
    savingsGoal: 15000 // Monthly Savings Target
  },

  // Monthly income baseline
  monthlyIncome: 75000, // in INR

  // Fixed monthly liabilities (debts, bills, essentials)
  fixedLiabilities: [
    { id: 'liability_rent', name: 'Apartment Rent', amount: 20000, category: 'Housing' },
    { id: 'liability_electricity', name: 'Electricity Bill', amount: 3500, category: 'Utilities' },
    { id: 'liability_broadband', name: 'Broadband Internet', amount: 1500, category: 'Utilities' },
    { id: 'liability_car_loan', name: 'Car Loan EMI', amount: 12000, category: 'Debt' },
    { id: 'liability_insurance', name: 'Term Insurance Premium', amount: 2000, category: 'Insurance' }
  ],
  
  // Historical transactions for past 30 days
  transactions: [
    // Income
    { id: 'tx_salary', date: '2026-06-01', description: 'IDBI Monthly Salary Credit', amount: 75000, type: 'income', category: 'Salary' },
    { id: 'tx_dividend', date: '2026-06-15', description: 'IDBI Mutual Fund Dividend', amount: 2500, type: 'income', category: 'Investments' },
    
    // Fixed Liabilities Paid
    { id: 'tx_rent', date: '2026-06-02', description: 'Apartment Owner Rent Transfer', amount: 20000, type: 'expense', category: 'Housing', isLeak: false },
    { id: 'tx_loan', date: '2026-06-05', description: 'IDBI Auto Loan EMI Debit', amount: 12000, type: 'expense', category: 'Debt', isLeak: false },
    { id: 'tx_elec', date: '2026-06-07', description: 'State Electricity Board Pay', amount: 3500, type: 'expense', category: 'Utilities', isLeak: false },
    { id: 'tx_net', date: '2026-06-08', description: 'Airtel Fiber Broadband', amount: 1500, type: 'expense', category: 'Utilities', isLeak: false },
    { id: 'tx_ins', date: '2026-06-10', description: 'LIC Term Policy Payment', amount: 2000, type: 'expense', category: 'Insurance', isLeak: false },
    
    // Variable Expenses (Discretionary & Leaks)
    { id: 'tx_netflix', date: '2026-06-03', description: 'Netflix India Subscription', amount: 649, type: 'expense', category: 'Subscriptions', isLeak: true },
    { id: 'tx_spotify', date: '2026-06-03', description: 'Spotify Premium Individual', amount: 119, type: 'expense', category: 'Subscriptions', isLeak: true },
    { id: 'tx_gym', date: '2026-06-04', description: 'Gold Gym Membership Monthly', amount: 3000, type: 'expense', category: 'Fitness', isLeak: false },
    { id: 'tx_dine_1', date: '2026-06-05', description: 'Zomato Food Delivery Online', amount: 1250, type: 'expense', category: 'Food & Dining', isLeak: true },
    { id: 'tx_dine_2', date: '2026-06-07', description: 'The Glasshouse Restaurant', amount: 4800, type: 'expense', category: 'Food & Dining', isLeak: true },
    { id: 'tx_dine_3', date: '2026-06-12', description: 'Starbucks Coffee Outlet', amount: 450, type: 'expense', category: 'Food & Dining', isLeak: true },
    { id: 'tx_shop_1', date: '2026-06-14', description: 'Amazon India Online Shopping', amount: 6500, type: 'expense', category: 'Shopping', isLeak: false },
    { id: 'tx_shop_2', date: '2026-06-18', description: 'Zara Apparel Store Buy', amount: 3800, type: 'expense', category: 'Shopping', isLeak: true },
    { id: 'tx_groceries_1', date: '2026-06-10', description: 'BigBasket Grocery Order', amount: 4500, type: 'expense', category: 'Groceries', isLeak: false },
    { id: 'tx_groceries_2', date: '2026-06-25', description: 'Reliance Smart Groceries', amount: 3200, type: 'expense', category: 'Groceries', isLeak: false },
    { id: 'tx_cab_1', date: '2026-06-11', description: 'Ola Cabs Ride Booking', amount: 850, type: 'expense', category: 'Travel', isLeak: false },
    { id: 'tx_cab_2', date: '2026-06-20', description: 'Uber India Ride Payment', amount: 620, type: 'expense', category: 'Travel', isLeak: false },
    { id: 'tx_leak_sub1', date: '2026-06-15', description: 'Unused Cloud Storage Space', amount: 500, type: 'expense', category: 'Subscriptions', isLeak: true },
    { id: 'tx_leak_sub2', date: '2026-06-20', description: 'Premium Fitness App (Unused)', amount: 999, type: 'expense', category: 'Subscriptions', isLeak: true }
  ],
  
  // IDBI Yield-Generating Products for asset growth suggestions
  idbiProducts: [
    {
      id: 'idbi_sip',
      name: 'IDBI Equity Growth Mutual Fund (SIP)',
      type: 'Mutual Fund',
      rate: '14.5% p.a. (Historical)',
      minInvestment: 500,
      description: 'Systematic Investment Plan designed to accumulate wealth over long horizons through diversified equity assets.',
      badge: 'High Yield',
      leakTarget: 'Subscriptions & Dining out leaks can be routed here.'
    },
    {
      id: 'idbi_fd',
      name: 'IDBI Tax-Saver Fixed Deposit',
      type: 'Fixed Deposit',
      rate: '7.25% p.a.',
      minInvestment: 10000,
      description: 'Secure FD with dual benefits of guaranteed high returns and Section 80C income tax deductions.',
      badge: 'Secure Growth',
      leakTarget: 'Surplus cash from Safe-to-Spend limits can be parked here.'
    },
    {
      id: 'idbi_nps',
      name: 'IDBI National Pension System (NPS)',
      type: 'Retirement Fund',
      rate: '9.5% p.a. (Estimated)',
      minInvestment: 500,
      description: 'Government-backed pension scheme aimed at building a robust retirement corpus with additional tax exemptions.',
      badge: 'Retirement Security',
      leakTarget: 'Long-term wealth building redirects.'
    }
  ],

  // Semantic Guardrail configurations for chatbot
  semanticGuardrail: {
    systemPrompt: "You are AURA, the 24/7 Digital Wealth Manager. You strictly answer queries regarding budgeting, personal finance, investing, expense tracking, and IDBI products. If a user asks something unrelated, you must block it under your semantic guardrail and redirect them back to financial matters.",
    
    financialKeywords: [
      'spend', 'save', 'invest', 'budget', 'leak', 'loan', 'interest', 'fd', 'mutual fund', 
      'sip', 'tax', 'nps', 'liability', 'portfolio', 'asset', 'debt', 'expense', 'income', 
      'aura', 'safe-to-spend', 'growth', 'idbi', 'finance', 'money', 'wealth', 'stock', 'shares',
      'salary', 'rent', 'liabilities', 'calculator', 'forecast', 'what-if'
    ],
    
    defaultQAs: [
      {
        question: "What is my Safe-to-Spend limit?",
        answer: "Based on your monthly income of **₹75,000**, fixed liabilities of **₹39,000**, and a monthly savings target of **₹15,000**, your baseline spending limit is calculated as **₹21,000** this month (approx. **₹700 per day**). Keeping within this prevents you from touching your savings."
      },
      {
        question: "Tell me about my expense leaks",
        answer: "AURA identified **5 active leaks** totaling **₹11,117** this month, predominantly from unused subscriptions (Netflix: ₹649, Spotify: ₹119, Cloud: ₹500, Fitness: ₹999) and excessive dining out (₹8,850 total variable dining). Shifting even **₹5,000** of this to **IDBI Equity Growth Mutual Fund (SIP)** could yield up to **₹7.3 Lakhs** in 5 years at a 14.5% compound rate."
      },
      {
        question: "What IDBI products should I invest in?",
        answer: "Depending on your risk appetite:\n- **High Growth**: [IDBI Equity Growth Mutual Fund (SIP)](file:///d:/Hackathons/IDBI/index.html#products) (14.5% historical returns)\n- **Secure/Tax Saving**: [IDBI Tax-Saver FD](file:///d:/Hackathons/IDBI/index.html#products) (7.25% p.a.)\n- **Retirement**: [IDBI National Pension System](file:///d:/Hackathons/IDBI/index.html#products) (~9.5% returns)."
      },
      {
        question: "Who are you?",
        answer: "I am **AURA (Advanced User Risk & Advisory)**, your specialized 24/7 Digital Wealth Manager. I analyze your IDBI bank transaction data to eliminate expense leaks, forecast future income simulation via 'What-If' engines, and recommend wealth products to help you transition from passive saving to structured wealth building."
      }
    ],

    safetyFilterRedirects: [
      "I noticed your query is unrelated to finance. To maintain your wealth discipline, I am programmed to strictly address budgeting, investments, or bank products. Let me know if you would like to analyze your **Safe-to-Spend limit** or **IDBI Wealth Products** instead!",
      "Apologies, but that query triggers our Semantic Guardrail since it is off-topic. As your financial co-pilot, I remain dedicated to your wealth building. Let's discuss your **Expense Leaks** or run a **What-If simulation**!",
      "Under our specialized financial safety filters, I am restricted from answering non-financial queries. Let's check your **Historical Wealth Charts** or calculate a budget forecast instead."
    ]
  }
};
