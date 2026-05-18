"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const stages = ["New Lead", "Inspection", "Insurance", "Estimate", "Signed", "Production", "Closed"];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Page() {
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [form, setForm] = useState({
    homeowner_name: "",
    phone: "",
    email: "",
    address: "",
    lead_source: "",
    estimated_value: "",
    notes: "",
    status: "New Lead",
    sales_rep: "Michael",
  });

  async function loadLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading leads: " + error.message);
    } else {
      setLeads(data || []);
      if (!selectedLead && data?.length) setSelectedLead(data[0]);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  function updateForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveLead(e) {
    e.preventDefault();
    setMessage("Saving lead...");

    const { error } = await supabase.from("leads").insert([
      {
        homeowner_name: form.homeowner_name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        lead_source: form.lead_source,
        estimated_value: form.estimated_value ? Number(form.estimated_value) : null,
        notes: form.notes,
        status: form.status || "New Lead",
        sales_rep: form.sales_rep || "Michael",
      },
    ]);

    if (error) {
      setMessage("Error saving lead: " + error.message);
      return;
    }

    setMessage("Lead saved successfully!");
    setShowForm(false);
    setForm({
      homeowner_name: "",
      phone: "",
      email: "",
      address: "",
      lead_source: "",
      estimated_value: "",
      notes: "",
      status: "New Lead",
      sales_rep: "Michael",
    });

    await loadLeads();
  }

  const pipelineValue = useMemo(
    () => leads.reduce((sum, lead) => sum + Number(lead.estimated_value || 0), 0),
    [leads]
  );

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
      <div style={styles.logoBox}>
  <img
    src="/logo.jpg"
    alt="Home Run Roofing"
    style={{
      width: "100%",
      borderRadius: 14,
      objectFit: "contain",
    }}
  />
</div>

        {["Dashboard", "Customers", "Boards", "Calendar", "Files", "Sales", "Reports"].map((item, i) => (
          <button key={item} style={i === 0 ? styles.navActive : styles.nav}>
            {item}
          </button>
        ))}

        <div style={styles.motto}>
          <strong>Team Motto</strong>
          <h3>We knock it out of the park.</h3>
          <p>Track leads, claims, estimates, jobs, and production from one place.</p>
        </div>
      </aside>

      <section style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.redText}>Home Run Roofing CRM</p>
            <h1 style={styles.title}>Sales Pipeline</h1>
          </div>

          <button onClick={() => setShowForm(true)} style={styles.redButton}>
            + New Job
          </button>
        </header>

        {message && <div style={styles.message}>{message}</div>}

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <p>Open Pipeline</p>
            <h2>{money.format(pipelineValue)}</h2>
            <span>{leads.length} active leads</span>
          </div>

          <div style={styles.statCard}>
            <p>New Leads</p>
            <h2>{leads.filter((l) => l.status === "New Lead").length}</h2>
            <span>Waiting for contact</span>
          </div>

          <div style={styles.statCard}>
            <p>Inspections</p>
            <h2>{leads.filter((l) => l.status === "Inspection").length}</h2>
            <span>Scheduled / needed</span>
          </div>

          <div style={styles.statCard}>
            <p>Signed</p>
            <h2>{leads.filter((l) => l.status === "Signed").length}</h2>
            <span>Ready for production</span>
          </div>
        </div>

        <div style={styles.contentGrid}>
          <section style={styles.boardWrapper}>
            <div style={styles.boardHeader}>
              <div>
                <h2>Board View</h2>
                <p>Saved leads from Supabase appear here by stage.</p>
              </div>
            </div>

            <div style={styles.board}>
              {stages.map((stage) => {
                const stageLeads = leads.filter((lead) => lead.status === stage);

                return (
                  <div key={stage} style={styles.column}>
                    <div style={styles.columnHeader}>
                      <strong>{stage}</strong>
                      <span>{stageLeads.length}</span>
                    </div>

                    {stageLeads.length === 0 && <div style={styles.empty}>No leads yet</div>}

                    {stageLeads.map((lead) => (
                      <button key={lead.id} onClick={() => setSelectedLead(lead)} style={styles.leadCard}>
                        <strong>{lead.homeowner_name}</strong>
                        <p>{lead.address}</p>
                        <p>{lead.phone}</p>
                        <b>{lead.estimated_value ? money.format(Number(lead.estimated_value)) : ""}</b>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>

          <aside style={styles.detailPanel}>
            <h2>Customer File</h2>

            {selectedLead ? (
              <>
                <h3>{selectedLead.homeowner_name}</h3>
                <p><strong>Address:</strong> {selectedLead.address}</p>
                <p><strong>Phone:</strong> {selectedLead.phone}</p>
                <p><strong>Email:</strong> {selectedLead.email}</p>
                <p><strong>Source:</strong> {selectedLead.lead_source}</p>
                <p><strong>Rep:</strong> {selectedLead.sales_rep}</p>
                <p><strong>Status:</strong> {selectedLead.status}</p>
                <p><strong>Value:</strong> {selectedLead.estimated_value ? money.format(Number(selectedLead.estimated_value)) : ""}</p>
                <div style={styles.nextBox}>
                  <strong>Notes</strong>
                  <p>{selectedLead.notes || "No notes yet."}</p>
                </div>
              </>
            ) : (
              <p>No lead selected yet.</p>
            )}

            <div style={styles.quickAdd}>
              <h2>Quick Add Lead</h2>
              <form onSubmit={saveLead} style={styles.form}>
                <input name="homeowner_name" placeholder="Homeowner Name" value={form.homeowner_name} onChange={updateForm} required style={styles.input} />
                <input name="address" placeholder="Address" value={form.address} onChange={updateForm} required style={styles.input} />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={updateForm} style={styles.input} />
                <input name="estimated_value" placeholder="Estimated Value" value={form.estimated_value} onChange={updateForm} style={styles.input} />
                <button type="submit" style={styles.redButton}>Save Lead</button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {showForm && (
        <div style={styles.modalBg}>
          <form onSubmit={saveLead} style={styles.modal}>
            <h2>New Job</h2>
            <input name="homeowner_name" placeholder="Homeowner Name" value={form.homeowner_name} onChange={updateForm} required style={styles.input} />
            <input name="address" placeholder="Address" value={form.address} onChange={updateForm} required style={styles.input} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={updateForm} style={styles.input} />
            <input name="email" placeholder="Email" value={form.email} onChange={updateForm} style={styles.input} />
            <input name="lead_source" placeholder="Lead Source" value={form.lead_source} onChange={updateForm} style={styles.input} />
            <input name="estimated_value" placeholder="Estimated Value" value={form.estimated_value} onChange={updateForm} style={styles.input} />
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={updateForm} style={styles.input} />
            <button type="submit" style={styles.redButton}>Save Job</button>
            <button type="button" onClick={() => setShowForm(false)} style={styles.darkButton}>Cancel</button>
          </form>
        </div>
      )}
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", background: "#f1f5f9", fontFamily: "Arial, sans-serif", color: "#0f172a" },
  sidebar: { width: 270, background: "#071b4d", color: "white", padding: 24, minHeight: "100vh" },
  logoBox: { background: "white", color: "#071b4d", borderRadius: 18, padding: 18, marginBottom: 28, textAlign: "center", fontWeight: "900" },
  logoText: { fontSize: 28, color: "#b91c1c" },
  logoSub: { fontSize: 14, letterSpacing: 2 },
  nav: { display: "block", width: "100%", background: "transparent", color: "white", border: "none", textAlign: "left", padding: 14, borderRadius: 14, fontWeight: "bold", marginBottom: 8 },
  navActive: { display: "block", width: "100%", background: "#b91c1c", color: "white", border: "none", textAlign: "left", padding: 14, borderRadius: 14, fontWeight: "bold", marginBottom: 8 },
  motto: { background: "rgba(255,255,255,.1)", borderRadius: 20, padding: 18, marginTop: 30 },
  main: { flex: 1, padding: 24, overflowX: "hidden" },
  header: { background: "white", borderRadius: 20, padding: 22, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  redText: { color: "#b91c1c", fontWeight: "bold", margin: 0 },
  title: { color: "#071b4d", margin: 0, fontSize: 34 },
  redButton: { background: "#b91c1c", color: "white", border: "none", borderRadius: 14, padding: "13px 18px", fontWeight: "bold", cursor: "pointer" },
  darkButton: { background: "#334155", color: "white", border: "none", borderRadius: 14, padding: "13px 18px", fontWeight: "bold", cursor: "pointer" },
  message: { background: "white", padding: 14, borderRadius: 14, marginBottom: 18 },
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 },
  statCard: { background: "white", borderRadius: 18, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,.06)" },
  contentGrid: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 },
  boardWrapper: { background: "white", borderRadius: 22, padding: 20 },
  boardHeader: { marginBottom: 16 },
  board: { display: "grid", gridTemplateColumns: "repeat(7, minmax(220px, 1fr))", gap: 14, overflowX: "auto", paddingBottom: 12 },
  column: { background: "#e2e8f0", borderRadius: 18, padding: 12, minHeight: 420 },
  columnHeader: { display: "flex", justifyContent: "space-between", marginBottom: 12, color: "#071b4d" },
  empty: { border: "1px dashed #94a3b8", borderRadius: 14, padding: 14, textAlign: "center", color: "#64748b" },
  leadCard: { width: "100%", background: "white", border: "none", borderRadius: 16, padding: 14, textAlign: "left", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,.08)", cursor: "pointer" },
  detailPanel: { background: "white", borderRadius: 22, padding: 20 },
  nextBox: { background: "#071b4d", color: "white", padding: 16, borderRadius: 16, marginTop: 14 },
  quickAdd: { marginTop: 24, borderTop: "1px solid #e2e8f0", paddingTop: 18 },
  form: { display: "grid", gap: 10 },
  input: { padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 15 },
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal: { background: "white", padding: 24, borderRadius: 20, width: "100%", maxWidth: 520, display: "grid", gap: 12 },
};
