import React from 'react';
import { motion } from 'framer-motion';

export const Scene4Design = ({ currentTime }) => {
  const elapsed = currentTime - 180; // 0 to 60s
  
  // Highlight stages of the hierarchy during the explanation
  // 180 to 195: App root focus
  // 195 to 210: Layout components (Navbar, Sidebar, Footer)
  // 210 to 225: Page wrappers (Dashboard)
  // 225 to 240: Leaf components (Cards, Video Player)
  const isAppFocused = elapsed >= 0;
  const isLayoutsFocused = elapsed >= 10;
  const isPagesFocused = elapsed >= 20;
  const isLeavesFocused = elapsed >= 35;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-bg-dark to-[#090a14] p-6 justify-center items-center relative overflow-hidden">
      <div className="w-full text-center mb-6 z-10">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-accent-purple uppercase">Solution Topology</span>
        <h2 className="text-xl font-bold text-white mt-1">Unified Component Architecture</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Centralizing shared state in layout blocks while isolating reusable leaf nodes
        </p>
      </div>

      {/* Component Tree Board */}
      <div className="relative w-full max-w-2xl h-72 border border-slate-900 bg-[#070b13]/60 rounded-xl p-4 flex items-center justify-center">
        
        {/* Connection Paths SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* App to children paths */}
          <g opacity={isLayoutsFocused ? 1 : 0.2} className="transition-opacity duration-700">
            {/* App to Navbar */}
            <path d="M 320 60 L 160 130" stroke="url(#tree-line-grad)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
            {/* App to Sidebar */}
            <path d="M 320 60 L 260 130" stroke="url(#tree-line-grad)" strokeWidth="1.5" fill="none" />
            {/* App to Dashboard */}
            <path d="M 320 60 L 380 130" stroke="url(#tree-line-grad)" strokeWidth="2" fill="none" />
            {/* App to Footer */}
            <path d="M 320 60 L 480 130" stroke="url(#tree-line-grad)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          </g>

          {/* Dashboard to children paths */}
          <g opacity={isLeavesFocused ? 1 : 0.2} className="transition-opacity duration-700">
            {/* Dashboard to Cards */}
            <path d="M 380 150 L 320 220" stroke="url(#tree-line-grad-accent)" strokeWidth="1.5" fill="none" />
            {/* Dashboard to Video Player */}
            <path d="M 380 150 L 440 220" stroke="url(#tree-line-grad-accent)" strokeWidth="1.5" fill="none" />
          </g>

          <defs>
            <linearGradient id="tree-line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="tree-line-grad-accent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Node Components */}
        {/* App Root (Level 0) */}
        <motion.div
          animate={{ scale: isAppFocused ? 1.05 : 1 }}
          className={`absolute top-8 w-24 py-1.5 rounded-lg border text-center text-xs font-mono font-semibold transition-all duration-500 bg-[#0f1524] z-20 ${isAppFocused ? 'border-accent-purple shadow-glow-purple text-white' : 'border-slate-800 text-slate-500'}`}
          style={{ left: 'calc(50% - 48px)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-purple inline-block mr-1.5 animate-pulse" />
          App Shell
        </motion.div>

        {/* Layout Components (Level 1) */}
        <div className="absolute top-32 inset-x-4 flex justify-between px-6 z-20">
          {/* Navbar */}
          <motion.div
            animate={{ opacity: isLayoutsFocused ? 1 : 0.3 }}
            className={`w-20 py-1.5 rounded border text-center text-[10px] font-mono transition-all duration-500 ${isLayoutsFocused ? 'border-slate-700 bg-slate-900/90 text-slate-200' : 'border-slate-850 bg-slate-950 text-slate-600'}`}
          >
            Navbar
          </motion.div>

          {/* Sidebar */}
          <motion.div
            animate={{ opacity: isLayoutsFocused ? 1 : 0.3 }}
            className={`w-20 py-1.5 rounded border text-center text-[10px] font-mono transition-all duration-500 ${isLayoutsFocused ? 'border-slate-700 bg-slate-900/90 text-slate-200' : 'border-slate-850 bg-slate-950 text-slate-600'}`}
          >
            Sidebar
          </motion.div>

          {/* Dashboard Container (Middle main page wrapper) */}
          <motion.div
            animate={{ scale: isPagesFocused ? 1.05 : 1, opacity: isPagesFocused ? 1 : 0.3 }}
            className={`w-28 py-2 rounded-lg border text-center text-xs font-mono font-semibold transition-all duration-500 ${isPagesFocused ? 'border-accent-blue bg-accent-blue/10 text-white shadow-glow-blue' : 'border-slate-850 bg-slate-950 text-slate-600'}`}
            style={{ position: 'absolute', left: 'calc(50% - 56px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue inline-block mr-1.5 animate-pulse" />
            Dashboard
          </motion.div>

          {/* Footer */}
          <motion.div
            animate={{ opacity: isLayoutsFocused ? 1 : 0.3 }}
            className={`w-20 py-1.5 rounded border text-center text-[10px] font-mono transition-all duration-500 ${isLayoutsFocused ? 'border-slate-700 bg-slate-900/90 text-slate-200' : 'border-slate-850 bg-slate-950 text-slate-600'}`}
          >
            Footer
          </motion.div>
        </div>

        {/* Leaf Components (Level 2) */}
        <div className="absolute bottom-6 w-full flex justify-center gap-12 z-20">
          {/* CourseCards */}
          <motion.div
            animate={{ scale: isLeavesFocused ? 1.05 : 1, opacity: isLeavesFocused ? 1 : 0.3 }}
            className={`w-24 py-1.5 rounded border text-center text-[10px] font-mono transition-all duration-500 bg-[#0f172a] ${isLeavesFocused ? 'border-accent-cyan text-accent-cyan shadow-glow-cyan font-medium' : 'border-slate-850 text-slate-600'}`}
          >
            Course Cards
          </motion.div>

          {/* Custom Video Player */}
          <motion.div
            animate={{ scale: isLeavesFocused ? 1.05 : 1, opacity: isLeavesFocused ? 1 : 0.3 }}
            className={`w-24 py-1.5 rounded border text-center text-[10px] font-mono transition-all duration-500 bg-[#0f172a] ${isLeavesFocused ? 'border-accent-cyan text-accent-cyan shadow-glow-cyan font-medium' : 'border-slate-850 text-slate-600'}`}
          >
            Video Player
          </motion.div>
        </div>
      </div>
    </div>
  );
};
