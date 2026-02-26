import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Globe, 
  Cpu, 
  PieChart, 
  Zap, 
  ChevronRight, 
  ArrowRight,
  Menu,
  Database,
  AlertCircle,
  Heart,
  Microscope,
  Stethoscope
} from 'lucide-react';
import './App.css';

// --- Shared Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className="container">
        <div className={`glass rounded-2xl px-6 py-3 flex items-center justify-between border-white/10 ${isScrolled ? 'bg-bg-primary/80' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">UrbanVoice <span className="text-brand-primary">Sentinel</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#intelligence" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Intelligence</a>
            <a href="#infrastructure" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Infrastructure</a>
            <a href="#monitor" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Live Pulse</a>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <button className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Sign In</button>
            <button className="btn btn-primary text-sm py-2 px-5">Get Started</button>
          </div>

          <div className="md:hidden">
            <Menu className="w-5 h-5 text-text-secondary" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group"
  >
    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 border border-brand-primary/20 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-brand-primary" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-text-secondary leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

// --- Main Page ---

function App() {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/fastapi-data');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setLiveData(data);
    } catch (err) {
      console.error("Sentinel Error:", err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen selection:bg-brand-primary/30">
      {/* Decorative Elements */}
      <div className="blob bg-brand-primary top-[-200px] left-[-100px]" />
      <div className="blob bg-brand-secondary bottom-[-200px] right-[-100px]" />
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                  </span>
                  Metropolitan Health Network
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                  Urban Health <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                    Intelligently Secure.
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed max-w-xl">
                  Sentinel monitors the invisible pulses of the city—from air quality to biometric health trends—ensuring urban resilience through decentralized neural nodes.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button onClick={fetchLiveData} className="btn btn-primary px-8 py-4">
                    View Live Pulse <ArrowRight className="w-5 h-5 ml-1" />
                  </button>
                  <button className="btn btn-outline px-8 py-4">
                    Technical Specs
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="w-full aspect-square glass rounded-[60px] border-white/5 flex items-center justify-center p-12 overflow-hidden shadow-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent"></div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full border border-dashed border-white/10 rounded-full flex items-center justify-center"
                  >
                    <div className="w-[70%] h-[70%] border border-white/5 rounded-full flex items-center justify-center relative">
                      <Activity className="w-20 h-20 text-brand-primary opacity-40" />
                      
                      {/* Floating Orbs */}
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-0 right-0 w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-lg"
                      >
                         <Heart className="w-6 h-6 text-red-400" />
                      </motion.div>
                      
                      <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                        className="absolute bottom-10 left-[-20px] w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-lg"
                      >
                         <Microscope className="w-6 h-6 text-cyan-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: 'Active Nodes', value: '4,289' },
              { label: 'Latency', value: '0.12ms' },
              { label: 'Uptime', value: '99.99%' },
              { label: 'Cities Monitored', value: '124' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <p className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="intelligence" className="py-24">
        <div className="container">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
              Metropolitan-scale <br />
              <span className="text-text-secondary">Intelligence Architecture.</span>
            </h2>
            <p className="text-text-secondary text-lg">
              We leverage edge-computing and neural processing to transform messy urban data into clear, actionable health insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity} 
              title="Real-time Vitals" 
              description="Monitor air pollutants, noise levels, and biological markers at meter-level precision."
              delay={0.1}
            />
            <FeatureCard 
              icon={Stethoscope} 
              title="Civic Diagnostics" 
              description="Predictive infrastructure analysis to prevent healthcare system overloads."
              delay={0.2}
            />
            <FeatureCard 
              icon={Cpu} 
              title="Neural Mesh" 
              description="Privacy-first data processing that happens at the node, not in the cloud."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Live Monitor Section */}
      <section id="monitor" className="py-24 relative overflow-hidden">
        <div className="container">
          <div className="glass rounded-[48px] p-8 md:p-20 overflow-hidden relative border-white/5">
            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Database className="w-80 h-80" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight text-white">
                  Unified Stack <br />
                  Orchestration.
                </h2>
                <div className="space-y-8">
                  {[
                    { title: 'Frontend Relay', tech: 'React + Vite', desc: 'Enterprise-grade visualization layer.' },
                    { title: 'API Gateway', tech: 'Express Node.js', desc: 'Secure middleware for data validation.' },
                    { title: 'Compute Engine', tech: 'FastAPI Python', desc: 'Neural processing and AI modeling.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 border border-brand-primary/20">
                        <Zap className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <p className="text-white font-bold mb-1">{item.title} <span className="text-xs font-medium text-text-muted ml-2">{item.tech}</span></p>
                        <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={fetchLiveData}
                  disabled={loading}
                  className="mt-12 btn btn-primary px-10 py-4 group"
                >
                  {loading ? 'Interrogating Neural Engine...' : 'Run Integration Test'}
                  {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>

              {/* Console Preview */}
              <div className="bg-[#050608] rounded-3xl p-6 md:p-8 border border-white/10 font-mono text-sm shadow-2xl relative">
                <div className="flex gap-2 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                  <div className="flex-1 text-center text-[10px] text-text-muted uppercase tracking-[0.3em]">sentinel-v4.0.2</div>
                </div>
                
                <div className="space-y-5 min-h-[300px]">
                  <div className="flex gap-3">
                    <span className="text-brand-primary opacity-50">$</span>
                    <p className="text-white">urban-sentinel --fetch-node-84</p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 py-4"
                      >
                        <div className="h-2 w-2/3 bg-white/5 rounded animate-pulse" />
                        <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse delay-75" />
                        <div className="h-2 w-3/4 bg-white/5 rounded animate-pulse delay-150" />
                      </motion.div>
                    ) : liveData ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-brand-primary/5 p-5 rounded-2xl border border-brand-primary/20"
                      >
                        <p className="text-brand-primary text-xs mb-3 flex items-center gap-2">
                           <AlertCircle className="w-3 h-3" />
                           Node Signal Locked
                        </p>
                        <pre className="text-indigo-200 text-xs overflow-x-auto">
                          {JSON.stringify(liveData, null, 2)}
                        </pre>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 opacity-20">
                         <Database className="w-12 h-12 mb-4" />
                         <p className="text-xs uppercase tracking-widest">Awaiting Command</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight leading-tight">
              The future of urban <br /> resilience starts here.
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12">
              <button className="btn btn-primary px-12 py-5 text-xl">Request Access</button>
              <button className="text-text-secondary font-semibold hover:text-white transition-colors flex items-center gap-2">
                 Read Documentation <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-2.5">
                <Shield className="text-brand-primary w-6 h-6" />
                <span className="font-bold text-white">UrbanVoice</span>
             </div>
             <p className="text-text-muted text-xs font-medium uppercase tracking-[0.4em]">© 2026 Sentinel Network Lab</p>
             <div className="flex gap-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-white transition-colors">Safety</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Legal</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
