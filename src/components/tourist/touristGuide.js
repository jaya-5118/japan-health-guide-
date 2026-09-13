// ============================================================
// MediConnect Japan - Tourist & Senior Travel Health Guide
// Designed for elderly international visitors in Japan
// Accessibility, Multilingual Communication & Emergency Medical Aid
// ============================================================
import { store } from "../../db/store.js";
import { soundService } from "../../services/audio.js";

export function renderTouristView(activeTab = "places", filterCity = "all", selectedLang = "en") {
  const places = store.get("tourist_places");
  const hospitals = store.get("tourist_hospitals");
  const phrases = store.get("tourist_phrases");
  const profile = store.data.tourist_profile || {};

  return `
    <div class="patient-layout">
      <!-- Tourist Top Bar with Cultural Banner & Sub-Tabs -->
      <div class="elderly-card tourist-hero-card" style="background: linear-gradient(135deg, rgba(30, 27, 75, 0.85), rgba(79, 70, 184, 0.75)); border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="status-badge" style="background: rgba(232, 99, 122, 0.25); color: #FDE8EC; border: 1px solid rgba(232, 99, 122, 0.4);">
                Japan Senior Travel & Emergency Portal • 観光・緊急支援
              </span>
              <span class="status-badge" style="background: rgba(46, 158, 94, 0.25); color: #E6F7ED; border: 1px solid rgba(46, 158, 94, 0.4);">
                Active Traveler: ${profile.name || "Arthur Miller"} (${profile.age || 74}yo)
              </span>
            </div>
            <h2 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0; font-family: var(--font-display);">
              Elderly Tourist Travel & Medical Companion
            </h2>
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 4px 0 0 0;">
              Barrier-free destination guide, multilingual speech translator & instant 119 emergency medical dispatch
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn-touch-primary" id="btn-tourist-quick-sos" style="background: linear-gradient(135deg, #DC3545, #B52A37); font-size: 14px; height: 42px; min-height: 42px; padding: 0 18px;">
              <span>119 Emergency SOS</span>
            </button>
            <button class="btn-secondary" id="btn-tourist-jnto-call" style="background: rgba(255, 255, 255, 0.15); color: #FFFFFF; font-size: 13px; height: 42px; border: 1px solid rgba(255, 255, 255, 0.25); padding: 0 14px; border-radius: var(--radius-md); cursor: pointer;">
              <span>JNTO Hotline (24/7)</span>
            </button>
          </div>
        </div>

        <!-- Sub Navigation Pills -->
        <div style="display: flex; gap: 8px; margin-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 16px; overflow-x: auto;">
          <button class="tab-pill ${activeTab === "places" ? "active" : ""}" data-tourist-tab="places">
            Accessible Places
          </button>
          <button class="tab-pill ${activeTab === "translator" ? "active" : ""}" data-tourist-tab="translator">
            Language & Speech Assistant
          </button>
          <button class="tab-pill ${activeTab === "emergency" ? "active" : ""}" data-tourist-tab="emergency">
            Emergency SOS & Medical Card
          </button>
          <button class="tab-pill ${activeTab === "transport" ? "active" : ""}" data-tourist-tab="transport">
            Barrier-Free Transit
          </button>
        </div>
      </div>

      <!-- Main Tab Content Area -->
      ${
        activeTab === "places"
          ? renderPlacesScreen(places, filterCity)
          : activeTab === "translator"
          ? renderTranslatorScreen(phrases, selectedLang)
          : activeTab === "emergency"
          ? renderEmergencyScreen(profile, hospitals)
          : renderTransitScreen()
      }
    </div>
  `;
}

// ------------------------------------------------------------
// TAB 1: Accessible Places Screen
// ------------------------------------------------------------
function renderPlacesScreen(places, filterCity) {
  const filtered = filterCity === "all" ? places : places.filter((p) => p.city.toLowerCase() === filterCity.toLowerCase());
  const cities = ["all", "Tokyo", "Kyoto", "Kanazawa", "Hakone", "Aomori"];

  return `
    <div style="margin-bottom: 24px;">
      <!-- City Filter Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${cities
            .map(
              (city) => `
            <button class="filter-pill ${filterCity.toLowerCase() === city.toLowerCase() ? "active" : ""}" data-filter-city="${city}" style="padding: 6px 14px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.2); background: ${
                filterCity.toLowerCase() === city.toLowerCase() ? "var(--primary)" : "rgba(255, 255, 255, 0.1)"
              }; color: #FFFFFF; transition: all 0.2s ease;">
              ${city === "all" ? "All Regions" : city}
            </button>
          `
            )
            .join("")}
        </div>
        <div style="color: rgba(255, 255, 255, 0.7); font-size: 13px;">
          Showing ${filtered.length} senior-friendly barrier-free destinations
        </div>
      </div>

      <!-- Places Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
        ${filtered
          .map(
            (place) => `
          <div class="elderly-card" style="display: flex; flex-direction: column; justify-content: space-between; background: rgba(255, 255, 255, 0.88); color: var(--text-main);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px;">
                <div>
                  <span class="status-badge" style="background: var(--primary-light); color: var(--primary-dark); font-weight: 700; margin-bottom: 6px; display: inline-block;">
                    ${place.city} • ${place.category}
                  </span>
                  <h3 style="font-size: 18px; font-weight: 800; color: #1A1A2E; margin: 4px 0 2px 0;">
                    ${place.name}
                  </h3>
                  <div style="font-size: 13px; color: var(--text-muted); font-family: 'Noto Serif JP', serif;">
                    ${place.name_ja} (${place.area})
                  </div>
                </div>
                <div style="text-align: right;">
                  <span style="background: #E6F7ED; color: #1B8A4A; padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 700; display: inline-block;">
                    ${place.accessibility_score}
                  </span>
                </div>
              </div>

              <p style="font-size: 13.5px; color: #3D3D5C; line-height: 1.5; margin-bottom: 14px;">
                ${place.description}
              </p>

              <!-- Accessibility Highlights Box -->
              <div style="background: rgba(79, 70, 184, 0.06); border: 1px solid rgba(79, 70, 184, 0.15); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 14px; font-size: 12.5px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
                  <div><strong>Walking:</strong> ${place.walking_effort}</div>
                  <div><strong>Wheelchair:</strong> ${place.wheelchair_accessible ? "Fully Accessible" : "Partial"}</div>
                  <div><strong>Elevator:</strong> ${place.elevator_available ? "Available" : "Level Walkway"}</div>
                  <div><strong>Rest Benches:</strong> ${place.resting_benches}</div>
                </div>
                <div style="color: #B52A37; font-weight: 600; padding-top: 4px; border-top: 1px dashed rgba(79, 70, 184, 0.2);">
                  Emergency Medical Aid: ${place.nearest_hospital}
                </div>
              </div>
            </div>

            <!-- Action Buttons (No Emojis) -->
            <div style="display: flex; gap: 8px; margin-top: 10px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 12px;">
              <button class="btn-touch-primary btn-read-place-guide" data-place-id="${place.id}" style="flex: 1; height: 38px; min-height: 38px; font-size: 13px; padding: 0 10px;">
                <span>Read Audio Guide</span>
              </button>
              <button class="btn-secondary btn-show-taxi-card" data-place-id="${place.id}" style="flex: 1; height: 38px; font-size: 13px; background: #FFFFFF; border: 1px solid #D1D5DB; color: #1A1A2E; border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">
                <span>Show Taxi Card</span>
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// TAB 2: Multilingual Speech & Language Assistant Screen
// ------------------------------------------------------------
function renderTranslatorScreen(phrases, selectedLang) {
  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文 (Chinese)" },
    { code: "ko", name: "한국어 (Korean)" },
    { code: "es", name: "Español (Spanish)" },
    { code: "fr", name: "Français (French)" }
  ];

  return `
    <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
      <!-- Live Translation Interactive Tool -->
      <div class="elderly-card" style="background: rgba(255, 255, 255, 0.92); color: var(--text-main);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
          <div>
            <h3 style="font-size: 18px; font-weight: 800; color: #1A1A2E; margin: 0;">
              Live Tourist Voice & Text Translator
            </h3>
            <div style="font-size: 13px; color: var(--text-muted);">
              Type or speak any phrase. MediConnect translates into Japanese text, Romaji, and clear Japanese speech.
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 13px; font-weight: 600; color: #1A1A2E;">Input Language:</label>
            <select id="select-tourist-language" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid #CBD5E1; font-size: 13px; background: #FFFFFF;">
              ${languages.map((l) => `<option value="${l.code}" ${l.code === selectedLang ? "selected" : ""}>${l.name}</option>`).join("")}
            </select>
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 14px;">
          <input 
            type="text" 
            id="input-tourist-custom-text" 
            placeholder="Type your question (e.g., 'Where is the nearest pharmacy for blood pressure medicine?')" 
            style="flex: 1; padding: 12px 16px; border-radius: var(--radius-md); border: 1.5px solid #CBD5E1; font-size: 15px; outline: none;"
          />
          <button class="btn-touch-primary" id="btn-translate-tourist-custom" style="padding: 0 20px; font-size: 14px;">
            <span>Translate & Speak Japanese</span>
          </button>
        </div>

        <!-- Live Output Result Card -->
        <div id="tourist-translation-result" style="background: rgba(79, 70, 184, 0.05); border: 1px solid rgba(79, 70, 184, 0.15); border-radius: var(--radius-md); padding: 16px; display: none;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
            <div>
              <div style="font-size: 12px; font-weight: 700; color: var(--accent-indigo); text-transform: uppercase; margin-bottom: 4px;">
                Japanese Pronunciation for Locals:
              </div>
              <div id="out-ja-text" style="font-size: 22px; font-weight: 800; color: #1A1A2E; font-family: 'Noto Serif JP', serif; margin-bottom: 6px;">
                --
              </div>
              <div id="out-romaji-text" style="font-size: 14px; color: #4B5563; font-style: italic;">
                --
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-touch-primary" id="btn-play-custom-ja-speech" style="height: 36px; min-height: 36px; font-size: 13px; padding: 0 14px;">
                <span>Speak Again</span>
              </button>
              <button class="btn-secondary" id="btn-show-fullscreen-custom-card" style="height: 36px; font-size: 13px; background: #FFFFFF; border: 1px solid #CBD5E1; padding: 0 12px; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600;">
                <span>Show Big Screen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Curated Senior Travel & Medical Phrasebook -->
      <div class="elderly-card" style="background: rgba(255, 255, 255, 0.92); color: var(--text-main);">
        <h3 style="font-size: 18px; font-weight: 800; color: #1A1A2E; margin: 0 0 14px 0;">
          Essential Elderly Travel & Medical Phrasebook
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 14px;">
          ${phrases
            .map(
              (p) => `
            <div style="border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 14px; background: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="background: ${
                    p.category.includes("Medical") ? "#FDEAEC" : p.category.includes("Transit") ? "#E6F7ED" : "#FFF4E3"
                  }; color: ${
                p.category.includes("Medical") ? "#DC3545" : p.category.includes("Transit") ? "#1B8A4A" : "#C77B18"
              }; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-sm);">
                    ${p.category} • ${p.context}
                  </span>
                </div>
                <div style="font-size: 14.5px; font-weight: 700; color: #1A1A2E; margin-bottom: 6px;">
                  "${p.en}"
                </div>
                <div style="font-size: 18px; font-weight: 800; color: var(--accent-indigo); font-family: 'Noto Serif JP', serif; margin-bottom: 4px;">
                  ${p.ja}
                </div>
                <div style="font-size: 12.5px; color: #64748B; font-style: italic; margin-bottom: 12px;">
                  ${p.romaji}
                </div>
              </div>

              <div style="display: flex; gap: 8px; border-top: 1px solid #F1F5F9; padding-top: 10px;">
                <button class="btn-touch-primary btn-speak-phrase" data-text-ja="${p.ja}" data-text-en="${p.en}" style="flex: 1; height: 34px; min-height: 34px; font-size: 12.5px; padding: 0 10px;">
                  <span>Speak in Japanese</span>
                </button>
                <button class="btn-secondary btn-show-phrase-card" data-phrase-ja="${p.ja}" data-phrase-en="${p.en}" data-phrase-romaji="${p.romaji}" style="flex: 1; height: 34px; font-size: 12.5px; background: #F8FAFC; border: 1px solid #CBD5E1; color: #1A1A2E; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600;">
                  <span>Show Card to Staff</span>
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// TAB 3: Emergency SOS & Tourist Medical Card Screen
// ------------------------------------------------------------
function renderEmergencyScreen(profile, hospitals) {
  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <!-- Left Column: Tourist Digital Medical ID Card -->
      <div class="elderly-card" style="background: rgba(255, 255, 255, 0.94); color: var(--text-main); border-top: 4px solid #DC3545;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
          <div>
            <span class="status-badge" style="background: #FDEAEC; color: #DC3545; font-weight: 700; margin-bottom: 6px; display: inline-block;">
              Paramedic Quick-Triage Pass • 緊急医療カード
            </span>
            <h3 style="font-size: 20px; font-weight: 800; color: #1A1A2E; margin: 0;">
              ${profile.name || "Arthur Miller"}
            </h3>
            <div style="font-size: 13px; color: var(--text-muted);">
              Age ${profile.age || 74} • Nationality: ${profile.nationality || "USA"} • Blood Type: ${profile.blood_type || "O+"}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: #64748B; font-weight: 700;">STAYING AT:</div>
            <div style="font-size: 13px; font-weight: 700; color: #1A1A2E;">${profile.hotel || "Imperial Hotel Tokyo"}</div>
          </div>
        </div>

        <!-- Critical Conditions in English & Japanese -->
        <div style="background: #FFF8E8; border: 1px solid #FDE68A; border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px;">
          <div style="font-size: 12px; font-weight: 700; color: #B45309; text-transform: uppercase; margin-bottom: 6px;">
            Chronic Conditions & History (既往歴):
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #1A1A2E; line-height: 1.6;">
            ${(profile.chronic_conditions || ["Essential Hypertension", "Mild Angina Pectoris", "Type 2 Diabetes"]).map((c) => `<li><strong>${c}</strong></li>`).join("")}
          </ul>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-sm); padding: 10px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748B;">CURRENT MEDICATIONS:</div>
            <div style="font-size: 12.5px; color: #1A1A2E; font-weight: 600; margin-top: 4px;">
              ${(profile.current_medications || ["Amlodipine 5mg", "Metformin 500mg", "Nitroglycerin"]).join("<br>")}
            </div>
          </div>
          <div style="background: #FDEAEC; border: 1px solid #FECDD3; border-radius: var(--radius-sm); padding: 10px;">
            <div style="font-size: 11px; font-weight: 700; color: #DC3545;">ALLERGIES (アレルギー):</div>
            <div style="font-size: 12.5px; color: #B91C1C; font-weight: 700; margin-top: 4px;">
              ${(profile.allergies || ["Penicillin", "Sulfa drugs"]).join(", ")}
            </div>
          </div>
        </div>

        <!-- Full Japanese Summary for Paramedics -->
        <div style="background: #F1F5F9; border-radius: var(--radius-sm); padding: 12px; font-size: 12.5px; color: #334155; line-height: 1.5; font-family: 'Noto Serif JP', serif; margin-bottom: 16px;">
          <strong>救急隊員・医師向け情報:</strong><br>
          ${profile.japanese_medical_summary || "本態性高血圧、狭心症、糖尿病。アレルギー: ペニシリン。海外旅行保険加入済み。"}
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn-touch-primary" id="btn-speak-japanese-medical-summary" style="flex: 1; font-size: 13px; height: 40px; min-height: 40px;">
            <span>Read Summary to Paramedic</span>
          </button>
          <button class="btn-secondary" id="btn-print-tourist-medical-card" style="flex: 1; font-size: 13px; height: 40px; background: #FFFFFF; border: 1px solid #CBD5E1; color: #1A1A2E; border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">
            <span>Print / Save Pass</span>
          </button>
        </div>
      </div>

      <!-- Right Column: Instant Emergency Dispatch & Accredited Hospitals -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Emergency Hotline Action Box -->
        <div class="elderly-card" style="background: rgba(220, 53, 69, 0.9); color: #FFFFFF;">
          <h3 style="font-size: 18px; font-weight: 800; margin: 0 0 6px 0; color: #FFFFFF;">
            Japan National Emergency Hotlines
          </h3>
          <p style="font-size: 13px; margin: 0 0 14px 0; color: rgba(255, 255, 255, 0.9);">
            Dialing 119 in Japan connects directly to Fire & Medical Ambulance Services.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="btn-touch-primary" id="btn-tourist-dispatch-119" style="background: #FFFFFF; color: #DC3545; height: 48px; min-height: 48px; font-size: 15px; font-weight: 800; border: none; box-shadow: 0 4px 14px rgba(0,0,0,0.2);">
              <span>Dial 119 Ambulance</span>
            </button>
            <button class="btn-secondary" id="btn-tourist-call-jnto" style="background: rgba(0, 0, 0, 0.25); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.4); height: 48px; font-size: 13px; font-weight: 700; border-radius: var(--radius-md); cursor: pointer;">
              <span>JNTO Hotline 24/7<br>(050-3816-2720)</span>
            </button>
          </div>
        </div>

        <!-- Accredited Multilingual Emergency Hospitals -->
        <div class="elderly-card" style="background: rgba(255, 255, 255, 0.92); color: var(--text-main); flex: 1;">
          <h3 style="font-size: 16px; font-weight: 800; color: #1A1A2E; margin: 0 0 12px 0;">
            International Accredited Hospitals in Japan
          </h3>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${hospitals
              .map(
                (h) => `
              <div style="border: 1px solid #E2E8F0; border-radius: var(--radius-sm); padding: 10px 12px; background: #FFFFFF; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 13.5px; color: #1A1A2E;">
                    ${h.name}
                  </div>
                  <div style="font-size: 12px; color: var(--text-muted);">
                    ${h.city} • Languages: ${h.languages.join(", ")}
                  </div>
                  <div style="font-size: 11.5px; color: #16A34A; font-weight: 600;">
                    ${h.accreditation} • ${h.emergency_hours}
                  </div>
                </div>

                <div>
                  <button class="btn-touch-primary btn-call-hospital" data-phone="${h.phone}" data-name="${h.name}" style="height: 32px; min-height: 32px; font-size: 12px; padding: 0 10px;">
                    <span>Call Desk</span>
                  </button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// TAB 4: Senior Barrier-Free Transit Screen
// ------------------------------------------------------------
function renderTransitScreen() {
  return `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div class="elderly-card" style="background: rgba(255, 255, 255, 0.92); color: var(--text-main);">
        <h3 style="font-size: 18px; font-weight: 800; color: #1A1A2E; margin: 0 0 12px 0;">
          Universal Design Taxis (JPN TAXI)
        </h3>
        <p style="font-size: 13.5px; color: #4B5563; line-height: 1.6; margin-bottom: 14px;">
          Japan features high-roof "JPN TAXI" vehicles designed specifically for elderly passengers and wheelchair users. They have electric sliding doors, low non-slip entry steps, yellow interior grab handles, and built-in wheelchair boarding ramps.
        </p>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-sm); padding: 12px; margin-bottom: 14px;">
          <div style="font-weight: 700; font-size: 13px; color: #1E293B; margin-bottom: 6px;">How to request a UD Taxi:</div>
          <div style="font-size: 13px; color: #475569; line-height: 1.5;">
            Show this phrase to hotel concierge or station staff:<br>
            <span style="font-size: 16px; font-weight: 700; color: var(--accent-indigo); font-family: 'Noto Serif JP', serif;">
              「乗り降りがしやすいユニバーサルデザインタクシー（JPN TAXI）を手配していただけますか？」
            </span>
          </div>
        </div>

        <button class="btn-touch-primary" id="btn-request-ud-taxi-demo" style="width: 100%; height: 42px; min-height: 42px; font-size: 14px;">
          <span>Request Assisted Taxi Service</span>
        </button>
      </div>

      <div class="elderly-card" style="background: rgba(255, 255, 255, 0.92); color: var(--text-main);">
        <h3 style="font-size: 18px; font-weight: 800; color: #1A1A2E; margin: 0 0 12px 0;">
          Station Staff Wheelchair & Senior Escort Service
        </h3>
        <p style="font-size: 13.5px; color: #4B5563; line-height: 1.6; margin-bottom: 14px;">
          JR and Tokyo Metro offer free personal staff escorts for seniors. Station staff meet you at the ticket gate, escort you down via elevators, place a bridge plate between platform and train, and call ahead to your destination station so another staff member greets you at the carriage door.
        </p>

        <div style="background: #E6F7ED; border: 1px solid #BBF7D0; border-radius: var(--radius-sm); padding: 12px; margin-bottom: 14px;">
          <div style="font-weight: 700; font-size: 13px; color: #166534; margin-bottom: 4px;">Service is completely free:</div>
          <div style="font-size: 12.5px; color: #14532D; line-height: 1.5;">
            Simply speak to the stationmaster at the ticket window (Midori-no-Madoguchi) 15 minutes before your scheduled train.
          </div>
        </div>

        <button class="btn-touch-primary" id="btn-station-assist-speak" style="width: 100%; height: 42px; min-height: 42px; font-size: 14px; background: linear-gradient(135deg, #1B8A4A, #166534);">
          <span>Speak Station Assistance Request</span>
        </button>
      </div>
    </div>
  `;
}
