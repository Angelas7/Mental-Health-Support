import { useEffect, useState } from "react";
import { supabase, hasSupabaseConfig } from "./lib/supabase.js";
import { isFutureAppointmentRange } from "./lib/portal-utils.js";
import MarketingHome from "./MarketingHome.jsx";
import { BookHeart, CalendarDays, Check, CircleHelp, Heart, Leaf, LogOut, LockKeyhole, Moon, Smile, Sparkles, UserRound } from "lucide-react";

const moods = [
  { label: "Very low", emoji: "🌧️" },
  { label: "Low", emoji: "🌫️" },
  { label: "Okay", emoji: "🌿" },
  { label: "Good", emoji: "🌤️" },
  { label: "Great", emoji: "☀️" }
];

function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { display_name: name } }
        });
        if (error) throw error;
        setMessage(data.session ? "Your account is ready. Welcome to your space." : "Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) { setMessage(error.message || "Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  return <main className="auth-shell">
    <div className="auth-art">
      <div className="brand"><span className="brand-mark"><Leaf size={18}/></span> Balenza Therapy</div>
      <div className="art-copy"><span className="eyebrow">A LITTLE SPACE FOR YOU</span><h1>Come as you are.<br/><em>Take a breath.</em></h1><p>Your wellbeing journey, held with care and privacy.</p></div>
      <div className="art-orb orb-one"/><div className="art-orb orb-two"/><div className="art-orb orb-three"/>
      <span className="art-note">one moment at a time</span>
    </div>
    <section className="auth-panel">
      <div className="auth-card">
        <span className="eyebrow">{mode === "signin" ? "WELCOME BACK" : "A NEW BEGINNING"}</span>
        <h2>{mode === "signin" ? "Your space is here." : "Let's make space."}</h2>
        <p className="muted">{mode === "signin" ? "Sign in to continue your journey." : "Create your private patient account."}</p>
        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && <label>Your name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required /></label>}
          <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required /></label>
          <button className="primary-btn" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
        </form>
        {message && <p className="notice" role="status">{message}</p>}
        <p className="switch-auth">{mode === "signin" ? "New to Balenza Therapy?" : "Already have an account?"} <button onClick={()=>{setMode(mode === "signin" ? "signup" : "signin");setMessage("");}}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p>
        <p className="privacy-line"><LockKeyhole size={13}/> Your account is private. Please don't use this demo with real health information.</p>
      </div>
    </section>
  </main>;
}

function PatientHome({ profile, session }) {
  const [tab, setTab] = useState("overview");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [journal, setJournal] = useState(() => sessionStorage.getItem(`balenza-journal-draft:${session.user.id}`) || "");
  const [entries, setEntries] = useState([]);
  const [moodsLog, setMoodsLog] = useState([]);
  const [homework, setHomework] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [therapistId, setTherapistId] = useState("");
  const [consent, setConsent] = useState({journal:false,mood:false,homework:false,appointments:false});
  const [status, setStatus] = useState("");

  async function load() {
    const [j, m, h, a, c] = await Promise.all([
      supabase.from("journal_entries").select("id,title,body,created_at").order("created_at",{ascending:false}).limit(10),
      supabase.from("mood_entries").select("id,mood,note,recorded_at").order("recorded_at",{ascending:false}).limit(10),
      supabase.from("homework").select("id,title,instructions,due_at,status").order("due_at",{ascending:true}),
      supabase.from("appointments").select("id,starts_at,ends_at,status").order("starts_at",{ascending:true}),
      supabase.from("therapist_patient_access").select("id,therapist_id,status,can_view_journal,can_view_mood,can_manage_homework,can_manage_appointments").order("created_at",{ascending:false})
    ]);
    if (j.error || m.error || h.error || a.error || c.error) {
      setStatus("Some information could not be loaded. Please refresh or contact your portal administrator.");
      return;
    }
    setEntries(j.data || []); setMoodsLog(m.data || []); setHomework(h.data || []); setAppointments(a.data || []); setAccessRequests(c.data || []);
  }
  useEffect(()=>{ load(); }, []);

  async function saveMood(event) {
    event.preventDefault(); if (!mood) return;
    const { error } = await supabase.from("mood_entries").insert({ patient_id: session.user.id, mood, note });
    if (error) setStatus(error.message); else { setMood(""); setNote(""); setStatus("Your check-in has been saved."); load(); }
  }
  async function saveJournal(event) {
    event.preventDefault(); if (!journal.trim()) return;
    const { error } = await supabase.from("journal_entries").insert({ patient_id: session.user.id, body: journal.trim(), title: "A journal entry" });
    if (error) setStatus(error.message); else { setJournal(""); sessionStorage.removeItem(`balenza-journal-draft:${session.user.id}`); setStatus("Your entry has been saved privately."); load(); }
  }
  async function requestTherapist(event) {
    event.preventDefault();
    const {error}=await supabase.from("therapist_patient_access").insert({patient_id:session.user.id,therapist_id:therapistId.trim(),status:"pending"});
    if(error) setStatus(error.message); else {setTherapistId("");setStatus("Your access request has been sent. No information is shared until you approve specific permissions.");load();}
  }
  async function approveTherapist(id) {
    const {error}=await supabase.rpc("patient_approve_therapist_access",{p_access_id:id,p_can_view_journal:consent.journal,p_can_view_mood:consent.mood,p_can_manage_homework:consent.homework,p_can_manage_appointments:consent.appointments});
    if(error) setStatus(error.message); else {setStatus("Your selected permissions have been approved.");setConsent({journal:false,mood:false,homework:false,appointments:false});load();}
  }
  async function revokeTherapist(id) {
    const {error}=await supabase.rpc("patient_revoke_therapist_access",{p_access_id:id});
    if(error) setStatus(error.message); else {setStatus("Therapist access has been revoked.");load();}
  }
  async function completeTask(id) {
    const { error } = await supabase.from("homework").update({status:"completed"}).eq("id",id);
    if (error) setStatus(error.message); else { setStatus("Task marked complete."); load(); }
  }
  const firstName = profile?.display_name?.split(" ")[0] || "there";
  return <div className="portal-shell">
    <aside className="sidebar">
      <a className="brand" href="#"><span className="brand-mark"><Leaf size={18}/></span> Balenza Therapy</a>
      <span className="side-label">YOUR SPACE</span>
      <nav className="side-nav">
        <button className={tab==="overview"?"active":""} onClick={()=>setTab("overview")}><Sparkles size={17}/> Overview</button>
        <button className={tab==="mood"?"active":""} onClick={()=>setTab("mood")}><Smile size={17}/> Mood check-in</button>
        <button className={tab==="journal"?"active":""} onClick={()=>setTab("journal")}><BookHeart size={17}/> My journal</button>
        <button className={tab==="homework"?"active":""} onClick={()=>setTab("homework")}><Check size={17}/> My homework</button>
        <button className={tab==="appointments"?"active":""} onClick={()=>setTab("appointments")}><CalendarDays size={17}/> Appointments</button>
        <button className={tab==="care"?"active":""} onClick={()=>setTab("care")}><Heart size={17}/> Care team</button>
      </nav>
      <div className="sidebar-bottom"><div className="profile-chip"><span className="avatar"><UserRound size={16}/></span><span><strong>{profile?.display_name || "Your account"}</strong><small>Patient</small></span></div><button className="signout" onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Sign out</button></div>
    </aside>
    <main className="workspace">
      <header className="topbar"><div><span className="eyebrow">YOUR PRIVATE SPACE</span><p>Welcome, {firstName}</p></div><span className="secure-tag"><LockKeyhole size={13}/> Private space</span></header>
      {status && <div className="status-banner" role="status">{status}<button onClick={()=>setStatus("")}>Dismiss</button></div>}
      {tab==="overview" && <><section className="welcome-card"><div><span className="eyebrow">A GENTLE REMINDER</span><h1>You don't have to<br/><em>figure it all out today.</em></h1><p>Take things at your own pace. This is a space to pause, reflect and care for yourself.</p><button className="primary-btn" onClick={()=>setTab("mood")}>How am I feeling today?</button></div><div className="welcome-flower">✿</div></section><div className="summary-grid"><article className="summary-card"><span className="summary-icon lavender"><Smile/></span><small>MOOD CHECK-INS</small><strong>{moodsLog.length}</strong><span>recent entries</span></article><article className="summary-card"><span className="summary-icon blush"><BookHeart/></span><small>JOURNAL ENTRIES</small><strong>{entries.length}</strong><span>recent reflections</span></article><article className="summary-card"><span className="summary-icon sky"><CalendarDays/></span><small>UPCOMING SESSIONS</small><strong>{appointments.filter(x=>x.status==="scheduled" && new Date(x.starts_at)>new Date()).length}</strong><span>scheduled appointments</span></article></div><section className="content-card"><div className="section-heading"><div><span className="eyebrow">YOUR NEXT STEPS</span><h2>Little things to return to</h2></div></div><div className="quick-links"><button onClick={()=>setTab("journal")}><BookHeart/>Write a reflection <span>→</span></button><button onClick={()=>setTab("homework")}><Check/>Review your homework <span>→</span></button><button onClick={()=>setTab("appointments")}><CalendarDays/>See your appointments <span>→</span></button></div></section></>}
      {tab==="mood" && <section className="content-card page-card"><span className="eyebrow">CHECK IN WITH YOURSELF</span><h1>How are you <em>feeling?</em></h1><p className="muted">There is no right or wrong answer. Just notice where you are.</p><form onSubmit={saveMood}><div className="mood-picker">{moods.map(m=><button type="button" key={m.label} className={mood===m.label?"mood-choice selected":"mood-choice"} onClick={()=>setMood(m.label)}><span>{m.emoji}</span>{m.label}</button>)}</div><label className="field-label">Anything you'd like to add? <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="A thought, a feeling, or just a few words…" rows={4}/></label><button className="primary-btn" disabled={!mood}>Save check-in</button></form><div className="history-list"><h3>Recent check-ins</h3>{moodsLog.map(x=><div className="history-row" key={x.id}><span>{moods.find(m=>m.label===x.mood)?.emoji || "🌿"} {x.mood}</span><small>{new Date(x.recorded_at).toLocaleString()}</small></div>)}</div></section>}
      {tab==="journal" && <section className="content-card page-card"><span className="eyebrow">A PLACE TO PUT YOUR THOUGHTS</span><h1>Your <em>journal.</em></h1><p className="muted">Write freely. Your entries are private to you unless you explicitly grant a therapist access.</p><form onSubmit={saveJournal}><textarea className="journal-input" value={journal} onChange={e=>{setJournal(e.target.value);sessionStorage.setItem(`balenza-journal-draft:${session.user.id}`,e.target.value);}} placeholder="Start wherever you are…" rows={8}/><button className="primary-btn" disabled={!journal.trim()}>Save entry</button></form><div className="history-list"><h3>Past reflections</h3>{entries.map(x=><article className="journal-item" key={x.id}><small>{new Date(x.created_at).toLocaleString()}</small><p>{x.body}</p></article>)}</div></section>}
      {tab==="homework" && <section className="content-card page-card"><span className="eyebrow">GENTLE PROGRESS</span><h1>Your <em>homework.</em></h1><p className="muted">Activities shared with you by your therapist.</p>{homework.length===0?<p className="empty-state">No homework has been assigned yet. That's okay.</p>:homework.map(x=><article className="task-item" key={x.id}><div><strong>{x.title}</strong><p>{x.instructions}</p><small>{x.due_at ? "Due "+new Date(x.due_at).toLocaleDateString() : "No due date"} · {x.status}</small></div>{x.status!=="completed"&&<button className="small-btn" onClick={()=>completeTask(x.id)}>Mark complete</button>}</article>)}</section>}
      {tab==="care" && <section className="content-card page-card"><span className="eyebrow">YOUR CHOICE, YOUR CONTROL</span><h1>Your <em>care team.</em></h1><p className="muted">Enter the therapist account ID they shared with you. Nothing is shared until you approve each permission below.</p><form className="assign-form" onSubmit={requestTherapist}><label>Therapist account ID<input value={therapistId} onChange={e=>setTherapistId(e.target.value)} placeholder="Therapist UUID" required/></label><button className="primary-btn">Request connection</button></form><div className="history-list"><h3>Connection requests and permissions</h3>{accessRequests.length===0?<p className="empty-state">No therapist connections yet.</p>:accessRequests.map(x=><article className="task-item" key={x.id}><div><strong>{x.therapist_id.slice(0,8)}…</strong><p>Status: {x.status}</p>{x.status==="active"&&<small>Journal: {x.can_view_journal?"allowed":"private"} · Mood: {x.can_view_mood?"allowed":"private"} · Homework: {x.can_manage_homework?"allowed":"not allowed"} · Appointments: {x.can_manage_appointments?"allowed":"not allowed"}</small>}</div>{x.status==="pending"?<div className="consent-actions"><label><input type="checkbox" checked={consent.journal} onChange={e=>setConsent(v=>({...v,journal:e.target.checked}))}/> Journal</label><label><input type="checkbox" checked={consent.mood} onChange={e=>setConsent(v=>({...v,mood:e.target.checked}))}/> Mood</label><label><input type="checkbox" checked={consent.homework} onChange={e=>setConsent(v=>({...v,homework:e.target.checked}))}/> Homework</label><label><input type="checkbox" checked={consent.appointments} onChange={e=>setConsent(v=>({...v,appointments:e.target.checked}))}/> Appointments</label><button className="small-btn" onClick={()=>approveTherapist(x.id)}>Approve selected</button></div>:x.status==="active"?<button className="small-btn" onClick={()=>revokeTherapist(x.id)}>Revoke access</button>:null}</article>)}</div></section>}
      {tab==="appointments" && <section className="content-card page-card"><span className="eyebrow">TIME SET ASIDE FOR YOU</span><h1>Your <em>appointments.</em></h1><p className="muted">Your upcoming sessions and appointment details.</p>{appointments.length===0?<p className="empty-state">No appointments are scheduled yet.</p>:appointments.map(x=><article className="task-item" key={x.id}><div><strong>{new Date(x.starts_at).toLocaleString()}</strong><p>Ends {new Date(x.ends_at).toLocaleTimeString()} · {x.status}</p></div></article>)}</section>}
      <footer className="portal-footer"><span>Balenza Therapy · One moment at a time</span><span><CircleHelp size={13}/> Not an emergency or crisis service.</span></footer>
    </main>
  </div>;
}

function TherapistHome({ profile }) {
  const [access, setAccess] = useState([]);
  const [homework, setHomework] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [due, setDue] = useState("");
  const [appointmentPatientId,setAppointmentPatientId]=useState("");
  const [appointmentStart,setAppointmentStart]=useState("");
  const [appointmentEnd,setAppointmentEnd]=useState("");
  const [message, setMessage] = useState("");
  async function load() {
    const [a,h,s] = await Promise.all([
      supabase.from("therapist_patient_access").select("id,patient_id,status,can_view_journal,can_view_mood,can_manage_homework,can_manage_appointments").eq("therapist_id",profile.id),
      supabase.from("homework").select("id,patient_id,title,status,due_at").eq("therapist_id",profile.id),
      supabase.from("appointments").select("id,patient_id,starts_at,status").eq("therapist_id",profile.id)
    ]);
    if (a.error || h.error || s.error) setMessage("Some information could not be loaded. Please check your project policies.");
    setAccess(a.data||[]);setHomework(h.data||[]);setAppointments(s.data||[]);
  }
  useEffect(()=>{load();},[]);
  async function assign(event) {
    event.preventDefault();
    const grant = access.find(x=>x.patient_id===patientId && x.status==="active" && x.can_manage_homework);
    if (!grant) { setMessage("This patient has not approved homework management access."); return; }
    const {error}=await supabase.from("homework").insert({patient_id:patientId,therapist_id:profile.id,title,instructions,due_at:due||null});
    if(error) setMessage(error.message); else {setMessage("Homework assigned.");setPatientId("");setTitle("");setInstructions("");setDue("");load();}
  }
  async function scheduleAppointment(event) {
    event.preventDefault();
    const grant=access.find(x=>x.patient_id===appointmentPatientId && x.status==="active" && x.can_manage_appointments);
    if(!grant){setMessage("This patient has not approved appointment management access.");return;}
    if(!isFutureAppointmentRange(appointmentStart, appointmentEnd)){setMessage("Choose a future start time and an end time after it.");return;}
    const starts=new Date(appointmentStart), ends=new Date(appointmentEnd);
    const {error}=await supabase.from("appointments").insert({patient_id:appointmentPatientId,therapist_id:profile.id,starts_at:starts.toISOString(),ends_at:ends.toISOString(),reminder_enabled:false});
    if(error)setMessage(error.message);else{setMessage("Appointment scheduled.");setAppointmentPatientId("");setAppointmentStart("");setAppointmentEnd("");load();}
  }
  return <div className="portal-shell"><aside className="sidebar"><a className="brand" href="#"><span className="brand-mark"><Leaf size={18}/></span> Balenza Therapy</a><span className="side-label">PRACTICE SPACE</span><div className="side-nav"><span className="nav-static"><CalendarDays size={17}/> Overview</span></div><div className="sidebar-bottom"><div className="profile-chip"><span className="avatar"><UserRound size={16}/></span><span><strong>{profile.display_name||"Therapist"}</strong><small>Therapist</small></span></div><button className="signout" onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Sign out</button></div></aside><main className="workspace"><header className="topbar"><div><span className="eyebrow">PRACTICE SPACE</span><p>Welcome back</p></div><span className="secure-tag"><LockKeyhole size={13}/> Restricted access</span></header>{message&&<div className="status-banner">{message}<button onClick={()=>setMessage("")}>Dismiss</button></div>}<section className="welcome-card therapist-welcome"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>Care, with <em>connection.</em></h1><p>Only patient relationships and permissions approved by the patient appear here.</p></div><div className="welcome-flower">✿</div></section><div className="summary-grid"><article className="summary-card"><small>APPROVED RELATIONSHIPS</small><strong>{access.filter(x=>x.status==="active").length}</strong></article><article className="summary-card"><small>ASSIGNED ACTIVITIES</small><strong>{homework.length}</strong></article><article className="summary-card"><small>APPOINTMENTS</small><strong>{appointments.length}</strong></article></div><section className="content-card"><span className="eyebrow">PATIENT PERMISSIONS</span><h2>Approved relationships</h2>{access.length===0?<p className="empty-state">No patient relationships are connected yet.</p>:access.map(x=><div className="history-row" key={x.id}><span>{x.patient_id.slice(0,8)}…</span><small>{x.status} · Journal {x.can_view_journal?"yes":"no"} · Mood {x.can_view_mood?"yes":"no"}</small></div>)}</section><section className="content-card"><span className="eyebrow">SUPPORT BETWEEN SESSIONS</span><h2>Assign an activity</h2><p className="muted">Only assign tasks when the patient has approved homework management for your relationship.</p><form className="assign-form" onSubmit={assign}><label>Patient ID<input value={patientId} onChange={e=>setPatientId(e.target.value)} placeholder="Patient account UUID" required/></label><label>Activity title<input value={title} onChange={e=>setTitle(e.target.value)} required/></label><label>Instructions<textarea value={instructions} onChange={e=>setInstructions(e.target.value)} rows={3}/></label><label>Due date<input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label><button className="primary-btn">Assign activity</button></form></section><section className="content-card" style={{marginTop:18}}><span className="eyebrow">TIME SET ASIDE FOR CARE</span><h2>Schedule an appointment</h2><p className="muted">Only schedule for a patient who has approved appointment management.</p><form className="assign-form" onSubmit={scheduleAppointment}><label>Patient ID<input value={appointmentPatientId} onChange={e=>setAppointmentPatientId(e.target.value)} placeholder="Patient account UUID" required/></label><label>Starts at<input type="datetime-local" value={appointmentStart} onChange={e=>setAppointmentStart(e.target.value)} required/></label><label>Ends at<input type="datetime-local" value={appointmentEnd} onChange={e=>setAppointmentEnd(e.target.value)} required/></label><button className="primary-btn">Schedule session</button></form><div className="history-list"><h3>Scheduled sessions</h3>{appointments.map(x=><div className="history-row" key={x.id}><span>{x.patient_id.slice(0,8)}…</span><small>{new Date(x.starts_at).toLocaleString()} · {x.status}</small></div>)}</div></section><footer className="portal-footer"><span>Balenza Therapy · One moment at a time</span><span>Patient information is permission-scoped.</span></footer></main></div>;
}

function AdminHome({ profile }) {
  const [users,setUsers]=useState([]);
  const [email,setEmail]=useState("");
  const [name,setName]=useState("");
  const [role,setRole]=useState("patient");
  const [message,setMessage]=useState("");
  async function loadUsers(){
    const {data,error}=await supabase.functions.invoke("admin-list-users",{body:{}});
    if(error) setMessage(error.message); else setUsers(data.users||[]);
  }
  useEffect(()=>{loadUsers();},[]);
  async function invite(event){
    event.preventDefault();
    const {data,error}=await supabase.functions.invoke("admin-invite-user",{body:{email,display_name:name,role}});
    if(error) setMessage(error.message); else {setMessage("Invitation sent. Ask the user to check their inbox.");setEmail("");setName("");loadUsers();}
  }
  return <div className="portal-shell"><aside className="sidebar"><a className="brand" href="#"><span className="brand-mark"><Leaf size={18}/></span> Balenza Therapy</a><span className="side-label">PLATFORM</span><div className="side-nav"><span className="nav-static"><UserRound size={17}/> Accounts</span></div><div className="sidebar-bottom"><div className="profile-chip"><span className="avatar"><UserRound size={16}/></span><span><strong>{profile.display_name||"Administrator"}</strong><small>Platform admin</small></span></div><button className="signout" onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Sign out</button></div></aside><main className="workspace"><header className="topbar"><div><span className="eyebrow">PLATFORM ADMINISTRATION</span><p>Account management</p></div><span className="secure-tag"><LockKeyhole size={13}/> No clinical record access</span></header>{message&&<div className="status-banner">{message}<button onClick={()=>setMessage("")}>Dismiss</button></div>}<section className="welcome-card"><div><span className="eyebrow">ADMINISTRATOR SPACE</span><h1>Manage access,<br/><em>protect privacy.</em></h1><p>Invite and manage portal accounts. Patient journal and mood content are not available in this workspace.</p></div><div className="welcome-flower">✿</div></section><section className="content-card" style={{marginTop:22}}><span className="eyebrow">ACCOUNT PROVISIONING</span><h2>Invite a patient or therapist</h2><form className="assign-form" onSubmit={invite}><label>Full name<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Account type<select value={role} onChange={e=>setRole(e.target.value)}><option value="patient">Patient</option><option value="therapist">Therapist</option></select></label><button className="primary-btn">Send invitation</button></form></section><section className="content-card" style={{marginTop:18}}><span className="eyebrow">PORTAL ACCOUNTS</span><h2>Account directory</h2>{users.map(u=><div className="history-row" key={u.id}><span><strong>{u.display_name||"Unnamed account"}</strong><small>{u.email}</small></span><small>{u.role}</small></div>)}</section><footer className="portal-footer"><span>Balenza Therapy · Platform administration</span><span>Clinical records remain restricted.</span></footer></main></div>;
}

export default function App() {
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [showAuth,setShowAuth]=useState(false);
  useEffect(()=>{
    if(!hasSupabaseConfig){setLoading(false);return;}
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));
    return ()=>subscription.unsubscribe();
  },[]);
  useEffect(()=>{
    let live=true;
    async function getProfile(){
      if(!session){if(live){setProfile(null);setLoading(false);}return;}
      setLoading(true);
      const {data,error}=await supabase.from("profiles").select("id,display_name,role").eq("id",session.user.id).single();
      if(live){setProfile(data);setError(error ? "Your profile could not be loaded. Confirm that the database migrations have been applied." : "");setLoading(false);}
    }
    getProfile();
    return ()=>{live=false;};
  },[session]);
  if(!hasSupabaseConfig)return <div className="setup-screen"><div className="setup-card"><div className="brand"><span className="brand-mark"><Leaf size={18}/></span> Balenza Therapy</div><span className="eyebrow">PORTAL SETUP</span><h1>Your calm space is <em>taking shape.</em></h1><p>The portal interface is ready for local setup. Add your Supabase project URL and publishable/anon key to <code>portal/.env.local</code>, then restart the development server.</p><p className="muted">Never place a service-role key or email-provider secret in this file.</p></div></div>;
  if(loading)return <div className="loading-screen">A moment, please…</div>;
  if(!session)return showAuth ? <AuthScreen/> : <MarketingHome onPortalClick={()=>setShowAuth(true)}/>;
  if(error)return <div className="loading-screen">{error} <button onClick={()=>supabase.auth.signOut()}>Sign out</button></div>;
  if(profile?.role==="therapist")return <TherapistHome profile={profile}/>;
  if(profile?.role==="platform_admin")return <AdminHome profile={profile}/>;
  return <PatientHome profile={profile} session={session}/>;
}
