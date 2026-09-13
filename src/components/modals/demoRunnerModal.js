// ============================================================
// MediConnect Japan - Phase 9: Interactive Demo Scenarios 1 to 5
// 1-Click Guided Scenario Orchestrator for Hackathon Judges
// ============================================================
import { store } from "../../db/store.js";
import { soundService } from "../../services/audio.js";
import {
  runWorkflowMedicationReminder,
  runWorkflowEmergencySymptomDetection,
  runWorkflowSpecialistReferral,
  runWorkflowAiTranslation,
  runWorkflowCaregiverHandoff
} from "../../agents/workflows.js";
import confetti from "canvas-confetti";

export function renderDemoRunnerModal(isOpen = false, activeScenario = 1, currentStep = 1, scenarioLogs = []) {
  if (!isOpen) return "";

  return `
    <div class="modal-overlay" id="demo-runner-overlay">
      <div class="modal-dialog" style="max-width: 860px;">
        <div class="modal-header" style="background: linear-gradient(135deg, #1E1B4B, #312E81); color: white;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 28px;">⚡</div>
            <div>
              <h3 style="font-size: 20px; font-weight: 800; color: white;">Antigravity Hackathon Demo Scenario Orchestrator</h3>
              <div style="font-size: 13px; color: #C7D2FE;">Live end-to-end execution of Phase 9 Hackathon Scenarios</div>
            </div>
          </div>
          <button id="btn-close-demo-modal" style="background: transparent; border: none; color: #C7D2FE; font-size: 24px; cursor: pointer;">✕</button>
        </div>

        <div class="modal-body">
          <!-- Scenario Selector Tabs -->
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid var(--border);">
            <button class="btn-ghost-pill ${activeScenario === 1 ? "active-scenario" : ""}" data-scenario-select="1" style="${activeScenario === 1 ? "background: #4F46E5; color: white; border-color: #4F46E5;" : "color: #334155;"}">
              1. Med Reminder
            </button>
            <button class="btn-ghost-pill ${activeScenario === 2 ? "active-scenario" : ""}" data-scenario-select="2" style="${activeScenario === 2 ? "background: #DC2626; color: white; border-color: #DC2626;" : "color: #334155;"}">
              2. Chest Pain & 119
            </button>
            <button class="btn-ghost-pill ${activeScenario === 3 ? "active-scenario" : ""}" data-scenario-select="3" style="${activeScenario === 3 ? "background: #7C3AED; color: white; border-color: #7C3AED;" : "color: #334155;"}">
              3. Specialist Referral
            </button>
            <button class="btn-ghost-pill ${activeScenario === 4 ? "active-scenario" : ""}" data-scenario-select="4" style="${activeScenario === 4 ? "background: #2563EB; color: white; border-color: #2563EB;" : "color: #334155;"}">
              4. Telehealth & AI Translation
            </button>
            <button class="btn-ghost-pill ${activeScenario === 5 ? "active-scenario" : ""}" data-scenario-select="5" style="${activeScenario === 5 ? "background: #059669; color: white; border-color: #059669;" : "color: #334155;"}">
              5. Caregiver Shift Handoff
            </button>
          </div>

          <!-- Scenario Description Card -->
          <div style="background: #F8FAFC; border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 18px;">
            ${getScenarioDescription(activeScenario)}
          </div>

          <!-- Execution Action Bar -->
          <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 18px;">
            <button class="btn-touch-primary" id="btn-run-current-scenario" style="background: #4F46E5; flex: 1;">
              ▶ Run Full Scenario Automatically
            </button>
            <button class="btn-touch-primary" id="btn-step-current-scenario" style="background: #1E293B; min-width: 160px;">
              ⏭ Step-by-Step
            </button>
          </div>

          <!-- Live Step Progress & Terminal Output -->
          <div style="background: #0F172A; color: #E2E8F0; border-radius: 12px; padding: 16px; font-family: monospace; font-size: 13px; max-height: 240px; overflow-y: auto;">
            <div style="color: #38BDF8; font-weight: 700; margin-bottom: 8px;">
              [SYSTEM EVENT & AGENT LOG CONSOLE]
            </div>
            ${
              scenarioLogs.length === 0
                ? `<div style="color: #64748B;">Ready to initiate scenario. Click "Run Full Scenario" above to observe live state changes across Patient, Caregiver, Doctor, and Admin layers.</div>`
                : scenarioLogs
                    .map(
                      (l) => `
                <div style="margin-bottom: 6px; line-height: 1.4;">
                  <span style="color: #94A3B8;">[${l.time}]</span> 
                  <span style="color: ${l.type === "agent" ? "#A78BFA" : l.type === "alert" ? "#F87171" : "#34D399"}; font-weight: bold;">
                    ${l.title}:
                  </span> 
                  <span>${l.message}</span>
                </div>
              `
                    )
                    .join("")
            }
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-ghost-pill" id="btn-reset-scenario-state" style="color: #DC2626; border-color: #FECACA;">
            🔄 Reset Database to Initial Seed
          </button>
          <button class="btn-touch-primary" id="btn-close-demo-modal-footer" style="height: 42px; font-size: 14px; background: #334155;">
            Done / Close
          </button>
        </div>
      </div>
    </div>
  `;
}

function getScenarioDescription(scenarioNumber) {
  switch (scenarioNumber) {
    case 1:
      return `
        <h4 style="font-size: 17px; font-weight: 800; color: #1E293B; margin-bottom: 6px;">
          Scenario 1: Medication Reminder & Adherence
        </h4>
        <p style="font-size: 14px; color: #475569; margin-bottom: 8px;">
          1. System clock hits 08:00 AM → App generates voice prompt: <em>"Time to take Amlodipine"</em><br>
          2. Patient Takeshi confirms via voice: <em>"I already took it"</em><br>
          3. System logs dose as taken → Caregiver Yuki's dashboard updates adherence ring → Doctor Tanaka's EHR reflects 94% adherence.
        </p>
        <span class="status-pill green">Demonstrates: Real-time Pub/Sub Sync + Voice Assist</span>
      `;
    case 2:
      return `
        <h4 style="font-size: 17px; font-weight: 800; color: #991B1B; margin-bottom: 6px;">
          Scenario 2: Emergency Symptom Detection & 119 Ambulance Call
        </h4>
        <p style="font-size: 14px; color: #475569; margin-bottom: 8px;">
          1. Takeshi inputs: <em>"I have severe chest pain"</em><br>
          2. Antigravity NLP classifies severity as <strong>RED EMERGENCY</strong><br>
          3. Caregiver Yuki gets instant high-priority siren alert + 119 dispatch button with GPS coordinates (Hirosaki, Aomori) and full medical summary.
        </p>
        <span class="status-pill red">Demonstrates: Medical NLP Triage + Emergency Escalation</span>
      `;
    case 3:
      return `
        <h4 style="font-size: 17px; font-weight: 800; color: #5B21B6; margin-bottom: 6px;">
          Scenario 3: Rural Doctor (Aomori) → Specialist Referral (Tokyo)
        </h4>
        <p style="font-size: 14px; color: #475569; margin-bottom: 8px;">
          1. Dr. Tanaka flags resistant morning BP (142/90 mmHg) in rural clinic<br>
          2. AI auto-populates referral form with 7-day BP trend and current meds<br>
          3. Matches with Tokyo University Cardiologist Dr. Akemi Nakamura (2-day wait)<br>
          4. Encrypted transfer completes; consultation booked for Sept 15, 14:00 JST.
        </p>
        <span class="status-pill green">Demonstrates: Healthcare Geographic Gap Solution</span>
      `;
    case 4:
      return `
        <h4 style="font-size: 17px; font-weight: 800; color: #1E40AF; margin-bottom: 6px;">
          Scenario 4: Bilingual Telehealth Consultation with AI Translation
        </h4>
        <p style="font-size: 14px; color: #475569; margin-bottom: 8px;">
          1. Live WebRTC consultation connects Dr. Nakamura (Tokyo) & Takeshi (Aomori)<br>
          2. Dr. Nakamura speaks Japanese → Patient sees & hears English in real-time<br>
          3. Takeshi replies in English → Dr. Nakamura receives Japanese translation<br>
          4. Dr. Nakamura prescribes Lisinopril 15mg titration → Auto-routed to local pharmacy.
        </p>
        <span class="status-pill green">Demonstrates: Google Cloud Medical NLP Bilingual Pipeline</span>
      `;
    case 5:
      return `
        <h4 style="font-size: 17px; font-weight: 800; color: #065F46; margin-bottom: 6px;">
          Scenario 5: Caregiver Autonomous Shift Handoff
        </h4>
        <p style="font-size: 14px; color: #475569; margin-bottom: 8px;">
          1. Primary Caregiver Yuki (Tokyo) marks <em>"Day Off"</em> for rest<br>
          2. Autonomous Agent immediately alerts backup Kenji (Aomori son)<br>
          3. Kenji accepts shift → Alert routing table shifts all alarms to Kenji<br>
          4. Takeshi is notified that Kenji is on standby today.
        </p>
        <span class="status-pill green">Demonstrates: Japan Caregiver Burnout Solution</span>
      `;
    default:
      return "";
  }
}

// ------------------------------------------------------------
// Run Scenario Logic
// ------------------------------------------------------------
export async function executeScenario(scenarioNumber, addLogFn) {
  const now = () => new Date().toLocaleTimeString();

  if (scenarioNumber === 1) {
    addLogFn({ time: now(), type: "agent", title: "Medication Agent", message: "Dispatched 08:00 AM morning voice reminder for Amlodipine 5mg." });
    runWorkflowMedicationReminder("med_amlodipine");

    await new Promise((r) => setTimeout(r, 900));
    addLogFn({ time: now(), type: "action", title: "Patient Voice Input", message: 'Takeshi: "I already took my morning pill."' });

    store.update("medications", "med_amlodipine", {
      today_status: "taken",
      last_taken: new Date().toISOString()
    });

    store.update("medications", "med_metformin", {
      today_status: "taken",
      last_taken: new Date().toISOString()
    });

    soundService.playSuccessChime();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    addLogFn({ time: now(), type: "agent", title: "Adherence Sync", message: "Caregiver dashboard updated: 3/3 taken today (100%). Doctor Tanaka record updated." });
  } else if (scenarioNumber === 2) {
    addLogFn({ time: now(), type: "action", title: "Emergency Input", message: 'Takeshi reported: "I have severe chest pain and breathlessness."' });

    runWorkflowEmergencySymptomDetection("Severe chest pain and tightness");

    await new Promise((r) => setTimeout(r, 800));
    addLogFn({ time: now(), type: "alert", title: "RED EMERGENCY", message: "AI classified RED (96% NLP confidence). 119 Ambulance Alert sent with GPS (Hirosaki, Aomori)." });
    addLogFn({ time: now(), type: "agent", title: "Caregiver Alert", message: "Yuki in Tokyo alerted via high-priority push + call notification." });
  } else if (scenarioNumber === 3) {
    addLogFn({ time: now(), type: "action", title: "Rural Clinic Action", message: "Dr. Tanaka initiated specialist referral for Takeshi Sato." });

    const ref = runWorkflowSpecialistReferral({});

    await new Promise((r) => setTimeout(r, 800));
    addLogFn({ time: now(), type: "agent", title: "Specialist Matched", message: "Tokyo Cardio Center (Dr. Akemi Nakamura) confirmed acceptance. Telehealth booked Sept 15, 14:00." });
    confetti({ particleCount: 40, spread: 50 });
  } else if (scenarioNumber === 4) {
    addLogFn({ time: now(), type: "agent", title: "Telehealth Room", message: "Video session launched between Takeshi & Dr. Nakamura." });
    addLogFn({ time: now(), type: "action", title: "Dr. Nakamura (Japanese)", message: "「あなたの血圧はまだ高いです。塩分を減らしてください。」" });

    soundService.speak("Your blood pressure is still high. Please reduce salt intake.", "en-US");

    await new Promise((r) => setTimeout(r, 1200));
    addLogFn({ time: now(), type: "agent", title: "AI Translation Engine", message: "Doctor speech translated to English subtitles for Takeshi." });
    addLogFn({ time: now(), type: "action", title: "Takeshi (English)", message: '"I have been eating less salt."' });

    await new Promise((r) => setTimeout(r, 1000));
    addLogFn({ time: now(), type: "agent", title: "Pharmacy Protocol", message: "Prescription updated: Lisinopril increased from 10mg to 15mg. Sent to local Hirosaki pharmacy." });
  } else if (scenarioNumber === 5) {
    addLogFn({ time: now(), type: "action", title: "Shift Toggle", message: 'Primary Caregiver Yuki marked "Day Off" for rest.' });

    runWorkflowCaregiverHandoff("cg_yuki", "day_off");

    await new Promise((r) => setTimeout(r, 800));
    addLogFn({ time: now(), type: "agent", title: "Autonomous Shift Agent", message: "Alert routing transferred to backup Kenji Sato (Hirosaki). Takeshi and Dr. Tanaka notified." });
    confetti({ particleCount: 40, spread: 50 });
  }
}
