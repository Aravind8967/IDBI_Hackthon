# AURA - Advanced User Risk & Advisory

AURA (Advanced User Risk & Advisory) is a specialized 24/7 Digital Wealth Manager prototype developed for the IDBI Bank Digital Wealth Management Track (Track 1) for the IDBI Innovate 2026 hackathon.

## Core Features

- **Holistic Income & Expense Budgeting**: AURA tracks cash flows and fixed liabilities to calculate a dynamic "Safe-to-Spend" daily limit.
- **Historical Financial Health Mapping**: Visualizes spending habits using interactive charts for chosen date ranges.
- **Proactive Wealth & Asset Growth Engine**: Identifies leaking expenses and suggests shifting those funds to yield-generating products.
- **Predictive "What-If" Forward Planner**: Simulates future financial health using user-input scenarios.
- **Context-Aware "Smart Nudges"**: Conversational alerts triggered when spending anomalies threaten monthly goals.

## Prerequisites

To run this application, you must have the following installed on your local machine:
- Docker
- Docker Compose

## Installation

1. Copy the application source files to your workspace directory.
2. Verify that the following files are present in the project folder:
   - index.html
   - styles.css
   - app.js
   - data.js
   - avatar.png
   - Dockerfile
   - nginx.conf
   - docker-compose.yml

## Commands to Start and Stop the Project

Navigate to the project directory containing the docker-compose.yml file in your terminal and run the appropriate commands below.

### To Start the Project

Run the following command to build the Docker image and start the container in detached (background) mode:

```bash
docker compose up -d --build
```

Once running, the application will be accessible in your web browser at:
`http://localhost:8080`

### To Stop the Project

Run the following command to stop the running container and clean up the network:

```bash
docker compose down
```
