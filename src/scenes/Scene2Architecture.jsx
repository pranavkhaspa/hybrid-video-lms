import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Scene2Architecture = ({ currentTime }) => {
  const elapsed = currentTime - 60; // elapsed time in this scene

  // Compute folder states based on timeline milestones
  const isComponentsOpen = elapsed >= 13;
  const isPagesOpen = elapsed >= 27;
  const isHooksOpen = elapsed >= 40;
  
  // Compute file highlight targets
  const highlightCourseCard = elapsed >= 13 && elapsed < 27;
  const highlightUseTransition = elapsed >= 40 && elapsed < 53;
  const highlightApp = elapsed >= 53;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-bg-dark to-[#0c1220] p-6 justify-center">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white tracking-wide">Project Directory Structure</h2>
        <p className="text-xs text-slate-400">Exploring the structural layout inside the source directory</p>
      </div>

      <div className="w-full max-w-md mx-auto glass-panel rounded-lg border border-slate-800/80 overflow-hidden shadow-2xl">
        {/* IDE Header Bar */}
        <div className="flex justify-between items-center bg-[#0d131f] px-4 py-2 border-b border-slate-800/60">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">hybrid-video-lms / src</span>
          <div className="w-8" />
        </div>

        {/* Tree Body */}
        <div className="p-4 font-mono text-xs text-slate-300 h-80 overflow-y-auto select-none bg-[#0a0f18]/80">
          {/* Root src folder */}
          <div className="flex items-center gap-1.5 py-0.5 text-accent-blue font-medium">
            <span>📂</span>
            <span>src</span>
          </div>

          <div className="pl-4 border-l border-slate-800/60 ml-2 py-0.5 flex flex-col gap-1">
            {/* Components Folder */}
            <div>
              <div className="flex items-center gap-1.5 py-0.5 text-amber-500">
                <span>{isComponentsOpen ? '📂' : '📁'}</span>
                <span>components</span>
              </div>
              
              <AnimatePresence>
                {isComponentsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-6 border-l border-slate-800/40 ml-2 overflow-hidden flex flex-col gap-0.5 py-0.5"
                  >
                    <div className={`flex items-center gap-1.5 py-0.5 px-1.5 rounded transition-all duration-300 ${highlightCourseCard ? 'bg-accent-blue/15 text-accent-blue font-semibold scale-102 border-l-2 border-accent-blue' : 'text-slate-400'}`}>
                      <span>⚛️</span>
                      <span>CourseCard.jsx</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <span>⚛️</span>
                      <span>Navbar.jsx</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <span>⚛️</span>
                      <span>Sidebar.jsx</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <span>⚛️</span>
                      <span>VideoPlayer.jsx</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pages Folder */}
            <div>
              <div className="flex items-center gap-1.5 py-0.5 text-amber-500">
                <span>{isPagesOpen ? '📂' : '📁'}</span>
                <span>pages</span>
              </div>
              
              <AnimatePresence>
                {isPagesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pl-6 border-l border-slate-800/40 ml-2 overflow-hidden flex flex-col gap-0.5 py-0.5"
                  >
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <span>⚛️</span>
                      <span>Dashboard.jsx</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5 text-slate-400">
                      <span>⚛️</span>
                      <span>CourseDetails.jsx</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hooks Folder */}
            <div>
              <div className="flex items-center gap-1.5 py-0.5 text-amber-500">
                <span>{isHooksOpen ? '📂' : '📁'}</span>
                <span>hooks</span>
              </div>
              
              <AnimatePresence>
                {isHooksOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pl-6 border-l border-slate-800/40 ml-2 overflow-hidden flex flex-col gap-0.5 py-0.5"
                  >
                    <div className={`flex items-center gap-1.5 py-0.5 px-1.5 rounded transition-all duration-300 ${highlightUseTransition ? 'bg-accent-purple/15 text-accent-purple font-semibold scale-102 border-l-2 border-accent-purple' : 'text-slate-400'}`}>
                      <span>⚙️</span>
                      <span>useTransition.js</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* App.jsx */}
            <div className={`flex items-center gap-1.5 py-0.5 px-1.5 rounded transition-all duration-300 ${highlightApp ? 'bg-accent-cyan/15 text-accent-cyan font-semibold scale-102 border-l-2 border-accent-cyan' : 'text-slate-400'}`}>
              <span>⚛️</span>
              <span>App.jsx</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
