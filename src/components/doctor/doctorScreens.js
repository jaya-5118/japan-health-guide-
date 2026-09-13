// ============================================================
// MediConnect Japan - Phase 5: Doctor Interface & Telehealth (4 Screens)
// Patient List, Medical Record (EHR), Telehealth with AI Translation, Specialist Referral
// ============================================================
import { store } from "../../db/store.js";
import { soundService } from "../../services/audio.js";
import {
  runWorkflowSpecialistReferral,
  runWorkflowAiTranslation
} from "../../agents/workflows.js";

export function renderDoctorView(activeTab = "patients") {
  const doc = store.find("doctors", "doc_tanaka");
  const specialistDoc = store.find("doctors", "doc_nakamura");
  const patients = store.get("patients");
  const pat = store.find("patients", "pat_takeshi");
  const referrals = store.get("referrals");
  const telehealth = store.get("telehealth_sessions", (t) => t.patient_id === pat.id)[0] || {
    id: "th_20260915_01",
    status: "scheduled",
    scheduled_time: "2026-09-15T14:00:00+09:00",
    reason: "Cardiology consultation for resistant hypertension"
  };

  return `
    <div class="doctor-wrapper">
      <!-- Doctor Top Banner -->
      <div style="background: white; border: 1px solid var(--border); border-radius: 16px; padding: 18px 24px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: #EFF6FF; color: #1D4ED8; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800;">
            田
          </div>
          <div>
            <div style="font-size: 19px; font-weight: 800; color: var(--text-main);">
              ${doc.name} (${doc.name_kanji})
            </div>
            <div style="font-size: 14px; color: var(--text-secondary);">
              ${doc.specialty} •  Tsugaru Community Clinic (Hirosaki, Aomori)
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="background: #F1F5F9; padding: 6px 14px; border-radius: 10px; font-size: 13px;">
            License: <strong>${doc.license_no}</strong>
          </div>
          <button class="btn-touch-primary" id="btn-doc-start-telehealth-quick" style="height: 42px; font-size: 14px; background: #2563EB;">
             Launch Telehealth Room
          </button>
        </div>
      </div>

      <!-- Navigation Tabs (Screen 1 to 4) -->
      <div class="screen-tabs">
        <button class="screen-tab ${activeTab === "patients" ? "active" : ""}" data-doc-tab="patients">
           Patient Triage List (${patients.length})
        </button>
        <button class="screen-tab ${activeTab === "ehr" ? "active" : ""}" data-doc-tab="ehr">
           Electronic Health Record (Takeshi)
        </button>
        <button class="screen-tab ${activeTab === "telehealth" ? "active" : ""}" data-doc-tab="telehealth" style="color: #2563EB; font-weight: 700;">
           Telehealth & AI Translation
        </button>
        <button class="screen-tab ${activeTab === "referral" ? "active" : ""}" data-doc-tab="referral">
           Specialist Referral (${referrals.length})
        </button>
      </div>

      <!-- Doctor Screen Views -->
      <div class="doctor-content">
        ${activeTab === "patients"
      ? renderPatientList(patients)
      : activeTab === "ehr"
        ? renderEHR(pat)
        : activeTab === "telehealth"
          ? renderTelehealth(pat, doc, specialistDoc, telehealth)
          : renderReferralForm(pat, doc, specialistDoc, referrals)
    }
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 1: DOCTOR PATIENT LIST
// ------------------------------------------------------------
function renderPatientList(patients) {
  return `
    <div class="fade-in">
      <!-- Quick Stats Row -->
      <div class="grid-4" style="margin-bottom: 20px;">
        <div class="elderly-card" style="padding: 16px; margin: 0;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">TOTAL ASSIGNED</div>
          <div style="font-size: 26px; font-weight: 900; color: #1E293B;">12 Patients</div>
          <div style="font-size: 12px; color: #10B981;">Aomori Rural Network</div>
        </div>
        <div class="elderly-card" style="padding: 16px; margin: 0;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">STATUS ATTENTION</div>
          <div style="font-size: 26px; font-weight: 900; color: #D97706;">2 Need Review</div>
          <div style="font-size: 12px; color: #D97706;">Elevated BP / Dizziness</div>
        </div>
        <div class="elderly-card" style="padding: 16px; margin: 0;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">PENDING REFERRALS</div>
          <div style="font-size: 26px; font-weight: 900; color: #2563EB;">1 Scheduled</div>
          <div style="font-size: 12px; color: #2563EB;">Tokyo Cardio Center</div>
        </div>
        <div class="elderly-card" style="padding: 16px; margin: 0;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">MED ADHERENCE AVG</div>
          <div style="font-size: 26px; font-weight: 900; color: #059669;">94.2%</div>
          <div style="font-size: 12px; color: #059669;">Above 90% benchmark</div>
        </div>
      </div>

      <!-- Patients Table / Cards -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${patients
      .map((p) => {
        return `
            <div class="elderly-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-left: 8px solid ${p.status === "green" ? "#10B981" : p.status === "yellow" ? "#F59E0B" : "#EF4444"
          };">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 52px; height: 52px; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 900; color: #334155;">
                  ${p.name.charAt(0)}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px; font-weight: 800;">${p.name} (${p.name_kanji})</span>
                    <span class="status-pill ${p.status}">${p.status.toUpperCase()}</span>
                  </div>
                  <div style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">
                    ${p.age}yo • ${p.prefecture}, ${p.city} • Conditions: <strong>${p.conditions.join(", ")}</strong>
                  </div>
                  <div style="font-size: 13px; color: #64748B; margin-top: 4px;">
                    Latest Note: ${p.status_reason}
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 10px; align-items: center;">
                <button class="btn-touch-primary btn-open-patient-ehr" data-pat-id="${p.id}" style="height: 42px; font-size: 14px; background: #1E88E5;">
                   View Full EHR
                </button>
                <button class="btn-touch-primary btn-doc-refer-specialist" data-pat-id="${p.id}" style="height: 42px; font-size: 14px; background: #7C3AED;">
                   Refer to Specialist
                </button>
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
// SCREEN 2: PATIENT MEDICAL RECORD (DOCTOR EHR VIEW)
// ------------------------------------------------------------
function renderEHR(pat) {
  const meds = store.get("medications", (m) => m.patient_id === pat.id);
  const vitals = store.get("vital_signs", (v) => v.patient_id === pat.id);
  const history = store.get("medical_history", (h) => h.patient_id === pat.id);
  const insurance = store.find("insurance", "ins_01");

  return `
    <div class="fade-in">
      <!-- Patient Profile Header -->
      <div class="elderly-card" style="border-top: 5px solid #2563EB;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <h2 style="font-size: 26px; font-weight: 800;">${pat.name} (${pat.name_kanji})</h2>
              <span class="status-pill yellow">CAUTION</span>
            </div>
            <div style="font-size: 15px; color: var(--text-secondary); margin-top: 6px;">
              DOB: ${pat.dob} (${pat.age}yo) • Gender: ${pat.gender} • Blood: ${pat.blood_type}
            </div>
            <div style="font-size: 14px; color: #DC2626; font-weight: 700; margin-top: 4px;">
              ⚠️ Drug Allergies: ${pat.allergies.join(", ")}
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 13px; color: var(--text-muted);">National Health Insurance:</div>
            <div style="font-size: 15px; font-weight: 800; color: #1E293B;">${insurance.policy_number}</div>
            <div style="font-size: 13px; color: #059669;">${insurance.coverage_type}</div>
          </div>
        </div>
      </div>

      <!-- Clinical Tabs Content -->
      <div class="grid-2">
        <!-- Left Column: Active Medications & Refill Approval -->
        <div class="elderly-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-size: 18px; font-weight: 800;">Active Prescriptions</h3>
            <span style="font-size: 13px; color: #059669; font-weight: 700;">94% Adherence</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${meds
      .map((m) => {
        return `
                <div style="border: 1px solid var(--border); border-radius: 10px; padding: 12px; background: #F8FAFC;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 16px;">${m.name} (${m.dosage})</strong>
                    <span style="font-size: 12px; background: #E2E8F0; padding: 2px 8px; border-radius: 6px;">${m.stock_remaining} left</span>
                  </div>
                  <div style="font-size: 13px; color: var(--text-secondary); margin: 4px 0;">
                    ${m.name_jp} • ${m.instructions}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span style="font-size: 12px; color: #64748B;">Times: ${m.times_per_day.join(", ")}</span>
                    <button class="btn-ghost-pill btn-titrate-med" data-med-id="${m.id}" style="font-size: 12px; padding: 4px 10px;">
                       Titrate Dosage
                    </button>
                  </div>
                </div>
              `;
      })
      .join("")}
          </div>
        </div>

        <!-- Right Column: Clinical History & Doctor Notes -->
        <div class="elderly-card">
          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 14px;">Medical History & Diagnoses</h3>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${history
      .map((h) => {
        return `
                <div style="border-left: 4px solid #3B82F6; padding-left: 10px; font-size: 14px;">
                  <strong>${h.condition}</strong> (${h.category})
                  <div style="color: #64748B; font-size: 13px;">Diagnosed: ${h.diagnosed_date} • ${h.notes}</div>
                </div>
              `;
      })
      .join("")}
          </div>

          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 10px;">Add Doctor Clinical Note</h3>
          <textarea id="input-doc-note" class="form-textarea" placeholder="Enter clinical observation, medication adjustment rationale, or care directives..."></textarea>
          <button class="btn-touch-primary" id="btn-save-doc-note" style="width: 100%; height: 44px; font-size: 14px; margin-top: 10px;">
             Save Clinical Note to EHR
          </button>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 3: TELEHEALTH CONSULTATION WITH REAL-TIME AI TRANSLATION
// ------------------------------------------------------------
function renderTelehealth(pat, doc, specialistDoc, telehealth) {
  return `
    <div class="fade-in">
      <div class="elderly-card" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 22px; font-weight: 800;">Bilingual Telehealth Studio (オンライン診療)</h2>
            <span class="status-pill green">LIVE WEBRTC ENCRYPTED</span>
          </div>
          <div style="font-size: 14px; color: var(--text-secondary);">
            Connecting: <strong>${specialistDoc.name}</strong> (Tokyo Cardiologist) & <strong>${pat.name}</strong> (Hirosaki, Aomori)
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-ghost-pill" id="btn-toggle-demo-speech" style="color: #1E293B;">
             Speech Audio: ON
          </button>
        </div>
      </div>

      <!-- Video Grid Simulation -->
      <div class="video-grid">
        <!-- Main Video Stream (Patient or Specialist) -->
        <div class="main-stream">
          <div style="position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 8px; font-size: 13px; font-weight: 700;">
            Takeshi Sato (Aomori Remote Patient) • 720p 60fps
          </div>

          <div style="text-align: center;">
            <div style="width: 120px; height: 120px; border-radius: 50%; background: #334155; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 48px; border: 3px solid #10B981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);">
              
            </div>
            <div style="font-size: 20px; font-weight: 800;">Takeshi Sato (佐藤 健)</div>
            <div style="font-size: 14px; color: #94A3B8;">Speaking English / Simple Japanese</div>
          </div>

          <!-- Bottom Live Subtitle Overlay -->
          <div id="live-telehealth-subtitles" style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 14px 20px; text-align: center; backdrop-filter: blur(8px);">
            <div style="font-size: 12px; color: #38BDF8; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
               Google Cloud Medical NLP Real-Time Translation:
            </div>
            <div id="sub-original" style="font-size: 16px; color: #FFFFFF; font-weight: 600;">
              Dr. Nakamura: 「あなたの血圧はまだ高いです。塩分を減らしてください。」
            </div>
            <div id="sub-translated" style="font-size: 18px; color: #4ADE80; font-weight: 800; margin-top: 4px;">
              ↳ Translated: "Your blood pressure is still high. Please reduce salt intake."
            </div>
          </div>
        </div>

        <!-- Right Side: Self Camera + Live Clinical Control -->
        <div class="sub-stream">
          <div class="self-cam">
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 6px; font-size: 11px;">
              Dr. Nakamura (Tokyo Specialist)
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px;"></div>
              <div style="font-size: 12px; font-weight: 700;">Self View</div>
            </div>
          </div>

          <!-- Quick Dialogue Simulation Buttons -->
          <div class="subtitles-box">
            <div style="font-size: 13px; font-weight: 800; color: #94A3B8; margin-bottom: 8px;">
              Interactive Demo Speech Simulation:
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn-touch-primary btn-sim-speak" data-speaker="doctor" data-text-ja="あなたの血圧はまだ高いです。塩分を減らしてください。" style="height: 38px; font-size: 12px; background: #1E293B; border: 1px solid #334155; text-align: left; justify-content: flex-start;">
                 Doctor: "Your BP is still high..."
              </button>

              <button class="btn-touch-primary btn-sim-speak" data-speaker="patient" data-text-en="I have been eating less salt." style="height: 38px; font-size: 12px; background: #1E293B; border: 1px solid #334155; text-align: left; justify-content: flex-start;">
                 Takeshi: "I have been eating less salt."
              </button>

              <button class="btn-touch-primary btn-sim-speak" data-speaker="doctor" data-text-ja="リシノプリルを10mgから15mgに増量しましょう。" style="height: 38px; font-size: 12px; background: #1E293B; border: 1px solid #334155; text-align: left; justify-content: flex-start;">
                 Doctor: "Increase Lisinopril to 15mg"
              </button>
            </div>

            <!-- In-Call Prescription Action -->
            <div style="border-top: 1px solid #334155; padding-top: 10px; margin-top: 10px;">
              <div style="font-size: 12px; font-weight: 700; color: #E2E8F0; margin-bottom: 6px;">
                Instant Prescription Adjustment:
              </div>
              <button class="btn-touch-primary" id="btn-adjust-lisinopril-15" style="width: 100%; height: 38px; font-size: 12px; background: #059669;">
                 Prescribe Lisinopril 15mg (Send to Pharmacy)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 4: SPECIALIST REFERRAL FORM
// ------------------------------------------------------------
function renderReferralForm(pat, doc, specialistDoc, referrals) {
  return `
    <div class="fade-in">
      <div class="elderly-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800;">Create Specialist Referral (専門医紹介状発行)</h2>
            <div style="font-size: 14px; color: var(--text-secondary);">
              Antigravity Referral Agent automatically populates clinical data and matches with tertiary hospitals
            </div>
          </div>
          <span class="status-pill green">AI AUTONOMOUS ENCRYPTION READY</span>
        </div>

        <div class="grid-2">
          <div>
            <div class="form-group">
              <label class="form-label">Patient Name & ID</label>
              <input type="text" class="form-input" value="${pat.name} (${pat.name_kanji}) - 78yo Male" disabled>
            </div>

            <div class="form-group">
              <label class="form-label">Referring Clinic</label>
              <input type="text" class="form-input" value="Tsugaru Community Clinic - Dr. Hiroshi Tanaka" disabled>
            </div>

            <div class="form-group">
              <label class="form-label">Target Specialty & Hospital</label>
              <select id="select-specialist" class="form-select">
                <option value="doc_nakamura" selected>Dr. Akemi Nakamura - Tokyo Advanced Cardio Center (Avg Wait: 2 Days)</option>
                <option value="doc_saito">Dr. Kenzo Saito - Sendai Nephrology Institute (Avg Wait: 5 Days)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Referral Priority Level</label>
              <select id="select-referral-priority" class="form-select">
                <option value="Routine">Routine</option>
                <option value="Urgent" selected>Urgent (Within 48 hours)</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <div class="form-group">
              <label class="form-label">Clinical Indication / Reason for Referral</label>
              <textarea id="referral-reason" class="form-textarea" style="height: 90px;">Persistently elevated systolic blood pressure (138-142 mmHg) on dual-therapy. Titration and specialist review requested.</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Auto-Generated Clinical Summary</label>
              <textarea id="referral-summary" class="form-textarea" style="height: 120px;">78-year-old male with 8-year history of essential hypertension and T2D. Currently on Amlodipine 5mg and Lisinopril 10mg. Morning BP consistently > 135/85 mmHg. Mild postural dizziness reported Sept 12.</textarea>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer;">
                <input type="checkbox" id="check-patient-consent" checked>
                <span><strong>Patient Informed Consent Verified</strong> (Takeshi Sato consented via voice authentication)</span>
              </label>
            </div>

            <button class="btn-touch-primary" id="btn-submit-specialist-referral" style="width: 100%; background: #7C3AED; font-size: 16px;">
               Encrypt & Transmit Referral to Dr. Nakamura
            </button>
          </div>
        </div>

        <!-- Existing Referral Records -->
        <div style="border-top: 1px solid var(--border); padding-top: 20px; margin-top: 24px;">
          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 14px;">Active Referral Tracking</h3>
          ${referrals
      .map((r) => {
        return `
              <div style="background: #F8FAFC; border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="font-weight: 800; font-size: 16px;">
                    ${r.specialty} Referral • Status: <span class="status-pill green">${r.status}</span>
                  </div>
                  <div style="font-size: 14px; color: var(--text-secondary); margin-top: 2px;">
                    Specialist: <strong>Dr. Akemi Nakamura</strong> (Tokyo Cardio Center) • Priority: ${r.priority}
                  </div>
                  <div style="font-size: 13px; color: #64748B; margin-top: 2px;">
                    Scheduled Telehealth Consultation: Sept 15, 2026 at 14:00 JST
                  </div>
                </div>
                <button class="btn-touch-primary btn-open-telehealth-from-ref" style="height: 40px; font-size: 13px; background: #2563EB;">
                   Open Consultation Room
                </button>
              </div>
            `;
      })
      .join("")}
        </div>
      </div>
    </div>
  `;
}
