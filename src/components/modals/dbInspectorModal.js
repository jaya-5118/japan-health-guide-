// ============================================================
// MediConnect Japan - Phase 1: Database Collections Inspector
// Live Inspector for all 12 Collections
// ============================================================
import { store } from "../../db/store.js";

export function renderDbInspectorModal(isOpen = false, activeCollection = "patients") {
  if (!isOpen) return "";

  const collections = [
    { name: "patients", label: "1. Patients", count: store.get("patients").length },
    { name: "caregivers", label: "2. Caregivers", count: store.get("caregivers").length },
    { name: "medications", label: "3. Medications", count: store.get("medications").length },
    { name: "doctors", label: "4. Doctors", count: store.get("doctors").length },
    { name: "clinics", label: "5. Clinics", count: store.get("clinics").length },
    { name: "symptoms", label: "6. Symptoms", count: store.get("symptoms").length },
    { name: "vital_signs", label: "7. Vital Signs", count: store.get("vital_signs").length },
    { name: "telehealth_sessions", label: "8. Telehealth", count: store.get("telehealth_sessions").length },
    { name: "referrals", label: "9. Referrals", count: store.get("referrals").length },
    { name: "alerts", label: "10. Alerts", count: store.get("alerts").length },
    { name: "medical_history", label: "11. Medical History", count: store.get("medical_history").length },
    { name: "insurance", label: "12. Insurance", count: store.get("insurance").length },
    { name: "tourist_places", label: "13. Tourist Places", count: store.get("tourist_places").length },
    { name: "tourist_hospitals", label: "14. Tourist Hospitals", count: store.get("tourist_hospitals").length },
    { name: "tourist_phrases", label: "15. Travel Phrases", count: store.get("tourist_phrases").length }
  ];

  const currentRecords = store.get(activeCollection);

  return `
    <div class="modal-overlay" id="db-inspector-overlay">
      <div class="modal-dialog" style="max-width: 950px; height: 85vh;">
        <div class="modal-header" style="background: #0F172A; color: white;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">🗄️</div>
            <div>
              <h3 style="font-size: 19px; font-weight: 800; color: white;">Antigravity Reactive Database Collections Inspector</h3>
              <div style="font-size: 13px; color: #94A3B8;">Real-time sync enabled • WebSocket pub/sub bus • 12 Collections</div>
            </div>
          </div>
          <button id="btn-close-db-modal" style="background: transparent; border: none; color: #CBD5E1; font-size: 24px; cursor: pointer;">✕</button>
        </div>

        <div class="modal-body" style="display: flex; gap: 20px; padding: 18px; overflow: hidden;">
          <!-- Left Sidebar: 12 Collections List -->
          <div style="width: 240px; border-right: 1px solid var(--border); padding-right: 14px; overflow-y: auto;">
            <div style="font-size: 12px; font-weight: 800; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">
              Collections (${collections.length})
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${collections
                .map((c) => {
                  const isActive = c.name === activeCollection;
                  return `
                  <button class="btn-ghost-pill btn-inspect-col" data-col="${c.name}" style="justify-content: space-between; width: 100%; text-align: left; padding: 8px 12px; border-radius: 8px; ${
                    isActive ? "background: #1E88E5; color: white; border-color: #1E88E5; font-weight: bold;" : "color: #1E293B;"
                  }">
                    <span>${c.label}</span>
                    <span style="font-size: 11px; background: ${isActive ? "rgba(255,255,255,0.2)" : "#E2E8F0"}; padding: 2px 6px; border-radius: 10px;">
                      ${c.count}
                    </span>
                  </button>
                `;
                })
                .join("")}
            </div>
          </div>

          <!-- Right Content: Records JSON & Structure -->
          <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 18px; font-weight: 800; color: #1E293B;">
                Collection: <span style="color: #1E88E5;">${activeCollection}</span> (${currentRecords.length} records)
              </h4>
              <span class="status-pill green">RBAC PROTECTED</span>
            </div>

            <div style="background: #0F172A; color: #A5F3FC; padding: 16px; border-radius: 10px; font-family: monospace; font-size: 12px; overflow-x: auto; flex: 1;">
              <pre>${JSON.stringify(currentRecords, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="background: #F8FAFC;">
          <button class="btn-ghost-pill" id="btn-reset-db-from-inspector" style="color: #DC2626; border-color: #FECACA;">
            🔄 Reset Collections to Seed Data
          </button>
          <button class="btn-touch-primary" id="btn-close-db-modal-footer" style="height: 40px; font-size: 13px; background: #1E293B;">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  `;
}
