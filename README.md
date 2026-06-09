# Spendly 💰

> "The code is like a joke. If it needs comment, it's no good." — **Russ Olsen**
>
> "Truth can only be found in one place: the code." ― **Robert C. Martin**

---

## 📚 Project Overview
* **Course:** CSE499 - Senior Project
* **Project Name:** Spendly

Spendly is a modern, responsive financial tracking application designed to help you take control of your personal finances. Track your income, organize your expenses into categories, set monthly budgets, and get real-time visual insights into your spending habits.

---

## ✨ Features

* **🔐 Secure Access:** Create a personal account to keep your financial data private.
* **📁 Custom Categories:** Use default categories (Food, Transport, Salary, etc.) or create your own with custom emojis.
* **💸 Transaction Tracking:** Easily log your daily income and expenses. Edit or remove them if you make a mistake.
* **📊 Financial Insights:** View your total balance, monthly income, and expenses at a glance.
* **🎯 Monthly Budgeting:** Set a custom spending limit for the month and track your progress visually.
* **📥 Export Data:** Download your entire transaction history as a CSV file for your own records.
* **📱 Mobile Ready:** Manage your finances on the go with a fully responsive interface that works great on phones, tablets, and desktop computers.

---

## 🚀 How to Run Locally

If you wish to run a local copy of Spendly on your machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configuration:** 
   Create a `.env.local` file in the root folder with your database connection URL (`DATABASE_URL`) and authentication secret (`AUTH_SECRET`).

3. **Initialize Database:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Start the app:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Team Members
| Name | Role |
| :--- | :--- |
| **David Burguete** | Developer / CSE499 Senior Project |
| **Haroldo Gonzalez** | Developer / CSE499 Senior Project |