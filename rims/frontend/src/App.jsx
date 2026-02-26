import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  Database, 
  Cpu, 
  Globe, 
  Zap, 
  ArrowRight,
  Menu,
  Terminal,
  Server
} from 'lucide-react';
import './App.css';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'nav-blur py-3' : 'py-5'}`}>
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-indigo-500 w-6 h-6" />
          <span className="text-lg font-bold tracking-tight text-white">Sentinel<span className="text-indigo-500">Node</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#monitor" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Monitoring</a>
          <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</button>
          <button className="btn btn-primary text-sm py-2">Get Started</button>
        </div>

        <button className="md:hidden text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="card-enterprise">
    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
      <Icon className="w-5 h-5 text-indigo-500" />
    </div>
    <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

// --- Main App ---

function App() {
  const [nodeData, setNodeData] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchNode = async () => {
    setFetching(true);
    try {
      const resp = await fetch('http://localhost:5000/api/fastapi-data');
      const data = await resp.json();
      setNodeData(data);
    } catch (err) {
      console.error("Connection error:", err);
    } finally {
      setTimeout(() => setFetching(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-wider mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  System Version 4.0.2
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white text-balance">
                  Autonomous Urban Monitoring <br />
                  <span className="text-indigo-500">at Metropolitan Scale.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                  SentinelNode deploys decentralized neural clusters to monitor city health metrics with sub-millisecond precision.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="btn btn-primary px-8 py-3.5 w-full sm:w-auto">
                    Deploy Application
                  </button>
                  <button className="btn btn-secondary px-8 py-3.5 w-full sm:w-auto" onClick={fetchNode}>
                    <Activity className="w-4 h-4 mr-1" /> Run Diagnostics
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Row */}
        <section id="features" className="py-16 border-y border-white/5 bg-white/[0.01]">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-6">
              <Feature 
                icon={Cpu} 
                title="Neural Mesh" 
                desc="Distributed edge computing for real-time environmental data processing."
              />
              <Feature 
                icon={Shield} 
                title="Atomic Security" 
                desc="Hardware-level encryption for critical metropolitan infrastructure."
              />
              <Feature 
                icon={Globe} 
                title="Global Sync" 
                desc="Unified telemetry dashboard for cross-city safety orchestration."
              />
            </div>
          </div>
        </section>

        {/* Console Section */}
        <section id="monitor" className="py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-12">
                <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Console Header */}
                  <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2">
                       <Terminal className="w-3 h-3" /> Live Control Interface
                    </span>
                  </div>
                  
                  {/* Console Body */}
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between gap-12">
                      <div className="max-w-md">
                        <h2 className="text-3xl font-bold mb-6 text-white text-balance">Unified Cross-Stack Telemetry.</h2>
                        <ul className="space-y-4 mb-8">
                          {[
                            { tech: 'React', desc: 'Visualization layer with Atomic UI' },
                            { tech: 'Express', desc: 'Secure middleware for node relay' },
                            { tech: 'FastAPI', desc: 'Core neural engine for processing' }
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                              <Zap className="w-4 h-4 text-indigo-500" />
                              <span><strong className="text-white">{item.tech}:</strong> {item.desc}</span>
                            </li>
                          ))}
                        </ul>
                        <button 
                          className="btn btn-primary w-full md:w-auto" 
                          onClick={fetchNode}
                          disabled={fetching}
                        >
                          {fetching ? 'Syncing...' : 'Initiate Handshake'}
                        </button>
                      </div>

                      <div className="flex-1 bg-black/40 rounded-xl p-6 font-mono text-xs border border-white/5 min-h-[250px] relative">
                        <AnimatePresence mode="wait">
                          {fetching ? (
                            <motion.div 
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3 animate-pulse"
                            >
                              <div className="h-2 w-1/2 bg-slate-800 rounded" />
                              <div className="h-2 w-3/4 bg-slate-800 rounded" />
                              <div className="h-2 w-2/3 bg-slate-800 rounded" />
                            </motion.div>
                          ) : nodeData ? (
                            <motion.div 
                              key="data"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-indigo-300"
                            >
                              <div className="flex items-center gap-2 text-indigo-500 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <span className="uppercase text-[10px] font-bold">Signal Locked</span>
                              </div>
                              <pre className="whitespace-pre-wrap">{JSON.stringify(nodeData, null, 2)}</pre>
                            </motion.div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                              <Server className="w-8 h-8 mb-4" />
                              <p className="tracking-widest uppercase font-bold text-[10px]">Awaiting Connection</p>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container-custom">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                 <Shield className="text-indigo-500 w-5 h-5" />
                 <span className="font-bold text-white text-sm">SentinelNode</span>
              </div>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest text-center">
                 © 2026 Sentinel Lab. Unified Municipal Intelligence Network.
              </p>
              <div className="flex gap-6">
                 <a href="#" className="text-slate-500 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
