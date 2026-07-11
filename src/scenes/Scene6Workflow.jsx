import React from 'react';
import { motion } from 'framer-motion';

export const Scene6Workflow = ({ currentTime }) => {
  const elapsed = currentTime - 300; // 0 to 60s
  
  // Stages glow in order as narration runs
  const activeStep = 
    elapsed < 10 ? 1 :
    elapsed < 20 ? 2 :
    elapsed < 30 ? 3 :
    elapsed < 40 ? 4 :
    elapsed < 52 ? 5 : 6;

  const steps = [
    { number: 1, title: "User Click", desc: "Mouse trigger is captured by the synthetic event handler.", icon: "🖱️" },
    { number: 2, title: "React State", desc: "Local state hooks update, dispatching navigation events.", icon: "⚡" },
    { number: 3, title: "Re-render", desc: "React executes component loops, producing updated trees.", icon: "⚛️" },
    { number: 4, title: "DOM Update", desc: "Reconciliation engine paints structural modifications to the DOM.", icon: "🌳" },
    { number: 5, title: "Smooth Transition", desc: "Framer Motion calculates physics curves, applying CSS transforms.", icon: "✨" },
    { number: 6, title: "Updated Interface", desc: "Fluid state achieved, presenting organic animations to user.", icon: "📱" }
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-bg-dark to-[#090b14] p-6 justify-center items-center">
      
      {/* Title */}
      <div className="text-center mb-5">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-accent-purple uppercase">Render Lifecycle</span>
        <h2 className="text-lg font-bold text-white mt-1">Reactive Action-Render Loop</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Tracing data pathways from mouse triggers to physical canvas animations</p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-xl relative">
        {steps.map((step) => {
          const isActive = step.number === activeStep;
          const isDone = step.number < activeStep;
          
          return (
            <motion.div
              key={step.number}
              animate={{
                scale: isActive ? 1.03 : 1,
              }}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between h-28 relative transition-all duration-500 ${
                isActive 
                  ? 'border-accent-purple bg-accent-purple/10 text-white shadow-glow-purple' 
                  : isDone
                    ? 'border-slate-800 bg-slate-900/10 text-slate-300 opacity-80'
                    : 'border-slate-900 bg-slate-950/20 text-slate-650 opacity-30'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg">{step.icon}</span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30' 
                    : 'bg-slate-900 text-slate-500'
                }`}>
                  0{step.number}
                </span>
              </div>
              
              <div className="mt-2">
                <h4 className="text-[10px] font-bold tracking-wide">{step.title}</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-normal line-clamp-2">
                  {step.desc}
                </p>
              </div>

              {/* Glowing active outline */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg border border-accent-purple/50 animate-pulse pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
