"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const stages = ["New Lead", "Inspection", "Insurance", "Estimate", "Signed", "Production", "Closed"];

export default function Page() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
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
        status: form.status,
        sales_rep: form.sales_rep,
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

    loadLeads();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#071b4d", color: "white", padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 34 }}>Home Run Roofing CRM</h1>
        <p style={{ marginTop: 8 }}>We knock it out of the park.</p>
        <button onClick={() => setShowForm(true)} style={buttonStyle}>+ New Job</button>
      </div>

      <div style={{ padding: 24 }}>
        {message && (
          <div style={{ padding: 14, marginBottom: 20, background: "white", borderRadius: 12 }}>
            {message}
          </div>
        )}

        <section style={{ background: "white", padding: 20, borderRadius: 18, marginBottom: 24 }}>
          <h2>Quick Add Lead</h2>
          <form onSubmit={saveLead} style={{ display: "grid", gap: 12 }}>
            <input name="homeowner_name" placeholder="Homeowner Name" value={form.homeowner_name} onChange={updateForm} required style={inputStyle} />
            <input name="address" placeholder="Address" value={form.address} onChange={updateForm} required style={inputStyle} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={updateForm} style={inputStyle} />
            <input name="email" placeholder="Email" value={form.email} onChange={updateForm} style={inputStyle} />
            <input name="estimated_value" placeholder="Estimated Value" value={form.estimated_value} onChange={updateForm} style={inputStyle} />
            <button type="submit" style={buttonStyle}>Save Lead</button>
          </form>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(220px, 1fr))", gap: 14, overflowX: "auto" }}>
          {stages.map((stage) => (
            <div key={stage} style={{ background: "#e2e8f0", borderRadius: 16, padding: 12 }}>
              <h3>{stage}</h3>
              {leads.filter((lead) => lead.status === stage).map((lead) => (
                <div key={lead.id} style={cardStyle}>
                  <strong>{lead.homeowner_name}</strong>
                  <p>{lead.address}</p>
                  <p>{lead.phone}</p>
                  <p>{lead.estimated_value ? `$${lead.estimated_value}` : ""}</p>
                </div>
              ))}
            </div>
          ))}
        </section>
      </div>

      {showForm && (
        <div style={modalBg}>
          <form onSubmit={saveLead} style={modalCard}>
            <h2>New Job</h2>
            <input name="homeowner_name" placeholder="Homeowner Name" value={form.homeowner_name} onChange={updateForm} required style={inputStyle} />
            <input name="address" placeholder="Address" value={form.address} onChange={updateForm} required style={inputStyle} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={updateForm} style={inputStyle} />
            <input name="email" placeholder="Email" value={form.email} onChange={updateForm} style={inputStyle} />
            <input name="lead_source" placeholder="Lead Source" value={form.lead_source} onChange={updateForm} style={inputStyle} />
            <input name="estimated_value" placeholder="Estimated Value" value={form.estimated_value} onChange={updateForm} style={inputStyle} />
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={updateForm} style={inputStyle} />
            <button type="submit" style={buttonStyle}>Save Job</button>
            <button type="button" onClick={() => setShowForm(false)} style={cancelStyle}>Cancel</button>
          </form>
        </div>
      )}
    </main>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 16,
};

const buttonStyle = {
  marginTop: 12,
  background: "#b91c1c",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const cancelStyle = {
  marginTop: 10,
  background: "#334155",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const cardStyle = {
  background: "white",
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
};

const modalBg = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const modalCard = {
  background: "white",
  padding: 24,
  borderRadius: 18,
  width: "100%",
  maxWidth: 500,
  display: "grid",
  gap: 12,
};
