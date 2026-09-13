// ============================================================
// MediConnect Japan - Phase 4: Caregiver Interface (4 Screens)
// Dashboard, Medication Management, Schedule/Handoff, Alerts & Emergency
// ============================================================
import { store } from "../../db/store.js";
import { soundService } from "../../services/audio.js";
import { runWorkflowCaregiverHandoff } from "../../agents/workflows.js";

export function renderCaregiverView(activeTab = "dashboard") {
  const cg = store.find("caregivers", "cg_yuki");
  const backupCg = store.find("caregivers", "cg_kenji");
  const pat = store.find("patients", "pat_takeshi");
  const meds = store.get("medications", (m) => m.patient_id === pat.id);
  const alerts = store.get("alerts", (a) => a.recipient_role === "caregiver" || a.patient_id === pat.id);
  const criticalAlerts = alerts.filter((a) => a.priority === "critical" && !a.is_read);

  const takenCount = meds.filter((m) => m.today_status === "taken").length;
  const totalCount = meds.length;

  return `
    <div class="caregiver-wrapper">
      <!-- Caregiver Top Status Bar -->
      <div style="background: white; border: 1px solid var(--border); border-radius: 16px; padding: 18px 24px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: #E0E7FF; color: #4338CA; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800;">
            由
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: var(--text-main);">
              ${cg.name} (${cg.name_kanji}) • Primary Caregiver
            </div>
            <div style="font-size: 14px; color: var(--text-secondary);">
               ${cg.location} • Monitoring Father: <strong>${pat.name}</strong> (${pat.age}yo, Aomori)
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="text-align: right;">
            <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">My Shift Status</div>
            <span class="status-pill ${cg.availability_status === "on_shift" ? "green" : "red"}">
              ${cg.availability_status === "on_shift" ? "● On Active Shift" : "○ Day Off / Backup Active"}
            </span>
          </div>
          <button id="btn-toggle-shift-status" class="btn-touch-primary" style="background: ${cg.availability_status === "on_shift" ? "#D97706" : "#10B981"}; height: 42px; font-size: 14px;">
            ${cg.availability_status === "on_shift" ? "Set 'Day Off' (Handoff to Kenji)" : "Resume 'On Shift'"}
          </button>
        </div>
      </div>

      <!-- Critical Alert Red Banner if any -->
      ${criticalAlerts.length > 0
      ? `
        <div class="alert-banner critical" style="box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);">
          <div style="font-size: 28px;">🚨</div>
          <div style="flex: 1;">
            <div style="font-weight: 800; font-size: 17px;">CRITICAL EMERGENCY ALERT: ${criticalAlerts[0].title}</div>
            <div style="margin: 4px 0 10px; font-size: 15px;">${criticalAlerts[0].message}</div>
            <div style="display: flex; gap: 10px;">
              <button class="btn-sos" id="btn-cg-call-119" style="height: 40px; font-size: 14px; padding: 0 16px;">
                 Dispatch 119 Ambulance
              </button>
              <button class="btn-touch-primary" id="btn-cg-call-patient" style="height: 40px; font-size: 14px; background: #DC2626; padding: 0 16px;">
                 Call Father (${pat.phone})
              </button>
              <button class="btn-ghost-pill" id="btn-cg-ack-critical" data-alert-id="${criticalAlerts[0].id}">
                ✓ Mark Addressed
              </button>
            </div>
          </div>
        </div>
      `
      : ""
    }

      <!-- Screen Navigation Tabs (Screen 1 to 4) -->
      <div class="screen-tabs">
        <button class="screen-tab ${activeTab === "dashboard" ? "active" : ""}" data-cg-tab="dashboard">
           Caregiver Dashboard
        </button>
        <button class="screen-tab ${activeTab === "meds" ? "active" : ""}" data-cg-tab="meds">
           Medication Management (${takenCount}/${totalCount})
        </button>
        <button class="screen-tab ${activeTab === "schedule" ? "active" : ""}" data-cg-tab="schedule">
           Schedule & Backup Handoff
        </button>
        <button class="screen-tab ${activeTab === "alerts" ? "active" : ""}" data-cg-tab="alerts">
           Health Alerts & Incidents (${alerts.length})
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="caregiver-content">
        ${activeTab === "dashboard"
      ? renderCgDashboard(pat, meds, takenCount, totalCount, alerts, backupCg)
      : activeTab === "meds"
        ? renderCgMeds(pat, meds)
        : activeTab === "schedule"
          ? renderCgSchedule(cg, backupCg, pat)
          : renderCgAlerts(alerts, pat)
    }
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 1: CAREGIVER DASHBOARD
// ------------------------------------------------------------
function renderCgDashboard(pat, meds, takenCount, totalCount, alerts, backupCg) {
  const adherenceRate = Math.round((takenCount / totalCount) * 100);

  return `
    <div class="fade-in">
      <!-- Patient Status Header Card -->
      <div class="elderly-card" style="background: white; border-left: 8px solid ${pat.status === "green" ? "#10B981" : pat.status === "yellow" ? "#F59E0B" : "#EF4444"}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 26px; font-weight: 800;">${pat.name} (${pat.name_kanji})</h2>
            <span class="status-pill ${pat.status}">Patient Status: ${pat.status.toUpperCase()}</span>
          </div>
          <div style="font-size: 15px; color: var(--text-secondary); margin-top: 4px;">
            ${pat.age}yo Male •  ${pat.address} • Blood: ${pat.blood_type}
          </div>
          <div style="font-size: 14px; color: #64748B; margin-top: 4px;">
            Current condition note: <strong>${pat.status_reason}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-touch-primary" id="btn-cg-call-father" style="height: 46px; font-size: 15px;">
             Call Patient
          </button>
          <button class="btn-touch-primary" id="btn-cg-send-msg" style="height: 46px; font-size: 15px; background: #059669;">
             Send Message
          </button>
          <button class="btn-sos" id="btn-cg-emergency-sos" style="height: 46px; font-size: 15px; padding: 0 20px;">
             Emergency 119
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid-3">
        <!-- Adherence Progress Ring -->
        <div class="elderly-card" style="text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: var(--text-secondary); margin-bottom: 12px;">
            Today's Medication Adherence
          </div>
          <div style="position: relative; width: 130px; height: 130px; margin: 0 auto 12px;">
            <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
              <path stroke="#E2E8F0" stroke-width="3.8" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path stroke="#10B981" stroke-dasharray="${adherenceRate}, 100" stroke-width="3.8" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <span style="font-size: 26px; font-weight: 900; color: #1E293B;">${adherenceRate}%</span>
              <span style="font-size: 12px; color: #64748B;">${takenCount}/${totalCount} taken</span>
            </div>
          </div>
          <div style="font-size: 14px; color: var(--text-muted);">
            Weekly adherence avg: <strong>94%</strong> (Target: &gt;90%)
          </div>
        </div>

        <!-- Latest Vitals Quick Check -->
        <div class="elderly-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 16px; font-weight: 700; color: var(--text-secondary);">Vitals Check</span>
            <span class="status-pill yellow">Spike Monitor</span>
          </div>
          <div style="font-size: 28px; font-weight: 900; color: #D97706; margin-bottom: 6px;">
            138 / 88 <span style="font-size: 14px; font-weight: 600; color: #64748B;">mmHg</span>
          </div>
          <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">
            Heart Rate: 72 bpm • Glucose: 128 mg/dL
          </div>
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 8px 12px; font-size: 13px; color: #92400E;">
            ⚠️ Dr. Tanaka referred to Tokyo specialist for medication adjustment.
          </div>
        </div>

        <!-- Backup Caregiver Contact -->
        <div class="elderly-card">
          <div style="font-size: 16px; font-weight: 700; color: var(--text-secondary); margin-bottom: 12px;">
            Backup Caregiver (Local)
          </div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: #D1FAE5; color: #065F46; display: flex; align-items: center; justify-content: center; font-weight: 800;">
              健
            </div>
            <div>
              <div style="font-weight: 800; font-size: 15px;">${backupCg.name} (${backupCg.relationship})</div>
              <div style="font-size: 13px; color: var(--text-muted);">${backupCg.location} (5 min from Takeshi)</div>
            </div>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
            Status: <strong>Available Backup</strong> • Shift ready
          </div>
          <button class="btn-touch-primary" id="btn-cg-contact-kenji" style="width: 100%; height: 38px; font-size: 13px; background: #4F46E5;">
             Coordinate with Kenji
          </button>
        </div>
      </div>

      <!-- Today's Schedule Timeline -->
      <div class="elderly-card">
        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 16px;">Today's Care Schedule Timeline</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px; padding: 12px; background: #F8FAFC; border-radius: 10px; border-left: 4px solid #10B981;">
            <span style="font-weight: 800; width: 70px; color: #1E293B;">08:00 AM</span>
            <div style="flex: 1;">
              <strong>Morning Meds & Vitals</strong>
              <div style="font-size: 13px; color: #64748B;">Amlodipine 5mg + Metformin 500mg taken with breakfast. BP logged: 138/88.</div>
            </div>
            <span style="background: #D1FAE5; color: #065F46; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700;">✓ Completed</span>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; padding: 12px; background: #F8FAFC; border-radius: 10px; border-left: 4px solid #3B82F6;">
            <span style="font-weight: 800; width: 70px; color: #1E293B;">12:30 PM</span>
            <div style="flex: 1;">
              <strong>Lunch & Hydration Check</strong>
              <div style="font-size: 13px; color: #64748B;">Prompt patient to drink water and check for post-lunch fatigue.</div>
            </div>
            <span style="background: #E0E7FF; color: #3730A3; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700;">Pending</span>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; padding: 12px; background: #F8FAFC; border-radius: 10px; border-left: 4px solid #F59E0B;">
            <span style="font-weight: 800; width: 70px; color: #1E293B;">08:00 PM</span>
            <div style="flex: 1;">
              <strong>Evening Medication Dose</strong>
              <div style="font-size: 13px; color: #64748B;">Lisinopril 10mg + Metformin 500mg. Automated voice reminder will fire at 20:00.</div>
            </div>
            <span style="background: #FEF3C7; color: #92400E; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700;">Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 2: MEDICATION MANAGEMENT (CAREGIVER VIEW)
// ------------------------------------------------------------
function renderCgMeds(pat, meds) {
  return `
    <div class="fade-in">
      <div class="elderly-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800;">Prescription Adherence & Refill Monitor</h2>
          <div style="font-size: 14px; color: var(--text-secondary);">
            Automated alerts escalate to you if father misses doses by &gt; 1 hour
          </div>
        </div>
        <button class="btn-touch-primary" id="btn-notify-doctor-refill" style="height: 44px; font-size: 14px; background: #4F46E5;">
           Request Refill from Dr. Tanaka
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${meds
      .map((m) => {
        const isRefillUrgent = m.stock_remaining <= 12;
        return `
            <div class="elderly-card" style="border-left: 8px solid ${m.color};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px; font-weight: 800;">${m.name}</span>
                    <span style="font-size: 16px; font-weight: 700; color: #4B5563;">${m.dosage}</span>
                    <span class="status-pill ${m.today_status === "taken" ? "green" : "yellow"}">
                      ${m.today_status.toUpperCase()}
                    </span>
                  </div>
                  <div style="font-size: 14px; color: var(--text-secondary); margin: 6px 0;">
                    Scheduled: ${m.times_per_day.join(", ")} • ${m.instructions}
                  </div>
                  <div style="font-size: 13px; color: var(--text-muted);">
                    Adherence stats: <strong>${m.adherence_count} doses taken</strong> / ${m.missed_count} missed (Past 30 days)
                  </div>
                </div>

                <div style="text-align: right;">
                  <div style="font-size: 20px; font-weight: 900; color: ${isRefillUrgent ? "#DC2626" : "#059669"};">
                    ${m.stock_remaining} pills left
                  </div>
                  <div style="font-size: 12px; color: var(--text-muted);">
                    Refill due: <strong>${m.refill_due_date}</strong>
                  </div>
                  ${isRefillUrgent
            ? `<div style="margin-top: 6px; background: #FEF2F2; color: #991B1B; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">
                           Refill reminder sent
                         </div>`
            : ""
          }
                </div>
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
// SCREEN 3: CAREGIVER SCHEDULE & AVAILABILITY (Handoff Workflow)
// ------------------------------------------------------------
function renderCgSchedule(cg, backupCg, pat) {
  const isOnShift = cg.availability_status === "on_shift";

  return `
    <div class="fade-in">
      <div class="elderly-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800;">Caregiver Duty & Shift Handoff (シフト管理)</h2>
            <div style="font-size: 14px; color: var(--text-secondary);">
              Autonomous Antigravity Agent routes alerts to backup caregiver when you mark Day Off
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-touch-primary" id="btn-trigger-handoff-demo" style="background: #9333EA; font-size: 14px; height: 44px;">
               Run Handoff Demo Scenario
            </button>
          </div>
        </div>

        <!-- Status Toggle Banner -->
        <div style="background: ${isOnShift ? "#F0FDF4" : "#FEF3C7"}; border: 2px solid ${isOnShift ? "#86EFAC" : "#FCD34D"}; border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
          <div>
            <div style="font-size: 14px; font-weight: 700; color: ${isOnShift ? "#166534" : "#92400E"}; text-transform: uppercase;">
              Current Active Status
            </div>
            <div style="font-size: 24px; font-weight: 900; color: #1E293B; margin-top: 4px;">
              ${isOnShift ? "Yuki Sato: ACTIVE ON SHIFT" : "Yuki Sato: ON DAY OFF (REST)"}
            </div>
            <div style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">
              ${isOnShift
      ? "All patient alerts, medication escalations, and clinic reports are routed to Yuki (Tokyo)."
      : "Backup activated! Kenji Sato (Aomori) is currently receiving all emergency alerts."
    }
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn-touch-primary" id="btn-set-shift-on" style="background: ${isOnShift ? "#10B981" : "#E2E8F0"}; color: ${isOnShift ? "#FFF" : "#475569"}; height: 46px;">
              ● On Shift
            </button>
            <button class="btn-touch-primary" id="btn-set-shift-off" style="background: ${!isOnShift ? "#D97706" : "#E2E8F0"}; color: ${!isOnShift ? "#FFF" : "#475569"}; height: 46px;">
              ○ Day Off (Handoff)
            </button>
          </div>
        </div>

        <!-- Handoff Protocol Details -->
        <div class="grid-2">
          <div style="border: 1px solid var(--border); border-radius: 12px; padding: 18px; background: #FFFFFF;">
            <div style="font-weight: 800; font-size: 16px; margin-bottom: 8px;">Primary Caregiver: Yuki Sato</div>
            <ul style="font-size: 14px; color: var(--text-secondary); list-style: none; display: flex; flex-direction: column; gap: 6px;">
              <li>• Location: Tokyo (Remote monitoring)</li>
              <li>• Phone: +81 90-4412-9901</li>
              <li>• Burnout Risk Index: <strong>32/100 (Safe)</strong></li>
              <li>• Response Time: 4.2 min avg</li>
            </ul>
          </div>

          <div style="border: 1px solid var(--border); border-radius: 12px; padding: 18px; background: #FFFFFF;">
            <div style="font-weight: 800; font-size: 16px; margin-bottom: 8px;">Backup Caregiver: Kenji Sato</div>
            <ul style="font-size: 14px; color: var(--text-secondary); list-style: none; display: flex; flex-direction: column; gap: 6px;">
              <li>• Location: Hirosaki, Aomori (Local dispatch)</li>
              <li>• Phone: +81 80-5591-2234</li>
              <li>• Response Time: 6.8 min avg</li>
              <li>• Ready for emergency physical visit in 10 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// SCREEN 4: HEALTH ALERTS & EMERGENCY MANAGEMENT
// ------------------------------------------------------------
function renderCgAlerts(alerts, pat) {
  return `
    <div class="fade-in">
      <div class="elderly-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 18px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800;">Emergency Triage & Alert History</h2>
          <div style="font-size: 14px; color: var(--text-secondary);">
            Real-time feed of automated patient monitoring escalations
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-sos" id="btn-cg-test-emergency" style="height: 42px; font-size: 14px;">
            🚨 Simulate Chest Pain Alert
          </button>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${alerts
      .map((a) => {
        const isCrit = a.priority === "critical";
        return `
            <div class="elderly-card" style="border-left: 8px solid ${isCrit ? "#DC2626" : a.priority === "warning" ? "#F59E0B" : "#3B82F6"}; background: ${isCrit ? "#FEF2F2" : "#FFFFFF"};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px; font-weight: 800;">${a.title}</span>
                  <span class="status-pill ${isCrit ? "red" : a.priority === "warning" ? "yellow" : "green"}">
                    ${a.priority.toUpperCase()}
                  </span>
                </div>
                <span style="font-size: 13px; color: var(--text-muted);">
                  ${new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 12px;">
                ${a.message}
              </p>
              ${isCrit
            ? `
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <button class="btn-sos" id="btn-cg-dispatch-119" style="height: 40px; font-size: 14px; padding: 0 16px;">
                     Dispatch 119 Ambulance
                  </button>
                  <button class="btn-touch-primary" id="btn-cg-direct-call" style="height: 40px; font-size: 14px; background: #DC2626; padding: 0 16px;">
                     Dial Takeshi (+81 172-33-8821)
                  </button>
                  <button class="btn-ghost-pill" id="btn-cg-notify-doctor" style="color: #1E293B;">
                     Alert Dr. Tanaka
                  </button>
                </div>
              `
            : `
                <div style="display: flex; gap: 8px;">
                  <button class="btn-ghost-pill btn-cg-ack" data-alert-id="${a.id}" style="color: #1E293B;">
                    ✓ Mark Resolved
                  </button>
                </div>
              `
          }
            </div>
          `;
      })
      .join("")}
      </div>
    </div>
  `;
}
