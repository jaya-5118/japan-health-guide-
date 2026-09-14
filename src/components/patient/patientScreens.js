// ============================================================
// MediConnect Japan - Phase 3: Patient Interface (5 Screens)
// Voice-First, Mobile-Primary & High-Contrast Elderly UI
// 3D Glassmorphism Japanese Theme
// ============================================================
import { store } from "../../db/store.js";
import { soundService } from "../../services/audio.js";
import {
  runWorkflowMedicationReminder,
  runWorkflowEmergencySymptomDetection,
  runWorkflowVitalsSpikeDetection
} from "../../agents/workflows.js";

export function renderPatientView(activeTab = "home") {
  const pat = store.find("patients", "pat_takeshi");
  const meds = store.get("medications", (m) => m.patient_id === pat.id);
  const vitals = store.get("vital_signs", (v) => v.patient_id === pat.id);
  const alerts = store.get("alerts", (a) => a.patient_id === pat.id && a.recipient_role === "patient");

  const latestBp = vitals.filter((v) => v.type === "blood_pressure")[0] || {
    systolic: 138,
    diastolic: 88,
    pulse: 72
  };
  const takenMeds = meds.filter((m) => m.today_status === "taken").length;
  const totalMeds = meds.length;

  return `
    <div class="patient-wrapper">
      <!-- Mode Switcher: Quick jump to Senior Mode -->
      <div style="background: rgba(232, 99, 122, 0.2); border: 1.5px solid var(--primary); border-radius: var(--radius-full); padding: 8px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; backdrop-filter: blur(12px);">
        <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: #FFFFFF; font-size: 14px;">
          <span>👵 Prefer larger text & voice?</span>
        </div>
        <button class="btn-senior-switch-standard" id="btn-switch-to-senior-mode" style="background: var(--primary); color: white; border: none; font-weight: 800; padding: 8px 18px; border-radius: var(--radius-full); cursor: pointer; box-shadow: 0 4px 12px rgba(232, 99, 122, 0.4);">
          <span>Switch to Senior Mode (かんたん画面) ➔</span>
        </button>
      </div>

      <!-- Voice Assistant Bar -->
      <div class="voice-hero-bar" style="color: white; border-radius: 20px; padding: 18px 24px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <button id="btn-patient-voice-mic" class="mic-pulse-btn" style="width: 58px; height: 58px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4); color: #fff; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
            🎤
          </button>
          <div>
            <div style="font-size: 17px; font-weight: 700;">Tap Mic & Speak (音声サポート)</div>
            <div style="font-size: 13px; opacity: 0.8;">Try saying: <em>"I took my 8 AM medicine"</em> or <em>"I have chest pain"</em></div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-voice-quick" data-voice="took_med" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; backdrop-filter: blur(6px); transition: all 0.2s;">
            🗣 "Took my morning pills"
          </button>
          <button class="btn-voice-quick" data-voice="chest_pain" style="background: rgba(220,53,69,0.3); border: 1px solid rgba(255,255,255,0.3); color: #FFF; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; backdrop-filter: blur(6px); transition: all 0.2s;">
            🚨 "I have chest pain"
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="screen-tabs">
        <button class="screen-tab ${activeTab === "home" ? "active" : ""}" data-patient-tab="home">
          🏠 Home Dashboard
        </button>
        <button class="screen-tab ${activeTab === "meds" ? "active" : ""}" data-patient-tab="meds">
          💊 Medications (${takenMeds}/${totalMeds})
        </button>
        <button class="screen-tab ${activeTab === "emergency" ? "active" : ""}" data-patient-tab="emergency">
          🚨 "I Feel Unwell" (SOS)
        </button>
        <button class="screen-tab ${activeTab === "vitals" ? "active" : ""}" data-patient-tab="vitals">
          📊 Health Tracking & BP
        </button>
        <button class="screen-tab ${activeTab === "messages" ? "active" : ""}" data-patient-tab="messages">
          💬 Messages & Care Team (${alerts.filter(a => !a.is_read).length})
        </button>
      </div>

      <!-- Content Views -->
      <div class="patient-screen-content">
        ${
          activeTab === "home"
            ? renderHomeScreen(pat, meds, latestBp, takenMeds, totalMeds, alerts)
            : activeTab === "meds"
            ? renderMedsScreen(pat, meds)
            : activeTab === "emergency"
            ? renderEmergencyScreen(pat)
            : activeTab === "vitals"
            ? renderVitalsScreen(pat, vitals, latestBp)
            : renderMessagesScreen(pat, alerts)
        }
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 1: HOME DASHBOARD
// ------------------------------------------------------------
function renderHomeScreen(pat, meds, latestBp, takenMeds, totalMeds, alerts) {
  const unreadAlerts = alerts.filter((a) => !a.is_read);

  return `
    <div class="fade-in">
      <!-- Greeting Banner -->
      <div class="elderly-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="font-size: 14px; color: var(--text-muted); font-weight: 600;">Good morning • おはようございます</div>
          <h2 style="font-size: 28px; font-weight: 800; color: var(--text-main); margin: 6px 0; font-family: var(--font-display);">
            ${pat.name} (${pat.name_kanji})<br/><button id="btn-edit-patient" class="btn-touch-primary" style="margin-top:8px;background:var(--accent-indigo);color:#fff;">Edit Profile</button>
          </h2>
          <div style="font-size: 14px; color: var(--text-secondary);">
            📍 ${pat.city}, ${pat.prefecture} • Primary Care: Dr. Hiroshi Tanaka (Rural Clinic)
          </div>
        </div>
        <div style="text-align: right;">
          <div class="status-pill ${pat.status}">
            Status: ${pat.status.toUpperCase()}
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
            ${pat.status_reason}
          </div>
        </div>
      </div>

      <!-- 3 Large Status Cards -->
      <div class="grid-3">
        <!-- Card 1: Today's Meds -->
        <div class="elderly-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <span style="font-size: 17px; font-weight: 700; color: var(--text-main);">💊 Today's Meds</span>
            <span style="font-weight: 800; font-size: 15px; color: var(--accent-indigo);">${takenMeds}/${totalMeds} Taken</span>
          </div>
          <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 18px;">
            ${
              takenMeds === totalMeds
                ? "✓ All medications taken for today! Excellent work."
                : "Morning doses due: Amlodipine 5mg & Metformin 500mg."
            }
          </div>
          <button class="btn-touch-primary" id="btn-quick-take-med" style="width: 100%;">
            ${takenMeds === totalMeds ? "✓ Meds Completed" : "💊 Take Morning Pills"}
          </button>
        </div>

        <!-- Card 2: Health Status & Vitals -->
        <div class="elderly-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <span style="font-size: 17px; font-weight: 700; color: var(--text-main);">❤️ Latest Vitals</span>
            <span class="status-pill yellow">CAUTION</span>
          </div>
          <div style="font-size: 34px; font-weight: 900; color: var(--status-orange); margin-bottom: 4px; font-family: var(--font-display);">
            ${latestBp.systolic}/${latestBp.diastolic} <span style="font-size: 15px; font-weight: 500; color: var(--text-muted);">mmHg</span>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 18px;">
            Pulse: ${latestBp.pulse} bpm • Measured today at 08:00 AM
          </div>
          <button class="btn-touch-primary" id="btn-nav-to-vitals" style="width: 100%; background: linear-gradient(135deg, var(--warning), var(--status-orange));">
            📈 View BP Trend Chart
          </button>
        </div>

        <!-- Card 3: Care Team Messages -->
        <div class="elderly-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <span style="font-size: 17px; font-weight: 700; color: var(--text-main);">💬 Care Team</span>
            <span style="background: linear-gradient(135deg, var(--success), #1B8A4A); color: white; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: 700;">
              ${unreadAlerts.length} New
            </span>
          </div>
          <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 18px;">
            Daughter Yuki (Tokyo) & Son Kenji are on standby. Next appointment: Sept 15 (Telehealth).
          </div>
          <button class="btn-touch-primary" id="btn-nav-to-messages" style="width: 100%; background: linear-gradient(135deg, var(--success), #1B8A4A);">
            📩 Open Messages
          </button>
        </div>
      </div>

      <!-- Quick Action SOS Section -->
      <div class="elderly-card" style="background: rgba(253, 234, 236, 0.85); border: 2px dashed var(--error); text-align: center; padding: 32px 20px;">
        <h3 style="font-size: 22px; font-weight: 800; color: #991B1B; margin-bottom: 10px; font-family: var(--font-display);">
          Need Immediate Medical Help? (緊急医療サポート)
        </h3>
        <p style="font-size: 15px; color: #7F1D1D; max-width: 600px; margin: 0 auto 22px;">
          If you feel dizziness, chest pain, or sudden shortness of breath, tap the red SOS button below or speak into the microphone.
        </p>
        <button class="btn-sos" id="btn-home-sos">
          🚨 "I Feel Unwell" (緊急連絡・救急)
        </button>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 2: MEDICATIONS
// ------------------------------------------------------------
function renderMedsScreen(pat, meds) {
  const taken = meds.filter((m) => m.today_status === "taken").length;
  const adherencePercent = Math.round((taken / meds.length) * 100);

  return `
    <div class="fade-in">
      <div class="elderly-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; font-family: var(--font-display);">My Daily Medications (お薬手帳)</h2>
          <div style="font-size: 14px; color: var(--text-secondary);">
            Synchronized with Dr. Tanaka's clinic & Caregiver Yuki in Tokyo
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="text-align: right;">
            <div style="font-size: 24px; font-weight: 900; color: var(--success);">${taken}/${meds.length} Taken</div>
            <div style="font-size: 12px; color: var(--text-muted);">${adherencePercent}% daily adherence</div>
          </div>
          <button id="btn-trigger-reminder-demo" class="btn-touch-primary" style="background: linear-gradient(135deg, var(--accent-indigo), #7C3AED); font-size: 13px; height: 44px;">
            🔔 Test Voice Reminder
          </button>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${meds
          .map((m) => {
            const isTaken = m.today_status === "taken";
            return `
            <div class="elderly-card" style="border-left: 6px solid ${m.color}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div style="flex: 1; min-width: 260px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                  <span style="font-size: 19px; font-weight: 800; color: var(--text-main);">${m.name}</span>
                  <span style="font-size: 15px; font-weight: 700; color: var(--text-secondary);">(${m.dosage})</span>
                  <span style="background: rgba(0,0,0,0.06); font-size: 11px; padding: 2px 8px; border-radius: 6px;">${m.shape}</span>
                </div>
                <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 6px;">
                  ${m.name_jp} • Scheduled: <strong>${m.times_per_day.join(", ")}</strong>
                </div>
                <div style="font-size: 13px; color: var(--text-muted);">
                  ${m.instructions} • Stock: <strong>${m.stock_remaining} pills</strong> (Refill due: ${m.refill_due_date})
                </div>
              </div>

              <div>
                ${
                  isTaken
                    ? `<div style="background: rgba(230, 247, 237, 0.9); border: 1px solid var(--success); color: #065F46; padding: 10px 20px; border-radius: 14px; font-size: 15px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                        ✓ Taken at 08:12 AM
                       </div>`
                    : `<button class="btn-touch-primary btn-take-single-med" data-med-id="${m.id}" style="min-width: 180px;">
                        💊 Take Dose Now
                       </button>`
                }
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 3: "I FEEL UNWELL" EMERGENCY (SOS)
// ------------------------------------------------------------
function renderEmergencyScreen(pat) {
  return `
    <div class="fade-in">
      <div class="elderly-card" style="background: rgba(253, 234, 236, 0.88); border: 2px solid var(--error);">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
          <div style="font-size: 38px;">🚨</div>
          <div>
            <h2 style="font-size: 24px; font-weight: 800; color: #991B1B; font-family: var(--font-display);">
              Emergency Symptom Triage (体調急変・緊急アシスタント)
            </h2>
            <div style="font-size: 14px; color: #7F1D1D;">
              AI NLP interpreter analyzes your symptoms and immediately dispatches alerts to Caregivers, Clinic, and Japan 119 Emergency Services.
            </div>
          </div>
        </div>

        <div class="form-group" style="margin-top: 20px;">
          <label class="form-label" style="font-size: 17px; font-weight: 700; color: #1E293B;">
            Describe what you are feeling (症状を教えてください):
          </label>
          <div style="display: flex; gap: 12px; margin-bottom: 12px;">
            <input type="text" id="input-symptom-text" class="form-input" placeholder="e.g. Severe chest pain, shortness of breath, sudden dizziness" value="Severe chest pain and tightness in chest" style="font-size: 17px; height: 56px;">
            <button class="btn-touch-primary" id="btn-assess-symptom" style="background: linear-gradient(135deg, #E53935, #B71C1C); min-width: 180px; font-size: 17px;">
              🔍 Analyze & Alert
            </button>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-ghost-pill symptom-chip" data-text="Severe chest pain and pressure" style="color: #991B1B; border-color: #F87171; background: rgba(254, 226, 226, 0.8);">
              🚨 "Severe chest pain"
            </button>
            <button class="btn-ghost-pill symptom-chip" data-text="Sudden dizziness upon standing" style="color: #92400E; border-color: #FCD34D; background: rgba(254, 243, 199, 0.8);">
              ⚠️ "Sudden dizziness"
            </button>
            <button class="btn-ghost-pill symptom-chip" data-text="Shortness of breath walking up stairs" style="color: #991B1B; border-color: #F87171; background: rgba(254, 226, 226, 0.8);">
              🚨 "Shortness of breath"
            </button>
          </div>
        </div>

        <div id="emergency-assessment-result" style="margin-top: 24px; padding: 22px; background: rgba(255,255,255,0.9); border-radius: 16px; border: 1px solid #FECACA; backdrop-filter: blur(8px);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <div>
              <span class="status-pill red">AI SEVERITY: RED EMERGENCY (重度)</span>
              <span style="font-size: 13px; color: var(--text-muted); margin-left: 10px;">Google Cloud Medical NLP Confidence: 96%</span>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #991B1B;">
              GPS: 40.6031° N, 140.4641° E (Hirosaki, Aomori)
            </div>
          </div>
          <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 20px;">
            Potential acute cardiovascular event detected. Protocol recommendation: Immediate 119 Ambulance dispatch and family caregiver notification.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <button class="btn-sos" id="btn-trigger-119" style="height: 56px; font-size: 16px;">
              🚑 Call 119 (Japan Emergency)
            </button>
            <button class="btn-touch-primary" id="btn-call-caregiver" style="height: 56px; background: linear-gradient(135deg, var(--warning), var(--status-orange)); font-size: 16px;">
              📞 Call Daughter Yuki
            </button>
            <button class="btn-touch-primary" id="btn-call-doctor" style="height: 56px; background: linear-gradient(135deg, var(--accent-indigo), #7C3AED); font-size: 16px;">
              👨‍⚕️ Call Dr. Tanaka
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 4: HEALTH TRACKING & BP
// ------------------------------------------------------------
function renderVitalsScreen(pat, vitals, latestBp) {
  const bpHistory = vitals.filter((v) => v.type === "blood_pressure");

  return `
    <div class="fade-in">
      <div class="elderly-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 22px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800; font-family: var(--font-display);">Blood Pressure Trend Chart (血圧推移)</h2>
            <div style="font-size: 14px; color: var(--text-secondary);">
              Target: &lt; 130 / 80 mmHg • Continuous Tele-monitoring
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <span class="status-pill yellow">CAUTION: Systolic elevated</span>
          </div>
        </div>

        <!-- SVG Line Chart for 3 Days -->
        <div style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 22px; margin-bottom: 22px; backdrop-filter: blur(6px);">
          <div style="font-size: 13px; font-weight: 700; color: var(--text-secondary); margin-bottom: 10px;">
            Last 3 Days Blood Pressure Log (Sept 11 - Sept 13, 2026)
          </div>
          <svg viewBox="0 0 600 200" style="width: 100%; height: 200px; overflow: visible;">
            <!-- Grid Lines -->
            <line x1="40" y1="40" x2="580" y2="40" stroke="rgba(0,0,0,0.1)" stroke-dasharray="4" />
            <line x1="40" y1="90" x2="580" y2="90" stroke="rgba(0,0,0,0.1)" stroke-dasharray="4" />
            <line x1="40" y1="140" x2="580" y2="140" stroke="rgba(0,0,0,0.1)" stroke-dasharray="4" />
            <text x="5" y="45" font-size="11" fill="#6B6B8D">150</text>
            <text x="5" y="95" font-size="11" fill="#2E9E5E">130 (Goal)</text>
            <text x="5" y="145" font-size="11" fill="#6B6B8D">90</text>

            <!-- Target 130 line highlighted -->
            <line x1="40" y1="90" x2="580" y2="90" stroke="#2E9E5E" stroke-width="2" stroke-dasharray="6" />

            <!-- Systolic Line (Pink) -->
            <polyline fill="none" stroke="#E8637A" stroke-width="3" points="80,65 280,60 480,70" />
            <circle cx="80" cy="65" r="6" fill="#E8637A" />
            <text x="80" y="50" font-size="12" font-weight="bold" fill="#E8637A" text-anchor="middle">140</text>

            <circle cx="280" cy="60" r="6" fill="#E8637A" />
            <text x="280" y="45" font-size="12" font-weight="bold" fill="#E8637A" text-anchor="middle">142</text>

            <circle cx="480" cy="70" r="6" fill="#E8637A" />
            <text x="480" y="55" font-size="12" font-weight="bold" fill="#E8637A" text-anchor="middle">138</text>

            <!-- Diastolic Line (Indigo) -->
            <polyline fill="none" stroke="#4F46B8" stroke-width="3" points="80,145 280,140 480,145" />
            <circle cx="80" cy="145" r="6" fill="#4F46B8" />
            <text x="80" y="165" font-size="12" font-weight="bold" fill="#4F46B8" text-anchor="middle">88</text>

            <circle cx="280" cy="140" r="6" fill="#4F46B8" />
            <text x="280" y="160" font-size="12" font-weight="bold" fill="#4F46B8" text-anchor="middle">90</text>

            <circle cx="480" cy="145" r="6" fill="#4F46B8" />
            <text x="480" y="165" font-size="12" font-weight="bold" fill="#4F46B8" text-anchor="middle">88</text>

            <!-- Date Labels -->
            <text x="80" y="190" font-size="12" fill="#6B6B8D" text-anchor="middle">Sept 11</text>
            <text x="280" y="190" font-size="12" fill="#6B6B8D" text-anchor="middle">Sept 12</text>
            <text x="480" y="190" font-size="12" fill="#6B6B8D" text-anchor="middle">Sept 13 (Today)</text>
          </svg>
        </div>

        <!-- AI Insight Alert Box -->
        <div class="alert-banner warning">
          <div style="font-size: 24px;">💡</div>
          <div>
            <strong>Antigravity AI Health Insight:</strong>
            <p style="margin-top: 4px;">
              Your 3-day systolic average is 140 mmHg (above 130 target). Recommended dietary adjustment: Reduce miso soup and pickles sodium to under 6g/day. Dr. Tanaka has scheduled a cardiology review with Dr. Nakamura for medication titration.
            </p>
          </div>
        </div>

        <!-- Manual Entry Card -->
        <div style="border-top: 1px solid rgba(0,0,0,0.08); padding-top: 22px; margin-top: 22px;">
          <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 14px;">
            Log New BP Reading (手動測定入力)
          </h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;">
            <div style="flex: 1; min-width: 140px;">
              <label class="form-label">Systolic (上)</label>
              <input type="number" id="input-sys" class="form-input" value="138">
            </div>
            <div style="flex: 1; min-width: 140px;">
              <label class="form-label">Diastolic (下)</label>
              <input type="number" id="input-dia" class="form-input" value="88">
            </div>
            <div style="flex: 1; min-width: 140px;">
              <label class="form-label">Pulse (脈拍)</label>
              <input type="number" id="input-pulse" class="form-input" value="72">
            </div>
            <button class="btn-touch-primary" id="btn-log-bp" style="min-width: 180px;">
              💾 Record & Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 5: MESSAGES & NOTIFICATIONS
// ------------------------------------------------------------
function renderMessagesScreen(pat, alerts) {
  return `
    <div class="fade-in">
      <div class="elderly-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; font-family: var(--font-display);">Messages & Alerts (お知らせ・連絡)</h2>
          <div style="font-size: 14px; color: var(--text-secondary);">
            Direct communications from Caregiver Yuki, Kenji, and Dr. Tanaka's clinic
          </div>
        </div>
        <button class="btn-touch-primary" id="btn-quick-reply-ok" style="background: linear-gradient(135deg, var(--success), #1B8A4A); font-size: 14px; height: 44px;">
          👍 Quick Reply "I'm OK"
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${alerts
          .map((a) => {
            const isRead = a.is_read;
            return `
            <div class="elderly-card" style="border-left: 5px solid ${
              a.priority === "critical" ? "var(--error)" : a.priority === "warning" ? "var(--warning)" : "var(--accent-indigo)"
            }; ${isRead ? "" : "background: rgba(232, 99, 122, 0.06);"}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="font-size: 17px; font-weight: 800; color: var(--text-main);">
                  ${a.title}
                </div>
                <div style="font-size: 12px; color: var(--text-muted);">
                  ${new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600;">
                ${a.title_jp}
              </div>
              <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 14px;">
                ${a.message}
              </p>
              <div style="display: flex; gap: 8px;">
                <button class="btn-ghost-pill btn-ack-alert" data-alert-id="${a.id}" style="color: var(--text-main); border-color: rgba(0,0,0,0.15); background: rgba(255,255,255,0.5);">
                  ✓ Acknowledge
                </button>
                ${
                  a.action_type === "take_medication"
                    ? `<button class="btn-touch-primary btn-take-single-med" data-med-id="med_amlodipine" style="height: 38px; font-size: 12px;">
                        💊 Take Medication Now
                       </button>`
                    : ""
                }
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}
