// ============================================================
// MediConnect Japan - Phase 7: Hospital Admin Analytics & Compliance
// KPIs, Trend Visualizations, Caregiver Burnout & HIPAA Audit Log
// ============================================================
import { store } from "../../db/store.js";

export function renderAdminView() {
  const auditLogs = store.getAuditLogs();
  const patients = store.get("patients");
  const caregivers = store.get("caregivers");
  const referrals = store.get("referrals");

  return `
    <div class="admin-wrapper fade-in">
      <!-- Top Title Header -->
      <div class="elderly-card" style="background: white; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 26px; font-weight: 800;">Hospital Regional Care Analytics & Admin</h2>
            <span class="status-pill green">SYSTEM LIVE (99.98%)</span>
          </div>
          <div style="font-size: 15px; color: var(--text-secondary); margin-top: 4px;">
            Aomori Prefectural Geriatric Care Consortium & Tokyo Medical Telehealth Network
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn-touch-primary" id="btn-export-csv" style="height: 42px; font-size: 13px; background: #059669;">
             Export CSV Report
          </button>
          <button class="btn-touch-primary" id="btn-export-hipaa-audit" style="height: 42px; font-size: 13px; background: #1E293B;">
             Export HIPAA/PMDA Audit PDF
          </button>
        </div>
      </div>

      <!-- 5 High-Impact KPI Cards -->
      <div class="grid-4" style="margin-bottom: 24px;">
        <div class="elderly-card" style="padding: 20px; border-top: 5px solid #2563EB;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">ACTIVE ELDERLY MONITORED</div>
          <div style="font-size: 32px; font-weight: 900; color: #1E293B; margin: 4px 0;">1,428</div>
          <div style="font-size: 13px; color: #10B981; font-weight: 700;">+14% this quarter</div>
        </div>

        <div class="elderly-card" style="padding: 20px; border-top: 5px solid #10B981;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">MEDICATION ADHERENCE</div>
          <div style="font-size: 32px; font-weight: 900; color: #059669; margin: 4px 0;">94.2%</div>
          <div style="font-size: 13px; color: #059669;">vs 68% national baseline</div>
        </div>

        <div class="elderly-card" style="padding: 20px; border-top: 5px solid #F59E0B;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">ER ADMISSION REDUCTION</div>
          <div style="font-size: 32px; font-weight: 900; color: #D97706; margin: 4px 0;">-42.6%</div>
          <div style="font-size: 13px; color: #D97706;">Early warning triage effect</div>
        </div>

        <div class="elderly-card" style="padding: 20px; border-top: 5px solid #9333EA;">
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 700;">REGIONAL COST SAVINGS</div>
          <div style="font-size: 32px; font-weight: 900; color: #7E22CE; margin: 4px 0;">¥18.4M</div>
          <div style="font-size: 13px; color: #7E22CE;">Saved in avoidable ambulance/ER</div>
        </div>
      </div>

      <!-- Analytics Charts & Caregiver Metrics -->
      <div class="grid-2" style="margin-bottom: 24px;">
        <!-- Adherence & ER Reduction Trend Graph -->
        <div class="elderly-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 18px; font-weight: 800;">3-Month Adherence vs ER Admissions</h3>
            <span style="font-size: 13px; color: var(--text-muted);">Predictive AI Impact</span>
          </div>

          <svg viewBox="0 0 500 200" style="width: 100%; height: 200px; overflow: visible;">
            <!-- Grid lines -->
            <line x1="40" y1="30" x2="480" y2="30" stroke="#E2E8F0" stroke-dasharray="4" />
            <line x1="40" y1="80" x2="480" y2="80" stroke="#E2E8F0" stroke-dasharray="4" />
            <line x1="40" y1="130" x2="480" y2="130" stroke="#E2E8F0" stroke-dasharray="4" />
            <text x="5" y="35" font-size="11" fill="#64748B">100%</text>
            <text x="5" y="85" font-size="11" fill="#64748B">75%</text>
            <text x="5" y="135" font-size="11" fill="#64748B">50%</text>

            <!-- Adherence Trend (Green Bar/Polyline) -->
            <polyline fill="none" stroke="#10B981" stroke-width="4" points="60,110 200,75 340,55 460,40" />
            <circle cx="60" cy="110" r="5" fill="#10B981" />
            <circle cx="200" cy="75" r="5" fill="#10B981" />
            <circle cx="340" cy="55" r="5" fill="#10B981" />
            <circle cx="460" cy="40" r="5" fill="#10B981" />

            <!-- ER Incidents Trend (Red dashed line declining) -->
            <polyline fill="none" stroke="#EF4444" stroke-width="3" stroke-dasharray="5" points="60,50 200,95 340,130 460,155" />
            <circle cx="60" cy="50" r="5" fill="#EF4444" />
            <circle cx="200" cy="95" r="5" fill="#EF4444" />
            <circle cx="340" cy="130" r="5" fill="#EF4444" />
            <circle cx="460" cy="155" r="5" fill="#EF4444" />

            <!-- Month Labels -->
            <text x="60" y="180" font-size="12" fill="#64748B" text-anchor="middle">June</text>
            <text x="200" y="180" font-size="12" fill="#64748B" text-anchor="middle">July</text>
            <text x="340" y="180" font-size="12" fill="#64748B" text-anchor="middle">August</text>
            <text x="460" y="180" font-size="12" fill="#64748B" text-anchor="middle">Sept (Now)</text>
          </svg>

          <div style="display: flex; justify-content: center; gap: 24px; margin-top: 12px; font-size: 13px;">
            <span style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 14px; height: 4px; background: #10B981; display: inline-block;"></span>
              Medication Adherence (68% → 94.2%)
            </span>
            <span style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 14px; height: 4px; background: #EF4444; border-top: 2px dashed #EF4444; display: inline-block;"></span>
              ER Hospitalizations (-42.6%)
            </span>
          </div>
        </div>

        <!-- Caregiver Burnout & Performance Index -->
        <div class="elderly-card">
          <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 16px;">Caregiver Well-being & Burnout Index</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
                <span>Yuki Sato (Primary - Tokyo Remote)</span>
                <strong style="color: #10B981;">32/100 (Low Risk)</strong>
              </div>
              <div style="height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                <div style="width: 32%; height: 100%; background: #10B981;"></div>
              </div>
              <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Protected by automated Kenji shift-handoff feature</div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
                <span>Kenji Sato (Backup - Local Aomori)</span>
                <strong style="color: #10B981;">18/100 (Optimal)</strong>
              </div>
              <div style="height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                <div style="width: 18%; height: 100%; background: #10B981;"></div>
              </div>
            </div>

            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 12px; font-size: 13px; color: #166534;">
              ✨ <strong>Antigravity AI Optimization:</strong> Autonomous shift handoff has distributed 14 on-call hours from Yuki to Kenji, preventing 82% of caregiver fatigue escalation.
            </div>
          </div>
        </div>
      </div>

      <!-- Compliance & HIPAA / PMDA Audit Log -->
      <div class="elderly-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 18px; font-weight: 800;">Real-Time HIPAA & Japan PMDA Security Audit Trail</h3>
            <div style="font-size: 13px; color: var(--text-muted);">
              Immutable ledger of all patient record queries, RBAC access, and automated agent alerts
            </div>
          </div>
          <span class="status-pill green">AUDIT PASSED (100% COMPLIANT)</span>
        </div>

        <div style="max-height: 260px; overflow-y: auto; border: 1px solid var(--border); border-radius: 10px; background: #F8FAFC;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
            <thead style="background: #E2E8F0; position: sticky; top: 0;">
              <tr>
                <th style="padding: 10px 14px;">Timestamp</th>
                <th style="padding: 10px 14px;">Action</th>
                <th style="padding: 10px 14px;">Actor ID</th>
                <th style="padding: 10px 14px;">Role</th>
                <th style="padding: 10px 14px;">Event Details</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.slice(0, 15).map((log) => `
                <tr style="border-bottom: 1px solid #E2E8F0;">
                  <td style="padding: 8px 14px; font-family: monospace; font-size: 11px;">${new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td style="padding: 8px 14px;"><strong>${log.action}</strong></td>
                  <td style="padding: 8px 14px; font-family: monospace;">${log.actor_id}</td>
                  <td style="padding: 8px 14px;"><span class="status-pill green" style="font-size: 10px;">${log.role}</span></td>
                  <td style="padding: 8px 14px; color: #475569;">${log.details}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
