# AURA - Advanced User Risk & Advisory

A modern, AI-powered digital wealth management platform built for the IDBI Hackathon. AURA is a comprehensive financial advisory system designed to help users optimize their spending, track assets, and achieve long-term wealth goals.

## 🎯 Overview

AURA is an intelligent 24/7 Digital Wealth Manager that combines real-time expense tracking, AI-driven recommendations, and predictive financial planning. The platform uses semantic guardrails and conversational AI to provide context-aware financial guidance while maintaining user trust and safety.

**Key Innovation**: AURA detects spending leaks, automatically suggests wealth-building opportunities, and simulates financial scenarios to empower users with data-driven decisions.

---

## ✨ Core Features

### 1. **Holistic Income & Expense Budgeting**
- Continuously tracks cash flows and liabilities
- Calculates dynamic "Safe-to-Spend" limits in real-time
- Prevents overspending with intelligent alerts
- Visual breakdown of liabilities vs. discretionary spending

### 2. **Historical Financial Health Mapping**
- Query specific date ranges to analyze spending patterns
- Interactive pie, bar, and trend charts
- Category-wise expense visualization
- Financial Health Score calculation (0-100)

### 3. **Proactive Wealth & Asset Growth Engine**
- Identifies "expense leaks" (wasteful spending patterns)
- One-click redirection of leaked funds to IDBI investment products
- Automatic SIP enrollment suggestions
- Leak tracking and optimization insights

### 4. **Predictive "What-If" Forward Planner**
- Simulate future income/expense scenarios
- 12-month wealth trajectory projections
- Compare baseline vs. simulated growth paths
- Visualize impact of financial decisions

### 5. **Context-Aware "Smart Nudges"**
- Real-time spending anomaly detection
- Conversational alerts from AURA avatar
- Personalized budget optimization tips
- Wealth-building goal reminders

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Charts** | Chart.js 3.x |
| **Backend Simulation** | Node.js (Optional for API integration) |
| **Containerization** | Docker, Nginx |
| **Styling** | Custom CSS with Light/Dark theme support |

### Language Composition:
- **JavaScript**: 48.9%
- **HTML**: 28.1%
- **CSS**: 22.4%
- **Dockerfile**: 0.6%

---

## 📁 Project Structure

```
IDBI_Hackthon/
├── index.html                 # Main application UI
├── app.js                      # Core application logic (32KB)
├── data.js                     # Mock financial data & config
├── styles.css                  # Comprehensive styling
├── nginx.conf                  # Nginx reverse proxy config
├── Dockerfile                  # Container configuration
├── project_notes.txt           # Design & feature notes
├── Aravind_IDBI.pdf           # Project documentation
├── Aravind_IDBI.pptx          # Presentation deck
├── avatar.png                  # AURA avatar asset
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ (optional, for local development)
- Docker & Docker Compose (for containerized deployment)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

#### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aravind8967/IDBI_Hackthon.git
   cd IDBI_Hackthon
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a simple HTTP server:
   python -m http.server 8000
   # Navigate to http://localhost:8000
   ```

#### Option 2: Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t aura-wealth-manager .
   ```

2. **Run the container**
   ```bash
   docker run -p 80:80 aura-wealth-manager
   ```

3. **Access the application**
   - Open `http://localhost` in your browser

---

## 💡 Usage Guide

### Dashboard
- **View Key Metrics**: Monthly income, liabilities, safe-to-spend limit, and financial health score
- **Track Expense Leaks**: See a real-time list of detected wasteful spending
- **One-Click Optimization**: Redirect leaks to IDBI investment products

### Safe-to-Spend Tracker
- **Add Fixed Liabilities**: Loans, insurance premiums, utilities, etc.
- **Set Savings Goals**: Define your monthly wealth-building target
- **Real-Time Calculation**: Automatically calculates available spending budget
- **Visual Budget Bars**: See income breakdown at a glance

### Financial Analytics
- **Expense Distribution Pie Chart**: Category-wise spending breakdown
- **Cash Flow Bar Chart**: Income vs. total expenditure comparison
- **Interactive Charts**: Hover for details, responsive design

### What-If Simulator
- **Input Future Scenarios**: Simulate income changes or planned expenses
- **12-Month Projection**: Visualize wealth growth trajectory
- **Leak Redirection Toggle**: See impact of optimizing expenses
- **Analytical Insights**: Automated forecasts and recommendations

### AURA Chatbot
- **Ask Financial Questions**: Query about spending, investments, products
- **Semantic Guardrails**: AI filters for safe, on-topic responses
- **Quick Prompts**: Suggested questions for quick guidance
- **IDBI Product Information**: Learn about FD, SIP, NPS, Mutual Funds

### Product Calculator
- **Investment Returns Simulator**: Calculate FD, SIP, NPS returns
- **Flexible Inputs**: Principal amount, tenure, product type
- **Compound Interest**: Realistic return projections
- **Investment Planning**: Make informed decisions

---

## 🎨 Features Highlight

### Theme Support
- **Dark Mode** (Default): Easy on the eyes, professional appearance
- **Light Mode**: High contrast alternative
- Toggle via the moon/sun icon in top navigation

### Responsive Design
- Mobile-friendly interface
- Tablet and desktop optimized
- Adaptive charts and layouts

### Real-Time Updates
- Dashboard metrics update instantly
- Charts redraw on data changes
- Smooth animations and transitions

### Data Visualization
- Chart.js for interactive, animated charts
- Doughnut, bar, and line charts
- Theme-aware color schemes
- Legend and tooltip support

---

## 📊 Mock Data Structure

The application includes pre-configured mock data in `data.js`:

```javascript
AURA_MOCK_DATA = {
  user: {
    accountNo: "XXXXX12345",
    savingsGoal: 15000
  },
  monthlyIncome: 80000,
  fixedLiabilities: [
    { name: "Housing Loan", amount: 25000, category: "Housing" },
    { name: "Car Loan", amount: 8000, category: "Transport" },
    // ... more items
  ],
  transactions: [
    // Expense items with category, amount, date
    // Some flagged as "leaks" for detection
  ],
  semanticGuardrail: {
    financialKeywords: [...],
    defaultQAs: [...],
    safetyFilterRedirects: [...]
  }
}
```

---

## 🔐 Security & Privacy

- **Client-Side Processing**: All calculations happen locally in the browser
- **No Real Data**: Uses simulated mock data (demo only)
- **Semantic Guardrails**: AI responses filtered for financial domain
- **No External API Calls**: Standalone application
- **No Data Storage**: Session-based, data resets on refresh

**⚠️ Disclaimer**: This is a prototype/hackathon project. Do not use with real financial data in production without additional security measures.

---

## 🔧 Key Functions (app.js)

| Function | Purpose |
|----------|---------|
| `initDashboard()` | Initialize dashboard metrics |
| `calculateSafeToSpendValues()` | Compute available spending budget |
| `calculateActiveLeaksSum()` | Identify wasteful spending patterns |
| `initCharts()` | Render Chart.js visualizations |
| `processSemanticGuardrail()` | Filter and respond to user queries |
| `runWhatIfSimulation()` | Project financial scenarios |
| `setupProductSimulator()` | Calculate investment returns |
| `redirectLeakToInvestment()` | Redirect expenses to SIPs |

---

## 📈 IDBI Products Integration

AURA includes simulated calculators for:

1. **Fixed Deposit (FD)**
   - Rate: 7.25% p.a.
   - Quarterly compounding
   - Low-risk, guaranteed returns

2. **Systematic Investment Plan (SIP)**
   - Rate: 14.5% p.a. (equity returns)
   - Monthly contributions
   - Best for long-term wealth building

3. **National Pension System (NPS)**
   - Rate: 9.5% p.a.
   - Tax-advantaged retirement planning
   - Flexible withdrawal options

---

## 🎓 Hackathon Context

This project was created for the **IDBI Hackathon** with focus on:
- ✅ Innovative digital wealth management
- ✅ AI-powered financial advice
- ✅ User-centric design
- ✅ Fintech integration with banking products
- ✅ Preventive financial health monitoring

---

## 🤝 Contributing

For hackathon improvements or feature suggestions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with detailed description

---

## 📄 License

This project is created for the IDBI Hackathon. Please refer to the hackathon terms for licensing details.

---

## 📞 Contact & Support

**Project Author**: Aravind8967

For questions, suggestions, or technical support:
- 📧 Email: [Your Email]
- 🐙 GitHub: [https://github.com/Aravind8967](https://github.com/Aravind8967)
- 📱 LinkedIn: [Your LinkedIn]

---

## 🙏 Acknowledgments

- **IDBI Bank** for the hackathon opportunity
- **Chart.js** for data visualization library
- **Digital Humans** (uneeQ & Nvidia) for avatar concept inspiration

---

## 📋 Presentation Materials

- **PDF Deck**: `Aravind_IDBI.pdf` - Comprehensive project documentation
- **PowerPoint**: `Aravind_IDBI.pptx` - Visual presentation for stakeholders
- **Project Notes**: `project_notes.txt` - Development notes and feature roadmap

---

## 🚀 Future Enhancements

- [ ] Real API integration with IDBI banking services
- [ ] Multi-user account support with authentication
- [ ] Advanced ML-based expense categorization
- [ ] Real-time market data integration
- [ ] Goal-based investment recommendations
- [ ] Monthly PDF report generation
- [ ] Mobile app (React Native)
- [ ] Blockchain-based transaction verification

---

**Build Your Wealth, Confidently. With AURA.** 💰

Made with ❤️ for the IDBI Hackathon 2026