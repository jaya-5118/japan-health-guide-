// Patient Report Form Component
export function renderPatientReportForm(patient) {
  const { name, age, prefecture, phone, emergency_contact, primary_caregiver_id, assigned_doctor_id } = patient || {};
  return `
    <section class="report-wrapper" style="display:flex;flex-direction:column;align-items:center;gap:24px;margin-top:80px;">
      <h2 style="font-size:28px;font-weight:800;color:var(--text-white);">患者情報の編集 (Edit Patient Details)</h2>
      <form id="patient-report" style="background:var(--glass-bg-strong);backdrop-filter:blur(16px);border-radius: var(--radius-md);padding:24px;width:320px;box-shadow:var(--shadow-glow-indigo);">
        <div style="margin-bottom:12px;">
          <label for="name" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">名前 / Name</label>
          <input id="name" name="name" type="text" required value="${name || ''}" style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);"/>
        </div>
        <div style="margin-bottom:12px;">
          <label for="age" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">年齢 / Age</label>
          <input id="age" name="age" type="number" min="1" required value="${age || ''}" style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);"/>
        </div>
        <div style="margin-bottom:12px;">
          <label for="prefecture" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">都道府県 / Prefecture</label>
          <input id="prefecture" name="prefecture" type="text" required value="${prefecture || ''}" style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);"/>
        </div>
        <div style="margin-bottom:12px;">
          <label for="phone" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">電話 / Phone</label>
          <input id="phone" name="phone" type="text" value="${phone || ''}" style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);"/>
        </div>
        <div style="margin-bottom:12px;">
          <label for="emergency_contact" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">緊急連絡先 / Emergency Contact</label>
          <input id="emergency_contact" name="emergency_contact" type="text" value="${emergency_contact || ''}" style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);"/>
        </div>
        <div style="margin-bottom:12px;">
          <label for="primary_caregiver_id" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">主介護者ID / Caregiver ID</label>
          <input id="primary_caregiver_id" name="primary_caregiver_id" type="text" value="${primary_caregiver_id || ''}" style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);"/>
        </div>
        <div style="margin-bottom:12px;">
          <label for="assigned_doctor_id" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">担当医ID / Doctor ID</label>
          <input id="assigned_doctor_id" name="assigned_doctor_id" type="text" value="${assigned_doctor_id || ''}" style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);"/>
        </div>
        <button type="submit" class="btn-touch-primary" style="width:100%;height:44px;background:var(--primary);color:#fff;">保存 (Save)</button>
      </form>
    </section>`;
}
