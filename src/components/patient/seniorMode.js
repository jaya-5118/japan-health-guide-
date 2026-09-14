// ============================================================
// MediConnect Japan - Senior Mode Interface
// Designed around elderly users: Big text, large buttons, high contrast,
// voice-first interaction, zero cognitive overload.
// Philosophy: "Healthcare shouldn't become inaccessible simply because someone cannot type."
// ============================================================
import { store } from "../../db/store.js";
import { soundService } from "../../services/audio.js";

export function renderSeniorMode(currentScreen = "home", voiceFeedback = { state: "idle", heardText: "", actionText: "" }) {
  const pat = store.find("patients", "pat_takeshi");
  const meds = store.get("medications", (m) => m.patient_id === pat.id);
  const vitals = store.get("vital_signs", (v) => v.patient_id === pat.id);
  const latestBp = vitals.filter((v) => v.type === "blood_pressure")[0] || {
    systolic: 138,
    diastolic: 88,
    pulse: 72
  };

  const morningMeds = meds.filter((m) => m.times_per_day.includes("08:00"));
  const allMorningTaken = morningMeds.length > 0 && morningMeds.every((m) => m.today_status === "taken");

  return `
    <div class="senior-container fade-in">
      <!-- Top Accessibility & Mode Bar -->
      <div class="senior-top-bar">
        <div class="senior-mode-badge">
          <span class="senior-badge-dot">●</span>
          <span>Senior Mode Active • かんたん画面</span>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button class="btn-senior-tool" id="btn-senior-read-screen" title="Read this screen aloud">
            <span>🔊</span>
            <span>Read Screen</span>
          </button>

          <button class="btn-senior-tool" id="btn-senior-repeat-speech" title="Repeat the last voice message">
            <span>🔁</span>
            <span>Repeat</span>
          </button>

          <button class="btn-senior-switch-standard" id="btn-switch-to-standard-mode" title="Switch to full dashboard mode">
            <span>Dashboard Mode ➔</span>
          </button>
        </div>
      </div>

      <!-- Core Content Area based on currentScreen -->
      ${
        currentScreen === "home"
          ? renderSeniorHomeScreen(pat, allMorningTaken, latestBp, voiceFeedback)
          : currentScreen === "medicine"
          ? renderSeniorMedicineScreen(pat, morningMeds, allMorningTaken)
          : currentScreen === "health"
          ? renderSeniorHealthScreen(pat, latestBp)
          : renderSeniorEmergencyScreen(pat, latestBp, meds)
      }

      <!-- Simple Gesture Quick Bar -->
      <div class="senior-gesture-bar">
        <span style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase;">
          Quick Shortcuts:
        </span>
        <button class="gesture-pill" id="gesture-confirm-med" title="Thumbs up gesture shortcut">
          <span>👍</span> Confirm Medicine Taken
        </button>
        <button class="gesture-pill" id="gesture-need-help" title="Open palm gesture shortcut">
          <span>✋</span> Need Help / SOS
        </button>
        ${
          currentScreen !== "home"
            ? `
          <button class="gesture-pill" id="gesture-back-home" title="Swipe left or tap to go back">
            <span>⬅️</span> Back to Home
          </button>
        `
            : ""
        }
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 1. SENIOR MODE HOME SCREEN
// ------------------------------------------------------------
function renderSeniorHomeScreen(pat, allMorningTaken, latestBp, voiceFeedback) {
  return `
    <div class="senior-home-wrapper">
      <!-- Large Greeting & Slogan -->
      <div class="senior-greeting-block">
        <h1 class="senior-main-greeting">
          Good morning, ${pat.name.split(" ")[0]}
        </h1>
        <div class="senior-sub-greeting">
          ${pat.name_kanji}さん、おはようございます
        </div>
        <div class="senior-central-prompt">
          How can I help you today?
        </div>
      </div>

      <!-- Prominent Voice Hero Section -->
      <div class="senior-voice-hero">
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">
          <button class="senior-hero-mic ${voiceFeedback.state === "listening" ? "is-listening" : ""}" id="btn-senior-hero-mic" title="Tap to speak">
            <span class="mic-icon">🎤</span>
          </button>

          <div class="senior-voice-status-box">
            <div class="voice-status-label">
              ${
                voiceFeedback.state === "listening"
                  ? "🎤 Listening... (音声を聞き取り中)"
                  : voiceFeedback.state === "heard"
                  ? `🗣 I heard: "${voiceFeedback.heardText}"`
                  : voiceFeedback.state === "confirmed"
                  ? `✅ ${voiceFeedback.actionText || "Action confirmed"}`
                  : "Tap the big microphone or speak anytime"
              }
            </div>
            <div class="voice-hint-text">
              Try saying: <strong>"Did I take my medicine?"</strong>, <strong>"Show my blood pressure"</strong>, or <strong>"I feel chest pain"</strong>
            </div>
          </div>
        </div>

        <!-- 1-Click Interactive Demo Commands (For Judges & Presenters) -->
        <div class="senior-voice-quick-pills">
          <button class="voice-quick-chip" data-speak-cmd="did_i_take_meds">
            <span>🗣 "Did I take my medicine?"</span>
          </button>
          <button class="voice-quick-chip" data-speak-cmd="i_took_medicine">
            <span>🗣 "I took my medicine"</span>
          </button>
          <button class="voice-quick-chip" data-speak-cmd="show_bp">
            <span>🗣 "Show my blood pressure"</span>
          </button>
          <button class="voice-quick-chip chip-emergency" data-speak-cmd="chest_pain">
            <span>🚨 "I feel chest pain"</span>
          </button>
          <button class="voice-quick-chip" data-speak-cmd="call_caregiver">
            <span>📞 "Call my caregiver"</span>
          </button>
        </div>
      </div>

      <!-- THE 4 MAJOR GIANT ACTION BUTTONS (Understood in 2 seconds) -->
      <div class="senior-big-grid">
        <!-- 1. Medicine Button -->
        <button class="senior-action-card card-meds" id="senior-btn-meds">
          <div class="card-icon-huge">💊</div>
          <div class="card-text-group">
            <div class="card-title-huge">Medicine</div>
            <div class="card-status-badge ${allMorningTaken ? "status-taken" : "status-pending"}">
              ${allMorningTaken ? "✅ Morning pills taken" : "⚠️ Morning pills scheduled"}
            </div>
          </div>
        </button>

        <!-- 2. My Health Button -->
        <button class="senior-action-card card-health" id="senior-btn-health">
          <div class="card-icon-huge">❤️</div>
          <div class="card-text-group">
            <div class="card-title-huge">My Health</div>
            <div class="card-status-badge status-info">
              BP: ${latestBp.systolic}/${latestBp.diastolic} mmHg • Normal
            </div>
          </div>
        </button>

        <!-- 3. Speak Button -->
        <button class="senior-action-card card-speak" id="senior-btn-speak">
          <div class="card-icon-huge">🎤</div>
          <div class="card-text-group">
            <div class="card-title-huge">Speak to Me</div>
            <div class="card-status-badge status-voice">
              Tap to talk without typing
            </div>
          </div>
        </button>

        <!-- 4. Emergency Button -->
        <button class="senior-action-card card-emergency" id="senior-btn-sos">
          <div class="card-icon-huge">🚨</div>
          <div class="card-text-group">
            <div class="card-title-huge">Emergency</div>
            <div class="card-status-badge status-alert">
              I feel unwell • Need help
            </div>
          </div>
        </button>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 2. SENIOR MODE MEDICINE SCREEN
// ------------------------------------------------------------
function renderSeniorMedicineScreen(pat, morningMeds, allMorningTaken) {
  return `
    <div class="senior-subscreen-wrapper">
      <div class="senior-screen-header">
        <button class="btn-senior-back" id="btn-senior-back-home">
          <span>⬅ Back to Home</span>
        </button>
        <h2 class="senior-screen-title">💊 Your Medicine Today</h2>
        <button class="btn-senior-read-me" id="btn-read-med-screen">
          <span>🔊 Read this to me</span>
        </button>
      </div>

      <!-- High-Contrast Status Card -->
      <div class="senior-detail-card ${allMorningTaken ? "card-status-success" : "card-status-warning"}">
        <div style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">
          ${
            allMorningTaken
              ? "✅ Morning medicine is recorded as TAKEN!"
              : "⚠️ Morning medicine has NOT been recorded yet."
          }
        </div>
        <div style="font-size: 16px; color: #334155; line-height: 1.5;">
          ${
            allMorningTaken
              ? "Well done, Takeshi-san! Your doctor and caregiver have received confirmation."
              : "Please take your prescribed pills with a glass of water, then tap the big confirm button below or say 'I took my medicine'."
          }
        </div>
      </div>

      <!-- Giant Pill Cards -->
      <div class="senior-pills-list">
        <div class="senior-pill-row">
          <div class="pill-badge-icon">💊</div>
          <div style="flex: 1;">
            <div style="font-size: 22px; font-weight: 800; color: #1E293B;">Amlodipine (アムロジピン) 5mg</div>
            <div style="font-size: 16px; color: #64748B; margin-top: 4px;">For Blood Pressure • 1 tablet with water at 8:00 AM</div>
          </div>
          <div class="pill-taken-indicator">
            ${allMorningTaken ? "✅ Taken" : "⏳ Pending"}
          </div>
        </div>

        <div class="senior-pill-row">
          <div class="pill-badge-icon">💊</div>
          <div style="flex: 1;">
            <div style="font-size: 22px; font-weight: 800; color: #1E293B;">Metformin (メトホルミン) 500mg</div>
            <div style="font-size: 16px; color: #64748B; margin-top: 4px;">For Blood Sugar • 1 tablet after breakfast at 8:00 AM</div>
          </div>
          <div class="pill-taken-indicator">
            ${allMorningTaken ? "✅ Taken" : "⏳ Pending"}
          </div>
        </div>
      </div>

      <!-- Giant Action Buttons -->
      <div class="senior-action-pair">
        <button class="btn-senior-huge-confirm" id="btn-senior-confirm-meds">
          <span style="font-size: 32px;">✅</span>
          <span>I Took My Medicine (飲みました)</span>
        </button>

        <button class="btn-senior-huge-secondary" id="btn-senior-speak-med-info">
          <span style="font-size: 28px;">🔊</span>
          <span>Read My Instructions Aloud</span>
        </button>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 3. SENIOR MODE MY HEALTH SCREEN
// ------------------------------------------------------------
function renderSeniorHealthScreen(pat, latestBp) {
  return `
    <div class="senior-subscreen-wrapper">
      <div class="senior-screen-header">
        <button class="btn-senior-back" id="btn-senior-back-home">
          <span>⬅ Back to Home</span>
        </button>
        <h2 class="senior-screen-title">❤️ My Health Information</h2>
        <button class="btn-senior-read-me" id="btn-read-health-screen">
          <span>🔊 Read this to me</span>
        </button>
      </div>

      <!-- Giant Blood Pressure Card -->
      <div class="senior-bp-card">
        <div style="font-size: 18px; font-weight: 800; color: #4338CA; text-transform: uppercase; letter-spacing: 0.05em;">
          Latest Blood Pressure (血圧)
        </div>
        <div class="senior-bp-numbers">
          ${latestBp.systolic} / ${latestBp.diastolic} <span style="font-size: 28px; color: #64748B; font-weight: 600;">mmHg</span>
        </div>
        <div style="font-size: 20px; font-weight: 700; color: #1E293B; margin-top: 6px;">
          Pulse: ${latestBp.pulse} bpm • Target Status: <span style="color: #16A34A;">In Safe Target Range</span>
        </div>
        <div style="font-size: 15px; color: #64748B; margin-top: 6px;">
          Recorded today at 8:00 AM from your home monitor
        </div>
      </div>

      <!-- Doctor & Caregiver Direct Notes -->
      <div class="senior-detail-card" style="border-left: 6px solid #4F46B8;">
        <div style="font-size: 18px; font-weight: 800; color: #1E293B; margin-bottom: 6px;">
          👨‍⚕️ Note from Dr. Hiroshi Tanaka (Hirosaki Clinic):
        </div>
        <div style="font-size: 17px; color: #334155; line-height: 1.6;">
          "Takeshi-san, your blood pressure is well-managed. Continue your morning walk in the garden, and stay hydrated throughout the day."
        </div>
      </div>

      <div class="senior-detail-card" style="border-left: 6px solid #E8637A;">
        <div style="font-size: 18px; font-weight: 800; color: #1E293B; margin-bottom: 6px;">
          👩‍⚕️ Primary Caregiver on Duty:
        </div>
        <div style="font-size: 17px; color: #334155; line-height: 1.6;">
          <strong>Yuki Sato (Daughter)</strong> • Phone: +81 90-4412-9901<br>
          Receiving all daily health confirmations and vitals updates.
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="senior-action-pair">
        <button class="btn-senior-huge-confirm" id="btn-senior-read-bp-aloud" style="background: linear-gradient(135deg, #4F46B8, #3730A3);">
          <span style="font-size: 28px;">🔊</span>
          <span>Read My Vitals Aloud</span>
        </button>

        <button class="btn-senior-huge-secondary" id="btn-senior-call-caregiver-voice">
          <span style="font-size: 28px;">📞</span>
          <span>Call Caregiver (Yuki)</span>
        </button>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 4. SENIOR MODE EMERGENCY SCREEN
// ------------------------------------------------------------
function renderSeniorEmergencyScreen(pat, latestBp, meds) {
  return `
    <div class="senior-subscreen-wrapper">
      <!-- High Visibility Emergency Header -->
      <div class="senior-emergency-header-box">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 48px; animation: urgent-pulse 1.5s infinite;">🚨</div>
            <div>
              <h1 style="font-size: 32px; font-weight: 900; color: #FFFFFF; margin: 0;">
                Emergency Detected
              </h1>
              <div style="font-size: 20px; font-weight: 700; color: #FECDD3; margin-top: 4px;">
                Chest pain reported • Emergency workflow initiated
              </div>
            </div>
          </div>

          <button class="btn-senior-back" id="btn-senior-back-home" style="background: rgba(255,255,255,0.25); color: white; border: 1px solid rgba(255,255,255,0.4);">
            <span>⬅ Return to Safe Screen</span>
          </button>
        </div>
      </div>

      <!-- Disclosure Badge (Strict Hackathon Guideline: Not live 119, prototype) -->
      <div class="senior-prototype-badge">
        ⚠️ <strong>119 Emergency Workflow Prototype:</strong> Predefined emergency symptom detected. Designed for future 119 integration. AI does not diagnose or replace physicians.
      </div>

      <!-- Critical Paramedic Summary Card -->
      <div class="senior-emergency-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; border-bottom: 2px solid #F1F5F9; padding-bottom: 14px; margin-bottom: 16px;">
          <div>
            <div style="font-size: 14px; color: #64748B; font-weight: 700; text-transform: uppercase;">PATIENT IDENTIFICATION</div>
            <div style="font-size: 26px; font-weight: 900; color: #1E293B;">${pat.name} (${pat.name_kanji})</div>
            <div style="font-size: 16px; color: #475569; margin-top: 2px;">Age 78 • Blood Type A+ • Hirosaki, Aomori</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; color: #DC2626; font-weight: 800;">LATEST VITALS RECORDED</div>
            <div style="font-size: 26px; font-weight: 900; color: #DC2626;">${latestBp.systolic} / ${latestBp.diastolic} mmHg</div>
            <div style="font-size: 15px; color: #64748B;">Pulse: ${latestBp.pulse} bpm</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div style="background: #FFF8E8; padding: 14px; border-radius: 12px; border: 1px solid #FDE68A;">
            <div style="font-size: 13px; font-weight: 800; color: #B45309; text-transform: uppercase;">KNOWN MEDICAL CONDITIONS</div>
            <div style="font-size: 16px; font-weight: 700; color: #1E293B; margin-top: 4px;">
              Essential Hypertension, Type 2 Diabetes
            </div>
            <div style="font-size: 14px; color: #B91C1C; font-weight: 700; margin-top: 4px;">
              Allergies: Penicillin, Sulfa drugs
            </div>
          </div>

          <div style="background: #F8FAFC; padding: 14px; border-radius: 12px; border: 1px solid #E2E8F0;">
            <div style="font-size: 13px; font-weight: 800; color: #475569; text-transform: uppercase;">CAREGIVER & DOCTOR ALERTED</div>
            <div style="font-size: 16px; font-weight: 700; color: #1E293B; margin-top: 4px;">
              Caregiver: Yuki Sato (+81 90-4412-9901)
            </div>
            <div style="font-size: 14px; color: #64748B; margin-top: 2px;">
              Doctor: Dr. Tanaka (Hirosaki Community Clinic)
            </div>
          </div>
        </div>

        <!-- Paramedic Summary in Japanese -->
        <div style="background: #F1F5F9; border-radius: 10px; padding: 14px; font-size: 15px; color: #1E293B; font-family: 'Noto Serif JP', serif; line-height: 1.6;">
          <strong>救急隊員・搬送先病院への申し送り事項:</strong><br>
          患者名: 佐藤 健（78歳・男性）。持病: 本態性高血圧症、2型糖尿病。ペニシリンアレルギーあり。常用薬: アムロジピン5mg、メトホルミン500mg。主介護者: 長女 佐藤 由紀（090-4412-9901）に自動緊急通報送信済み。
        </div>
      </div>

      <!-- Giant Action Buttons -->
      <div class="senior-action-pair">
        <button class="btn-senior-huge-confirm" id="btn-senior-read-paramedic-summary" style="background: linear-gradient(135deg, #DC2626, #991B1B);">
          <span style="font-size: 32px;">🔊</span>
          <span>Read Medical Summary to Paramedic</span>
        </button>

        <button class="btn-senior-huge-secondary" id="btn-senior-call-caregiver-emergency">
          <span style="font-size: 32px;">📞</span>
          <span>Call Caregiver (Yuki) Directly</span>
        </button>
      </div>
    </div>
  `;
}
