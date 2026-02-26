import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  UploadCloud,
  Lock,
  FileSearch,
  CheckCircle,
  Stethoscope,
  HeartPulse,
  Brain,
  Clock,
  Touchpad,
  ChevronRight,
  Menu
} from 'lucide-react';
import './App.css';

import FullScreenLoader from './components/FullScreenLoader';
import Dashboard from './components/Dashboard';

// --- Shared Components ---

const fadeInScroll = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    style={{ textAlign: 'center', marginBottom: '4rem' }}
    {...fadeInScroll}
  >
    <h2 className="text-balance">{title}</h2>
    {subtitle && <p style={{ color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.125rem' }}>{subtitle}</p>}
  </motion.div>
);

const BenefitCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="card"
    variants={fadeInScroll}
  >
    <div className="icon-wrapper">
      <Icon size={24} />
    </div>
    <h3>{title}</h3>
    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-body)' }}>{description}</p>
  </motion.div>
);

// --- Sections ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <HeartPulse size={28} color="var(--color-primary)" />
          <span>Respira<span style={{ color: 'var(--color-primary)' }}>Scan</span></span>
        </Link>

        <div className="nav-links">
          {isHome ? (
            <>
              <a href="#how-it-works" className="nav-link">How It Works</a>
              <a href="#conditions" className="nav-link">Conditions</a>
              <a href="#benefits" className="nav-link">Benefits</a>
              <a href="#privacy" className="nav-link">Privacy</a>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Analyze</Link>
              <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>History</Link>
            </>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem 1.25rem' }}>
            {location.pathname === '/dashboard' ? 'New Analysis' : 'Start Analysis'}
          </button>
        </div>

        <button className="md-only" style={{ background: 'none', border: 'none', display: 'none' }}>
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: 'url("/respirascan_hero_bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'inline-block',
              backgroundColor: '#eff6ff',
              color: 'var(--color-primary)',
              padding: '0.4rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}
          >
            AI-Powered Respiratory Screening
          </motion.span>
          <h1 className="text-balance">AI-Based Respiratory Risk Detection from Voice</h1>
          <p className="hero-subheading text-balance">
            Upload a voice or breathing sample and receive an AI-powered respiratory risk assessment within seconds.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Start Analysis <ChevronRight size={18} />
            </button>
            <a href="#how-it-works" className="btn btn-secondary">Learn How It Works</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="section-padding section-alt">
    <div className="container">
      <SectionHeader title="How It Works" subtitle="Three simple steps to understand your respiratory health markers." />
      <motion.div className="card-grid" variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <BenefitCard
          icon={UploadCloud}
          title="1. Upload Audio Sample"
          description="Record or upload a 10-second voice or breathing sample through our secure portal."
        />
        <BenefitCard
          icon={Brain}
          title="2. AI Extracts Acoustic Biomarkers"
          description="Our neural network analyzes your audio for subtle acoustic markers associated with respiratory health."
        />
        <BenefitCard
          icon={FileSearch}
          title="3. Receive Risk Assessment"
          description="Get a detailed report highlighting potential risks and recommended next steps."
        />
      </motion.div>
    </div>
  </section>
);

const Crown = ({ size, color, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
    <path d="M12 17H12.01" />
  </svg>
);

const ConditionsDetected = () => (
  <section id="conditions" className="section-conditions">
    <div className="container">
      <div className="header-dark">
        <SectionHeader
          title="Conditions Detected"
          subtitle="Our AI is trained to identify acoustic signatures of various respiratory conditions."
        />
      </div>
      <motion.div className="conditions-grid" variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        {[
          { name: 'Asthma', icon: HeartPulse },
          { name: 'COPD', icon: Activity },
          { name: 'COVID-19', icon: Crown },
          { name: 'Pneumonia', icon: Stethoscope }
        ].map((c, i) => (
          <motion.div key={i} className="medical-card" variants={fadeInScroll}>
            <div className="icon-circle-blue">
              <c.icon size={32} />
            </div>
            <h3>{c.name}</h3>
          </motion.div>
        ))}
      </motion.div>
      <motion.p className="disclaimer-small" {...fadeInScroll} style={{ marginTop: '3rem' }}>
        "This tool is for screening support only and does not replace professional medical diagnosis."
      </motion.p>
    </div>
  </section>
);

const WhyChoose = () => (
  <section id="benefits" className="section-padding section-alt">
    <div className="container">
      <SectionHeader title="Why Choose RespiraScan" />
      <motion.div className="card-grid" variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <BenefitCard
          icon={Touchpad}
          title="Non-invasive Screening"
          description="No needles or physical tests. Analysis is performed entirely on your voice or breathing sound."
        />
        <BenefitCard
          icon={Clock}
          title="Fast AI-powered Results"
          description="Receive your preliminary risk assessment in under 30 seconds after uploading."
        />
        <BenefitCard
          icon={CheckCircle}
          title="No Special Devices Required"
          description="Works with any standard smartphone or laptop microphone. No medical-grade hardware needed."
        />
        <BenefitCard
          icon={Lock}
          title="Secure and Encrypted"
          description="Your audio data is processed with enterprise-grade encryption and privacy protocols."
        />
      </motion.div>
    </div>
  </section>
);

const PrivacySecurity = () => (
  <section id="privacy" className="section-padding">
    <div className="container">
      <motion.div
        style={{ backgroundColor: 'white', padding: '4.5rem', borderRadius: 'var(--border-radius)', border: '1px solid #f1f5f9', boxShadow: 'var(--shadow-lg)' }}
        {...fadeInScroll}
      >
        <SectionHeader title="Security First, Always" subtitle="We treat your health data with the highest level of confidentiality." />
        <div className="privacy-grid">
          <div className="privacy-card">
            <ShieldCheck className="icon-small" size={24} />
            <div>
              <h3 style={{ fontSize: '1rem' }}>Secure Processing</h3>
              <p style={{ fontSize: '0.8125rem' }}>Processing happens on secure servers using end-to-end encryption.</p>
            </div>
          </div>
          <div className="privacy-card">
            <Lock className="icon-small" size={24} />
            <div>
              <h3 style={{ fontSize: '1rem' }}>No Permanent Storage</h3>
              <p style={{ fontSize: '0.8125rem' }}>Audio samples are analyzed and promptly deleted unless you choose to save them.</p>
            </div>
          </div>
          <div className="privacy-card">
            <CheckCircle className="icon-small" size={24} />
            <div>
              <h3 style={{ fontSize: '1rem' }}>User Consent</h3>
              <p style={{ fontSize: '0.8125rem' }}>You maintain complete control over who accesses your screening reports.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div style={{ gridColumn: 'span 2' }}>
          <div className="footer-logo">
            <HeartPulse size={24} />
            <span>RespiraScan</span>
          </div>
          <p style={{ maxWidth: '300px', fontSize: '0.875rem' }}>
            Advancing respiratory health screening through the power of acoustic artificial intelligence.
          </p>
        </div>
        <div className="footer-links">
          <h4>Platform</h4>
          <a href="#" className="footer-link-item">How it Works</a>
          <a href="#" className="footer-link-item">Pricing</a>
          <a href="#" className="footer-link-item">Science</a>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <a href="#" className="footer-link-item">About</a>
          <a href="#" className="footer-link-item">Contact</a>
          <a href="#" className="footer-link-item">Privacy Policy</a>
          <a href="#" className="footer-link-item">Terms</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-disclaimer-full">
          <strong>MEDICAL DISCLAIMER:</strong> RespiraScan is a screening tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </div>
        <p style={{ fontSize: '0.75rem' }}>© 2026 RespiraScan Technologies Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const LandingPage = () => (
  <>
    <Hero />
    <HowItWorks />
    <ConditionsDetected />
    <WhyChoose />
    <PrivacySecurity />
    <Footer />
  </>
);

const HistoryPagePlaceholder = () => (
  <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
    <Clock size={48} color="var(--color-primary)" style={{ marginBottom: '1.5rem' }} />
    <h1>Analysis History</h1>
    <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>Your past reports will appear here when you are logged in.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <FullScreenLoader />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPagePlaceholder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

