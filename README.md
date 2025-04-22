# Grade Eleven Explorer 🌍

**Live Demo:** [https://grade-eleven-explorer.lovable.app](https://grade-eleven-explorer.lovable.app)  
**Repository:** [github.com/Hansani366/grade-eleven-explorer](https://github.com/Hansani366/grade-eleven-explorer)

## 📌 Project Overview

Grade Eleven Explorer is a Micro SaaS web application built using **Vite + React**, designed to demonstrate advanced DevOps workflows in a production-ready environment. This project is part of the **System Administration & Maintenance (IT31023)** course and focuses on CI/CD pipelines, infrastructure automation, and software documentation best practices.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **CI/CD:** GitHub Actions
- **Hosting:** Lovable.app
- **Version Control:** Git + GitHub
- **Docs:** Markdown (`prd.md`, `tdd.md`, `adr.md`, `runbook.md`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (or check `.nvmrc` if included)

### Installation

```bash
git clone https://github.com/Hansani366/grade-eleven-explorer.git
cd grade-eleven-explorer
npm install
npm run dev




📝 System Administration & Maintenance Report
The System Administration & Maintenance Report provides an overview of the DevOps processes and system management for Grade Eleven Explorer. This includes infrastructure setup, CI/CD integration, monitoring, logging, and backup strategies.

Key Highlights:
CI/CD Automation:
GitHub Actions for continuous integration and deployment, ensuring automated testing and deployment to production.

Monitoring:
Utilizes Supabase logs to track database activities and error handling. Future integration with third-party monitoring tools (like UptimeRobot) for system health tracking.

Backup & Recovery:
Daily backups of the PostgreSQL database hosted on Supabase ensure data safety and availability. The backup system also includes scheduled exports of critical data.

Error Handling & Alerting:
Error tracking and alerting are part of the ongoing work. GitHub Actions will notify of any CI/CD pipeline failures, while Supabase will provide logs for critical system errors.

For more detailed information on system administration tasks, check the full System Administration & Maintenance Report.

🚨 Future Enhancements
Future plans for Grade Eleven Explorer include:

Advanced Monitoring Dashboard:
To visualize system performance, user activity, and errors in real-time, improving troubleshooting and maintenance processes.

Mobile Support:
Expand the platform’s reach by providing a mobile version of the web app, enabling users to access content on smartphones.

Granular Backup Strategies:
Implementing versioning and snapshot backups for finer control over data restoration and recovery.

📄 Documentation
Product Requirements Document: prd.md
Outlines the project’s features, user stories, and success criteria for the MVP.

Test-Driven Development (TDD) Documentation: tdd.md
Describes the testing approach, including test cases, code coverage, and testing framework used in the project.

Architecture Decision Record (ADR): adr.md
Describes the architecture decisions made during the development process, including technology stack and design choices.

Runbook for Maintenance & Monitoring: runbook.md
Provides detailed instructions for system maintenance, monitoring setup, and troubleshooting.
