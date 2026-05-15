"use client";

import React, { useMemo, useState } from "react";
import {
  Search, Plus, Bell, CalendarDays, Home, Users, FileText, DollarSign,
  MapPin, Phone, Mail, CheckCircle2, Clock, AlertTriangle, Filter,
  Upload, ClipboardList, BarChart3, Menu, X, ChevronRight
} from "lucide-react";

const stages = ["New Lead", "Inspection", "Insurance", "Estimate", "Signed", "Production", "Closed"];

const initialJobs = [
  { id: 1, name: "Scott Wampler", address: "9 Faulkner Cir, Greer SC", phone: "803-555-0148", email: "scott@email.com", stage: "Insurance", value: 14850, rep: "Michael", priority: "High", next: "Request re-inspection", due: "Today", source: "Door Knock" },
  { id: 2, name: "Sarah Mitchell", address: "221 Diamond Dr, Shelby NC", phone: "704-555-0192", email: "sarah@email.com", stage: "Inspection", value: 12500, rep: "Austin", priority: "Medium", next: "Inspect roof + soft metals", due: "Tomorrow", source: "Referral" },
  { id: 3, name: "David Carter", address: "88 Stadium Ln, Gaffney SC", phone: "864-555-0160", email: "david@email.com", stage: "Estimate", value: 16975, rep: "Michael", priority: "Medium", next: "Send estimate", due: "Friday", source: "Website" },
  { id: 4, name: "Kelly Johnson", address: "410 Home Plate Rd, Blacksburg SC", phone: "864-555-0172", email: "kelly@email.com", stage: "Production", value: 21200, rep: "Chris", priority: "High", next: "Order materials", due: "Monday", source: "Door Knock" },
  { id: 5, name: "Brian Thomas", address: "735 Victory Ave, Earl NC", phone: "704-555-0133", email: "brian@email.com", stage: "Signed", value: 13200, rep: "Austin", priority: "Low", next: "Collect deposit", due: "Wednesday", source: "Facebook" },
  { id: 6, name: "Angela Brooks", address: "115 Grand Slam Ct, Spartanburg SC", phone: "864-555-0188", email: "angela@email.com", stage: "New Lead", value: 9800, rep: "Michael", priority: "Medium", next: "Call homeowner", due: "Today", source: "Yard Sign" },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function StatCard({ title, value, sub, icon: Icon }) {
  return (
    <div className="stat-card">
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{sub}</span>
      </div>
      <div className="stat-icon"><Icon size={23} /></div>
    </div>
  );
}

function JobCard({ job, onOpen }) {
  return (
    <button className="job-card" onClick={() => onOpen(job)}>
      <div className="job-top">
        <div>
          <div className="job-name-row">
            <strong>{job.name}</strong>
            <span className={`priority ${job.priority.toLowerCase()}`}>{job.priority}</span>
          </div>
          <small><MapPin size={13} /> {job.address}</small>
        </div>
        <ChevronRight size={18} />
      </div>
      <div className="next-play">
        <span>Next play</span>
        <b>{job.next}</b>
      </div>
      <div className="job-bottom">
        <strong>{money.format(job.value)}</strong>
        <span>Due {job.due}</span>
      </div>
    </button>
  );
}

export default function Page() {
  const [jobs, setJobs] = useState(initialJobs);
  const [query, setQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [activeJob, setActiveJob] = useState(initialJobs[0]);
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = [job.name, job.address, job.rep, job.stage, job.source].join(" ").toLowerCase();
      return searchText.includes(query.toLowerCase()) && (selectedStage === "All" || job.stage === selectedStage);
    });
  }, [jobs, query, selectedStage]);

  const pipelineValue = filtered.reduce((sum, job) => sum + job.value, 0);
  const signedValue = jobs.filter((job) => ["Signed", "Production", "Closed"].includes(job.stage)).reduce((sum, job) => sum + job.value, 0);

  function moveJob(id, stage) {
    setJobs((current) => current.map((job) => job.id === id ? { ...job, stage } : job));
    setActiveJob((job) => job?.id === id ? { ...job, stage } : job);
  }

  const navItems = [
    [Home, "Dashboard"], [Users, "Customers"], [ClipboardList, "Boards"], [CalendarDays, "Calendar"],
    [FileText, "Files"], [DollarSign, "Sales"], [BarChart3, "Reports"]
  ];

  return (
    <div className="app">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="logo-wrap">
          <img src="/logo.jpg" alt="Home Run Roofing Logo" />
          <button className="mobile-close" onClick={() => setMobileNav(false)}><X /></button>
        </div>

        <nav>
          {navItems.map(([Icon, label], index) => (
            <button key={label} className={index === 0 ? "active" : ""}>
              <Icon size={20} /> {label}
            </button>
          ))}
        </nav>

        <div className="motto-card">
          <span>Team Motto</span>
          <h2>We knock it out of the park.</h2>
          <p>Track every lead, claim, estimate, file, and production step from one dugout.</p>
        </div>
      </aside>

      <main>
        <header>
          <button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu /></button>
          <div>
            <p>Home Run Roofing CRM</p>
            <h1>Sales Pipeline</h1>
          </div>
          <div className="header-actions">
            <label className="search">
              <Search size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer, address, rep, or source..." />
            </label>
            <button className="icon-button"><Bell size={20} /></button>
            <button className="new-job"><Plus size={18} /> New Job</button>
          </div>
        </header>

        <section className="content">
          <div className="stats-grid">
            <StatCard title="Open Pipeline" value={money.format(pipelineValue)} sub={`${filtered.length} active opportunities`} icon={DollarSign} />
            <StatCard title="Signed / Production" value={money.format(signedValue)} sub="Booked revenue on deck" icon={CheckCircle2} />
            <StatCard title="Today's Follow Ups" value="11" sub="Calls, texts, inspections" icon={Clock} />
            <StatCard title="Needs Attention" value="4" sub="Insurance, photos, supplements" icon={AlertTriangle} />
          </div>

          <div className="workspace">
            <section className="board-panel">
              <div className="panel-head">
                <div>
                  <h2>Board View</h2>
                  <p>Move jobs through each stage like JobNimbus or AccuLynx-style production boards.</p>
                </div>
                <div className="stage-filters">
                  {["All", ...stages].map((stage) => (
                    <button key={stage} onClick={() => setSelectedStage(stage)} className={selectedStage === stage ? "selected" : ""}>{stage}</button>
                  ))}
                  <button><Filter size={14} /> Filter</button>
                </div>
              </div>

              <div className="board">
                {stages.map((stage) => {
                  const columnJobs = filtered.filter((job) => job.stage === stage);
                  return (
                    <div className="column" key={stage}>
                      <div className="column-head">
                        <h3>{stage}</h3>
                        <span>{columnJobs.length}</span>
                      </div>
                      <div className="cards">
                        {columnJobs.map((job) => <JobCard key={job.id} job={job} onOpen={setActiveJob} />)}
                        {!columnJobs.length && <div className="empty">No jobs here</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="details">
              <div className="customer-card">
                <div className="customer-head">
                  <div>
                    <span>Customer File</span>
                    <h2>{activeJob.name}</h2>
                  </div>
                  <b>{activeJob.stage}</b>
                </div>
                <div className="contact-lines">
                  <p><MapPin size={17} /> {activeJob.address}</p>
                  <p><Phone size={17} /> {activeJob.phone}</p>
                  <p><Mail size={17} /> {activeJob.email}</p>
                </div>
                <div className="mini-grid">
                  <div><span>Contract</span><b>{money.format(activeJob.value)}</b></div>
                  <div><span>Rep</span><b>{activeJob.rep}</b></div>
                  <div><span>Source</span><b>{activeJob.source}</b></div>
                  <div><span>Due</span><b>{activeJob.due}</b></div>
                </div>
                <div className="action-box">
                  <span>Next Best Action</span>
                  <b>{activeJob.next}</b>
                </div>
                <label className="stage-select">
                  Update Stage
                  <select value={activeJob.stage} onChange={(e) => moveJob(activeJob.id, e.target.value)}>
                    {stages.map((stage) => <option key={stage}>{stage}</option>)}
                  </select>
                </label>
              </div>

              <div className="daily-card">
                <h2>Daily Dugout</h2>
                {[
                  ["Follow up with new leads", 7, Phone],
                  ["Upload inspection photos", 4, Upload],
                  ["Estimates waiting", 3, FileText],
                  ["Production items", 5, ClipboardList],
                ].map(([label, count, Icon]) => (
                  <button key={label}><span><Icon size={18} /> {label}</span><b>{count}</b></button>
                ))}
              </div>

              <div className="quick-add">
                <h2>Quick Add</h2>
                <input placeholder="Homeowner name" />
                <input placeholder="Property address" />
                <button>Add Lead</button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}