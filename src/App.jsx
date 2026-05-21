import { useState } from 'react'
import  { useEffect, useRef } from 'react'
import './App.css'

const ATMOSPHERE_CARDS = [
  { emoji: "🧱", bg: "linear-gradient(135deg, #3d2318 0%, #1e1e1c 100%)", label: "Açıq Kərpic Divarlar" },
  { emoji: "🌿", bg: "linear-gradient(135deg, #2d4a28 0%, #1a2a18 100%)", label: "Canlı Yaşıl Divarlar" },
  { emoji: "📺", bg: "linear-gradient(135deg, #1a2035 0%, #111210 100%)", label: "Nəhəng İdman Ekranları" },
  { emoji: "🛋️", bg: "linear-gradient(135deg, #4a5c3a 0%, #2a2a28 100%)", label: "Kadife Lounge Divanlar" },
  { emoji: "🕯️", bg: "linear-gradient(135deg, #4a3520 0%, #1e1e1c 100%)", label: "Ambiant İşıqlandırma" },
];
 
const FEATURES = [
  { icon: "📺", title: "Canlı İdman Yayımı", desc: "Lounge boyunca yerləşdirilmiş bir neçə 4K ekran hər oturacağı ən yaxşı oturacağa çevirir. Oyunun heç bir anını qaçırmayın." },
  { icon: "🌿", title: "Biofil Dizayn", desc: "Canlı yaşıl divarlar və seçilmiş bitki elementləri industrial-şik interyerimizdə yaşıl bir oazis yaradır." },
  { icon: "🍽️", title: "Lounge Yeməyi", desc: "Zərif yeməklərin birbaşa kadife divanınıza servis edildiyi rahatlıq və qastronomiya mükəmməl birləşir." },
  { icon: "🥃", title: "Seçilmiş Kokteyllər", desc: "Barmenlərimiz bölgənin ən yaxşı ingredientlərindən ilhamlanan imza içkilər yaradır." },
  { icon: "🧱", title: "Xoş Atmosfer", desc: "Açıq kərpic, polad sütunlar və təkrar istifadə edilmiş taxta Safranı fərqli edən estetika yaradır." },
  { icon: "✨", title: "Özəl Rezervasiyalar", desc: "Tədbirinizi stilə uyğun keçirin. Çevik məkanımız həm kiçik, həm də böyük tədbirləri ağlayır." },
];
 
const MENU_ITEMS = [
  { name: "Safran İmza Tabağı", sub: "Köhnəlmiş mal əti, trüf aioli, ot krostini", price: "₼42" },
  { name: "Yaşıl Divar Salatı", sub: "Mikro göyərti, nar, qoz yağı sosu", price: "₼18" },
  { name: "Kərpic Sobası Flatbread", sub: "Labneh, za'atar, qızardılmış bibər", price: "₼22" },
  { name: "Lounge Burger", sub: "Qara angus, karamelizə soğan, tüstülənmiş çedar", price: "₼28" },
  { name: "Zəfəran Rizotto", sub: "Arborio, parmezan, mövsüm göbələkləri", price: "₼32" },
];
 
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRefs = useRef([]);
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
 
  const addReveal = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };
 
  const marqueeItems = ["Canlı İdman", "Kokteyllər", "Lounge Yeməyi", "Özəl Tədbirlər", "Industrial Dizayn", "Yaşıl Divarlar", "Premium Təcrübə"];
 
  return (
    <div>
      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo">
          Safran<span>Lounge</span>
        </div>
        <ul className="nav-links">
          {["Haqqımızda", "Atmosfer", "Menyu", "Rezervasiya"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <button className="nav-reserve" onClick={() => document.getElementById("reservations").scrollIntoView({ behavior: "smooth" })}>
          Masa Rezerv Et
        </button>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
 
      {/* MOBILE MENU */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {["Haqqımızda", "Atmosfer", "Menyu", "Rezervasiya"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
        <button className="btn-primary" style={{ marginTop: "2rem" }}
          onClick={() => { setMenuOpen(false); document.getElementById("reservations").scrollIntoView({ behavior: "smooth" }); }}>
          Masa Rezerv Et
        </button>
      </div>
 
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-glow" />
        <span className="floating-tag left">Bakı — Azərbaycan</span>
        <span className="floating-tag right">Təsis: 2024 — Safran</span>
 
        <div className="hero-content">
          <p className="hero-eyebrow">Safran Lounge-a xoş gəlmisiniz</p>
          <h1 className="hero-title">
            <span className="gold">Safran</span><br />Lounge
          </h1>
          <p className="hero-subtitle">Zövqlü · Canlı · Zərif</p>
          <div className="hero-divider" />
          <p className="hero-desc">
            Gülərüz kollektivi ilə sizin xidmətinizdə.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => document.getElementById("reservations").scrollIntoView({ behavior: "smooth" })}>
              Masa Rezerv Et
            </button>
            <button className="btn-outline" onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>
              Daha Çox
            </button>
          </div>
        </div>
 
        <div className="hero-scroll">
          <span className="scroll-label">Aşağı</span>
          <div className="scroll-line" />
        </div>
      </section>
 
      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>
 
      {/* ABOUT */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-inner">
            <div className="about-visual" ref={addReveal}>
              <div className="about-card about-card-main">🧱</div>
              <div className="about-card about-card-accent">🌿</div>
              <div className="about-badge">
                <div className="about-badge-inner">
                  <span className="num">№1</span>
                  <span className="lbl">Lounge</span>
                </div>
              </div>
            </div>
            <div className="about-text">
              <p className="section-tag reveal" ref={addReveal}>Haqqımızda</p>
              <h2 className="section-title reveal reveal-delay-1" ref={addReveal}>
                <em>Bənzərsiz</em> Bir Lounge
              </h2>
              <p className="reveal reveal-delay-2" ref={addReveal} style={{ fontSize: "1.15rem", lineHeight: "1.85", color: "rgba(240,234,216,0.65)", fontWeight: 300, marginBottom: "1.5rem" }}>
                Safran Lounge, Bakı'nın ürəyində yerləşən bir idman lounge və yemək məkanıdır.  canlı yaşıl divarlarımız və nəhəng ekranlarımızla biz idman həvəskarları və dincəlmək istəyənlər üçün mükəmməl bir məkandır.
              </p>
              <p className="reveal reveal-delay-3" ref={addReveal} style={{ fontSize: "1.15rem", lineHeight: "1.85", color: "rgba(240,234,216,0.65)", fontWeight: 300 }}>
                Nəhəng ekranlarımızda matça baxmaq, zeytun kadife divanlarda dostlarla yemək yemək, yaxud imza kokteyli ilə rahatlamaq üçün gəlsəniz — Safran sizin yerinizdir.
              </p>
              <div className="about-stats reveal" ref={addReveal}>
                {[["500+", "Həftəlik Qonaq"], ["4+", "Ekran"], ["80+", "Menyu"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="stat-num">{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* ATMOSPHERE */}
      <section className="atmosphere" id="atmosphere">
        <div className="container">
          <p className="section-tag reveal" ref={addReveal}>Məkan</p>
          <h2 className="section-title reveal reveal-delay-1" ref={addReveal}>
            <em>Atmosferi</em> Hiss Et
          </h2>
          <div className="atm-grid">
            {ATMOSPHERE_CARDS.map((card, i) => (
              <div className="atm-card reveal" ref={addReveal} key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="atm-card-bg reveal" ref={addReveal} style={{ background: card.bg }}>{card.emoji}</div>
                <div className="atm-card-overlay">
                  <span className="atm-card-label atm-label-slide">{card.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* FEATURES */}
      <section className="features">
        <div className="container">
          <p className="section-tag reveal" ref={addReveal}>Niyə Safran</p>
          <h2 className="section-title reveal reveal-delay-1" ref={addReveal}>
            Hər Şey <em>Sizin Üçün</em>
          </h2>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card reveal" ref={addReveal} key={i} style={{ transitionDelay: `${(i % 3) * 0.12}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* MENU */}
      <section className="menu-section" id="menu">
        <div className="container">
          <div className="menu-inner">
            <div>
              <p className="section-tag reveal" ref={addReveal}>Dadlar</p>
              <h2 className="section-title reveal reveal-delay-1" ref={addReveal}>
                <em>İmza</em><br />Seçimlərimiz
              </h2>
              <div className="menu-list">
                {MENU_ITEMS.map((item, i) => (
                  <div className="menu-item reveal" ref={addReveal} key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-sub">{item.sub}</div>
                    </div>
                    <div className="item-price">{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="reveal" ref={addReveal} style={{ marginTop: "2.5rem" }}>
                <button className="btn-outline">Tam Menyuya Bax</button>
              </div>
            </div>
            <div className="menu-visual reveal" ref={addReveal}>
              <div className="menu-ring" />
              <div className="menu-ring" />
              <div className="menu-ring" />
              <div className="menu-center">🍽️</div>
            </div>
          </div>
        </div>
      </section>
 
      {/* RESERVATION */}
      <section className="reservation" id="reservations">
        <div className="container">
          <div className="reservation-inner">
            <p className="section-tag reveal" ref={addReveal} style={{ justifyContent: "center" }}>Ziyarətinizi Planlayın</p>
            <h2 className="section-title reveal reveal-delay-1" ref={addReveal}>
              Masanızı <em>Rezerv Edin</em>
            </h2>
            <p className="reveal reveal-delay-2" ref={addReveal} style={{ color: "rgba(240,234,216,0.5)", fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.7 }}>
              Safran Lounge-da yerinizi təmin edin. Canlı matç axşamları üçün əvvəlcədən rezervasiya tövsiyə olunur.
            </p>
            <div className="res-form reveal reveal-delay-2" ref={addReveal}>
              <div className="form-group">
                <label className="form-label">Ad Soyad</label>
                <input className="form-input" type="text" placeholder="Adınız" />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input className="form-input" type="tel" placeholder="+994 xx xxx xx xx" />
              </div>
              <div className="form-group">
                <label className="form-label">Tarix</label>
                <input className="form-input" type="date" />
              </div>
              <div className="form-group">
                <label className="form-label">Qonaq Sayı</label>
                <select className="form-input">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n} {n === 1 ? "Qonaq" : "Qonaq"}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label className="form-label">Xüsusi İstəklər</label>
                <input className="form-input" type="text" placeholder="Ad günü, ildönümü, qida tələbləri..." />
              </div>
              <div className="form-group full" style={{ alignItems: "center", marginTop: "0.5rem" }}>
                <button className="btn-primary" style={{ width: "100%", padding: "1.1rem" }}>
                  Rezervasiyanı Təsdiq Et
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="nav-logo">Safran<span>Lounge</span></div>
              <p className="footer-desc">
                Industrial şik yaşıl təbiətlə buluşur. Bakının ən yaxşı idman lounge və yeməyi məkanı — hər ziyarət xatirəyə çevrilir.
              </p>
              <div className="social-links">
                {["𝕏", "📸", "📘", "📱"].map((s, i) => (
                  <a key={i} href="#" className="social-link">{s}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="footer-heading">Naviqasiya</h4>
              <ul className="footer-links">
                {["Haqqımızda", "Atmosfer", "Menyu", "Rezervasiya", "Tədbirlər", "Qalereya"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-info">
              <h4 className="footer-heading">Ünvanımız</h4>
              <p><strong>Ünvan</strong><br />Bakı, Azərbaycan</p>
              <p style={{ marginTop: "1rem" }}><strong>İş Saatları</strong><br />Bazar ertəsi–Cümə axşamı: 12:00 – 01:00<br />Cümə–Bazar: 12:00 – 03:00</p>
              <p style={{ marginTop: "1rem" }}><strong>Rezervasiya</strong><br />+994 xx xxx xx xx</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2024 Safran Lounge. Bütün hüquqlar qorunur.</p>
            <p className="footer-copy">Bakı, Azərbaycan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
