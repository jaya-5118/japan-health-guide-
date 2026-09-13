// ============================================================
// MediConnect Japan - Main Application Controller & Event Engine
// ============================================================
import "./styles/theme.css";
import { store } from "./db/store.js";
import { soundService } from "./services/audio.js";
import { renderNavbar } from "./components/navbar.js";
import { renderPatientView } from "./components/patient/patientScreens.js";
import { renderCaregiverView } from "./components/caregiver/caregiverScreens.js";
import { renderDoctorView } from "./components/doctor/doctorScreens.js";
import { renderAdminView } from "./components/admin/adminScreens.js";
import { renderTouristView } from "./components/tourist/touristGuide.js";
import {
  renderDemoRunnerModal,
  executeScenario
} from "./components/modals/demoRunnerModal.js";
import { renderDbInspectorModal } from "./components/modals/dbInspectorModal.js";
import {
  runWorkflowMedicationReminder,
  runWorkflowEmergencySymptomDetection,
  runWorkflowSpecialistReferral,
  runWorkflowCaregiverHandoff,
  runWorkflowVitalsSpikeDetection
} from "./agents/workflows.js";
import confetti from "canvas-confetti";

// Application State
const appState = {
  currentRole: "patient", // 'patient', 'caregiver', 'doctor', 'admin', 'tourist'
  tabs: {
    patient: "home",
    caregiver: "dashboard",
    doctor: "patients",
    admin: "analytics",
    tourist: "places"
  },
  touristState: {
    filterCity: "all",
    selectedLang: "en"
  },
  demoModal: {
    isOpen: false,
    activeScenario: 1,
    currentStep: 1,
    logs: []
  },
  dbModal: {
    isOpen: false,
    activeCollection: "patients"
  },
  isAudioMuted: false
};

// Main App Container
const appEl = document.getElementById("app");

// Render Root Function
function renderApp() {
  if (!appEl) return;

  const { currentRole, tabs, demoModal, dbModal, isAudioMuted, touristState } = appState;
  const currentTab = tabs[currentRole];

  appEl.innerHTML = `
    ${renderNavbar(currentRole, isAudioMuted)}

    <main class="main-content">
      ${
        currentRole === "patient"
          ? renderPatientView(currentTab)
          : currentRole === "caregiver"
          ? renderCaregiverView(currentTab)
          : currentRole === "doctor"
          ? renderDoctorView(currentTab)
          : currentRole === "admin"
          ? renderAdminView()
          : renderTouristView(currentTab, touristState.filterCity, touristState.selectedLang)
      }
    </main>

    ${renderDemoRunnerModal(demoModal.isOpen, demoModal.activeScenario, demoModal.currentStep, demoModal.logs)}
    ${renderDbInspectorModal(dbModal.isOpen, dbModal.activeCollection)}
  `;

  attachEventListeners();
}

// Global Event Handler Attachments
function attachEventListeners() {
  // 1. Role Switching
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      appState.currentRole = role;
      store.setUser(role);
      soundService.playReminderChime();
      renderApp();
    });
  });

  // 2. Patient Screen Tabs
  document.querySelectorAll("[data-patient-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      appState.tabs.patient = tab.dataset.patientTab;
      renderApp();
    });
  });

  // 3. Caregiver Screen Tabs
  document.querySelectorAll("[data-cg-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      appState.tabs.caregiver = tab.dataset.cgTab;
      renderApp();
    });
  });

  // 4. Doctor Screen Tabs
  document.querySelectorAll("[data-doc-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      appState.tabs.doctor = tab.dataset.docTab;
      renderApp();
    });
  });

  // 5. Patient Quick Actions
  const btnQuickTakeMed = document.getElementById("btn-quick-take-med");
  if (btnQuickTakeMed) {
    btnQuickTakeMed.addEventListener("click", () => {
      store.update("medications", "med_amlodipine", { today_status: "taken", last_taken: new Date().toISOString() });
      store.update("medications", "med_metformin", { today_status: "taken", last_taken: new Date().toISOString() });
      soundService.playSuccessChime();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      soundService.speak("Well done Takeshi-san. Your morning medications are recorded.", "en-US");
      renderApp();
    });
  }

  // Single Med Taking
  document.querySelectorAll(".btn-take-single-med").forEach((btn) => {
    btn.addEventListener("click", () => {
      const medId = btn.dataset.medId;
      store.update("medications", medId, { today_status: "taken", last_taken: new Date().toISOString() });
      soundService.playSuccessChime();
      confetti({ particleCount: 40, spread: 50 });
      renderApp();
    });
  });

  // Patient Nav Shortcuts
  const btnNavToVitals = document.getElementById("btn-nav-to-vitals");
  if (btnNavToVitals) {
    btnNavToVitals.addEventListener("click", () => {
      appState.tabs.patient = "vitals";
      renderApp();
    });
  }

  const btnNavToMessages = document.getElementById("btn-nav-to-messages");
  if (btnNavToMessages) {
    btnNavToMessages.addEventListener("click", () => {
      appState.tabs.patient = "messages";
      renderApp();
    });
  }

  // SOS Buttons
  const btnHomeSos = document.getElementById("btn-home-sos");
  if (btnHomeSos) {
    btnHomeSos.addEventListener("click", () => {
      appState.tabs.patient = "emergency";
      renderApp();
    });
  }

  // Voice Quick Buttons
  document.querySelectorAll(".btn-voice-quick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.voice;
      if (type === "took_med") {
        store.update("medications", "med_amlodipine", { today_status: "taken", last_taken: new Date().toISOString() });
        soundService.playSuccessChime();
        soundService.speak("Voice recognized: Morning medicine marked as taken.", "en-US");
        renderApp();
      } else if (type === "chest_pain") {
        appState.tabs.patient = "emergency";
        renderApp();
        setTimeout(() => {
          runWorkflowEmergencySymptomDetection("Severe chest pain and tightness");
          renderApp();
        }, 100);
      }
    });
  });

  // Voice Mic Pulse
  const btnVoiceMic = document.getElementById("btn-patient-voice-mic");
  if (btnVoiceMic) {
    btnVoiceMic.addEventListener("click", () => {
      soundService.playReminderChime();
      soundService.speak("Hello Takeshi-san. I am listening. Tell me if you took medicine or feel unwell.", "en-US");
    });
  }

  // Symptom Analysis & Emergency Trigger
  const btnAssessSymptom = document.getElementById("btn-assess-symptom");
  if (btnAssessSymptom) {
    btnAssessSymptom.addEventListener("click", () => {
      const input = document.getElementById("input-symptom-text");
      const text = input ? input.value : "Severe chest pain";
      runWorkflowEmergencySymptomDetection(text);
      renderApp();
    });
  }

  document.querySelectorAll(".symptom-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const input = document.getElementById("input-symptom-text");
      if (input) {
        input.value = chip.dataset.text;
      }
      runWorkflowEmergencySymptomDetection(chip.dataset.text);
      renderApp();
    });
  });

  // 119 Emergency Button
  const btnTrigger119 = document.getElementById("btn-trigger-119");
  if (btnTrigger119) {
    btnTrigger119.addEventListener("click", () => {
      soundService.playEmergencyAlarm();
      soundService.speak("Connecting to Japan Emergency Services 119. GPS location transmitted: Hirosaki, Aomori.", "en-US");
      alert("🚑 [119 DISPATCH SIMULATION]\nJapan Emergency Medical Service 119 Alerted!\n\nPatient: Takeshi Sato (78yo)\nGPS: 40.6031 N, 140.4641 E (Hirosaki, Aomori)\nParamedic Summary: Severe chest pain, Essential Hypertension, T2D.");
    });
  }

  // Record Manual BP
  const btnLogBp = document.getElementById("btn-log-bp");
  if (btnLogBp) {
    btnLogBp.addEventListener("click", () => {
      const sys = parseInt(document.getElementById("input-sys").value, 10) || 138;
      const dia = parseInt(document.getElementById("input-dia").value, 10) || 88;
      const pulse = parseInt(document.getElementById("input-pulse").value, 10) || 72;
      runWorkflowVitalsSpikeDetection(sys, dia, pulse);
      confetti({ particleCount: 30, spread: 40 });
      renderApp();
    });
  }

  // Test Voice Reminder
  const btnTriggerReminderDemo = document.getElementById("btn-trigger-reminder-demo");
  if (btnTriggerReminderDemo) {
    btnTriggerReminderDemo.addEventListener("click", () => {
      runWorkflowMedicationReminder("med_amlodipine");
      renderApp();
    });
  }

  // Caregiver Shift Status Toggle
  const btnToggleShift = document.getElementById("btn-toggle-shift-status");
  if (btnToggleShift) {
    btnToggleShift.addEventListener("click", () => {
      const cg = store.find("caregivers", "cg_yuki");
      const nextStatus = cg.availability_status === "on_shift" ? "day_off" : "on_shift";
      runWorkflowCaregiverHandoff("cg_yuki", nextStatus);
      renderApp();
    });
  }

  const btnSetShiftOn = document.getElementById("btn-set-shift-on");
  if (btnSetShiftOn) {
    btnSetShiftOn.addEventListener("click", () => {
      runWorkflowCaregiverHandoff("cg_yuki", "on_shift");
      renderApp();
    });
  }

  const btnSetShiftOff = document.getElementById("btn-set-shift-off");
  if (btnSetShiftOff) {
    btnSetShiftOff.addEventListener("click", () => {
      runWorkflowCaregiverHandoff("cg_yuki", "day_off");
      renderApp();
    });
  }

  // Caregiver test emergency
  const btnCgTestEmergency = document.getElementById("btn-cg-test-emergency");
  if (btnCgTestEmergency) {
    btnCgTestEmergency.addEventListener("click", () => {
      runWorkflowEmergencySymptomDetection("Severe chest pain and tightness");
      renderApp();
    });
  }

  // Doctor Open EHR
  document.querySelectorAll(".btn-open-patient-ehr").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.tabs.doctor = "ehr";
      renderApp();
    });
  });

  // Doctor Refer Specialist
  document.querySelectorAll(".btn-doc-refer-specialist").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.tabs.doctor = "referral";
      renderApp();
    });
  });

  // Submit Specialist Referral
  const btnSubmitRef = document.getElementById("btn-submit-specialist-referral");
  if (btnSubmitRef) {
    btnSubmitRef.addEventListener("click", () => {
      const reason = document.getElementById("referral-reason")?.value;
      const summary = document.getElementById("referral-summary")?.value;
      const priority = document.getElementById("select-referral-priority")?.value || "Urgent";
      runWorkflowSpecialistReferral({
        reason,
        clinicalSummary: summary,
        priority
      });
      confetti({ particleCount: 50, spread: 60 });
      alert("✅ Specialist Referral Encrypted & Transmitted!\n\nTarget: Dr. Akemi Nakamura (Tokyo University Cardio Center)\nConsultation booked for Sept 15, 14:00 JST.");
      renderApp();
    });
  }

  // Telehealth Consultation Speech Simulation
  document.querySelectorAll(".btn-sim-speak").forEach((btn) => {
    btn.addEventListener("click", () => {
      const speaker = btn.dataset.speaker;
      const textJa = btn.dataset.textJa;
      const textEn = btn.dataset.textEn;

      const subOrig = document.getElementById("sub-original");
      const subTrans = document.getElementById("sub-translated");

      if (speaker === "doctor") {
        const trans = runWorkflowAiTranslation(textJa, "ja-JP");
        if (subOrig) subOrig.innerText = `Dr. Nakamura: 「${textJa}」`;
        if (subTrans) subTrans.innerText = `↳ Translated (EN): "${trans}"`;
        soundService.speak(trans, "en-US");
      } else {
        const trans = runWorkflowAiTranslation(textEn, "en-US");
        if (subOrig) subOrig.innerText = `Takeshi: "${textEn}"`;
        if (subTrans) subTrans.innerText = `↳ Translated (JA): 「${trans}」`;
        soundService.speak(trans, "ja-JP");
      }
    });
  });

  // Quick Prescription Adjustment during Telehealth
  const btnAdjustLisinopril = document.getElementById("btn-adjust-lisinopril-15");
  if (btnAdjustLisinopril) {
    btnAdjustLisinopril.addEventListener("click", () => {
      store.update("medications", "med_lisinopril", {
        dosage: "15mg",
        instructions: "Take 15mg in the evening (Titrated by Dr. Nakamura Tokyo)",
        updated_at: new Date().toISOString()
      });
      soundService.playSuccessChime();
      confetti({ particleCount: 50, spread: 60 });
      alert("💊 Prescription Updated!\n\nLisinopril titrated: 10mg -> 15mg\nE-Prescription encrypted and transmitted to Hirosaki Community Pharmacy.");
      renderApp();
    });
  }

  // Doctor Quick Launch Telehealth
  const btnDocStartTelehealth = document.getElementById("btn-doc-start-telehealth-quick");
  if (btnDocStartTelehealth) {
    btnDocStartTelehealth.addEventListener("click", () => {
      appState.tabs.doctor = "telehealth";
      renderApp();
    });
  }

  // Modal Open/Close: Demo Orchestrator
  const btnOpenDemo = document.getElementById("btn-open-demo-orchestrator");
  if (btnOpenDemo) {
    btnOpenDemo.addEventListener("click", () => {
      appState.demoModal.isOpen = true;
      renderApp();
    });
  }

  const btnCloseDemo = document.getElementById("btn-close-demo-modal");
  if (btnCloseDemo) {
    btnCloseDemo.addEventListener("click", () => {
      appState.demoModal.isOpen = false;
      renderApp();
    });
  }

  const btnCloseDemoFooter = document.getElementById("btn-close-demo-modal-footer");
  if (btnCloseDemoFooter) {
    btnCloseDemoFooter.addEventListener("click", () => {
      appState.demoModal.isOpen = false;
      renderApp();
    });
  }

  // Scenario selection in modal
  document.querySelectorAll("[data-scenario-select]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.demoModal.activeScenario = parseInt(btn.dataset.scenarioSelect, 10);
      renderApp();
    });
  });

  // Run full scenario button
  const btnRunCurrentScenario = document.getElementById("btn-run-current-scenario");
  if (btnRunCurrentScenario) {
    btnRunCurrentScenario.addEventListener("click", async () => {
      btnRunCurrentScenario.disabled = true;
      btnRunCurrentScenario.innerText = "⏳ Executing Scenario...";
      const num = appState.demoModal.activeScenario;

      await executeScenario(num, (log) => {
        appState.demoModal.logs.unshift(log);
        renderApp();
      });

      btnRunCurrentScenario.disabled = false;
      btnRunCurrentScenario.innerText = "▶ Run Full Scenario Automatically";
      renderApp();
    });
  }

  // Step current scenario
  const btnStepCurrentScenario = document.getElementById("btn-step-current-scenario");
  if (btnStepCurrentScenario) {
    btnStepCurrentScenario.addEventListener("click", async () => {
      const num = appState.demoModal.activeScenario;
      await executeScenario(num, (log) => {
        appState.demoModal.logs.unshift(log);
        renderApp();
      });
    });
  }

  // Modal Open/Close: DB Inspector
  const btnOpenDb = document.getElementById("btn-open-db-inspector");
  if (btnOpenDb) {
    btnOpenDb.addEventListener("click", () => {
      appState.dbModal.isOpen = true;
      renderApp();
    });
  }

  const btnCloseDb = document.getElementById("btn-close-db-modal");
  if (btnCloseDb) {
    btnCloseDb.addEventListener("click", () => {
      appState.dbModal.isOpen = false;
      renderApp();
    });
  }

  const btnCloseDbFooter = document.getElementById("btn-close-db-modal-footer");
  if (btnCloseDbFooter) {
    btnCloseDbFooter.addEventListener("click", () => {
      appState.dbModal.isOpen = false;
      renderApp();
    });
  }

  // DB Collection Inspector select
  document.querySelectorAll("[data-col]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.dbModal.activeCollection = btn.dataset.col;
      renderApp();
    });
  });

  // Global Reset Database
  const btnResetDb = document.getElementById("btn-global-reset-db");
  if (btnResetDb) {
    btnResetDb.addEventListener("click", () => {
      if (confirm("Reset all 12 database collections to default demo state?")) {
        store.reset();
        soundService.playSuccessChime();
        renderApp();
      }
    });
  }

  const btnResetFromInspector = document.getElementById("btn-reset-db-from-inspector");
  if (btnResetFromInspector) {
    btnResetFromInspector.addEventListener("click", () => {
      store.reset();
      renderApp();
    });
  }

  // Audio Toggle
  const btnToggleAudio = document.getElementById("btn-toggle-audio-mute");
  if (btnToggleAudio) {
    btnToggleAudio.addEventListener("click", () => {
      appState.isAudioMuted = !appState.isAudioMuted;
      soundService.isMuted = appState.isAudioMuted;
      renderApp();
    });
  }

  // Admin Export CSV
  const btnExportCsv = document.getElementById("btn-export-csv");
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
      const patients = store.get("patients");
      const csvContent = "data:text/csv;charset=utf-8," + "ID,Name,Age,Pre-Condition,Status,Prefecture\n" +
        patients.map((p) => `${p.id},"${p.name}",${p.age},"${p.conditions.join(";")}",${p.status},${p.prefecture}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `mediconnect_japan_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Admin Export Audit
  const btnExportHipaa = document.getElementById("btn-export-hipaa-audit");
  if (btnExportHipaa) {
    btnExportHipaa.addEventListener("click", () => {
      alert("📄 [HIPAA & JAPAN PMDA AUDIT EXPORT]\n\nAudit Ledger Verified: 100% Compliant.\nTotal Security Events: " + store.getAuditLogs().length + "\nEncryption: AES-256 GCM\nSession Integrity: Signed & Verified.");
    });
  }

  // ==========================================================
  // Tourist Guide Event Listeners
  // ==========================================================
  // 1. Tourist Sub-Tabs
  document.querySelectorAll("[data-tourist-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      appState.tabs.tourist = tab.dataset.touristTab;
      renderApp();
    });
  });

  // 2. City Filters
  document.querySelectorAll("[data-filter-city]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.touristState.filterCity = btn.dataset.filterCity;
      renderApp();
    });
  });

  // 3. Language Selector
  const selTouristLang = document.getElementById("select-tourist-language");
  if (selTouristLang) {
    selTouristLang.addEventListener("change", (e) => {
      appState.touristState.selectedLang = e.target.value;
      renderApp();
    });
  }

  // 4. Audio Guide for Places
  document.querySelectorAll(".btn-read-place-guide").forEach((btn) => {
    btn.addEventListener("click", () => {
      const place = store.find("tourist_places", btn.dataset.placeId);
      if (place) {
        soundService.playReminderChime();
        soundService.speak(`${place.name} in ${place.city}. ${place.description}. Walking effort is: ${place.walking_effort}. Resting benches are available: ${place.resting_benches}. Nearest emergency aid: ${place.nearest_hospital}.`, "en-US");
      }
    });
  });

  // 5. Taxi Destination Card Display
  document.querySelectorAll(".btn-show-taxi-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const place = store.find("tourist_places", btn.dataset.placeId);
      if (place) {
        soundService.speak(place.taxi_instruction, "ja-JP");
        alert(`🚖 [JAPAN TAXI DRIVER CARD]\n\nShow this screen to your taxi driver:\n\n「${place.taxi_instruction}」\n\nDestination: ${place.name} (${place.name_ja})\nCity: ${place.city} (${place.area})`);
      }
    });
  });

  // 6. Speak Phrase in Japanese
  document.querySelectorAll(".btn-speak-phrase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const jaText = btn.dataset.textJa;
      soundService.speak(jaText, "ja-JP");
    });
  });

  // 7. Show Phrase Card to Japanese Local / Staff
  document.querySelectorAll(".btn-show-phrase-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ja = btn.dataset.phraseJa;
      const en = btn.dataset.phraseEn;
      const romaji = btn.dataset.phraseRomaji;
      soundService.speak(ja, "ja-JP");
      alert(`🇯🇵 [COMMUNICATION CARD FOR STAFF / LOCAL]\n\nShow this to train staff or locals:\n\n「${ja}」\n\nPronunciation: ${romaji}\nMeaning: "${en}"`);
    });
  });

  // 8. Custom Tourist Voice / Text Translator
  const btnTranslateCustom = document.getElementById("btn-translate-tourist-custom");
  if (btnTranslateCustom) {
    btnTranslateCustom.addEventListener("click", () => {
      const input = document.getElementById("input-tourist-custom-text");
      const text = input ? input.value.trim() : "";
      if (!text) {
        alert("Please enter a sentence to translate.");
        return;
      }

      // Keyword-guided intelligent medical & travel dictionary
      let jaText = "すみません、お手伝いいただけますか？";
      let romaji = "Sumimasen, otetsudai itadakemasu ka?";

      const lower = text.toLowerCase();
      if (lower.includes("pharmacy") || lower.includes("medicine") || lower.includes("pill")) {
        jaText = "近くに薬局、またはドラッグストアはありますか？薬が必要です。";
        romaji = "Chikaku ni yakkyoku, matawa doraggusutoa wa arimasu ka? Kusuri ga hitsuyō desu.";
      } else if (lower.includes("doctor") || lower.includes("hospital") || lower.includes("clinic")) {
        jaText = "英語が通じる病院または診療所を教えていただけますか？";
        romaji = "Eigo ga tsūjiru byōin matawa shinryōjo o oshiete itadakemasu ka?";
      } else if (lower.includes("chest") || lower.includes("heart") || lower.includes("pain")) {
        jaText = "胸が痛みます。心臓の持病があります。すぐに救急車を呼んでください。";
        romaji = "Mune ga itamimasu. Shinzō no jibyō ga arimasu. Sugu ni kyūkyūsha o yonde kudasai.";
      } else if (lower.includes("elevator") || lower.includes("wheelchair") || lower.includes("stairs")) {
        jaText = "車椅子用のエレベーターはどちらですか？階段の利用が難しいです。";
        romaji = "Kurumaisu-yō no erebētā wa dochira desu ka? Kaidan no riyō ga muzukashii desu.";
      } else if (lower.includes("sugar") || lower.includes("diabetes") || lower.includes("diabetic")) {
        jaText = "私は糖尿病患者です。低血糖用の飴または糖分が必要です。";
        romaji = "Watashi wa tōnyōbyō kanja desu. Teikettō-yō no ame matawa tōbun ga hitsuyō desu.";
      } else if (lower.includes("toilet") || lower.includes("restroom") || lower.includes("bathroom")) {
        jaText = "多機能トイレ（バリアフリートイレ）はどこにありますか？";
        romaji = "Takinō toire (bariafurī toire) wa doko ni arimasu ka?";
      } else if (lower.includes("water") || lower.includes("drink")) {
        jaText = "薬を飲むための白湯、またはお水をいただけますでしょうか？";
        romaji = "Kusuri o nomu tame no sayu, matawa omizu o itadakemasu deshō ka?";
      } else {
        jaText = `「${text}」について尋ねたいのですが、日本語でお手伝いいただけますか？`;
        romaji = `"${text}" ni tsuite tazunetai no desu ga, nihongo de otetsudai itadakemasu ka?`;
      }

      const resBox = document.getElementById("tourist-translation-result");
      const outJa = document.getElementById("out-ja-text");
      const outRomaji = document.getElementById("out-romaji-text");

      if (resBox && outJa && outRomaji) {
        resBox.style.display = "block";
        outJa.innerText = jaText;
        outRomaji.innerText = romaji;
      }

      soundService.speak(jaText, "ja-JP");
    });
  }

  // Replay custom speech
  const btnReplayJa = document.getElementById("btn-play-custom-ja-speech");
  if (btnReplayJa) {
    btnReplayJa.addEventListener("click", () => {
      const outJa = document.getElementById("out-ja-text");
      if (outJa && outJa.innerText !== "--") {
        soundService.speak(outJa.innerText, "ja-JP");
      }
    });
  }

  // Fullscreen custom card
  const btnShowCustomCard = document.getElementById("btn-show-fullscreen-custom-card");
  if (btnShowCustomCard) {
    btnShowCustomCard.addEventListener("click", () => {
      const outJa = document.getElementById("out-ja-text");
      const outRomaji = document.getElementById("out-romaji-text");
      if (outJa) {
        soundService.speak(outJa.innerText, "ja-JP");
        alert(`🇯🇵 [COMMUNICATION CARD FOR STAFF / LOCAL]\n\n「${outJa.innerText}」\n\nPronunciation: ${outRomaji.innerText}`);
      }
    });
  }

  // 9. Emergency 119 Quick SOS
  const trigger119Tour = () => {
    soundService.playEmergencyAlarm();
    soundService.speak("119 Ambulance Alert Dispatched. GPS location and medical triage card transmitted to Japan Emergency Medical Services.", "en-US");
    alert("🚑 [119 EMERGENCY AMBULANCE DISPATCH]\n\nJapan Emergency Services (119) Contacted!\n\nTourist: Arthur Miller (74yo, USA)\nCurrent Location: Tokyo / Kyoto Tourist District\nConditions: Essential Hypertension, Angina, T2D\nParamedic Protocol: Oxygen + ECG Triage Assigned.");
  };

  const btnTourQuickSos = document.getElementById("btn-tourist-quick-sos");
  if (btnTourQuickSos) btnTourQuickSos.addEventListener("click", trigger119Tour);

  const btnTour119 = document.getElementById("btn-tourist-dispatch-119");
  if (btnTour119) btnTour119.addEventListener("click", trigger119Tour);

  // 10. JNTO Hotline
  const triggerJnto = () => {
    soundService.playReminderChime();
    alert("📞 [JNTO JAPAN VISITOR HOTLINE]\n\nPhone: 050-3816-2720\nAvailability: 24 Hours / 365 Days\nLanguages: English, Chinese, Korean, Japanese\nProvides: Tourist emergency assistance, disaster updates, accident support.");
  };

  const btnJntoTop = document.getElementById("btn-tourist-jnto-call");
  if (btnJntoTop) btnJntoTop.addEventListener("click", triggerJnto);

  const btnJntoCard = document.getElementById("btn-tourist-call-jnto");
  if (btnJntoCard) btnJntoCard.addEventListener("click", triggerJnto);

  // 11. Read Japanese Medical Summary Aloud for Paramedics
  const btnSpeakMedicalSummary = document.getElementById("btn-speak-japanese-medical-summary");
  if (btnSpeakMedicalSummary) {
    btnSpeakMedicalSummary.addEventListener("click", () => {
      const profile = store.data.tourist_profile || {};
      const summary = profile.japanese_medical_summary || "救急隊員の方へ。患者はアーサー・ミラー74歳です。高血圧と狭心症の持病があります。ペニシリンアレルギーがあります。";
      soundService.speak(summary, "ja-JP");
    });
  }

  // 12. Print / Save Medical Pass
  const btnPrintMedicalCard = document.getElementById("btn-print-tourist-medical-card");
  if (btnPrintMedicalCard) {
    btnPrintMedicalCard.addEventListener("click", () => {
      window.print();
    });
  }

  // 13. Call Hospital Desk
  document.querySelectorAll(".btn-call-hospital").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const phone = btn.dataset.phone;
      soundService.playReminderChime();
      alert(`🏥 [CALLING INTERNATIONAL DESK]\n\nHospital: ${name}\nPhone: ${phone}\nConnecting to Multilingual Emergency Reception...`);
    });
  });

  // 14. Universal Design Taxi Request Demo
  const btnReqTaxi = document.getElementById("btn-request-ud-taxi-demo");
  if (btnReqTaxi) {
    btnReqTaxi.addEventListener("click", () => {
      soundService.playSuccessChime();
      confetti({ particleCount: 50, spread: 60 });
      alert("🚖 [UNIVERSAL DESIGN TAXI DISPATCHED]\n\nJPN TAXI confirmed for Arthur Miller!\nVehicle: Low floor, wheelchair ramp equipped, non-slip entry.\nEstimated Arrival: 7 minutes.");
    });
  }

  // 15. Station Assistance Speak
  const btnStationAssist = document.getElementById("btn-station-assist-speak");
  if (btnStationAssist) {
    btnStationAssist.addEventListener("click", () => {
      const jaSpeech = "すみません、駅員さんに階段や乗車のサポートをお願いできますでしょうか？足腰に不安があります。";
      soundService.speak(jaSpeech, "ja-JP");
      alert(`🚉 [STATION STAFF ASSISTANCE REQUEST]\n\n「${jaSpeech}」\n\nSpoken aloud in Japanese to stationmaster!`);
    });
  }
}

// Subscribe to store updates for real-time reactivity
store.subscribe(() => {
  renderApp();
});

// Initial boot
renderApp();
