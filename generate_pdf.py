"""
MediConnect Japan - Complete Project Documentation PDF Generator
Uses ReportLab to create an executive, publication-grade PDF manual.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Don't draw header on first page (cover)
        if self._pageNumber > 1:
            self.drawString(54, 11 * 72 - 36, "MediConnect Japan — AI-Powered Healthcare Ecosystem & Senior Tourist Guide")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)

        # Footer on all pages
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 54, 36, page_str)
        self.drawString(54, 36, "CONFIDENTIAL & PROPRIETARY • HACKATHON MVP COMPREHENSIVE GUIDE")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 8.5 * 72 - 54, 48)
        self.restoreState()

def generate_pdf(filename="MediConnect_Japan_Documentation.pdf"):
    pdf_path = os.path.join(os.path.dirname(__file__), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom color palette
    c_primary = colors.HexColor("#E8637A")      # Sakura Pink
    c_indigo = colors.HexColor("#4F46B8")       # Deep Indigo
    c_dark = colors.HexColor("#0F172A")         # Slate Dark
    c_text = colors.HexColor("#1E293B")         # Body text
    c_muted = colors.HexColor("#64748B")        # Muted grey
    c_card_bg = colors.HexColor("#F8FAFC")      # Light card
    c_border = colors.HexColor("#E2E8F0")

    # Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_indigo,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=c_primary,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_indigo,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_dark,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14.5,
        textColor=c_text,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=body_style,
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_dark
    )

    story = []

    # ========================================================
    # COVER / HEADER
    # ========================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("MediConnect Japan (遠隔医療基盤)", title_style))
    story.append(Paragraph("AI-Powered Elderly Care Ecosystem & Senior Tourist Companion Guide", subtitle_style))
    story.append(Paragraph("<b>Author & Engineering:</b> MediConnect Japan Hackathon Team | <b>Version:</b> 2.0 MVP Production Build", body_style))
    story.append(Paragraph("<b>GitHub Repository:</b> <font color='#4F46B8'><u>https://github.com/jaya-5118/japan-health-guide-</u></font>", body_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=10, spaceAfter=15))

    # Executive Overview Box
    exec_data = [
        [
            Paragraph(
                "<b>EXECUTIVE OVERVIEW:</b> MediConnect Japan is a unified healthcare and travel support platform "
                "addressing Japan's severe super-aging demographic reality (29.1% aged 65+) and doctor shortages in rural prefectures (e.g., Aomori). "
                "The platform links <b>Patients, Caregivers, Doctors, Municipal Health Admins, and International Senior Tourists</b> "
                "into a high-speed, reactive, AI-coordinated care network with voice-first assistance, 3D glassmorphism interface, "
                "real-time medical translation, and instant 119 emergency dispatch protocols.",
                callout_style
            )
        ]
    ]
    exec_table = Table(exec_data, colWidths=[500])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FDF2F4")),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor("#F8B4C0")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 12))

    # ========================================================
    # SECTION 1: DATASET ORIGINS & SEED ARCHITECTURE
    # ========================================================
    story.append(Paragraph("1. Dataset Origins & Clinical Baseline Sources", h1_style))
    story.append(Paragraph(
        "Where did the dataset come from? To ensure clinical authenticity and cultural relevance, the data architecture "
        "is synthesized from official Japanese government health standards, demographic studies, and tourist barrier-free audits:",
        body_style
    ))

    data_sources = [
        "<b>Ministry of Health, Labour and Welfare (MHLW / 厚生労働省):</b> Clinical blood pressure staging and target thresholds (JSH 2019/2024 Guidelines: &lt;130/80 mmHg home, &lt;140/90 clinic). Statutory framework for Japan's <i>Late-Elderly Healthcare System</i> (後期高齢者医療制度) with 10% co-payment and <i>Long-Term Care Insurance</i> (要介護認定 要支援1).",
        "<b>Japan Geriatrics Society (JGS / 日本老年医学会):</b> Guidelines for safe pharmacotherapy in elderly patients, medication adherence schedules for polypharmacy (Amlodipine Besylate for calcium channel blockade, Metformin for T2D glycemic control, Lisinopril for ACE inhibition titration).",
        "<b>Japan National Tourism Organization (JNTO / 日本政府観光局):</b> Accessibility databases evaluating wheelchair navigation, resting bench density, elevator bypass routes, and multilingual emergency hospital certifications across Tokyo, Kyoto, Hakone, Kanazawa, and Aomori.",
        "<b>Regional Healthcare Topology:</b> Real geographic mapping across Aomori Prefecture (Hirosaki, Kuroishi) and Tokyo University Hospital referral networks, accurately representing rural-to-urban telehealth hub-and-spoke dynamics."
    ]
    for src in data_sources:
        story.append(Paragraph(f"• {src}", bullet_style))

    story.append(Spacer(1, 8))

    # Table of Collections
    story.append(Paragraph("Database Collections Inventory (15 Core Collections):", h2_style))
    col_rows = [
        ["#", "Collection Name", "Entities Seeded", "Clinical / Functional Purpose"],
        ["1", "patients", "Takeshi Sato, Haruto Takahashi", "Elderly profiles, blood type, GPS, conditions, insurance"],
        ["2", "caregivers", "Yuki Sato, Kenji Takahashi", "Family & professional caregivers, shift statuses, backup IDs"],
        ["3", "medications", "Amlodipine, Metformin, Lisinopril", "Dosage, timing, adherence tracker, pharmacy linkages"],
        ["4", "doctors", "Dr. Tanaka, Dr. Nakamura", "Specialty (Geriatrics, Cardiology), clinical schedule"],
        ["5", "clinics", "Hirosaki Community, Tokyo Cardio", "Regional clinic nodes and hospital capabilities"],
        ["6", "symptoms", "Triage logs (Chest pain, BP spikes)", "AI NLP triage scores, severity flags (Emergency/Urgent)"],
        ["7", "vital_signs", "Systolic, Diastolic, Pulse, SpO2", "Historical time-series vitals with timestamp tracking"],
        ["8", "telehealth_sessions", "Cardio Consultations", "WebRTC simulated rooms, meeting IDs, encrypted channels"],
        ["9", "referrals", "Hirosaki to Tokyo Cardio Center", "Cross-regional specialist referral transmissions"],
        ["10", "alerts", "Push & voice notification queue", "Prioritized alerts (Red/Orange/Yellow/Green)"],
        ["11", "medical_history", "Hypertension, T2D, Cataract", "ICD-10 coded surgical and chronic condition history"],
        ["12", "insurance", "Japan National Health Insurance", "Policy numbers, late-elderly co-pay rates, validity"],
        ["13", "tourist_places", "Meiji Jingu, Kiyomizu, Kenroku-en...", "Barrier-free scores, walking effort, resting spots, taxi cards"],
        ["14", "tourist_hospitals", "St. Luke's, Kyoto Univ, Jikei...", "Accredited multilingual hospitals with 24/7 English desks"],
        ["15", "tourist_phrases", "Emergency, Transit, Dietary, SOS", "Bilingual phrasebook with audio pronunciation in Japanese"]
    ]
    col_table = Table(col_rows, colWidths=[20, 110, 140, 230])
    col_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_card_bg]),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
    ]))
    story.append(col_table)
    story.append(Spacer(1, 14))

    # ========================================================
    # SECTION 2: FRONTEND ARCHITECTURE & 3D UI
    # ========================================================
    story.append(Paragraph("2. Frontend Engineering & Visual Design System", h1_style))
    story.append(Paragraph(
        "The frontend is engineered with <b>Vanilla JavaScript (ES Modules)</b> bundled via <b>Vite 8</b>. "
        "Deliberately avoiding framework bloat, the application maintains sub-millisecond DOM render speeds, "
        "crucial for elderly users on mobile devices or low-bandwidth rural networks.",
        body_style
    ))

    fe_points = [
        "<b>3D Glassmorphism Japanese Aesthetic:</b> Multi-layered translucent glass panels (<code>backdrop-filter: blur(20px)</code>) styled with soft gradients, subtle 3D perspective tilts (<code>perspective(1000px) rotateX(1deg)</code>), and delicate Japanese cherry blossom (sakura) floating petal physics.",
        "<b>Senior-Inclusive Typography & Contrast:</b> High-contrast font pairing using Google Fonts <i>Noto Serif JP</i> for authentic Japanese kanji rendering and <i>Inter</i> for clinical legibility, complying with WCAG 2.1 AA accessibility guidelines.",
        "<b>Touch Target Sizing:</b> Big touch targets (minimum 52px height) tailored for arthritic or trembling fingers, with distinct color-coded status badges (Green = Stable, Yellow = Warning, Red = Emergency).",
        "<b>Web Speech & Audio Synthesis Engine:</b> Integrated <code>window.speechSynthesis</code> providing natural bilingual English and Japanese voice notifications, medication prompts, audio guides, and emergency translations without requiring external cloud API keys."
    ]
    for pt in fe_points:
        story.append(Paragraph(f"• {pt}", bullet_style))

    story.append(Spacer(1, 12))

    # ========================================================
    # SECTION 3: BACKEND & REACTIVE STATE BUS
    # ========================================================
    story.append(Paragraph("3. Backend State Management & Autonomous AI Agents", h1_style))
    story.append(Paragraph(
        "Rather than relying on a heavy remote database server that introduces network latency during emergencies, "
        "MediConnect Japan implements a client-side reactive bus architecture inspired by Redux and WebSocket pub/sub:",
        body_style
    ))

    be_points = [
        "<b>Reactive Store Pattern (store.js):</b> Central pub/sub state manager. Any insert, update, or deletion automatically triggers targeted UI re-renders and persists to local storage for offline resilience.",
        "<b>HIPAA & PMDA Security Ledger:</b> Complete immutable audit trail logging role switches, clinical record accesses, prescription adjustments, and emergency dispatches with millisecond timestamps and actor IDs.",
        "<b>6 Autonomous AI Agent Workflows:</b>",
        "&nbsp;&nbsp;&nbsp;&nbsp;1. <i>Medication Adherence Agent:</i> Tracks dosage windows, triggers voice alerts, and escalates to family caregivers upon missed doses.",
        "&nbsp;&nbsp;&nbsp;&nbsp;2. <i>Emergency Symptom NLP Agent:</i> Scans reported symptoms, evaluates cardiac/stroke keywords, and automates 119 triage alerts.",
        "&nbsp;&nbsp;&nbsp;&nbsp;3. <i>Specialist Referral Agent:</i> Compiles clinical summaries, encrypts patient records, and books tertiary appointments in Tokyo.",
        "&nbsp;&nbsp;&nbsp;&nbsp;4. <i>Medical Translation Agent:</i> Performs real-time bidirectional translation between elderly patients and bilingual clinicians.",
        "&nbsp;&nbsp;&nbsp;&nbsp;5. <i>Autonomous Caregiver Handoff Agent:</i> Reroutes patient monitoring and alert escalation during caregiver off-shift periods.",
        "&nbsp;&nbsp;&nbsp;&nbsp;6. <i>Vital Signs Spike Detection Agent:</i> Evaluates blood pressure spikes (&gt;140/90) and dynamically adjusts risk levels."
    ]
    for pt in be_points:
        story.append(Paragraph(f"{pt}", bullet_style))

    story.append(Spacer(1, 14))

    # ========================================================
    # SECTION 4: TOURIST GUIDE FEATURE SPECIFICATION
    # ========================================================
    story.append(Paragraph("4. Tourist Guide: Senior Travel & Emergency Portal", h1_style))
    story.append(Paragraph(
        "<b>New Feature Addition:</b> Designed specifically for elderly international travelers visiting Japan who require "
        "barrier-free accessibility information, multilingual communication support, and emergency medical protection while away from home.",
        body_style
    ))

    tourist_features = [
        "<b>Accessible Destinations Directory:</b> Curated elderly-friendly heritage sites across Tokyo, Kyoto, Kanazawa, Hakone, and Aomori. Each card details accessibility scores (e.g., 5/5 Full Barrier-Free), walking effort, elevator access, resting bench frequency, and proximity to international hospitals. Features <i>Audio Guide Narration</i> and a <i>Taxi Destination Card</i> in Japanese script to show taxi drivers.",
        "<b>Multilingual Speech & Communication Assistant:</b> Supports English, Chinese, Korean, Spanish, and French. Features pre-compiled essential elderly travel phrases categorized by Medical/SOS, Transit/Mobility, and Dining/Dietary restrictions (e.g., low sodium, table seating instead of tatami floor). Includes an interactive live translator that speaks natural Japanese aloud to station staff and shopkeepers.",
        "<b>Emergency SOS & Tourist Medical Pass:</b> Instant 119 Ambulance dispatch simulation transmitting tourist GPS and medical triage data. Displays a digital Japanese Emergency Medical Pass (showing conditions like Angina, Hypertension, and Penicillin allergy in Japanese) with a button that reads the entire medical summary aloud to Japanese paramedics.",
        "<b>Barrier-Free Transit Navigator:</b> Step-by-step guides for requesting Universal Design Taxis (JPN TAXI with wheelchair ramps) and Tokyo Metro / JR station staff personal escorts with portable boarding ramps."
    ]
    for tf in tourist_features:
        story.append(Paragraph(f"• {tf}", bullet_style))

    story.append(Spacer(1, 12))

    # ========================================================
    # SECTION 5: HOW TO USE THE PROJECT (USER MANUAL)
    # ========================================================
    story.append(Paragraph("5. Step-by-Step User Manual: Role-by-Role Walkthrough", h1_style))
    story.append(Paragraph(
        "Switch between roles using the top navigation pill bar in the application:",
        body_style
    ))

    roles = [
        ("Patient Role (Takeshi Sato, 78yo)", [
            "Home Dashboard: View morning medication schedule (Amlodipine, Metformin), blood pressure summary, and caregiver on duty.",
            "Quick Actions: Tap 'Take Morning Medication' to log adherence with celebratory sound and confetti.",
            "Voice Interface: Tap the microphone icon or quick voice buttons ('I took my medicine' or 'I feel chest pain').",
            "Emergency SOS Screen: Dedicated 119 dispatch button transmitting real-time GPS location and medical summary."
        ]),
        ("Caregiver Role (Yuki Sato)", [
            "Monitoring Dashboard: Real-time patient status (Takeshi: Yellow Alert, Haruto: Green Normal).",
            "Shift Management: Toggle shift status between 'On Shift' and 'Day Off'. The system autonomously activates Kenji Takahashi as backup.",
            "Active Alerts: Review unread medication reminder warnings and vital sign alerts."
        ]),
        ("Doctor Role (Dr. Hiroshi Tanaka, Hirosaki Clinic)", [
            "Patients Roster: View clinical status, last vitals, and condition breakdown.",
            "Patient EHR: Inspect historical charts, active prescriptions, and clinical notes.",
            "Specialist Referral: Submit encrypted referral requests to Tokyo University Hospital.",
            "Telehealth Consultation: Launch simulated live video consultation with real-time speech translation and prescription titration."
        ]),
        ("Admin & Regional Analytics Role (Kenichi Mori)", [
            "Prefecture Analytics: Population aging demographics, clinic coverage maps, and triage severity metrics.",
            "Compliance & Audit: Export HIPAA / PMDA verified audit trails and download CSV clinical datasets."
        ]),
        ("Tourist Guide Role (Arthur Miller, 74yo Visitor)", [
            "Accessible Places: Filter by city (Tokyo, Kyoto, etc.), click 'Read Audio Guide' or 'Show Taxi Card'.",
            "Language Assistant: Select target phrase, click 'Speak in Japanese' to pronounce aloud, or type custom queries.",
            "Emergency Medical Card: Click 'Read Summary to Paramedic' to speak your conditions in Japanese to emergency crews.",
            "Dial 119 / JNTO: Access 24/7 tourist helpline (050-3816-2720) and emergency medical services."
        ])
    ]

    for role_name, steps in roles:
        story.append(Paragraph(f"<b>{role_name}:</b>", h2_style))
        for s in steps:
            story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;→ {s}", body_style))

    story.append(Spacer(1, 14))

    # ========================================================
    # SECTION 6: HACKATHON DEMO SCENARIOS & REPOSITORY
    # ========================================================
    story.append(Paragraph("6. Hackathon Demo Scenarios & GitHub Repository", h1_style))
    story.append(Paragraph(
        "To evaluate the project during hackathon judging, use the <b>'Demo Scenarios (1-5)'</b> button on the top header:",
        body_style
    ))

    scenarios = [
        "<b>Scenario 1:</b> Medication Adherence & Caregiver Escalation",
        "<b>Scenario 2:</b> Emergency Symptom Detection & 119 Autonomous Triage",
        "<b>Scenario 3:</b> Rural-to-Urban Specialist Telehealth & Referral",
        "<b>Scenario 4:</b> Caregiver Shift Handoff & Autonomous Backup Activation",
        "<b>Scenario 5:</b> Blood Pressure Spike & Titration"
    ]
    for sc in scenarios:
        story.append(Paragraph(f"• {sc}", bullet_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "<b>GitHub Repository:</b> <font color='#4F46B8'>https://github.com/jaya-5118/japan-health-guide-</font><br/>"
        "<b>Deployment:</b> Run locally via <code>npm install &amp;&amp; npm run dev</code> (runs on port 5173). Fully responsive across mobile, tablet, and desktop displays.",
        body_style
    ))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    generate_pdf()
