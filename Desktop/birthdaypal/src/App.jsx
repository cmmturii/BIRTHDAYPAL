import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import emailjs from "@emailjs/browser";

// ── Supabase Setup ────────────────────────────────────────────────────────
const supabase = createClient(
  "https://odyovlemiubcdatwyhpk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9keW92bGVtaXViY2RhdHd5aHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzM2NTksImV4cCI6MjA4NzIwOTY1OX0.yna87uzRwmz1eLUTCZLy5DztMdqsH_SHOTLwzlotfqw"
);

// ── EmailJS Setup ─────────────────────────────────────────────────────────
const EMAILJS_SERVICE  = "service_o7pk8t4";
const EMAILJS_TEMPLATE = "template_07ijv0f";
const EMAILJS_KEY      = "iYdC5C2QCpeWOMWf0";
emailjs.init(EMAILJS_KEY);

// Remind days mapping
const REMIND_DAYS = { "1 day":1, "3 days":3, "1 week":7, "2 weeks":14 };

async function sendBirthdayReminder(toEmail, person, daysUntilBday) {
  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
      to_email: toEmail,
      name:     person.name,
      days:     daysUntilBday,
      date:     `${MONTHS_FULL[person.month-1]} ${person.day}`,
      age:      person.year ? new Date().getFullYear() - person.year : "?",
      note:     person.note || "No note added",
    });
    return true;
  } catch(e) {
    console.error("EmailJS error:", e);
    return false;
  }
}

const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function daysUntil(month, day) {
  const now  = new Date();
  const next = new Date(now.getFullYear(), month - 1, day);
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return Math.round((next - now) / 86400000);
}

function urgencyColor(d) {
  if (d <= 0)  return "#FF4D6D";
  if (d <= 7)  return "#FF4D6D";
  if (d <= 21) return "#FF9000";
  return "#00C9A7";
}

function urgencyLabel(d) {
  if (d === 0) return "TODAY 🎉";
  if (d === 1) return "Tomorrow";
  if (d <= 7)  return `${d}d away`;
  return `${d} days`;
}

function launchConfetti() {
  const colors = ["#FF4D6D","#FF9000","#00C9A7","#4A9EF0","#FFD700","#FF8FA3"];
  for (let i = 0; i < 100; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left              = Math.random() * 100 + "vw";
    el.style.background        = colors[Math.floor(Math.random() * colors.length)];
    el.style.width             = (Math.random() * 8 + 6) + "px";
    el.style.height            = (Math.random() * 8 + 6) + "px";
    el.style.borderRadius      = Math.random() > 0.5 ? "50%" : "2px";
    el.style.animationDuration = (Math.random() * 2 + 1.5) + "s";
    el.style.animationDelay    = (Math.random() * 0.5) + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=Poppins:wght@300;400;500;600;700;800&display=swap');
@import url('https://use.fontawesome.com/releases/v6.5.1/css/all.css');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body { font-family: 'Cabinet Grotesk', system-ui, sans-serif; overflow: hidden; }

/* ── Animated Login ── */
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.auth-page {
  min-height: 100vh; width: 100vw; background: #25252b;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 20px; gap: 28px; position: relative; overflow: hidden;
}
.auth-blob-1 { position:absolute; top:-80px; left:-80px; width:500px; height:500px; background:radial-gradient(circle,rgba(255,39,112,0.1),transparent 70%); filter:blur(60px); animation:float 18s ease-in-out infinite alternate; pointer-events:none; }
.auth-blob-2 { position:absolute; bottom:0; right:-60px; width:400px; height:400px; background:radial-gradient(circle,rgba(69,243,255,0.07),transparent 70%); filter:blur(60px); animation:float 22s ease-in-out infinite alternate-reverse; pointer-events:none; }

.auth-logo { position:relative; z-index:10; text-align:center; animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
.auth-logo-icon { font-size:56px; margin-bottom:6px; display:block; }
.auth-logo-title { font-family:'Instrument Serif',serif; font-size:42px; background:linear-gradient(135deg,#ff2770,#45f3ff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.auth-logo-sub { font-size:13px; color:#666; margin-top:4px; font-family:'DM Mono',monospace; letter-spacing:0.05em; }

.box { position:relative; width:420px; height:210px; background:repeating-conic-gradient(from var(--a),#ff2770 0%,#ff2770 5%,transparent 5%,transparent 40%,#ff2770 50%); filter:drop-shadow(0 15px 50px #000); border-radius:20px; animation:rotating 4s linear infinite; display:flex; justify-content:center; align-items:center; transition:0.5s; z-index:10; cursor:pointer; margin:0 auto; }
@keyframes rotating { 0%{--a:0deg} 100%{--a:360deg} }
.box::before { content:""; position:absolute; width:100%; height:100%; background:repeating-conic-gradient(from var(--a),#45f3ff 0%,#45f3ff 5%,transparent 5%,transparent 40%,#45f3ff 50%); filter:drop-shadow(0 15px 50px #000); border-radius:20px; animation:rotating 4s linear infinite; animation-delay:-1s; }
.box::after { content:""; position:absolute; inset:4px; background:#2d2d39; border-radius:15px; border:8px solid #25252b; }
.box.expanded { width:460px; height:540px; }
.box.expanded .login { inset:40px; }
.box.expanded .loginBx { transform:translateY(0px); }
.login { position:absolute; inset:60px; display:flex; justify-content:center; align-items:center; flex-direction:column; border-radius:10px; background:rgba(0,0,0,0.2); color:#fff; z-index:1000; box-shadow:inset 0 10px 20px rgba(0,0,0,0.5); border-bottom:2px solid rgba(255,255,255,0.5); transition:0.5s; overflow:hidden; }
.loginBx { position:relative; display:flex; justify-content:center; align-items:center; flex-direction:column; gap:14px; width:78%; transform:translateY(110px); transition:0.5s; }
.loginBx h2 { text-transform:uppercase; font-weight:700; letter-spacing:0.15em; font-family:'Poppins',sans-serif; font-size:18px; color:#fff; }
.loginBx h2 i { color:#ff2770; text-shadow:0 0 5px #ff2770,0 0 20px #ff2770; }
.auth-mode-switch { display:flex; background:rgba(255,255,255,0.06); border-radius:30px; padding:3px; width:100%; gap:4px; }
.auth-mode-btn { flex:1; padding:8px 0; border-radius:26px; border:none; cursor:pointer; font-family:'Poppins',sans-serif; font-size:12px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; transition:all 0.3s; background:transparent; color:#888; }
.auth-mode-btn.active { background:linear-gradient(135deg,#ff2770,#ff5a88); color:#fff; box-shadow:0 4px 18px rgba(255,39,112,0.4); }
.loginBx input[type="email"], .loginBx input[type="password"] { width:100%; padding:10px 18px; outline:none; border:2px solid rgba(255,255,255,0.3); font-size:0.9em; color:#fff; background:rgba(0,0,0,0.15); border-radius:30px; font-family:'Poppins',sans-serif; transition:border-color 0.3s,box-shadow 0.3s; }
.loginBx input:focus { border-color:#45f3ff; box-shadow:0 0 12px rgba(69,243,255,0.25); }
.loginBx input::placeholder { color:#888; }
.auth-submit-btn { width:100%; padding:11px 20px; border:none; font-size:0.95em; color:#111; background:#45f3ff; border-radius:30px; font-weight:700; cursor:pointer; transition:0.4s; font-family:'Poppins',sans-serif; letter-spacing:0.05em; text-transform:uppercase; }
.auth-submit-btn:hover { box-shadow:0 0 10px #45f3ff,0 0 40px rgba(69,243,255,0.5); }
.auth-submit-btn:disabled { opacity:0.6; cursor:not-allowed; }
.auth-links { width:100%; display:flex; justify-content:space-between; font-size:12px; font-family:'Poppins',sans-serif; }
.auth-links a { color:#fff; text-decoration:none; cursor:pointer; }
.auth-links a:last-child { color:#ff2770; font-weight:600; }
.auth-hint { font-family:'Poppins',sans-serif; font-size:13px; color:#aaa; letter-spacing:0.08em; text-transform:uppercase; animation:pulse-text 2s ease-in-out infinite; }
@keyframes pulse-text { 0%,100%{opacity:0.6} 50%{opacity:1} }
.auth-msg { width:100%; padding:9px 14px; border-radius:20px; font-size:12px; font-family:'Poppins',sans-serif; line-height:1.4; text-align:center; }
.auth-msg.success { background:rgba(0,201,167,0.15); border:1px solid rgba(0,201,167,0.3); color:#00C9A7; }
.auth-msg.error { background:rgba(255,39,112,0.12); border:1px solid rgba(255,39,112,0.3); color:#ff2770; }

/* ── App Layout ── */
.app-shell { display:flex; height:100vh; width:100vw; overflow:hidden; transition:background 0.4s; }
.sidebar { width:220px; flex-shrink:0; display:flex; flex-direction:column; padding:24px 14px; border-right:1px solid; transition:background 0.4s,border-color 0.4s; z-index:10; }
.sidebar-logo { display:flex; align-items:center; gap:10px; padding:0 8px; margin-bottom:32px; }
.sidebar-logo-icon { font-size:26px; }
.sidebar-logo-text { font-family:'Instrument Serif',serif; font-size:22px; background:linear-gradient(135deg,#FF4D6D,#FF8FA3); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.sidebar-nav { display:flex; flex-direction:column; gap:4px; flex:1; }
.nav-btn { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:14px; border:none; cursor:pointer; font-family:'Cabinet Grotesk',sans-serif; font-size:14px; font-weight:600; transition:all 0.2s; text-align:left; width:100%; background:transparent; }
.nav-btn.active { background:linear-gradient(135deg,rgba(255,77,109,0.18),rgba(255,77,109,0.08)); color:#FF4D6D; box-shadow:inset 0 0 0 1px rgba(255,77,109,0.25); }
.nav-btn .nav-icon { font-size:18px; width:22px; text-align:center; }
.sidebar-footer { margin-top:auto; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06); }
.user-chip { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; }
.user-avatar { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#FF4D6D,#FF9000); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.user-email { font-size:11px; font-family:'DM Mono',monospace; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px; }
.main-content { flex:1; min-width:0; width:0; display:flex; flex-direction:column; overflow:hidden; }
.topbar { display:flex; align-items:center; justify-content:space-between; padding:18px 28px; border-bottom:1px solid; flex-shrink:0; transition:border-color 0.4s; }
.topbar-title { font-family:'Instrument Serif',serif; font-size:26px; background:linear-gradient(135deg,#FF4D6D,#FF8FA3); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.topbar-count { font-size:12px; font-family:'DM Mono',monospace; margin-top:2px; }
.content-area { flex:1; overflow-y:auto; padding:24px 28px 28px; width:100%; box-sizing:border-box; }
.content-area::-webkit-scrollbar { width:4px; }
.content-area::-webkit-scrollbar-track { background:transparent; }
.content-area::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:99px; }
.cards-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px; width:100%; }

/* Mobile bottom nav */
.mobile-nav { display:none; }

/* ── Responsive Mobile ── */
@media (max-width: 768px) {
  .app-shell { flex-direction:column; }
  .sidebar { display:none; }
  .main-content { flex:1; width:100%; min-width:0; }
  .topbar { padding:12px 16px; }
  .topbar-title { font-size:20px; }
  .content-area { padding:14px 12px 100px; }
  .cards-grid { grid-template-columns:1fr; }
  .mobile-nav { display:flex; position:fixed; bottom:0; left:0; right:0; height:68px; background:rgba(13,13,26,0.97); backdrop-filter:blur(20px); border-top:1px solid rgba(255,255,255,0.06); align-items:center; justify-content:space-around; padding:0 4px 8px; z-index:100; }
  .mobile-nav-btn { display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; border:none; background:transparent; padding:6px 10px; flex:1; }
  .mobile-nav-icon { font-size:20px; opacity:0.4; transition:opacity 0.2s; }
  .mobile-nav-label { font-size:9px; font-weight:700; letter-spacing:0.06em; color:#444; font-family:'DM Mono',monospace; text-transform:uppercase; }
  .mobile-nav-btn.active .mobile-nav-icon { opacity:1; }
  .mobile-nav-btn.active .mobile-nav-label { color:#FF4D6D; }
  .mobile-nav-dot { width:16px; height:2px; border-radius:99px; background:#FF4D6D; box-shadow:0 0 8px rgba(255,77,109,0.6); margin-top:1px; }
  .box { width:92vw; max-width:360px; }
  .box.expanded { width:92vw; max-width:400px; height:520px; }
}

/* ── Glowy Button ── */
:root { --gx:200; --gy:400; --gxp:.5; --gsize:130px; }
.glowy-btn { --hue:calc(340 + (var(--gxp)*60)); --glow:radial-gradient(50% 50% at center,hsl(var(--hue) 90% 75%),hsl(var(--hue) 80% 60%),transparent) calc(var(--gx)*1px - var(--gsize)*.5) calc(var(--gy)*1px - var(--gsize)*.5)/var(--gsize) var(--gsize) no-repeat fixed; --btn-bg:#0f0f1a; width:100%; padding:15px; border-radius:14px; border:3px solid transparent; background:linear-gradient(var(--btn-bg),var(--btn-bg)) padding-box,var(--glow),linear-gradient(#000,#000) border-box; box-shadow:0 1px rgba(255,255,255,0.1) inset; cursor:pointer; touch-action:none; position:relative; font-family:'Cabinet Grotesk',sans-serif; font-size:15px; font-weight:800; letter-spacing:0.03em; transition:background-size 0.2s; }
.glowy-btn::before { content:""; position:absolute; inset:0; background:var(--btn-bg); z-index:2; border-radius:12px; box-shadow:0 1px rgba(255,255,255,0.1) inset; }
.glowy-btn::after  { content:""; position:absolute; inset:-3px; filter:blur(18px); border:3px solid transparent; background:var(--glow); border-radius:14px; }
.glowy-btn span    { background:var(--glow),white; background-clip:text; -webkit-background-clip:text; color:transparent; position:relative; z-index:3; }
.glowy-btn:active  { --gsize:280px; }
.glowy-btn:disabled { opacity:0.6; cursor:not-allowed; }

/* ── BB8 Toggle ── */
.bb8-toggle{--toggle-size:11px;--toggle-width:10.625em;--toggle-height:5.625em;--toggle-offset:calc((var(--toggle-height) - var(--bb8-diameter))/2);--toggle-bg:linear-gradient(#2c4770,#070e2b 35%,#628cac 50% 70%,#a6c5d4) no-repeat;--bb8-diameter:4.375em;--radius:99em;--transition:0.4s;--accent:#de7d2f;--bb8-bg:#fff;cursor:pointer;font-size:var(--toggle-size);display:inline-block;}
.bb8-toggle,.bb8-toggle *,.bb8-toggle *::before,.bb8-toggle *::after{box-sizing:border-box;}
.bb8-toggle__checkbox{appearance:none;display:none;}
.bb8-toggle__container{width:var(--toggle-width);height:var(--toggle-height);background:var(--toggle-bg);background-size:100% 11.25em;background-position-y:-5.625em;border-radius:var(--radius);position:relative;transition:var(--transition);}
.bb8{display:flex;flex-direction:column;align-items:center;position:absolute;top:calc(var(--toggle-offset) - 1.688em + 0.188em);left:var(--toggle-offset);transition:var(--transition);z-index:2;}
.bb8__head-container{position:relative;transition:var(--transition);z-index:2;transform-origin:1.25em 3.75em;}
.bb8__head{overflow:hidden;margin-bottom:-0.188em;width:2.5em;height:1.688em;background:linear-gradient(transparent .063em,dimgray .063em .313em,transparent .313em .375em,var(--accent) .375em .5em,transparent .5em 1.313em,silver 1.313em 1.438em,transparent 1.438em),linear-gradient(45deg,transparent .188em,var(--bb8-bg) .188em 1.25em,transparent 1.25em),linear-gradient(-45deg,transparent .188em,var(--bb8-bg) .188em 1.25em,transparent 1.25em),linear-gradient(var(--bb8-bg) 1.25em,transparent 1.25em);border-radius:var(--radius) var(--radius) 0 0;position:relative;z-index:1;filter:drop-shadow(0 .063em .125em gray);}
.bb8__head::before{content:"";position:absolute;width:.563em;height:.563em;background:radial-gradient(.125em circle at .25em .375em,red,transparent),radial-gradient(.063em circle at .375em .188em,var(--bb8-bg) 50%,transparent 100%),linear-gradient(45deg,#000 .188em,dimgray .313em .375em,#000 .5em);border-radius:var(--radius);top:.413em;left:50%;transform:translate(-50%);box-shadow:0 0 0 .089em lightgray,.563em .281em 0 -.148em,.563em .281em 0 -.1em var(--bb8-bg),.563em .281em 0 -.063em;z-index:1;transition:var(--transition);}
.bb8__head::after{content:"";position:absolute;bottom:.375em;left:0;width:100%;height:.188em;background:linear-gradient(to right,var(--accent) .125em,transparent .125em .188em,var(--accent) .188em .313em,transparent .313em .375em,var(--accent) .375em .938em,transparent .938em 1em,var(--accent) 1em 1.125em,transparent 1.125em 1.875em,var(--accent) 1.875em 2em,transparent 2em 2.063em,var(--accent) 2.063em 2.25em,transparent 2.25em 2.313em,var(--accent) 2.313em 2.375em,transparent 2.375em 2.438em,var(--accent) 2.438em);transition:var(--transition);}
.bb8__antenna{position:absolute;transform:translateY(-90%);width:.059em;border-radius:var(--radius) var(--radius) 0 0;transition:var(--transition);}
.bb8__antenna:nth-child(1){height:.938em;right:.938em;background:linear-gradient(#000 .188em,silver .188em);}
.bb8__antenna:nth-child(2){height:.375em;left:50%;transform:translate(-50%,-90%);background:silver;}
.bb8__body{width:4.375em;height:4.375em;border-radius:var(--radius);position:relative;overflow:hidden;transition:var(--transition);z-index:1;transform:rotate(45deg);background:linear-gradient(-90deg,var(--bb8-bg) 4%,var(--accent) 4% 10%,transparent 10% 90%,var(--accent) 90% 96%,var(--bb8-bg) 96%),linear-gradient(var(--bb8-bg) 4%,var(--accent) 4% 10%,transparent 10% 90%,var(--accent) 90% 96%,var(--bb8-bg) 96%),linear-gradient(to right,transparent 2.156em,silver 2.156em 2.219em,transparent 2.188em),linear-gradient(transparent 2.156em,silver 2.156em 2.219em,transparent 2.188em);background-color:var(--bb8-bg);}
.bb8__body::after{content:"";bottom:1.5em;left:.563em;position:absolute;width:.188em;height:.188em;background:rgb(236,236,236);border-radius:50%;box-shadow:.875em .938em,0 -1.25em,.875em -2.125em,2.125em -2.125em,3.063em -1.25em,3.063em 0,2.125em .938em;}
.bb8__body::before{content:"";width:2.625em;height:2.625em;position:absolute;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);border:.313em solid var(--accent);background:radial-gradient(1em circle at center,rgb(236,236,236) 50%,transparent 51%),radial-gradient(1.25em circle at center,var(--bb8-bg) 50%,transparent 51%),linear-gradient(-90deg,transparent 42%,var(--accent) 42% 58%,transparent 58%),linear-gradient(var(--bb8-bg) 42%,var(--accent) 42% 58%,var(--bb8-bg) 58%);}
.artificial__hidden{position:absolute;border-radius:inherit;inset:0;pointer-events:none;overflow:hidden;}
.bb8__shadow{width:var(--bb8-diameter);height:20%;border-radius:50%;background:#3a271c;opacity:.25;position:absolute;bottom:0;left:calc(var(--toggle-offset) - .938em);transition:var(--transition);transform:skew(-70deg);z-index:1;}
.bb8-toggle__scenery{width:100%;height:100%;pointer-events:none;overflow:hidden;position:relative;border-radius:inherit;}
.bb8-toggle__scenery::before{content:"";position:absolute;width:100%;height:30%;bottom:0;background:#b18d71;z-index:1;}
.bb8-toggle__cloud{z-index:1;position:absolute;border-radius:50%;}
.bb8-toggle__cloud:nth-last-child(1){width:.875em;height:.625em;filter:blur(.125em) drop-shadow(.313em .313em #ffffffae) drop-shadow(-.625em 0 #fff) drop-shadow(-.938em -.125em #fff);right:1.875em;top:2.813em;background:linear-gradient(to top right,#ffffffae,#ffffffae);transition:var(--transition);}
.bb8-toggle__cloud:nth-last-child(2){top:.625em;right:4.375em;width:.875em;height:.375em;background:#dfdedeae;filter:blur(.125em) drop-shadow(-.313em -.188em #e0dfdfae);transition:.6s;}
.bb8-toggle__cloud:nth-last-child(3){top:1.25em;right:.938em;width:.875em;height:.375em;background:#ffffffae;filter:blur(.125em) drop-shadow(.438em .188em #ffffffae);transition:.8s;}
.gomrassen,.hermes,.chenini{position:absolute;border-radius:var(--radius);background:linear-gradient(#fff,#6e8ea2);top:100%;}
.gomrassen{left:.938em;width:1.875em;height:1.875em;transition:var(--transition);}
.gomrassen::before,.gomrassen::after{content:"";position:absolute;border-radius:inherit;background:rgb(184,196,200);}
.gomrassen::before{left:.313em;top:.313em;width:.438em;height:.438em;}
.gomrassen::after{width:.25em;height:.25em;left:1.25em;top:.75em;}
.hermes{left:3.438em;width:.625em;height:.625em;transition:.6s;}
.chenini{left:4.375em;width:.5em;height:.5em;transition:.8s;}
.tatto-1,.tatto-2{position:absolute;width:1.25em;height:1.25em;border-radius:var(--radius);}
.tatto-1{background:#fefefe;right:3.125em;top:.625em;transition:var(--transition);}
.tatto-2{background:linear-gradient(#e6ac5c,#d75449);right:1.25em;top:2.188em;transition:.7s;}
.bb8-toggle__star{position:absolute;width:.063em;height:.063em;background:#fff;border-radius:var(--radius);top:100%;}
.bb8-toggle__star:nth-child(1){left:3.75em;box-shadow:1.25em .938em,-1.25em 2.5em,0 1.25em,1.875em .625em,-3.125em 1.875em,1.25em 2.813em;transition:.2s;}
.bb8-toggle__star:nth-child(2){left:4.688em;box-shadow:.625em 0,0 .625em,-.625em -.625em,.625em .938em,-3.125em 1.25em,1.25em -1.563em;transition:.3s;}
.bb8-toggle__star:nth-child(3){left:5.313em;box-shadow:-.625em -.625em,-2.188em 1.25em,-2.188em 0,-3.75em -.625em,-3.125em -.625em,-2.5em -.313em,.75em -.625em;transition:var(--transition);}
.bb8-toggle__star:nth-child(4){left:1.875em;width:.125em;height:.125em;transition:.5s;}
.bb8-toggle__star:nth-child(5){left:5em;width:.125em;height:.125em;transition:.6s;}
.bb8-toggle__star:nth-child(6){left:2.5em;width:.125em;height:.125em;transition:.7s;}
.bb8-toggle__star:nth-child(7){left:3.438em;width:.125em;height:.125em;transition:.8s;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(1){top:.625em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(2){top:1.875em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(3){top:1.25em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(4){top:3.438em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(5){top:3.438em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(6){top:.313em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__star:nth-child(7){top:1.875em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8-toggle__cloud{right:-100%;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .gomrassen{top:.938em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .hermes{top:2.5em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .chenini{top:2.75em;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container{background-position-y:0;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .tatto-1{top:100%;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .tatto-2{top:100%;}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8{left:calc(100% - var(--bb8-diameter) - var(--toggle-offset));}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8__shadow{left:calc(100% - var(--bb8-diameter) - var(--toggle-offset) + .938em);transform:skew(70deg);}
.bb8-toggle__checkbox:checked+.bb8-toggle__container .bb8__body{transform:rotate(225deg);}
.bb8-toggle__checkbox:hover+.bb8-toggle__container .bb8__head::before{left:100%;}
.bb8-toggle__checkbox:not(:checked):hover+.bb8-toggle__container .bb8__antenna:nth-child(1){right:1.5em;}
.bb8-toggle__checkbox:hover+.bb8-toggle__container .bb8__antenna:nth-child(2){left:.938em;}
.bb8-toggle__checkbox:checked:hover+.bb8-toggle__container .bb8__head::before{left:0;}
.bb8-toggle__checkbox:checked:hover+.bb8-toggle__container .bb8__antenna:nth-child(2){left:calc(100% - .938em);}
.bb8-toggle__checkbox:active+.bb8-toggle__container .bb8__head-container{transform:rotate(25deg);}
.bb8-toggle__checkbox:checked:active+.bb8-toggle__container .bb8__head-container{transform:rotate(-25deg);}

@keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
@keyframes toastIn { from{opacity:0;transform:translate(-50%,16px) scale(0.95)} to{opacity:1;transform:translate(-50%,0) scale(1)} }
@keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes spin    { to{transform:rotate(360deg)} }
@keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(255,77,109,0.4)} 70%{box-shadow:0 0 0 10px rgba(255,77,109,0)} 100%{box-shadow:0 0 0 0 rgba(255,77,109,0)} }
@keyframes confetti-fall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }

.confetti-piece { position:fixed; top:0; animation:confetti-fall linear forwards; z-index:9999; pointer-events:none; }
.bday-card { transition:transform 0.18s ease,box-shadow 0.18s ease; }
.bday-card:hover { transform:translateY(-3px); }
.delete-btn { opacity:0; transition:opacity 0.2s; }
.bday-card:hover .delete-btn { opacity:1; }
.ring-fill { transition:stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1); }
.bp-input:focus { outline:none; border-color:rgba(255,77,109,0.5)!important; box-shadow:0 0 0 3px rgba(255,77,109,0.12); }
.remind-chip { transition:all 0.15s; }
.remind-chip.active-chip { border-color:#FF4D6D!important; background:rgba(255,77,109,0.15)!important; color:#FF4D6D!important; }
.bp-toggle { width:38px; height:22px; border-radius:99px; position:relative; cursor:pointer; transition:background 0.2s; flex-shrink:0; }
.bp-toggle-knob { position:absolute; top:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.3); }
`;

// ── Spinner ───────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"80px 0" }}>
      <div style={{ width:40, height:40, border:"3px solid rgba(255,77,109,0.2)", borderTop:"3px solid #FF4D6D", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
    </div>
  );
}

// ── BB8 Toggle ────────────────────────────────────────────────────────────
function BB8Toggle({ checked, onChange }) {
  return (
    <label className="bb8-toggle">
      <input className="bb8-toggle__checkbox" type="checkbox" checked={checked} onChange={onChange}/>
      <div className="bb8-toggle__container">
        <div className="bb8-toggle__scenery">
          {[...Array(7)].map((_,i)=><div key={i} className="bb8-toggle__star"/>)}
          <div className="tatto-1"/><div className="tatto-2"/>
          <div className="gomrassen"/><div className="hermes"/><div className="chenini"/>
          <div className="bb8-toggle__cloud"/><div className="bb8-toggle__cloud"/><div className="bb8-toggle__cloud"/>
        </div>
        <div className="bb8">
          <div className="bb8__head-container">
            <div className="bb8__antenna"/><div className="bb8__antenna"/>
            <div className="bb8__head"/>
          </div>
          <div className="bb8__body"/>
        </div>
        <div className="artificial__hidden"><div className="bb8__shadow"/></div>
      </div>
    </label>
  );
}

// ── Glowy Button ──────────────────────────────────────────────────────────
function GlowyButton({ onClick, children, disabled }) {
  useEffect(() => {
    const fn = e => {
      document.documentElement.style.setProperty("--gx", e.clientX);
      document.documentElement.style.setProperty("--gy", e.clientY);
      document.documentElement.style.setProperty("--gxp", (e.clientX/window.innerWidth).toFixed(2));
    };
    window.addEventListener("pointermove", fn);
    return () => window.removeEventListener("pointermove", fn);
  }, []);
  return (
    <button className="glowy-btn" onClick={onClick} disabled={disabled}>
      <span>{children}</span>
    </button>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────
function AuthScreen() {
  const [expanded, setExpanded] = useState(false);
  const [mode,     setMode]     = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");

  const handleSubmit = async () => {
    setMsg(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("✅ Check your email to confirm, then log in!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch(e) { setMsg("❌ " + e.message); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <style>{CSS}</style>
      <div className="auth-blob-1"/><div className="auth-blob-2"/>
      <div className="auth-logo">
        <span className="auth-logo-icon">🎂</span>
        <div className="auth-logo-title">BirthdayPal</div>
        <div className="auth-logo-sub">Never miss a birthday again</div>
      </div>
      <div className={`box${expanded?" expanded":""}`} onClick={()=>!expanded&&setExpanded(true)}>
        <div className="login">
          <div className="loginBx">
            <h2><i className="fa-solid fa-cake-candles" style={{marginRight:8}}/>
              {mode==="login"?"Log In":"Sign Up"}
            <i className="fa-solid fa-heart" style={{marginLeft:8}}/></h2>
            {expanded && (
              <div className="auth-mode-switch">
                {["login","signup"].map(m=>(
                  <button key={m} className={`auth-mode-btn${mode===m?" active":""}`}
                    onClick={e=>{e.stopPropagation();setMode(m);setMsg("");}}>
                    {m==="login"?"Log In":"Sign Up"}
                  </button>
                ))}
              </div>
            )}
            {!expanded && <div className="auth-hint">Click to get started ✨</div>}
            {expanded && <>
              <input type="email" placeholder="✉ Email address" value={email} onChange={e=>setEmail(e.target.value)} onClick={e=>e.stopPropagation()}/>
              <input type="password" placeholder="🔒 Password" value={password} onChange={e=>setPassword(e.target.value)} onClick={e=>e.stopPropagation()} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
              {msg && <div className={`auth-msg ${msg.startsWith("✅")?"success":"error"}`}>{msg}</div>}
              <button className="auth-submit-btn" disabled={loading} onClick={e=>{e.stopPropagation();handleSubmit();}}>
                {loading?"Please wait…":mode==="login"?"🚀 Log In":"🎉 Create Account"}
              </button>
              <div className="auth-links" onClick={e=>e.stopPropagation()}>
                <a href="#">Forgot Password?</a>
                <a onClick={()=>{setMode(mode==="login"?"signup":"login");setMsg("");}}>
                  {mode==="login"?"Sign up free →":"← Back to login"}
                </a>
              </div>
            </>}
          </div>
        </div>
      </div>
      {expanded && (
        <div onClick={()=>{setExpanded(false);setMsg("");}}
          style={{position:"relative",zIndex:10,fontSize:12,color:"#555",cursor:"pointer",fontFamily:"'Poppins',sans-serif"}}
          onMouseEnter={e=>e.target.style.color="#ff2770"}
          onMouseLeave={e=>e.target.style.color="#555"}>
          ↑ Collapse
        </div>
      )}
    </div>
  );
}

// ── Countdown Ring ────────────────────────────────────────────────────────
function CountdownRing({ days, name, avatar, color, light }) {
  const r=44, circ=2*Math.PI*r;
  const pct=Math.max(0,Math.min(1,1-days/365));
  return (
    <div style={{ background:light?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.05)", border:`1px solid ${light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.08)"}`, borderRadius:20, padding:"20px 22px", display:"flex", alignItems:"center", gap:18, boxShadow:light?"0 2px 20px rgba(0,0,0,0.07)":"none", animation:"fadeUp 0.5s ease both", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, background:`radial-gradient(circle,${color}22,transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ position:"relative", width:100, height:100, flexShrink:0 }}>
        <svg width="100" height="100" style={{ transform:"rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke={light?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)"} strokeWidth="6"/>
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} className="ring-fill" style={{ filter:`drop-shadow(0 0 6px ${color}88)` }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:28, lineHeight:1 }}>{avatar}</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:light?"#777":"#aaa", marginTop:2 }}>{days===0?"TODAY":`${days}d`}</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color, marginBottom:4 }}>Next birthday</div>
        <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:22, color:light?"#111":"#F0ECF8", lineHeight:1.2, marginBottom:8 }}>{name}</div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${color}18`, border:`1px solid ${color}33`, borderRadius:99, padding:"4px 12px" }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:color, animation:days<=7?"pulse-ring 1.5s infinite":"none", display:"inline-block" }}/>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color, fontWeight:500 }}>{urgencyLabel(days)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Birthday Card ─────────────────────────────────────────────────────────
function BirthdayCard({ person, light, delay=0, onDelete }) {
  const d=daysUntil(person.month,person.day);
  const color=urgencyColor(d);
  const age=person.year?new Date().getFullYear()-person.year:null;
  return (
    <div className="bday-card" style={{ background:light?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.04)", border:`1px solid ${light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.06)"}`, borderRadius:18, padding:"16px 18px", boxShadow:light?"0 2px 14px rgba(0,0,0,0.06)":"none", animation:`slideIn 0.35s ease both`, animationDelay:`${delay}ms`, position:"relative" }}>
      <div style={{ position:"absolute", left:0, top:16, bottom:16, width:3, background:color, borderRadius:"0 4px 4px 0", opacity:0.9 }}/>
      <div style={{ display:"flex", alignItems:"center", gap:14, paddingLeft:8 }}>
        <div style={{ width:52, height:52, borderRadius:16, flexShrink:0, background:`linear-gradient(135deg,${color}25,${color}10)`, border:`1.5px solid ${color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{person.avatar}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, color:light?"#111":"#F0ECF8" }}>
              {person.name}
              {age?<span style={{ fontSize:12, color:light?"#bbb":"#666", marginLeft:7 }}>turns {age}</span>:null}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, color, background:`${color}15`, padding:"3px 10px", borderRadius:99, border:`1px solid ${color}30` }}>{urgencyLabel(d)}</span>
              <button className="delete-btn" onClick={()=>onDelete(person.id)} style={{ background:"rgba(255,77,109,0.12)", border:"1px solid rgba(255,77,109,0.25)", borderRadius:8, color:"#FF4D6D", fontSize:13, cursor:"pointer", padding:"3px 8px" }}>🗑</button>
            </div>
          </div>
          <div style={{ fontSize:12, color:light?"#aaa":"#666", marginBottom:person.note?4:0 }}>🎂 {MONTHS_FULL[person.month-1]} {person.day}</div>
          {person.note&&<div style={{ fontSize:12, color:light?"#bbb":"#555", fontStyle:"italic", fontFamily:"'Instrument Serif',serif" }}>"{person.note}"</div>}
        </div>
      </div>
    </div>
  );
}

// ── Add Form ──────────────────────────────────────────────────────────────
function AddForm({ onAdd, light }) {
  const [name,setName]=useState(""); const [month,setMonth]=useState(""); const [day,setDay]=useState("");
  const [year,setYear]=useState(""); const [note,setNote]=useState(""); const [remind,setRemind]=useState("1 week");
  const [avatar,setAvatar]=useState("🎂"); const [saving,setSaving]=useState(false);
  const avatarOptions=["🎂","👩","🧑","👨","👧","👦","👴","👵","🌟","💫","🎉","🎊"];
  const inp={ width:"100%", padding:"12px 16px", background:light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)", border:`1px solid ${light?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.09)"}`, borderRadius:12, color:light?"#111":"#F0ECF8", fontSize:14, fontFamily:"'Cabinet Grotesk',sans-serif", marginBottom:12, display:"block" };
  const lbl={ fontSize:10, color:light?"#aaa":"#666", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5, display:"block", fontFamily:"'DM Mono',monospace", fontWeight:500 };
  const currentYear = new Date().getFullYear();
  const handleSubmit=async()=>{
    if(!name||!month||!day) return;
    if(year && (Number(year) < 1900 || Number(year) > currentYear)) {
      alert(`Please enter a valid year between 1900 and ${currentYear}`);
      return;
    }
    setSaving(true);
    await onAdd(name,Number(month),Number(day),year?Number(year):null,note,avatar);
    setName("");setMonth("");setDay("");setYear("");setNote("");setAvatar("🎂");
    setSaving(false);
  };

  return (
    <div style={{ maxWidth:560, animation:"fadeUp 0.3s ease both" }}>
      <p style={{ color:light?"#999":"#666", fontSize:14, marginBottom:24, lineHeight:1.6 }}>Add a birthday and we'll make sure you never forget it.</p>
      <label style={lbl}>Pick an avatar</label>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {avatarOptions.map(a=>(
          <button key={a} onClick={()=>setAvatar(a)} style={{ width:42, height:42, borderRadius:12, fontSize:20, background:avatar===a?"rgba(255,77,109,0.15)":light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)", border:`1.5px solid ${avatar===a?"#FF4D6D":light?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)"}`, cursor:"pointer", transition:"all 0.15s", transform:avatar===a?"scale(1.12)":"scale(1)" }}>{a}</button>
        ))}
      </div>
      <label style={lbl}>Name</label>
      <input className="bp-input" style={inp} placeholder="e.g. Mom, Jake, Grandma…" value={name} onChange={e=>setName(e.target.value)}/>
      <label style={lbl}>Birthday</label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
        <select className="bp-input" value={month} onChange={e=>setMonth(e.target.value)} style={{...inp,marginBottom:0}}>
          <option value="">Month</option>
          {MONTHS_FULL.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
        </select>
        <input className="bp-input" style={{...inp,marginBottom:0}} type="number" placeholder="Day" min={1} max={31} value={day} onChange={e=>setDay(e.target.value)}/>
        <input className="bp-input" style={{...inp,marginBottom:0}} type="number" placeholder="Year" min={1900} max={new Date().getFullYear()} value={year} onChange={e=>{const v=e.target.value; if(v===""||( Number(v)>=1900 && Number(v)<=new Date().getFullYear())) setYear(v);}}/>
      </div>
      <label style={lbl}>Note (optional)</label>
      <input className="bp-input" style={inp} placeholder="e.g. Loves sunflowers…" value={note} onChange={e=>setNote(e.target.value)}/>
      <label style={lbl}>Remind me</label>
      <div style={{ display:"flex", gap:6, marginBottom:24 }}>
        {["1 day","3 days","1 week","2 weeks"].map(o=>(
          <button key={o} className={`remind-chip ${remind===o?"active-chip":""}`} onClick={()=>setRemind(o)} style={{ flex:1, padding:"8px 4px", borderRadius:10, cursor:"pointer", border:`1px solid ${remind===o?"#FF4D6D":light?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.08)"}`, background:remind===o?"rgba(255,77,109,0.12)":light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.04)", color:remind===o?"#FF4D6D":light?"#888":"#666", fontSize:12, fontFamily:"'DM Mono',monospace", fontWeight:500 }}>{o}</button>
        ))}
      </div>
      <div style={{ maxWidth:300 }}>
        <GlowyButton onClick={handleSubmit} disabled={saving}>{saving?"Saving…":"🎉 Add Birthday"}</GlowyButton>
      </div>
    </div>
  );
}

// ── Toggle Switch ─────────────────────────────────────────────────────────
function ToggleSwitch({ on, onToggle, color="#FF4D6D" }) {
  return (
    <div className="bp-toggle" onClick={onToggle} style={{ background:on?color:"rgba(255,255,255,0.12)" }}>
      <div className="bp-toggle-knob" style={{ left:on?19:3 }}/>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────
function SettingsTab({ light, onToggle, user, onSignOut, onClearAll }) {
  const [notifs,setNotifs]=useState({ email:true, push:true, inapp:true });
  const card={ background:light?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.04)", border:`1px solid ${light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}`, borderRadius:20, padding:"20px 22px", marginBottom:14, boxShadow:light?"0 2px 14px rgba(0,0,0,0.06)":"none" };
  const lbl={ fontSize:10, color:light?"#bbb":"#555", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:"'DM Mono',monospace", fontWeight:500, marginBottom:14 };
  return (
    <div style={{ maxWidth:600, animation:"fadeUp 0.3s ease both" }}>
      <div style={card}>
        <div style={lbl}>Account</div>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:"linear-gradient(135deg,#FF4D6D,#FF9000)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>👤</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:light?"#111":"#F0ECF8" }}>{user?.email}</div>
            <div style={{ fontSize:12, color:"#00C9A7", marginTop:3 }}>✅ Logged in — data synced</div>
          </div>
        </div>
        <button onClick={onSignOut} style={{ padding:"11px 22px", borderRadius:10, border:"1px solid rgba(255,77,109,0.3)", background:"rgba(255,77,109,0.08)", color:"#FF4D6D", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>🚪 Sign Out</button>
      </div>
      <div style={card}>
        <div style={lbl}>Theme</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:light?"#222":"#ddd" }}>{light?"☀️ Light Mode":"🌙 Dark Mode"}</div>
            <div style={{ fontSize:12, color:light?"#aaa":"#666", marginTop:3 }}>Toggle between day and night</div>
          </div>
          <BB8Toggle checked={!light} onChange={onToggle}/>
        </div>
      </div>
      <div style={card}>
        <div style={lbl}>Notifications</div>
        {[["✉️","Email reminders","email","#4A9EF0"],["🔔","Push notifications","push","#FF4D6D"],["📱","In-app alerts","inapp","#00C9A7"]].map(([ic,lb,key,col])=>(
          <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:500, color:light?"#333":"#ccc" }}>{ic} {lb}</div>
            <ToggleSwitch on={notifs[key]} color={col} onToggle={()=>setNotifs(p=>({...p,[key]:!p[key]}))}/>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={lbl}>Danger Zone</div>
        <button onClick={onClearAll} style={{ padding:"11px 22px", borderRadius:10, border:"1px solid rgba(255,77,109,0.3)", background:"rgba(255,77,109,0.08)", color:"#FF4D6D", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>🗑 Delete All My Birthdays</button>
      </div>
    </div>
  );
}

// ── Alerts Tab ────────────────────────────────────────────────────────────
function AlertsTab({ light }) {
  const card={ background:light?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.04)", border:`1px solid ${light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}`, borderRadius:20, padding:"18px 22px", marginBottom:12, boxShadow:light?"0 2px 14px rgba(0,0,0,0.06)":"none" };
  const integrations=[
    { icon:"📧", name:"EmailJS",            desc:"Sends real email reminders to your Gmail",  color:"#4A9EF0", status:"Connected ✅"  },
    { icon:"🔔", name:"Push Notifications", desc:"Browser alerts when app is open",           color:"#FF4D6D", status:"Enabled"       },
    { icon:"📅", name:"Google Calendar",    desc:"Export birthdays as recurring events",      color:"#00C9A7", status:"Coming soon"   },
    { icon:"🤖", name:"Claude AI",          desc:"Generate personalised birthday messages",   color:"#FF9000", status:"Coming soon"   },
  ];
  return (
    <div style={{ maxWidth:600 }}>
      <p style={{ color:light?"#999":"#666", fontSize:14, marginBottom:24, lineHeight:1.6 }}>Connect services to get real reminders delivered to you.</p>
      {integrations.map((intg,i)=>(
        <div key={intg.name} style={{...card, animation:`slideIn 0.35s ease both`, animationDelay:`${i*60}ms`}}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:52, height:52, borderRadius:16, flexShrink:0, background:`${intg.color}18`, border:`1.5px solid ${intg.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{intg.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:light?"#111":"#F0ECF8", marginBottom:3 }}>{intg.name}</div>
              <div style={{ fontSize:13, color:light?"#aaa":"#666" }}>{intg.desc}</div>
            </div>
            <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", padding:"4px 12px", borderRadius:99, fontWeight:600, flexShrink:0, background:["Not connected","Coming soon"].includes(intg.status)?"rgba(255,255,255,0.05)":`${intg.color}18`, border:`1px solid ${["Not connected","Coming soon"].includes(intg.status)?"rgba(255,255,255,0.08)":`${intg.color}35`}`, color:["Not connected","Coming soon"].includes(intg.status)?light?"#aaa":"#555":intg.color }}>{intg.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar Nav items ─────────────────────────────────────────────────────
const NAV = [
  { id:"Upcoming", label:"Upcoming",  icon:"🎂" },
  { id:"All",      label:"All",       icon:"📋" },
  { id:"Add",      label:"Add New",   icon:"➕" },
  { id:"Alerts",   label:"Alerts",    icon:"🔔" },
  { id:"Settings", label:"Settings",  icon:"⚙️" },
];

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [session,  setSession]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [people,   setPeople]   = useState([]);
  const [tab,      setTab]      = useState("Upcoming");
  const [light,    setLight]    = useState(()=>localStorage.getItem("theme")==="light");
  const [toast,    setToast]    = useState(null);
  const [fetching, setFetching] = useState(false);
  const [search,   setSearch]   = useState("");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ setSession(session); setLoading(false); });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setSession(session));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{ if(!session){setPeople([]);return;} loadBirthdays(); },[session]);

  async function loadBirthdays() {
    setFetching(true);
    const {data,error}=await supabase.from("birthdays").select("*").order("month",{ascending:true});
    if(!error) {
      setPeople(data||[]);
      // Check reminders
      checkReminders(data||[], session.user.email);
    }
    setFetching(false);
  }

  async function checkReminders(birthdays, userEmail) {
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem("lastReminderCheck");
    if(lastCheck === today) return; // Only check once per day

    for(const person of birthdays) {
      const days = daysUntil(person.month, person.day);
      const remindAt = REMIND_DAYS[person.remind || "1 week"];
      if(days === remindAt || days === 1 || days === 0) {
        await sendBirthdayReminder(userEmail, person, days);
      }
    }
    localStorage.setItem("lastReminderCheck", today);
  }

  useEffect(()=>{ localStorage.setItem("theme",light?"light":"dark"); },[light]);

  const sorted=[...people].map(p=>({...p,days:daysUntil(p.month,p.day)})).sort((a,b)=>a.days-b.days);
  const filtered=sorted.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd=async(name,month,day,year,note,avatar)=>{
    const {data,error}=await supabase.from("birthdays").insert([{name,month,day,year,note,avatar,remind,user_id:session.user.id}]).select();
    if(error){showToast("❌ "+error.message);return;}
    setPeople(p=>[...p,...data]);
    launchConfetti();
    showToast(`🎉 ${name}'s birthday saved!`);
    setTab("All");
  };

  const handleDelete=async(id)=>{
    const {error}=await supabase.from("birthdays").delete().eq("id",id);
    if(error){showToast("❌ Error deleting");return;}
    setPeople(p=>p.filter(b=>b.id!==id));
    showToast("🗑 Removed.");
  };

  const handleClearAll=async()=>{
    if(!window.confirm("Delete ALL birthdays? This cannot be undone.")) return;
    await supabase.from("birthdays").delete().eq("user_id",session.user.id);
    setPeople([]);
    showToast("All birthdays deleted.");
  };

  const handleSignOut=async()=>{ await supabase.auth.signOut(); setPeople([]); setTab("Upcoming"); showToast("👋 Signed out!"); };
  const showToast=(msg)=>{ setToast(msg); setTimeout(()=>setToast(null),3000); };

  const TAB_TITLES = { Upcoming:"Upcoming Birthdays", All:"All Birthdays", Add:"Add a Birthday", Alerts:"Alerts & Integrations", Settings:"Settings" };

  // Light/dark tokens
  const bg        = light?"#f4f1fc":"#080810";
  const sidebarBg = light?"#ffffff":"#0d0d1a";
  const borderCol = light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.06)";
  const textMain  = light?"#111":"#F0ECF8";
  const textSub   = light?"#aaa":"#555";
  const navColor  = light?"#666":"#555";

  if(loading) return <div style={{ minHeight:"100vh", background:"#080810", display:"flex", alignItems:"center", justifyContent:"center" }}><style>{CSS}</style><Spinner/></div>;
  if(!session) return <AuthScreen/>;

  return (
    <>
      <style>{CSS}</style>
      {/* Ambient blobs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", top:-100, left:-100, width:500, height:500, background:"radial-gradient(circle,rgba(255,77,109,0.07),transparent 70%)", filter:"blur(60px)", animation:"float 18s ease-in-out infinite alternate" }}/>
        <div style={{ position:"absolute", bottom:-60, right:-60, width:400, height:400, background:"radial-gradient(circle,rgba(255,144,0,0.06),transparent 70%)", filter:"blur(60px)", animation:"float 22s ease-in-out infinite alternate-reverse" }}/>
      </div>

      <div className="app-shell" style={{ background:bg }}>

        {/* ── Sidebar ── */}
        <div className="sidebar" style={{ background:sidebarBg, borderColor:borderCol }}>
          {/* Logo */}
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🎂</span>
            <span className="sidebar-logo-text">BirthdayPal</span>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            {NAV.map(item=>(
              <button key={item.id} className={`nav-btn${tab===item.id?" active":""}`}
                onClick={()=>setTab(item.id)}
                style={{ color:tab===item.id?"#FF4D6D":navColor }}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User footer */}
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-avatar">👤</div>
              <div>
                <div className="user-email" style={{ color:textSub }}>{session?.user?.email}</div>
                <div style={{ fontSize:10, color:"#00C9A7", marginTop:2 }}>● Synced</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="main-content">
          {/* Topbar */}
          <div className="topbar" style={{ borderColor:borderCol, background:light?"rgba(255,255,255,0.7)":"rgba(13,13,26,0.8)", backdropFilter:"blur(20px)" }}>
            <div>
              <div className="topbar-title">{TAB_TITLES[tab]}</div>
              <div className="topbar-count" style={{ color:textSub }}>{people.length} {people.length===1?"birthday":"birthdays"} tracked</div>
            </div>
            {tab==="All" && (
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", opacity:0.4 }}>🔍</span>
                <input className="bp-input" value={search} onChange={e=>setSearch(e.target.value)}
                  style={{ padding:"9px 14px 9px 36px", background:light?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)", border:`1px solid ${borderCol}`, borderRadius:12, color:textMain, fontSize:14, fontFamily:"'Cabinet Grotesk',sans-serif", width:220 }}
                  placeholder="Search…"/>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="content-area">
            {fetching ? <Spinner/> : <>
              {tab==="Upcoming" && (
                <div>
                  {sorted[0] && (
                    <div style={{ marginBottom:28 }}>
                      <CountdownRing days={sorted[0].days} name={sorted[0].name} avatar={sorted[0].avatar} color={urgencyColor(sorted[0].days)} light={light}/>
                    </div>
                  )}
                  {sorted.length===0
                    ? <div style={{ textAlign:"center", padding:"80px 0" }}>
                        <div style={{ fontSize:64, marginBottom:16 }}>🎂</div>
                        <div style={{ fontSize:18, color:textSub, marginBottom:8 }}>No birthdays yet!</div>
                        <div style={{ fontSize:14, color:light?"#ccc":"#444" }}>Click "Add New" in the sidebar to get started</div>
                      </div>
                    : <>
                        <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", fontWeight:600, color:light?"#ccc":"#444", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>All upcoming</div>
                        <div className="cards-grid">
                          {sorted.map((p,i)=><BirthdayCard key={p.id} person={p} light={light} delay={i*40} onDelete={handleDelete}/>)}
                        </div>
                      </>
                  }
                </div>
              )}
              {tab==="All" && (
                <div className="cards-grid">
                  {filtered.length===0
                    ? <div style={{ color:textSub, fontSize:14, padding:"40px 0" }}>No results found.</div>
                    : filtered.map((p,i)=><BirthdayCard key={p.id} person={p} light={light} delay={i*30} onDelete={handleDelete}/>)
                  }
                </div>
              )}
              {tab==="Add"      && <AddForm onAdd={handleAdd} light={light}/>}
              {tab==="Alerts"   && <AlertsTab light={light}/>}
              {tab==="Settings" && <SettingsTab light={light} onToggle={()=>setLight(v=>!v)} user={session?.user} onSignOut={handleSignOut} onClearAll={handleClearAll}/>}
            </>}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav">
        {NAV.map(item=>(
          <button key={item.id} className={`mobile-nav-btn${tab===item.id?" active":""}`} onClick={()=>setTab(item.id)}>
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
            {tab===item.id && <div className="mobile-nav-dot"/>}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#FF4D6D,#FF1744)", color:"#fff", padding:"13px 24px", borderRadius:14, fontSize:14, fontWeight:700, boxShadow:"0 8px 32px rgba(255,77,109,0.45)", fontFamily:"'Cabinet Grotesk',sans-serif", zIndex:9999, animation:"toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both", whiteSpace:"nowrap" }}>{toast}</div>}
    </>
  );
}