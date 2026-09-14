// ============================================================
// MediConnect Japan - Top Header, Role-Switcher & Global Actions
// 3D Glassmorphism Japanese Theme
// ============================================================
import { store } from "../db/store.js";
import { soundService } from "../services/audio.js";

export function renderNavbar(activeRole, isAudioMuted = false) {
  const user = store.currentUser;

  return `
    <header class="top-header">
      <!-- Left: Logo & Title -->
      <div class="brand-badge">
        <div class="brand-logo">🌸</div>
        <div class="brand-text">
          <h1>MediConnect Japan</h1>
          <div class="brand-subtitle">Healthcare shouldn't become inaccessible simply because someone cannot type.</div>
        </div>
      </div>

      <!-- Center: Role Switcher -->
      <div class="role-bar">
        <button class="role-btn ${activeRole === "patient" ? "active" : ""}" data-role="patient">
          <span></span>
          <span>Patient (Takeshi)</span>
        </button>

        <button class="role-btn ${activeRole === "caregiver" ? "active" : ""}" data-role="caregiver">
          <span></span>
          <span>Caregiver (Yuki)</span>
        </button>

        <button class="role-btn ${activeRole === "doctor" ? "active" : ""}" data-role="doctor">
          <span></span>
          <span>Doctor (Dr. Tanaka)</span>
        </button>

        <button class="role-btn ${activeRole === "admin" ? "active" : ""}" data-role="admin">
          <span></span>
          <span>Admin & Analytics</span>
        </button>

        <button class="role-btn ${activeRole === "tourist" ? "active" : ""}" data-role="tourist">
          <span></span>
          <span>Tourist Guide (Japan Travel)</span>
        </button>
      </div>

      <!-- Right: Global Actions & Hackathon Demo Launcher -->
      <div class="header-actions">
        <button class="btn-demo" id="btn-open-demo-orchestrator">
          <span></span>
          <span>Demo Scenarios (1-5)</span>
        </button>

        <button class="btn-ghost-pill" id="btn-open-db-inspector" title="Inspect all 15 database collections">
          <span></span>
          <span>15 Collections</span>
        </button>

        <a href="/MediConnect_Japan_Documentation.pdf" download="MediConnect_Japan_Documentation.pdf" class="btn-ghost-pill" style="text-decoration: none; display: flex; align-items: center;" title="Download Comprehensive Project Documentation PDF">
          <span></span>
          <span>PDF Guide</span>
        </a>

        <button class="btn-ghost-pill" id="btn-toggle-audio-mute" title="Toggle Sound & Speech">
          <span>${isAudioMuted ? "🔇" : "🔊"}</span>
        </button>

        <button class="btn-ghost-pill" id="btn-global-reset-db" title="Reset all data to seed" style="color: #F87171;">
          <span>🔄</span>
        </button>
      </div>
    </header>
  `;
}
