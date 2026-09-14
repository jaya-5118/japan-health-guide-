// Patient Registration Form Component
export function renderRegistrationForm() {
  return `
    <section class="registration-wrapper" style="display:flex;flex-direction:column;align-items:center;gap:24px;margin-top:80px;">
      <h2 style="font-size:28px;font-weight:800;color:var(--text-white);">患者情報を登録してください (Enter Patient Details)</h2>
      <form id="patient-registration" style="background:var(--glass-bg-strong);backdrop-filter:blur(16px);border-radius: var(--radius-md);padding:24px;width:320px;box-shadow:var(--shadow-glow-indigo);">
        <div style="margin-bottom:12px;">
          <label for="name" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">名前 / Name</label>
          <input id="name" name="name" type="text" required style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);" />
        </div>
        <div style="margin-bottom:12px;">
          <label for="age" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">年齢 / Age</label>
          <input id="age" name="age" type="number" min="1" required style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);" />
        </div>
        <div style="margin-bottom:12px;">
          <label for="prefecture" style="display:block;font-size:var(--font-small);color:var(--text-white);margin-bottom:4px;">都道府県 / Prefecture</label>
          <input id="prefecture" name="prefecture" type="text" required style="width:100%;padding:8px;border:none;border-radius:var(--radius-sm);background:var(--bg-subtle);color:var(--text-white);" />
        </div>
        <button type="submit" class="btn-touch-primary" style="width:100%;height:44px;background:var(--primary);color:#fff;">登録 (Register)</button>
      </form>
    </section>`;
}
