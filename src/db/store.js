// ============================================================
// MediConnect Japan - Reactive Store & Real-time State Bus
// ============================================================
import { INITIAL_DATABASE } from "./collections.js";

const STORAGE_KEY = "mediconnect_japan_db_v1";

class MediConnectStore {
  constructor() {
    this.listeners = new Set();
    this.auditLogs = [];
    this.currentUser = {
      role: "patient", // 'patient', 'caregiver', 'doctor', 'admin'
      id: "pat_takeshi",
      name: "Takeshi Sato (佐藤 健)",
      title: "Patient (78yo, Aomori)"
    };
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
        // Ensure new tourist collections exist
        if (!this.data.tourist_places) {
          this.data.tourist_places = INITIAL_DATABASE.tourist_places;
          this.data.tourist_hospitals = INITIAL_DATABASE.tourist_hospitals;
          this.data.tourist_phrases = INITIAL_DATABASE.tourist_phrases;
          this.data.tourist_profile = INITIAL_DATABASE.tourist_profile;
          this.save();
        }
      } else {
        this.reset();
      }
    } catch (e) {
      console.warn("Storage access failed, using memory DB", e);
      this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.save();
    this.logAudit("SYSTEM_RESET", "system", "Database reset to initial demo state");
    this.notify("all", null);
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }

  // --- Real-Time Pub/Sub Event System ---
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(collection, record) {
    this.save();
    this.listeners.forEach((listener) => {
      try {
        listener(collection, record);
      } catch (err) {
        console.error("Listener error:", err);
      }
    });
  }

  // --- Current Role & User Switching ---
  setUser(role, userId) {
    if (role === "patient") {
      const pat = this.find("patients", userId || "pat_takeshi");
      this.currentUser = {
        role: "patient",
        id: pat.id,
        name: pat.name,
        name_kanji: pat.name_kanji,
        title: `Patient (${pat.age}yo, ${pat.prefecture})`
      };
    } else if (role === "caregiver") {
      const cg = this.find("caregivers", userId || "cg_yuki");
      this.currentUser = {
        role: "caregiver",
        id: cg.id,
        name: cg.name,
        name_kanji: cg.name_kanji,
        title: `Caregiver (${cg.relationship} - ${cg.location})`
      };
    } else if (role === "doctor") {
      const doc = this.find("doctors", userId || "doc_tanaka");
      this.currentUser = {
        role: "doctor",
        id: doc.id,
        name: doc.name,
        name_kanji: doc.name_kanji,
        title: `${doc.specialty} (${doc.location})`
      };
    } else if (role === "admin") {
      this.currentUser = {
        role: "admin",
        id: "admin_hirosaki",
        name: "Kenichi Mori (森 健一)",
        title: "Regional Hospital Administrator (Aomori Care Network)"
      };
    } else if (role === "tourist") {
      const profile = this.data.tourist_profile || INITIAL_DATABASE.tourist_profile;
      this.currentUser = {
        role: "tourist",
        id: profile.id || "tourist_arthur",
        name: profile.name,
        name_kanji: "アーサー・ミラー",
        title: `Senior Visitor (${profile.age}yo, ${profile.nationality})`
      };
    }
    this.logAudit("ROLE_SWITCH", this.currentUser.id, `User switched role to ${role}`);
    this.notify("auth", this.currentUser);
  }

  // --- Collection Queries ---
  get(collectionName, filterFn = null) {
    const list = this.data[collectionName] || [];
    if (filterFn && typeof filterFn === "function") {
      return list.filter(filterFn);
    }
    return list;
  }

  find(collectionName, id) {
    const list = this.data[collectionName] || [];
    return list.find((item) => item.id === id) || null;
  }

  insert(collectionName, record) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    if (!record.id) {
      record.id = `${collectionName.slice(0, 3)}_${Date.now()}`;
    }
    if (!record.created_at) {
      record.created_at = new Date().toISOString();
    }
    record.updated_at = new Date().toISOString();

    this.data[collectionName].unshift(record);
    this.logAudit("INSERT", this.currentUser.id, `Created ${collectionName} [${record.id}]`);
    this.notify(collectionName, record);
    return record;
  }

  update(collectionName, id, updates) {
    const list = this.data[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.logAudit("UPDATE", this.currentUser.id, `Updated ${collectionName} [${id}]`);
      this.notify(collectionName, list[index]);
      return list[index];
    }
    return null;
  }

  delete(collectionName, id) {
    const list = this.data[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      const removed = list.splice(index, 1)[0];
      this.logAudit("DELETE", this.currentUser.id, `Deleted ${collectionName} [${id}]`);
      this.notify(collectionName, removed);
      return true;
    }
    return false;
  }

  // --- HIPAA & PMDA Audit Logging ---
  logAudit(action, actorId, details) {
    const entry = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actor_id: actorId || this.currentUser.id,
      role: this.currentUser.role,
      details,
      ip: "192.168.1.104"
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  getAuditLogs() {
    return this.auditLogs;
  }
}

export const store = new MediConnectStore();
