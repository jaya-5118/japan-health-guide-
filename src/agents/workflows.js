// ============================================================
// MediConnect Japan - Phase 6: 6 Antigravity AI Agent Workflows
// ============================================================
import { store } from "../db/store.js";
import { soundService } from "../services/audio.js";

export const AGENT_LOGS = [];

function logAgentExecution(agentName, trigger, action, details) {
  const logItem = {
    id: `agent_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    agentName,
    trigger,
    action,
    details
  };
  AGENT_LOGS.unshift(logItem);
  if (AGENT_LOGS.length > 50) AGENT_LOGS.pop();
  console.log(`[AI Agent: ${agentName}]`, action, details);
  store.notify("agent_log", logItem);
}

// ------------------------------------------------------------
// WORKFLOW 1: Medication Reminder & Adherence Escalation
// ------------------------------------------------------------
export function runWorkflowMedicationReminder(medicationId = "med_amlodipine") {
  const med = store.find("medications", medicationId);
  const pat = store.find("patients", med?.patient_id || "pat_takeshi");
  const cg = store.find("caregivers", pat?.primary_caregiver_id || "cg_yuki");

  logAgentExecution(
    "Medication Adherence Agent",
    `Scheduled time ${med.times_per_day[0]} reached for ${med.name}`,
    "Voice reminder dispatched to patient",
    `Patient: ${pat.name}, Med: ${med.name} (${med.dosage})`
  );

  // Play audio reminder & speak
  soundService.playReminderChime();
  soundService.speak(`Takeshi-san, it is time for your morning medication: ${med.name} 5 milligrams. Please take it with water.`, "en-US");

  // Create patient alert
  const alert = store.insert("alerts", {
    patient_id: pat.id,
    recipient_role: "patient",
    type: "medication_reminder",
    priority: "normal",
    title: `Time to take ${med.name}`,
    title_jp: `${med.name_jp} の服用時間です`,
    message: `Scheduled dose: ${med.dosage}. ${med.instructions}`,
    is_read: false,
    requires_action: true,
    action_type: "take_medication",
    medication_id: med.id
  });

  return alert;
}

// ------------------------------------------------------------
// WORKFLOW 2: Emergency Symptom Detection & 119 Ambulance Call
// ------------------------------------------------------------
export function runWorkflowEmergencySymptomDetection(symptomText, locationCoords = { lat: 40.6031, lng: 140.4641 }) {
  const lower = symptomText.toLowerCase();
  let severity = "yellow";
  let isRedEmergency = false;

  // Emergency keywords in English & Japanese
  if (
    lower.includes("chest pain") ||
    lower.includes("heart") ||
    lower.includes("shortness of breath") ||
    lower.includes("can't breathe") ||
    lower.includes("stroke") ||
    lower.includes("numbness") ||
    lower.includes("胸が痛い") ||
    lower.includes("息苦しい")
  ) {
    severity = "red";
    isRedEmergency = true;
  } else if (lower.includes("dizziness") || lower.includes("faint") || lower.includes("めまい") || lower.includes("high bp")) {
    severity = "yellow";
  }

  const pat = store.find("patients", "pat_takeshi");
  const cg = store.find("caregivers", pat.primary_caregiver_id);
  const doc = store.find("doctors", pat.assigned_doctor_id);

  // 1. Record Symptom
  const symptomRecord = store.insert("symptoms", {
    patient_id: pat.id,
    symptom_text: symptomText,
    symptom_jp: isRedEmergency ? "激しい胸の痛み、息切れ" : "めまい・ふらつき",
    severity,
    nlp_confidence: 0.96,
    recommended_action: isRedEmergency ? "Immediate 119 ambulance dispatch & caregiver alert" : "Rest in sitting position and monitor vitals",
    reported_via: "voice",
    timestamp: new Date().toISOString(),
    reviewed_by_doctor: false
  });

  // 2. Update patient health status
  store.update("patients", pat.id, {
    status: severity,
    status_reason: `Reported symptom: "${symptomText}" (${severity.toUpperCase()})`
  });

  if (isRedEmergency) {
    soundService.playEmergencyAlarm();
    soundService.speak("Predefined emergency symptom detected. 119 emergency workflow prototype initiated. Caregiver and clinic doctor are being notified.", "en-US");

    // Create Caregiver High-Priority Alert
    store.insert("alerts", {
      patient_id: pat.id,
      recipient_role: "caregiver",
      type: "emergency_red",
      priority: "critical",
      title: `🚨 EMERGENCY PROTOCOL: ${pat.name} reported severe chest pain!`,
      title_jp: `🚨 緊急プロトコル: 佐藤健様が激しい胸の痛みを訴えています！`,
      message: `Location: ${pat.address} (GPS: ${locationCoords.lat}, ${locationCoords.lng}). Predefined emergency symptom detected. 119 emergency workflow prototype triggered. Designed for future 119 integration.`,
      is_read: false,
      requires_action: true,
      action_type: "call_119",
      data: {
        gps: locationCoords,
        summary: "78yo male, History: Hypertension, T2D. Meds: Amlodipine, Lisinopril, Metformin. Allergies: Penicillin."
      }
    });

    // Create Doctor Alert
    store.insert("alerts", {
      patient_id: pat.id,
      recipient_role: "doctor",
      type: "emergency_doctor",
      priority: "critical",
      title: `🚨 RED ALERT: ${pat.name} - Acute Chest Pain`,
      title_jp: `🚨 重篤警告: 佐藤健様 急性胸痛`,
      message: `119 dispatched to ${pat.address}. Clinic doctor Tanaka notified.`,
      is_read: false,
      requires_action: true
    });

    logAgentExecution(
      "Emergency Triage Agent",
      `Symptom input: "${symptomText}"`,
      "Triggered RED Protocol: 119 Ambulance Alert + GPS + Summary sent",
      `Notified Caregiver Yuki (${cg.phone}) and Dr. Tanaka (${doc.phone})`
    );
  } else {
    soundService.playReminderChime();
    store.insert("alerts", {
      patient_id: pat.id,
      recipient_role: "caregiver",
      type: "vitals_caution",
      priority: "warning",
      title: `Symptom Caution: ${pat.name}`,
      title_jp: `症状報告: 佐藤健様`,
      message: `Patient reported: "${symptomText}". Vital sign monitoring recommended.`,
      is_read: false
    });

    logAgentExecution(
      "Symptom Triage Agent",
      `Symptom input: "${symptomText}"`,
      "Classified severity as YELLOW / CAUTION",
      "Caregiver alerted to check hydration and rest"
    );
  }

  return symptomRecord;
}

// ------------------------------------------------------------
// WORKFLOW 3: Rural Doctor -> Tokyo Specialist Referral
// ------------------------------------------------------------
export function runWorkflowSpecialistReferral({
  patientId = "pat_takeshi",
  referringDoctorId = "doc_tanaka",
  specialistDoctorId = "doc_nakamura",
  priority = "Urgent",
  reason = "Persistently elevated systolic blood pressure (138-142 mmHg) on dual-therapy. Titration and specialist review requested.",
  clinicalSummary = "78-year-old male with 8-year history of essential hypertension and T2D. Currently on Amlodipine 5mg and Lisinopril 10mg. Morning BP consistently > 135/85 mmHg. Mild dizziness noted."
}) {
  const pat = store.find("patients", patientId);
  const specialist = store.find("doctors", specialistDoctorId);
  const referringDoc = store.find("doctors", referringDoctorId);

  const referral = store.insert("referrals", {
    patient_id: pat.id,
    referring_doctor_id: referringDoc.id,
    specialist_doctor_id: specialist.id,
    specialty: specialist.specialty,
    priority,
    status: "Accepted",
    reason,
    clinical_summary: clinicalSummary,
    patient_consented: true,
    scheduled_telehealth_id: "th_20260915_01",
    created_at: new Date().toISOString()
  });

  // Create notification for Specialist in Tokyo
  store.insert("alerts", {
    patient_id: pat.id,
    recipient_role: "doctor",
    type: "referral_received",
    priority: "warning",
    title: `New Referral: ${pat.name} (${pat.age}yo) from ${referringDoc.name}`,
    title_jp: `新規紹介状: 田中医師より 佐藤健様 (78歳)`,
    message: `Condition: ${reason}. Telehealth scheduled for Sept 15, 14:00.`,
    is_read: false,
    requires_action: true
  });

  // Notify Patient & Caregiver
  store.insert("alerts", {
    patient_id: pat.id,
    recipient_role: "patient",
    type: "appointment_booked",
    priority: "normal",
    title: `Specialist Telehealth Booked with ${specialist.name}`,
    title_jp: `東京心血管専門医 (${specialist.name_kanji}) のオンライン診療が確定しました`,
    message: `Scheduled for Sept 15, 2:00 PM. AI Translation will be active.`,
    is_read: false
  });

  store.insert("alerts", {
    patient_id: pat.id,
    recipient_role: "caregiver",
    type: "referral_update",
    priority: "normal",
    title: `Referral Confirmed: ${specialist.name}`,
    title_jp: `専門医紹介完了: ${specialist.name_kanji}`,
    message: `Dr. Nakamura accepted referral for Takeshi. Consultation Sept 15, 14:00.`,
    is_read: false
  });

  soundService.playSuccessChime();

  logAgentExecution(
    "Rural-to-Urban Specialist Match Agent",
    `Dr. Tanaka created referral for ${pat.name}`,
    `Auto-matched with ${specialist.name} (Tokyo University Cardio Center)`,
    `Wait time: 2 days. Telehealth consultation pre-booked with bilingual AI pipeline.`
  );

  return referral;
}

// ------------------------------------------------------------
// WORKFLOW 4: Real-Time AI Translation (Telehealth)
// ------------------------------------------------------------
const MEDICAL_TRANSLATIONS = {
  ja_to_en: {
    "あなたの血圧はまだ高いです。塩分を減らしてください。": "Your blood pressure is still high. Please reduce your salt intake.",
    "最近めまいや息切れはありましたか？": "Have you had any dizziness or shortness of breath recently?",
    "リシノプリルを10mgから15mgに増量しましょう。": "Let's increase Lisinopril from 10mg to 15mg.",
    "毎日朝一番に血圧を測って記録してください。": "Please measure and log your blood pressure every morning first thing.",
    "こんにちは、佐藤さん。体調はいかがですか？": "Hello Mr. Sato. How are you feeling today?"
  },
  en_to_ja: {
    "I have been eating less salt.": "塩分を少なくしています。",
    "I felt a little dizzy when standing up two days ago.": "2日前に立ち上がった時に少しめまいがしました。",
    "I took my morning pills after breakfast.": "朝食後に朝の薬を飲みました。",
    "Thank you doctor, I will take the new dosage.": "先生、ありがとうございます。新しい用量で服用します。",
    "Good afternoon Dr. Nakamura.": "中村先生、こんにちは。"
  }
};

export function runWorkflowAiTranslation(text, sourceLang = "ja-JP") {
  let translated = "";
  if (sourceLang.startsWith("ja")) {
    translated = MEDICAL_TRANSLATIONS.ja_to_en[text] || `[AI Medical Translation]: "${text}"`;
  } else {
    translated = MEDICAL_TRANSLATIONS.en_to_ja[text] || `[AI 医療翻訳]: 「${text}」`;
  }

  logAgentExecution(
    "Telehealth Medical Translation Agent",
    `Audio stream received in ${sourceLang}`,
    `Google Cloud Medical NLP translated -> ${sourceLang.startsWith("ja") ? "en-US" : "ja-JP"}`,
    `"${text}" -> "${translated}"`
  );

  return translated;
}

// ------------------------------------------------------------
// WORKFLOW 5: Caregiver Backup Activation (Shift Handoff)
// ------------------------------------------------------------
export function runWorkflowCaregiverHandoff(primaryCaregiverId = "cg_yuki", status = "day_off") {
  const primary = store.find("caregivers", primaryCaregiverId);
  const backup = store.find("caregivers", primary.backup_id || "cg_kenji");
  const pat = store.find("patients", "pat_takeshi");

  // Update primary status
  store.update("caregivers", primary.id, {
    availability_status: status
  });

  // Activate backup
  store.update("caregivers", backup.id, {
    availability_status: "on_shift"
  });

  // Update patient's active primary caregiver to backup during this shift
  store.update("patients", pat.id, {
    primary_caregiver_id: backup.id,
    backup_caregiver_id: primary.id
  });

  // Send Alert to Backup Caregiver (Kenji)
  store.insert("alerts", {
    patient_id: pat.id,
    recipient_role: "caregiver",
    type: "shift_handoff",
    priority: "warning",
    title: `Caregiver Shift Activated: You are on duty for ${pat.name}`,
    title_jp: `担当シフト交代: 佐藤健様の主介護者になりました`,
    message: `${primary.name} has scheduled a Day Off. All patient alerts and medication escalations are routed to you.`,
    is_read: false,
    requires_action: true
  });

  // Send notification to Takeshi
  store.insert("alerts", {
    patient_id: pat.id,
    recipient_role: "patient",
    type: "caregiver_update",
    priority: "normal",
    title: `${backup.name} is on duty for you today`,
    title_jp: `本日は健二さんがサポートを担当します`,
    message: `Your son Kenji in Hirosaki is receiving all your health updates today.`,
    is_read: false
  });

  soundService.playSuccessChime();

  logAgentExecution(
    "Caregiver Autonomous Handoff Agent",
    `${primary.name} toggled availability status to ${status.toUpperCase()}`,
    `Activated backup caregiver ${backup.name} (Hirosaki, Aomori)`,
    `Routing table updated: alerts for Takeshi now target ${backup.name} (${backup.phone})`
  );

  return { primary, backup };
}

// ------------------------------------------------------------
// WORKFLOW 6: Vital Signs Abnormality Spike Detection
// ------------------------------------------------------------
export function runWorkflowVitalsSpikeDetection(systolic, diastolic, pulse = 75) {
  const pat = store.find("patients", "pat_takeshi");
  const cg = store.find("caregivers", pat.primary_caregiver_id);
  const isSpike = systolic >= 150 || diastolic >= 95;
  const isCaution = systolic >= 135 || diastolic >= 85;

  const severity = isSpike ? "red" : isCaution ? "yellow" : "green";

  const record = store.insert("vital_signs", {
    patient_id: pat.id,
    type: "blood_pressure",
    systolic,
    diastolic,
    pulse,
    is_abnormal: isCaution,
    severity,
    notes: isSpike ? "Critical BP spike detected" : isCaution ? "Elevated reading" : "Optimal target range",
    timestamp: new Date().toISOString()
  });

  if (isSpike) {
    soundService.playEmergencyAlarm();
    store.insert("alerts", {
      patient_id: pat.id,
      recipient_role: "caregiver",
      type: "vitals_spike",
      priority: "critical",
      title: `🚨 Critical BP Spike: ${systolic}/${diastolic} mmHg`,
      title_jp: `🚨 血圧急上昇警告: ${systolic}/${diastolic} mmHg`,
      message: `Takeshi Sato reported systolic ${systolic} mmHg. Advise immediate sitting rest, recheck in 15 mins, or clinic contact.`,
      is_read: false,
      requires_action: true
    });

    logAgentExecution(
      "Vitals Anomaly Detection Agent",
      `New BP recorded: ${systolic}/${diastolic} mmHg`,
      "Triggered CRITICAL vitals alarm",
      `Alerted caregiver ${cg.name} and Dr. Tanaka`
    );
  } else if (isCaution) {
    soundService.playReminderChime();
    store.insert("alerts", {
      patient_id: pat.id,
      recipient_role: "caregiver",
      type: "vitals_caution",
      priority: "warning",
      title: `Elevated BP: ${systolic}/${diastolic} mmHg`,
      title_jp: `血圧注意: ${systolic}/${diastolic} mmHg`,
      message: `Takeshi Sato's BP is slightly elevated. AI recommendation: reduce sodium, maintain hydration.`,
      is_read: false
    });

    logAgentExecution(
      "Vitals Anomaly Detection Agent",
      `New BP recorded: ${systolic}/${diastolic} mmHg`,
      "Flagged as CAUTION (Mildly elevated)",
      "Logged dietary recommendation (sodium reduction) and notified caregiver"
    );
  }

  return record;
}
