<div align="center">
  <img src="https://github.com/user-attachments/assets/5c36a4a3-2971-46a7-9abe-9a8ca2feb152" alt="EcoDrop Logo" width="300" />

  # 💧 EcoDrop
  **Digitalizing Waste For A Greener Tomorrow**

  <p align="center">
    <img src="https://img.shields.io/badge/KitaHack-2026-10b981?style=for-the-badge&logo=hackaday&logoColor=white" alt="KitaHack 2026"/>
    <img src="https://img.shields.io/badge/Team-ChiliPanMee-ef4444?style=for-the-badge" alt="Team ChiliPanMee"/>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white" alt="Next.js"/>
    <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?logo=googlegemini&logoColor=white" alt="Gemini Vision AI"/>
    <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black" alt="Firebase"/>
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  </p>
</div>

---

## 🚩 The Hidden Crisis: Used Cooking Oil (UCO)
In Malaysia, an estimated **500,000 tonnes of used cooking oil** are generated annually. Unfortunately, a vast majority of it is improperly poured down sinks. 
* 🚫 **Infrastructure Damage:** UCO causes over 70% of urban sewerage blockages (fatbergs), costing millions of Ringgit in municipal maintenance.
* ☠️ **Environmental Threat:** Just 1 liter of oil can contaminate 1,000,000 liters of water, severely threatening local ecosystems.

## 💡 Our Solution: EcoDrop
**EcoDrop** is a mobile-first digital platform that transforms this environmental crisis into a high-value resource for the biofuel industry. We turn a messy chore into a rewarding habit by connecting households and F&B businesses directly to the recycling ecosystem.

### The 3 Core Pillars:
1. 📸 **SCAN:** Built-in Vision AI instantly checks oil purity via the smartphone camera.
2. 📍 **DROP:** Integrated mapping guides users to the nearest verified Smart Bins.
3. 🎁 **EARN:** Users receive Green Points upon drop-off, redeemable for real-world rewards.

---

## 🌍 UN Sustainable Development Goals Alignment
We proudly align our mission with the United Nations SDGs:

| SDG | Description | How EcoDrop Helps |
| :--- | :--- | :--- |
| **11** | **Sustainable Cities & Communities** | Improving municipal waste management and reducing the environmental impact of urban sewerage systems. |
| **12** | **Responsible Consumption & Production** | Substantially reducing waste generation through incentivized recycling and verified quality control. |

---

## ✨ Key Technical Features 

### 🤖 1. AI Intelligence Layer (Vision AI Engine)
Powered by **Google Gemini 2.5 Flash**, our `SmartScan` module evaluates images of UCO containers in real-time. It detects debris, estimates water content, and provides an instant **Quality Grade (A, B, or C)**, ensuring downstream biofuel processors receive verified feedstock.

### 🗺️ 2. Eco-Locator (Geospatial Mapping)
Utilizing `Leaflet` and Google mapping APIs, EcoDrop calculates precise distances to nearby collection centers, displaying real-time bin capacities (e.g., "45% Full") to optimize the user journey.

### 🏢 3. B2B Commercial Scheduler
A dedicated portal allowing restaurants and F&B operators to seamlessly book bulk oil pickups (>20 Liters), track their total recycled volume, and calculate their specific CO₂ offsets.

### 🎁 4. Green Rewards Ecosystem
An integrated storefront where verified drops translate into Green Points. Users can instantly redeem points for Petronas/Shell fuel vouchers or grocery discounts.

---

## 👤 User Journey: Meet Alex

**Persona:** Alex, Apartment Dweller 🏢
* **The Problem:** Alex cooks at home frequently but doesn't know where to throw his stored oil safely. He worries about clogging the sink.
* **Scan Oil:** Alex opens EcoDrop and uses the **AI Smart Scan** to grade his oil. 
* **Find Bin:** The app's map navigates him to the "Central Park UCO Bin" just 0.8km away.
* **Drop & Log:** He drops off the oil, and logs the transaction with a photo.
* **Earn Rewards:** Alex earns Green Points, subsidizing his next fuel purchase, while his oil is sent to a biofuel refinery.

> **The Result:** Instead of a messy chore that ends up in the drain, Alex's oil is now verified feedstock for biofuel, and he is rewarded for his effort.

---

## 🛠️ Tech Architecture

* **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion (for fluid UI animations). Mobile-first responsive design.
* **Cloud Backend:** Google Firebase (Authentication, Firestore Database, Cloud Storage for images).
* **AI Model:** Google AI Studio / Gemini API (JSON schema-enforced multi-modal prompting).
* **Location Services:** Geospatial tracking via React-Leaflet.

---

## 🚀 Run Locally 

**Prerequisites:** Node.js (v18+) 
1. Install dependencies: `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app: `npm run dev`

## Run and deploy your AI Studio app 

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/cab01ed4-7432-4af4-aaf4-8a832bf01858

---

## License

Copyright © 2026 ChiliPanMee - KitaHack2026. All rights reserved.
