import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  UploadCloud,
  Waves,
  Lock,
  FileSearch,
  CheckCircle,
  Stethoscope,
  HeartPulse,
  Brain,
  Shield,
  Clock,
  Touchpad,
  Mail,
  Info,
  ChevronRight,
  Menu
} from 'lucide-react';
import './App.css';

// --- Shared Components ---

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
    <h2 className="text-balance">{title}</h2>
    {subtitle && <p style={{ color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.125rem' }}>{subtitle}</p>}
  </div>
);

const BenefitCard = ({ icon: Icon, title, description }) => (
  <div className="card">
    <div className="icon-wrapper">
      <Icon size={24} />
    </div>
    <h3>{title}</h3>
    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-body)' }}>{description}</p>
  </div>
);

// --- Sections ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <a href="/" className="logo">
          <HeartPulse size={28} color="var(--color-primary)" />
          <span>Respira<span style={{ color: 'var(--color-primary)' }}>Scan</span></span>
        </a>

        <div className="nav-links">
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#conditions" className="nav-link">Conditions</a>
          <a href="#benefits" className="nav-link">Benefits</a>
          <a href="#privacy" className="nav-link">Privacy</a>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Start Analysis</button>
        </div>

        <button className="md-only" style={{ background: 'none', border: 'none', display: 'none' }}>
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="hero">
    <div className="hero-bg" style={{ backgroundImage: 'url("/respirascan_hero_bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <div className="container">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span style={{
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
        }}>
          AI-Powered Respiratory Screening
        </span>
        <h1 className="text-balance">AI-Based Respiratory Risk Detection from Voice</h1>
        <p className="hero-subheading text-balance">
          Upload a voice or breathing sample and receive an AI-powered respiratory risk assessment within seconds.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary">
            Start Analysis <ChevronRight size={18} />
          </button>
          <button className="btn btn-secondary">Learn How It Works</button>
        </div>
      </motion.div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="section-padding">
    <div className="container">
      <SectionHeader title="How It Works" subtitle="Three simple steps to understand your respiratory health markers." />
      <div className="card-grid">
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
      </div>
    </div>
  </section>
);

const ConditionsDetected = () => (
  <section id="conditions" className="section-padding" style={{ backgroundColor: '#f1f5f9' }}>
    <div className="container">
      <SectionHeader title="Conditions Detected" subtitle="Our AI is trained to identify acoustic signatures of various respiratory conditions." />
      <div className="card-grid">
        {[
          { name: 'Asthma', icon: HeartPulse },
          { name: 'COPD', icon: Activity },
          { name: 'COVID-19', icon: Crown }, // Using Crown for Covid as a placeholder or import
          { name: 'Pneumonia', icon: Stethoscope }
        ].map((c, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <c.icon size={40} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0' }}>{c.name}</h3>
          </div>
        ))}
      </div>
      <p className="disclaimer">
        "This tool is for screening support only and does not replace professional medical diagnosis."
      </p>
    </div>
  </section>
);

// Helper for COVID icon since Crown might not be the best
const Crown = ({ size, color, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
    <path d="M12 17H12.01" />
  </svg>
);

const WhyChoose = () => (
  <section id="benefits" className="section-padding">
    <div className="container">
      <SectionHeader title="Why Choose RespiraScan" />
      <div className="card-grid">
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
      </div>
    </div>
  </section>
);

const PrivacySecurity = () => (
  <section id="privacy" className="section-padding" style={{ backgroundColor: 'white' }}>
    <div className="container">
      <div style={{ backgroundColor: '#f8fafc', padding: '4rem', borderRadius: 'var(--border-radius)', border: '1px solid #e2e8f0' }}>
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
      </div>
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

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ConditionsDetected />
        <WhyChoose />
        <PrivacySecurity />
      </main>
      <Footer />
    </div>
  );
}

export default App;

