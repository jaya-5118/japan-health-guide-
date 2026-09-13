// ============================================================
// MediConnect Japan - 12 Core Collections & Test Seed Data
// ============================================================

export const INITIAL_DATABASE = {
  // 1. Patients Collection
  patients: [
    {
      id: "pat_takeshi",
      name: "Takeshi Sato",
      name_kanji: "佐藤 健",
      age: 78,
      dob: "1948-03-15",
      gender: "Male",
      blood_type: "A+",
      prefecture: "Aomori",
      city: "Hirosaki",
      address: "12-4 Sakura-machi, Hirosaki, Aomori 036-8356",
      gps: { lat: 40.6031, lng: 140.4641 },
      phone: "+81 172-33-8821",
      emergency_contact: "Yuki Sato (+81 90-4412-9901)",
      primary_caregiver_id: "cg_yuki",
      backup_caregiver_id: "cg_kenji",
      assigned_doctor_id: "doc_tanaka",
      clinic_id: "cl_aomori_rural",
      status: "yellow", // green, yellow, orange, red
      status_reason: "Elevated morning blood pressure (142/90 mmHg)",
      conditions: ["Essential Hypertension", "Type 2 Diabetes Mellitus", "Mild Osteoarthritis"],
      allergies: ["Penicillin", "Sulfa drugs"],
      preferred_language: "English / Simple Japanese",
      created_at: "2026-09-01T08:00:00Z",
      updated_at: "2026-09-13T08:00:00Z"
    },
    {
      id: "pat_haruto",
      name: "Haruto Takahashi",
      name_kanji: "高橋 陽翔",
      age: 82,
      dob: "1944-07-22",
      gender: "Male",
      blood_type: "O+",
      prefecture: "Aomori",
      city: "Kuroishi",
      address: "5-8 Nakamachi, Kuroishi, Aomori",
      gps: { lat: 40.6433, lng: 140.5982 },
      phone: "+81 172-52-1144",
      emergency_contact: "Kenji Takahashi (+81 80-1123-5567)",
      primary_caregiver_id: "cg_yuki",
      backup_caregiver_id: "cg_kenji",
      assigned_doctor_id: "doc_tanaka",
      clinic_id: "cl_aomori_rural",
      status: "green",
      status_reason: "Vitals stable, medication adherence 100%",
      conditions: ["Post-stroke rehabilitation", "Hyperlipidemia"],
      allergies: ["None known"],
      preferred_language: "Japanese",
      created_at: "2026-08-15T09:30:00Z",
      updated_at: "2026-09-12T17:00:00Z"
    }
  ],

  // 2. Caregivers Collection
  caregivers: [
    {
      id: "cg_yuki",
      name: "Yuki Sato",
      name_kanji: "佐藤 由紀",
      relationship: "Daughter",
      location: "Tokyo (Minato-ku)",
      phone: "+81 90-4412-9901",
      email: "yuki@demo.com",
      assigned_patient_ids: ["pat_takeshi", "pat_haruto"],
      availability_status: "on_shift", // 'on_shift', 'day_off', 'off_duty', 'on_leave'
      backup_id: "cg_kenji",
      availability_schedule: {
        monday: "on_shift",
        tuesday: "on_shift",
        wednesday: "on_shift",
        thursday: "on_shift",
        friday: "on_shift",
        saturday: "day_off",
        sunday: "on_shift"
      },
      response_time_avg_min: 4.2,
      satisfaction_score: 4.9,
      burnout_risk_score: 32, // out of 100
      created_at: "2026-09-01T08:00:00Z",
      updated_at: "2026-09-13T08:00:00Z"
    },
    {
      id: "cg_kenji",
      name: "Kenji Sato",
      name_kanji: "佐藤 健二",
      relationship: "Son (Local)",
      location: "Aomori (Hirosaki)",
      phone: "+81 80-5591-2234",
      email: "kenji@demo.com",
      assigned_patient_ids: ["pat_takeshi"],
      availability_status: "available_backup",
      backup_id: "cg_yuki",
      availability_schedule: {
        saturday: "on_shift",
        sunday: "backup"
      },
      response_time_avg_min: 6.8,
      satisfaction_score: 4.8,
      burnout_risk_score: 18,
      created_at: "2026-09-01T08:00:00Z",
      updated_at: "2026-09-13T08:00:00Z"
    }
  ],

  // 3. Medications Collection
  medications: [
    {
      id: "med_amlodipine",
      patient_id: "pat_takeshi",
      name: "Amlodipine Besylate",
      name_jp: "アムロジピン (Amlodipine)",
      dosage: "5mg",
      instructions: "Take with water every morning after breakfast",
      times_per_day: ["08:00"],
      stock_remaining: 10,
      refill_due_date: "2026-09-18",
      prescribed_by: "doc_tanaka",
      status: "active", // active, paused, discontinued
      today_status: "due", // taken, due, upcoming, missed
      last_taken: "2026-09-12T08:12:00Z",
      adherence_count: 27,
      missed_count: 1,
      color: "#2563EB",
      shape: "Round tablet",
      created_at: "2026-09-01T08:00:00Z",
      updated_at: "2026-09-13T07:30:00Z"
    },
    {
      id: "med_lisinopril",
      patient_id: "pat_takeshi",
      name: "Lisinopril",
      name_jp: "リシノプリル (Lisinopril)",
      dosage: "10mg",
      instructions: "Take in the evening before bedtime",
      times_per_day: ["20:00"],
      stock_remaining: 18,
      refill_due_date: "2026-09-28",
      prescribed_by: "doc_tanaka",
      status: "active",
      today_status: "upcoming",
      last_taken: "2026-09-12T20:05:00Z",
      adherence_count: 28,
      missed_count: 0,
      color: "#7C3AED",
      shape: "Oval tablet",
      created_at: "2026-09-01T08:00:00Z",
      updated_at: "2026-09-13T07:30:00Z"
    },
    {
      id: "med_metformin",
      patient_id: "pat_takeshi",
      name: "Metformin Hydrochloride",
      name_jp: "メトホルミン (Metformin)",
      dosage: "500mg",
      instructions: "Take with morning and evening meals",
      times_per_day: ["08:00", "20:00"],
      stock_remaining: 24,
      refill_due_date: "2026-09-25",
      prescribed_by: "doc_tanaka",
      status: "active",
      today_status: "due",
      last_taken: "2026-09-12T08:15:00Z",
      adherence_count: 55,
      missed_count: 2,
      color: "#059669",
      shape: "White oblong",
      created_at: "2026-09-01T08:00:00Z",
      updated_at: "2026-09-13T07:30:00Z"
    }
  ],

  // 4. Doctors Collection
  doctors: [
    {
      id: "doc_tanaka",
      name: "Dr. Hiroshi Tanaka",
      name_kanji: "田中 浩 医師",
      specialty: "General Internal Medicine & Geriatrics",
      license_no: "JP-MED-849201",
      clinic_id: "cl_aomori_rural",
      email: "tanaka@demo.com",
      phone: "+81 172-88-2910",
      location: "Hirosaki, Aomori",
      assigned_patient_ids: ["pat_takeshi", "pat_haruto"],
      languages: ["Japanese", "Basic English"],
      created_at: "2026-08-01T09:00:00Z"
    },
    {
      id: "doc_nakamura",
      name: "Dr. Akemi Nakamura",
      name_kanji: "中村 明美 医師",
      specialty: "Cardiology & Vascular Medicine",
      license_no: "JP-MED-994012",
      clinic_id: "cl_tokyo_cardio",
      email: "nakamura@demo.com",
      phone: "+81 3-5582-4400",
      location: "Minato-ku, Tokyo (Tokyo Cardiovascular Center)",
      assigned_patient_ids: [],
      languages: ["Japanese", "Fluent English"],
      average_wait_days: 2,
      created_at: "2026-07-15T09:00:00Z"
    }
  ],

  // 5. Clinics Collection
  clinics: [
    {
      id: "cl_aomori_rural",
      name: "Tsugaru Mountain Community Clinic",
      name_jp: "津軽地域ケアクリニック",
      type: "Rural Primary Care Clinic",
      address: "44-2 Oaza-Sakura, Hirosaki-shi, Aomori",
      phone: "+81 172-88-2900",
      distance_km_to_specialist: 680,
      emergency_heliport: false,
      created_at: "2026-01-10T00:00:00Z"
    },
    {
      id: "cl_tokyo_cardio",
      name: "Tokyo Advanced Cardiovascular Institute",
      name_jp: "東京先端心血管センター",
      type: "Tertiary Academic Hospital",
      address: "7-3-1 Hongo, Bunkyo-ku, Tokyo",
      phone: "+81 3-5582-4000",
      distance_km_to_specialist: 0,
      emergency_heliport: true,
      created_at: "2026-01-10T00:00:00Z"
    }
  ],

  // 6. Symptoms Collection
  symptoms: [
    {
      id: "symp_001",
      patient_id: "pat_takeshi",
      symptom_text: "Mild dizziness upon standing up after morning gardening",
      symptom_jp: "朝の庭仕事後、立ち上がった際に軽いめまい",
      severity: "yellow", // green, yellow, orange, red
      nlp_confidence: 0.92,
      recommended_action: "Hydrate, rest in sitting position, monitor BP",
      reported_via: "voice",
      timestamp: "2026-09-12T14:30:00Z",
      reviewed_by_doctor: true,
      doctor_notes: "Advised hydration and slow postural change"
    }
  ],

  // 7. Vital Signs Collection
  vital_signs: [
    {
      id: "vs_101",
      patient_id: "pat_takeshi",
      type: "blood_pressure",
      systolic: 140,
      diastolic: 88,
      pulse: 74,
      is_abnormal: true,
      severity: "yellow",
      notes: "Morning reading before breakfast",
      timestamp: "2026-09-11T08:00:00Z"
    },
    {
      id: "vs_102",
      patient_id: "pat_takeshi",
      type: "blood_pressure",
      systolic: 142,
      diastolic: 90,
      pulse: 76,
      is_abnormal: true,
      severity: "yellow",
      notes: "Morning reading",
      timestamp: "2026-09-12T08:00:00Z"
    },
    {
      id: "vs_103",
      patient_id: "pat_takeshi",
      type: "blood_pressure",
      systolic: 138,
      diastolic: 88,
      pulse: 72,
      is_abnormal: true,
      severity: "yellow",
      notes: "Morning reading today",
      timestamp: "2026-09-13T08:00:00Z"
    },
    {
      id: "vs_104",
      patient_id: "pat_takeshi",
      type: "blood_glucose",
      value: 128, // mg/dL fasting
      unit: "mg/dL",
      is_abnormal: false,
      severity: "green",
      notes: "Fasting glucose within target range (80-130)",
      timestamp: "2026-09-13T07:45:00Z"
    }
  ],

  // 8. Telehealth Sessions Collection
  telehealth_sessions: [
    {
      id: "th_20260915_01",
      patient_id: "pat_takeshi",
      doctor_id: "doc_nakamura",
      referring_doctor_id: "doc_tanaka",
      status: "scheduled", // scheduled, active, completed, cancelled
      scheduled_time: "2026-09-15T14:00:00+09:00",
      reason: "Cardiology consultation for resistant hypertension & medication optimization",
      meeting_url: "https://meet.mediconnect.jp/call/takeshi-cardio-915",
      room_pin: "MC-7821",
      bilingual_mode: true,
      primary_lang_doctor: "ja-JP",
      primary_lang_patient: "en-US",
      transcript: [],
      doctor_prescriptions_added: [],
      clinical_notes: ""
    }
  ],

  // 9. Referrals Collection
  referrals: [
    {
      id: "ref_001",
      patient_id: "pat_takeshi",
      referring_doctor_id: "doc_tanaka",
      specialist_doctor_id: "doc_nakamura",
      specialty: "Cardiology",
      priority: "Urgent", // Routine, Urgent, Emergency
      status: "Accepted", // Draft, Pending, Accepted, Completed, Declined
      reason: "Persistently elevated systolic BP (138-142 mmHg) on dual-therapy. Needs specialist titration review.",
      clinical_summary: "78yo male with 8-yr history of essential hypertension and T2D. Currently on Amlodipine 5mg and Lisinopril 10mg. Morning BP consistently > 135/85 mmHg. Mild postural dizziness reported Sept 12.",
      patient_consented: true,
      scheduled_telehealth_id: "th_20260915_01",
      created_at: "2026-09-13T08:30:00Z",
      updated_at: "2026-09-13T08:45:00Z"
    }
  ],

  // 10. Alerts & Notifications Collection
  alerts: [
    {
      id: "alt_501",
      patient_id: "pat_takeshi",
      recipient_role: "patient",
      type: "medication_reminder",
      priority: "normal",
      title: "Time for Morning Medication",
      title_jp: "朝のお薬の時間です",
      message: "Please take Amlodipine 5mg and Metformin 500mg with breakfast.",
      is_read: false,
      requires_action: true,
      action_type: "take_medication",
      created_at: "2026-09-13T08:00:00Z"
    },
    {
      id: "alt_502",
      patient_id: "pat_takeshi",
      recipient_role: "caregiver",
      type: "vitals_caution",
      priority: "warning",
      title: "BP Caution for Takeshi Sato",
      title_jp: "佐藤健様の血圧注意報",
      message: "Morning BP was 138/88 mmHg. 3-day average remains slightly above target.",
      is_read: true,
      requires_action: false,
      created_at: "2026-09-13T08:05:00Z"
    }
  ],

  // 11. Medical History Collection
  medical_history: [
    {
      id: "mh_01",
      patient_id: "pat_takeshi",
      category: "Chronic Condition",
      condition: "Essential Hypertension",
      diagnosed_date: "2018-05-12",
      diagnosed_by: "Dr. Hiroshi Tanaka",
      notes: "Well-managed until recent winter seasonal spikes. Target < 130/80 mmHg."
    },
    {
      id: "mh_02",
      patient_id: "pat_takeshi",
      category: "Chronic Condition",
      condition: "Type 2 Diabetes Mellitus",
      diagnosed_date: "2020-11-04",
      diagnosed_by: "Dr. Hiroshi Tanaka",
      notes: "HbA1c stable at 6.8%. Diet and Metformin 500mg bid."
    },
    {
      id: "mh_03",
      patient_id: "pat_takeshi",
      category: "Surgical History",
      condition: "Right Cataract Phacoemulsification",
      diagnosed_date: "2024-03-20",
      diagnosed_by: "Aomori Prefectural Central Hospital",
      notes: "Uncomplicated intraocular lens implantation."
    }
  ],

  // 12. Insurance Collection
  insurance: [
    {
      id: "ins_01",
      patient_id: "pat_takeshi",
      provider: "Japan National Health Insurance (国民健康保険)",
      policy_number: "JP-NHI-02-881920",
      coverage_type: "Late-Elderly Healthcare System (後期高齢者医療制度 - 10% co-pay)",
      copay_rate: "10%",
      valid_until: "2027-03-31",
      long_term_care_insured: true,
      care_need_level: "Support Level 1 (要支援1)",
      verified: true
    }
  ],

  // 13. Tourist Accessible Places Collection
  tourist_places: [
    {
      id: "tp_meiji_jingu",
      name: "Meiji Jingu & Yoyogi Sacred Forest",
      name_ja: "明治神宮",
      city: "Tokyo",
      area: "Shibuya / Harajuku",
      category: "Shrines & Nature",
      accessibility_score: "5/5 (Full Barrier-Free)",
      walking_effort: "Gentle & Flat",
      wheelchair_accessible: true,
      elevator_available: true,
      resting_benches: "Every 150m along main approach",
      nearest_hospital: "Tokyo Metropolitan Hiroo Hospital (10 min)",
      description: "Wide paved and smooth gravel paths surrounded by 100-year-old forest. Free wheelchair loans at North & South gates. Rest pavilions feature AED defibrillators, barrier-free restrooms, and air conditioning.",
      taxi_instruction: "明治神宮の原宿口（南参道）までお願いします (Please take me to Meiji Jingu Harajuku Gate South Approach)",
      image_badge: "Tokyo Shrine"
    },
    {
      id: "tp_kiyomizu",
      name: "Kiyomizu-dera Accessible Terrace",
      name_ja: "清水寺（バリアフリールート）",
      city: "Kyoto",
      area: "Higashiyama",
      category: "Historic Temples",
      accessibility_score: "4.5/5 (Special Elevator Route)",
      walking_effort: "Gentle Slope with Railings",
      wheelchair_accessible: true,
      elevator_available: true,
      resting_benches: "Tea pavilions with senior seating",
      nearest_hospital: "Kyoto University Hospital (15 min)",
      description: "Equipped with an elderly & wheelchair bypass slope and dedicated elevator reaching the world-famous wooden terrace. Rest areas offer hot green tea and traditional low-step seating.",
      taxi_instruction: "清水寺の防災道路（車椅子乗降所）までお願いします (Please take me to Kiyomizu-dera Barrier-Free Dropoff Point)",
      image_badge: "Kyoto Heritage"
    },
    {
      id: "tp_shinjuku_gyoen",
      name: "Shinjuku Gyoen Imperial Garden",
      name_ja: "新宿御苑",
      city: "Tokyo",
      area: "Shinjuku",
      category: "Imperial Gardens",
      accessibility_score: "5/5 (Paved & Extremely Flat)",
      walking_effort: "Very Easy",
      wheelchair_accessible: true,
      elevator_available: true,
      resting_benches: "Over 80 benches & 3 shaded pavilions",
      nearest_hospital: "Tokyo Medical University Hospital (8 min)",
      description: "A tranquil 144-acre oasis with wide asphalt walkways, flat Japanese traditional gardens, large greenhouse with automatic ramps, and multiple English-speaking information desks.",
      taxi_instruction: "新宿御苑の新宿門までお願いします (Please take me to Shinjuku Gyoen Shinjuku Gate)",
      image_badge: "Tokyo Gardens"
    },
    {
      id: "tp_kenrokuen",
      name: "Kenroku-en Senior Promenade",
      name_ja: "兼六園",
      city: "Kanazawa",
      area: "Ishikawa",
      category: "Imperial Gardens",
      accessibility_score: "4.5/5 (Priority Senior Course)",
      walking_effort: "Gentle Inclines with Railings",
      wheelchair_accessible: true,
      elevator_available: false,
      resting_benches: "Historic tea houses with bench seating",
      nearest_hospital: "Kanazawa University Hospital (12 min)",
      description: "One of Japan's Three Great Gardens. Features a dedicated wheelchair & senior recommended loop that bypasses steep stone steps. Traditional tea houses provide chairs for seniors who cannot kneel on tatami.",
      taxi_instruction: "兼六園の桂坂口（観光案内所前）までお願いします (Please take me to Kenroku-en Katsurazaka Gate)",
      image_badge: "Historic Garden"
    },
    {
      id: "tp_hakone_onsen",
      name: "Hakone Yumoto Barrier-Free Onsen",
      name_ja: "箱根湯本 温泉リトリート",
      city: "Hakone",
      area: "Kanagawa",
      category: "Wellness & Hot Springs",
      accessibility_score: "4.8/5 (Senior Adapted)",
      walking_effort: "Minimal Walking",
      wheelchair_accessible: true,
      elevator_available: true,
      resting_benches: "Thermal lounge with reclining chairs",
      nearest_hospital: "Hakone Town Clinic & Odawara Municipal Hospital",
      description: "Specially adapted hot spring baths with non-slip flooring, sturdy grab bars, and shallow steps into gentle mineral water (alkaline simple thermal spring suitable for elderly skin and circulation).",
      taxi_instruction: "箱根湯本温泉の駅前足湯・観光案内所までお願いします (Please take me to Hakone Yumoto Station Tourist Center)",
      image_badge: "Hot Springs"
    },
    {
      id: "tp_hirosaki_park",
      name: "Hirosaki Castle Scenic Park",
      name_ja: "弘前公園・弘前城",
      city: "Aomori",
      area: "Hirosaki",
      category: "Castles & Parks",
      accessibility_score: "4.7/5 (Flat Scenic Trails)",
      walking_effort: "Gentle Level Paths",
      wheelchair_accessible: true,
      elevator_available: false,
      resting_benches: "Benches every 100m overlooking moat",
      nearest_hospital: "Hirosaki University Hospital (5 min)",
      description: "Home of the famous cherry blossom moats and ancient cedar groves. Flat pathways, shaded cherry tunnels, and immediate proximity to northern Tohoku's premier university medical center.",
      taxi_instruction: "弘前公園の追手門口までお願いします (Please take me to Hirosaki Park Otemon Gate)",
      image_badge: "Aomori Castle"
    },
    {
      id: "tp_sensoji",
      name: "Senso-ji & Asakusa Promenade",
      name_ja: "浅草 浅草寺",
      city: "Tokyo",
      area: "Taito-ku",
      category: "Historic Temples",
      accessibility_score: "4.8/5 (Modern Temple Elevator)",
      walking_effort: "Flat Stone Paving",
      wheelchair_accessible: true,
      elevator_available: true,
      resting_benches: "Asakusa Culture & Tourist Center Lounge (Floor 8)",
      nearest_hospital: "Asakusa Hospital & Juntendo University Hospital",
      description: "Tokyo's oldest Buddhist temple features a modern glass elevator leading right up to the main hall (Hondo), level paving along Nakamise shopping street, and air-conditioned rest terraces.",
      taxi_instruction: "浅草寺の雷門前（浅草文化観光センター前）までお願いします (Please take me to Asakusa Kaminarimon Gate)",
      image_badge: "Tokyo Heritage"
    }
  ],

  // 14. Tourist International Emergency Hospitals
  tourist_hospitals: [
    {
      id: "th_stlukes",
      name: "St. Luke's International Hospital",
      name_ja: "聖路加国際病院",
      city: "Tokyo",
      area: "Chuo-ku (Akashi-cho)",
      languages: ["English", "Spanish", "French", "Japanese"],
      accreditation: "JCI (Joint Commission International)",
      emergency_hours: "24 Hours / 365 Days",
      phone: "+81 3-3541-5151",
      emergency_phone: "03-3541-5151",
      services: ["Cardiac ICU", "Stroke Center", "Senior Geriatric Triage", "Medical Evacuation Support"],
      address: "9-1 Akashicho, Chuo City, Tokyo 104-8560"
    },
    {
      id: "th_kyoto_univ",
      name: "Kyoto University Hospital International Care",
      name_ja: "京都大学医学部附属病院",
      city: "Kyoto",
      area: "Sakyo-ku",
      languages: ["English", "Mandarin", "Japanese"],
      accreditation: "Japan Medical Education & JMIP Certified",
      emergency_hours: "24 Hours Emergency",
      phone: "+81 75-751-3111",
      emergency_phone: "075-751-3111",
      services: ["Comprehensive Trauma", "Cardiovascular Care", "Multilingual Coordinators"],
      address: "54 Kawahara-cho, Shogoin, Sakyo-ku, Kyoto 606-8507"
    },
    {
      id: "th_jikei",
      name: "The Jikei University Hospital",
      name_ja: "東京慈恵会医科大学附属病院",
      city: "Tokyo",
      area: "Minato-ku (Nishi-Shimbashi)",
      languages: ["English", "Korean", "Mandarin", "Japanese"],
      accreditation: "JMIP (Japan Medical Service Accreditation for International Patients)",
      emergency_hours: "24 Hours Emergency",
      phone: "+81 3-3433-1111",
      emergency_phone: "03-3433-1111",
      services: ["Elderly Emergency Triage", "Orthopedics", "Hypertension & Nephrology"],
      address: "3-19-18 Nishi-Shimbashi, Minato City, Tokyo 105-8471"
    },
    {
      id: "th_aomori",
      name: "Aomori Prefectural Central Hospital",
      name_ja: "青森県立中央病院",
      city: "Aomori",
      area: "Aomori City",
      languages: ["English (Medical Translation Tablets)", "Japanese"],
      accreditation: "Designated Regional Critical Care Center",
      emergency_hours: "24 Hours Emergency",
      phone: "+81 17-726-8111",
      emergency_phone: "017-726-8111",
      services: ["Emergency Trauma", "Geriatric Acute Care", "Cardiology"],
      address: "2-1-1 Higashitsukurimichi, Aomori 030-8553"
    }
  ],

  // 15. Tourist Essential Health & Travel Phrases
  tourist_phrases: [
    {
      id: "ph_01",
      category: "Medical & SOS",
      en: "Please call an ambulance right away.",
      ja: "すぐに救急車を呼んでください",
      romaji: "Sugu ni kyūkyūsha o yonde kudasai",
      context: "Critical Emergency (119)"
    },
    {
      id: "ph_02",
      category: "Medical & SOS",
      en: "I feel dizzy and have chest tightness.",
      ja: "めまいがして胸が苦しいです",
      romaji: "Memai ga shite mune ga kurushii desu",
      context: "Paramedic / Doctor Triage"
    },
    {
      id: "ph_03",
      category: "Medical & SOS",
      en: "Where is the nearest hospital with English speaking doctors?",
      ja: "英語が話せる最寄りの病院はどこですか",
      romaji: "Eigo ga hanaseru moyori no byōin wa doko desu ka",
      context: "Hospital Inquiry"
    },
    {
      id: "ph_04",
      category: "Medical & SOS",
      en: "I have high blood pressure and need my medicine.",
      ja: "高血圧の持病があり、薬が必要です",
      romaji: "Kōketsuatsu no jibyō ga ari, kusuri ga hitsuyō desu",
      context: "Pharmacy / Clinic"
    },
    {
      id: "ph_05",
      category: "Transit & Mobility",
      en: "Where is the wheelchair accessible elevator?",
      ja: "車椅子用のエレベーターはどこですか",
      romaji: "Kurumaisu-yō no erebētā wa doko desu ka",
      context: "Train Stations & Temples"
    },
    {
      id: "ph_06",
      category: "Transit & Mobility",
      en: "Is there a bench where an elderly person can sit down and rest?",
      ja: "高齢者が座って休めるベンチはありますか",
      romaji: "Kōreisha ga suwatte yasumeru benchi wa arimasu ka",
      context: "Sightseeing Spots"
    },
    {
      id: "ph_07",
      category: "Transit & Mobility",
      en: "Please call a universal design taxi with a low step.",
      ja: "乗り降りが楽なユニバーサルタクシーを呼んでください",
      romaji: "Noriori ga raku na yunibāsaru takushī o yonde kudasai",
      context: "Hotel / Station Taxi Stand"
    },
    {
      id: "ph_08",
      category: "Dining & Comfort",
      en: "Low sodium and low salt, please.",
      ja: "塩分を控えめでお願いします",
      romaji: "Enbun o hikaeme de onegai shimasu",
      context: "Restaurants & Dining"
    },
    {
      id: "ph_09",
      category: "Dining & Comfort",
      en: "Do you have a table and chairs? I cannot sit on the tatami floor.",
      ja: "畳に座れないので、テーブルと椅子の席はありますか",
      romaji: "Tatami ni suwarenai node, tēburu to isu no seki wa arimasu ka",
      context: "Traditional Japanese Restaurants"
    },
    {
      id: "ph_10",
      category: "Dining & Comfort",
      en: "Could I please have some hot water for my prescription medicine?",
      ja: "薬を飲むための白湯をいただけますか",
      romaji: "Kusuri o nomu tame no sayu o itadakemasu ka",
      context: "Cafes & Dining"
    }
  ],

  // 16. Default Active Tourist Profile
  tourist_profile: {
    id: "tourist_arthur",
    name: "Arthur Miller",
    age: 74,
    nationality: "United States",
    passport_masked: "••••8841",
    blood_type: "O+",
    hotel: "Imperial Hotel Tokyo (Chiyoda-ku)",
    hotel_phone: "+81 3-3504-1111",
    emergency_contact: "Sarah Miller (Daughter): +1 415-555-0192",
    insurance_policy: "Allianz Global Travel Health (Policy #AG-998214)",
    chronic_conditions: ["Essential Hypertension", "Mild Angina Pectoris", "Type 2 Diabetes"],
    current_medications: ["Amlodipine 5mg once daily", "Metformin 500mg twice daily", "Nitroglycerin (as needed for chest tightness)"],
    allergies: ["Penicillin", "Sulfa drugs"],
    japanese_medical_summary: "【緊急医療情報】氏名: アーサー・ミラー (74歳・米国籍)。血液型: O型。既往歴: 本態性高血圧症、狭心症、2型糖尿病。アレルギー: ペニシリン、サルファ剤。常用薬: アムロジピン5mg、メトホルミン500mg、ニトログリセリン常備。緊急連絡先: 娘 サラ・ミラー (+1 415-555-0192)。海外旅行保険加入済み。"
  }
};
