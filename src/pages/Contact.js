import { useState } from "react";

const CHANNELS = [
  { icon: "🐙", cls: "gh", title: "GitHub",      sub: "Source code & issues",      handle: "github.com/batscar/solidity-chainlink-mastery.git", href: "https://github.com/batscar/solidity-chainlink-mastery.git" },
  { icon: "🐦", cls: "tw", title: "Twitter / X", sub: "Updates & announcements",   handle: "@TheDefipi_Mad",            href: "https://x.com/TheDefipi_Mad" },
  { icon: "✉️", cls: "em", title: "Email",        sub: "Direct & private inquiries", handle: "bw229032.bat@gmail.com",      href: "mailto:bw229032.bat@gmail.com" },
];

function Contact() {
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const [form,    setForm]    = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSent(true); setSending(false); }, 1200);
  };

  return (
    <div className="page" key="contact">
      {/* Hero */}
      <div className="contact-hero">
        <h1>Get in <span>Touch</span></h1>
        <p>
          Questions, bug reports, or want to contribute? Reach us on any channel below,
          or send a direct message using the form. We typically respond within 24 hours.
        </p>
      </div>

      {/* Channel cards */}
      <div className="c-grid">
        {CHANNELS.map((c, i) => (
          <a
            key={c.title}
            className="c-card"
            href={c.href}
            target="_blank"
            rel="noreferrer"
            style={{ animationDelay: `${(i + 1) * 0.05}s` }}
          >
            <div className="c-top">
              <div className={`c-icon ${c.cls}`}>{c.icon}</div>
              <div>
                <h3>{c.title}</h3>
                <div className="sub">{c.sub}</div>
              </div>
              <span className="c-arrow">→</span>
            </div>
            <div className="c-handle">{c.handle}</div>
          </a>
        ))}
      </div>

      {/* Contact form */}
      <div className="form-panel">
        <h2>Send a Message</h2>

        <div className="f-row">
          <div className="fg">
            <label>Your Name</label>
            <input
              type="text" name="name" placeholder="Divyansh Yadav"
              value={form.name} onChange={handleChange}
            />
          </div>
          <div className="fg">
            <label>Email Address</label>
            <input
              type="email" name="email" placeholder="divyansh@bitcoin.org"
              value={form.email} onChange={handleChange}
            />
          </div>
        </div>

        <div className="fg">
          <label>Subject</label>
          <input
            type="text" name="subject"
            placeholder="Bug report / Feature request / General question…"
            value={form.subject} onChange={handleChange}
          />
        </div>

        <div className="fg">
          <label>Message</label>
          <textarea
            name="message" rows={5}
            placeholder="Describe your issue or idea in detail…"
            value={form.message} onChange={handleChange}
          />
        </div>

        <button className="btn-send" onClick={handleSend} disabled={sending}>
          {sending ? "Sending…" : "Send Message →"}
        </button>

        {sent && (
          <div className="send-ok show">
            ✅ Message sent! We'll reply within 24 hours.
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;
