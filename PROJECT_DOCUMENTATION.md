# 🌸 MediConnect Japan (遠隔医療基盤)
### AI-Powered Elderly Care Ecosystem & Senior Tourist Companion

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES_Modules-F7DF1E?logo=javascript)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/UI-3D_Glassmorphism-E8637A)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/jaya-5118/japan-health-guide-)

> **Executive Overview**: MediConnect Japan is a unified digital health and senior travel support platform engineered for Japan's aging demographic crisis (29.1% of population aged 65+) and doctor shortages in rural prefectures (e.g., Aomori). The platform connects **Patients, Caregivers, Doctors, Regional Healthcare Administrators, and International Senior Tourists** into a high-speed, reactive, AI-assisted care network with speech synthesis, 3D glassmorphism UI, real-time medical translation, and instant 119 emergency dispatch protocols.

---

## 📑 Table of Contents
1. [Project Purpose & Core Problems Addressed](#1-project-purpose--core-problems-addressed)
2. [Dataset Origins & Clinical Standards](#2-dataset-origins--clinical-standards)
3. [15 Seed Database Collections](#3-15-seed-database-collections)
4. [Frontend Architecture & 3D Glassmorphism UI](#4-frontend-architecture--3d-glassmorphism-ui)
5. [Backend Reactive State Bus & AI Agent Workflows](#5-backend-reactive-state-bus--ai-agent-workflows)
6. [Tourist Guide Feature (Senior Travel & Emergency)](#6-tourist-guide-feature-senior-travel--emergency)
7. [Step-by-Step User Manual (Role-by-Role)](#7-step-by-step-user-manual-role-by-role)
8. [Hackathon Demo Scenarios (1–5)](#8-hackathon-demo-scenarios-15)
9. [Local Installation & Running](#9-local-installation--running)
10. [PDF Documentation](#10-pdf-documentation)

---

## 1. Project Purpose & Core Problems Addressed

Japan is the world's most super-aged nation. In rural prefectures like Aomori, healthcare infrastructure faces acute challenges:
- **Severe Rural Doctor Shortages**: Regional clinics in northern Tohoku have limited cardiologists and geriatricians.
- **Elderly Living Alone (Dokkyo Rojin)**: Seniors living alone risk missed medications, undetected falls, and silent hypertensive crises.
- **Family Caregiver Burnout**: Working adult children living in different cities struggle to manage daily adherence and emergency notifications.
- **Senior Tourist Language & Accessibility Barriers**: Millions of aging international travelers visit Japan annually but struggle with steep temple steps, lack of seating, communication hurdles, and calling Japanese emergency services (119).

**MediConnect Japan** solves these through an integrated, multi-role web ecosystem that unifies clinical telecare, automated caregiver handoffs, and tourist emergency assistance.

---

## 2. Dataset Origins & Clinical Standards

The database seed models are synthesized based on official Japanese clinical frameworks and government tourism standards:

1. **Ministry of Health, Labour and Welfare (MHLW / 厚生労働省)**:
   - Clinical blood pressure staging and target thresholds (*JSH 2019/2024 Guidelines*: `< 130/80 mmHg` home, `< 140/90 mmHg` clinic).
   - Statutory framework for Japan's **Late-Elderly Healthcare System** (*後期高齢者医療制度*) with 10% co-pay for seniors 75+.
   - Long-Term Care Insurance classifications (*要介護認定* / *要支援1*).
2. **Japan Geriatrics Society (JGS / 日本老年医学会)**:
   - Guidelines for safe pharmacotherapy in elderly patients and polypharmacy monitoring.
   - Clinical models for Amlodipine Besylate (calcium channel blocker), Metformin (T2D glycemic control), and Lisinopril (ACE inhibitor titration).
3. **Japan National Tourism Organization (JNTO / 日本政府観光局)**:
   - Barrier-free accessibility audits of major cultural heritage spots across Tokyo, Kyoto, Kanazawa, Hakone, and Aomori.
   - Universal design taxi guidelines (*JPN TAXI*) and 24/7 multilingual emergency visitor hotline (*050-3816-2720*).
4. **Regional Healthcare Topology**:
   - Realistic geographic mapping across Aomori Prefecture (Hirosaki Community Clinic, Aomori Prefectural Central Hospital, Hirosaki University Hospital) and Tokyo University Hospital referral networks.

---

## 3. 15 Seed Database Collections

| # | Collection Name | Seed Entities | Functional & Clinical Purpose |
|---|-----------------|---------------|-------------------------------|
| 1 | `patients` | Takeshi Sato (78yo), Haruto Takahashi (82yo) | Elderly profiles, blood type, GPS, conditions, insurance |
| 2 | `caregivers` | Yuki Sato, Kenji Takahashi | Primary & backup caregivers, shift status, alert routing |
| 3 | `medications` | Amlodipine, Metformin, Lisinopril | Dosages, timing, adherence tracker, pharmacy linkages |
| 4 | `doctors` | Dr. Hiroshi Tanaka, Dr. Akemi Nakamura | Geriatrics & Cardiology specialties, clinic affiliations |
| 5 | `clinics` | Hirosaki Community Clinic, Tokyo Cardio Center | Regional clinic nodes and tertiary hospital facilities |
| 6 | `symptoms` | Chest pain triage, BP spikes | AI NLP triage scores, severity flags (Emergency/Urgent) |
| 7 | `vital_signs` | Systolic, Diastolic, Pulse, SpO2 | Historical time-series vitals with timestamp tracking |
| 8 | `telehealth_sessions`| Cardio consultations | WebRTC simulated rooms, meeting IDs, encrypted channels |
| 9 | `referrals` | Hirosaki to Tokyo Cardio Center | Cross-regional specialist referral transmissions |
| 10 | `alerts` | Push & voice notification queue | Prioritized alerts (Red/Orange/Yellow/Green) |
| 11 | `medical_history` | Essential Hypertension, T2D, Cataract | ICD-10 coded surgical and chronic condition records |
| 12 | `insurance` | Japan National Health Insurance | Policy numbers, late-elderly co-pay rates, validity |
| 13 | `tourist_places` | Meiji Jingu, Kiyomizu, Kenroku-en, Hakone... | Barrier-free scores, walking effort, resting spots, taxi cards |
| 14 | `tourist_hospitals`| St. Luke's, Kyoto Univ, Jikei, Aomori... | Accredited multilingual hospitals with 24/7 English desks |
| 15 | `tourist_phrases` | Emergency SOS, Transit, Dining phrases | Bilingual phrasebook with audio pronunciation in Japanese |

---

## 4. Frontend Architecture & 3D Glassmorphism UI

The frontend is built using **Vanilla JavaScript (ES Modules)** and bundled with **Vite 8**:
- **Zero Heavy Framework Bloat**: Extremely lightweight, ensuring instant load times even on low-speed cellular connections in rural mountain areas.
- **3D Glassmorphism Design System**: Translucent frosted-glass panels (`backdrop-filter: blur(20px)`), subtle 3D perspective transforms (`perspective(1000px) rotateX(1deg)`), and Japanese cherry blossom (sakura) floating petal animations.
- **Senior-Inclusive Accessibility (WCAG 2.1 AA)**:
  - Big touch targets (minimum 52px button height).
  - High-contrast typography combining Google Fonts *Noto Serif JP* and *Inter*.
  - Color-coded triage indicators (Green = Stable, Yellow = Warning, Red = Emergency).
  - Clean UI without emoji clutter in buttons.
- **Web Speech & Audio Synthesis Engine**: Native browser `window.speechSynthesis` providing bilingual English and Japanese voice prompts, medication reminders, place audio guides, and emergency translations.

---

## 5. Backend Reactive State Bus & AI Agent Workflows

MediConnect Japan utilizes an in-browser reactive store pattern (`src/db/store.js`):
- **Reactive Pub/Sub Store**: Any record update automatically notifies subscribers, triggering atomic UI re-renders and syncing to `localStorage`.
- **HIPAA & Japan PMDA Audit Trail**: Every clinical action, role switch, prescription edit, and SOS dispatch is cryptographically logged with an immutable timestamp, actor ID, and IP address.
- **6 Autonomous AI Agent Workflows**:
  1. **Medication Adherence Agent**: Schedules audio reminders and automatically escalates missed doses to family caregivers.
  2. **Emergency Symptom Detection Agent**: Evaluates natural language symptoms, calculates emergency scores, and auto-dispatches 119 triage alerts.
  3. **Specialist Referral Agent**: Packages clinical records, generates referral letters, and books Tokyo University appointments.
  4. **Telehealth Translation Agent**: Translates English and Japanese clinical dialogue in real time during remote consultations.
  5. **Autonomous Caregiver Handoff Agent**: Seamlessly transfers alert monitoring to backup caregivers when the primary caregiver takes a day off.
  6. **Vital Signs Spike Detection Agent**: Detects hypertensive spikes and alerts attending physicians.

---

## 6. Tourist Guide Feature (Senior Travel & Emergency)

A dedicated portal for elderly international travelers visiting Japan:

1. **Accessible Places Explorer**:
   - Curated senior-friendly heritage sites across Tokyo, Kyoto, Kanazawa, Hakone, and Aomori.
   - Filter by city or region.
   - Displays barrier-free score, wheelchair accessibility, walking effort, resting benches frequency, and nearest emergency hospital.
   - **Audio Guide**: Click "Read Audio Guide" for spoken English narration.
   - **Taxi Driver Card**: Displays large Japanese destination instructions (e.g., *「明治神宮の原宿口までお願いします」*) so seniors can simply show their screen to taxi drivers.

2. **Language & Speech Assistant**:
   - Supports English, Chinese (中文), Korean (한국어), Spanish (Español), and French (Français).
   - Essential phrasebook grouped into *Medical & SOS*, *Transit & Mobility*, and *Dining & Comfort* (e.g., low sodium, chairs instead of tatami floor, hot water for pills).
   - **One-Touch Japanese Pronunciation**: Speaks authentic Japanese aloud via the Web Speech API.
   - **Live Custom Translator**: Type any question to get immediate Japanese Kanji, Romaji phonetics, and speech playback.

3. **Emergency SOS & Tourist Medical Pass**:
   - Instant **119 Ambulance Dispatch** button transmitting location, conditions, and blood type.
   - 24/7 **JNTO Tourist Helpline** connection (*050-3816-2720*).
   - **Senior Tourist Medical Pass**: Displays chronic conditions (Angina, Hypertension, T2D) and allergies (Penicillin) in English and Japanese.
   - **Paramedic Audio Readout**: Click "Read Summary to Paramedic" to speak the patient's entire medical triage profile aloud in Japanese.
   - International hospital directory (St. Luke's, Kyoto Univ Hospital, Jikei, etc.).

4. **Barrier-Free Transit Navigator**:
   - Universal Design Taxi (*JPN TAXI*) request guide with built-in wheelchair boarding ramps.
   - JR and Tokyo Metro free senior escort service instructions with audio assistance request.

---

## 7. Step-by-Step User Manual (Role-by-Role)

Switch roles using the top navigation bar:

### 👴 Patient Role (Takeshi Sato, 78yo)
1. **Home Screen**: Check morning medications (Amlodipine, Metformin), blood pressure status, and active caregiver.
2. **Take Medication**: Click "Take Morning Medication" to log adherence with celebratory confetti and chime.
3. **Voice Control**: Click the microphone icon or quick voice pills ("I took my medicine" or "I feel chest pain").
4. **Emergency SOS**: Tap the red emergency button to access the 119 dispatch console.

### 👩‍⚕️ Caregiver Role (Yuki Sato)
1. **Dashboard**: Monitor elderly patients in real time with color-coded triage status.
2. **Shift Handoff**: Click "Toggle Shift Status" to take a day off; the autonomous agent automatically activates backup caregiver Kenji.
3. **Alerts**: Review prioritized medication and vital sign warnings.

### 🩺 Doctor Role (Dr. Hiroshi Tanaka)
1. **Patient List**: View clinical condition cards, last recorded vitals, and adherence rates.
2. **Patient EHR**: Review full clinical history, allergies, and chronic diagnoses.
3. **Specialist Referral**: Create and submit an encrypted referral to Tokyo University Hospital.
4. **Telehealth**: Start a video consultation with bilingual speech translation and adjust prescriptions.

### 📊 Admin Role (Kenichi Mori)
1. **Analytics Dashboard**: Inspect prefecture-level aging demographics, clinic capacity, and triage metrics.
2. **Export Tools**: Download clinical CSV reports and PMDA-compliant security audit logs.

### 🗼 Tourist Guide Role (Arthur Miller, 74yo Visitor)
1. **Explore Places**: Browse barrier-free attractions and listen to audio guides.
2. **Speak with Locals**: Use the phrasebook or live translator to speak Japanese aloud to station staff or waiters.
3. **Emergency Card**: In case of illness, show or play the Japanese Emergency Medical Pass to paramedics.

---

## 8. Hackathon Demo Scenarios (1–5)

Open the **"Demo Scenarios (1-5)"** modal on the top header to run automated simulations:
- **Scenario 1**: Medication Adherence & Caregiver Escalation
- **Scenario 2**: Emergency Symptom Detection & 119 Autonomous Triage
- **Scenario 3**: Rural-to-Urban Specialist Telehealth & Referral
- **Scenario 4**: Caregiver Shift Handoff & Autonomous Backup Activation
- **Scenario 5**: Blood Pressure Spike & Prescription Titration

---

## 9. Local Installation & Running

```bash
# Clone the repository
git clone https://github.com/jaya-5118/japan-health-guide-.git
cd japan-health-guide-

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
Open your browser at `http://localhost:5173/`.

---

## 10. PDF Documentation

A publication-grade PDF documentation file has been generated and is included in this repository:
- **File**: `MediConnect_Japan_Documentation.pdf`
- **Regenerate PDF**: `python generate_pdf.py` (requires `reportlab` and `pillow`)

---

*MediConnect Japan — 遠隔医療基盤 & Senior Tourist Health Portal*  
*Developed for Google Antigravity Hackathon 2026*
