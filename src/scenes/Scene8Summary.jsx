import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Scene8Summary = ({ currentTime }) => {
  const elapsed = currentTime - 420; // 0 to 60s
  
  // Show summary parameters for first 25 seconds, then credits roll
  const showSummary = elapsed < 25;

  const metrics = [
    { label: "Reusable Components", value: "Unified UI Widgets Library", desc: "Common cards and buttons consolidated." },
    { label: "Transition Library", value: "Framer Motion Spring Engine", desc: "Elastic physical sheet movements integrated." },
    { label: "User Experience", value: "Eliminated Snap Latency", desc: "Cohesive visual states prevent context breaks." },
    { label: "Scalable Codebase", value: "40% Less Styling Markup", desc: "Centralized tokens accelerate feature additions." }
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#090b11] via-bg-dark to-[#04060b] p-6 justify-center items-center relative overflow-hidden">
      {/* Space background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {showSummary ? (
          // Summary Metrics Grid View
          <motion.div
            key="summary-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg z-10"
          >
            <div className="text-center mb-6">
              <span className="text-[10px] tracking-[0.25em] font-semibold text-accent-cyan uppercase">Review</span>
              <h2 className="text-xl font-bold text-white mt-1">Enhancement Summary</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric, index) => (
                <div key={index} className="p-3 rounded-lg border border-slate-900 bg-slate-950/40 backdrop-blur-sm">
                  <span className="text-[8px] text-accent-cyan uppercase font-bold tracking-wider">{metric.label}</span>
                  <h4 className="text-xs font-bold text-white mt-1 leading-snug">{metric.value}</h4>
                  <p className="text-[9px] text-slate-500 mt-1 leading-normal">{metric.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          // Credits Scroll View
          <motion.div
            key="credits-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-center z-10 w-full max-w-md flex flex-col gap-5 py-4"
          >
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan bg-clip-text text-transparent mb-1">
                Thank You for Watching
              </h1>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Engineering Presentation</span>
            </div>

            <div className="border-t border-b border-slate-900/60 py-4 my-2 flex flex-col gap-1.5 bg-slate-950/10 backdrop-blur-sm rounded-lg">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Project</span>
              <h3 className="text-sm font-bold text-white">Hybrid Video LMS</h3>
              <span className="text-[10px] text-accent-purple font-medium">Frontend Enhancement</span>
              <p className="text-[9px] text-slate-400">UI Components & Transition Library</p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Contributors</span>
              <h4 className="text-xs font-bold text-white">Sumit Prajapati</h4>
              <h4 className="text-xs font-bold text-white">Subhash Maurya</h4>
            </div>

            <div className="mt-2">
              <span className="text-[9px] uppercase font-bold tracking-widest bg-accent-cyan/15 text-accent-cyan px-3 py-1 rounded-full border border-accent-cyan/20">
                Open Source Contribution
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
