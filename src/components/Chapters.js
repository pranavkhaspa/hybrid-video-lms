export const chapters = [
  { number: 1, title: "Introduction", start: 0, end: 60 },
  { number: 2, title: "Existing Frontend Architecture", start: 60, end: 120 },
  { number: 3, title: "Problem Statement", start: 120, end: 180 },
  { number: 4, title: "Solution Design", start: 180, end: 240 },
  { number: 5, title: "Implementation Walkthrough", start: 240, end: 300 },
  { number: 6, title: "Frontend Workflow", start: 300, end: 360 },
  { number: 7, title: "Live Demonstration", start: 360, end: 420 },
  { number: 8, title: "Summary", start: 420, end: 480 }
];

export const script = [
  // --- CHAPTER 1: INTRODUCTION (0:00 - 1:00) ---
  {
    start: 0,
    end: 15,
    text: "Welcome to this engineering documentary. Today, we go behind the scenes of the Hybrid Video LMS—an open-source learning management platform designed to stream high-performance educational video content and interactive lectures directly to students globally.",
    camera: "camera-zoom-in",
    scene: 1
  },
  {
    start: 15,
    end: 30,
    text: "In the field of modern software engineering, frontend development is far more than simple cosmetic styling. It serves as the primary gateway, translating complex backend data streams into an accessible human interface that feels responsive, organic, and instantaneous.",
    camera: "camera-normal",
    scene: 1
  },
  {
    start: 30,
    end: 45,
    text: "An online student learning platform must react instantly to user inputs, provide clear visual feedback, and guide the learner through their educational journey without visual layout shifts, stuttering frames, or frustrating navigation load cuts.",
    camera: "camera-pan-left",
    scene: 1
  },
  {
    start: 45,
    end: 60,
    text: "This open-source contribution, led by developers Sumit Prajapati and Subhash Maurya, addresses these design inconsistencies by implementing a unified, modular UI component library and a fluid transition engine for a premium frontend experience.",
    camera: "camera-zoom-in",
    scene: 1
  },

  // --- CHAPTER 2: EXISTING FRONTEND ARCHITECTURE (1:00 - 2:00) ---
  {
    start: 60,
    end: 75,
    text: "To understand the implementation, let's first inspect the existing frontend architecture, folder organization, and routing structure of the Hybrid Video LMS codebase inside the main source folder.",
    camera: "camera-pan-right",
    scene: 2
  },
  {
    start: 75,
    end: 90,
    text: "Looking at the directory tree, the components folder houses presentation widgets like navigation bars, sidebar tabs, custom video player skins, and course cards, which were imported across various pages in an ad-hoc manner.",
    camera: "camera-zoom-in",
    scene: 2
  },
  {
    start: 90,
    end: 105,
    text: "The pages folder contains the top-level page components, including the main student dashboard and course detail views, which are wired together through a standard client-side router configuration.",
    camera: "camera-normal",
    scene: 2
  },
  {
    start: 105,
    end: 120,
    text: "Supporting assets, custom hooks, and shared styling variables are organized in adjacent subdirectories. While clean on paper, this layout lacked a centralized component styling guideline, leading to discrepancies as features expanded rapidly.",
    camera: "camera-zoom-in",
    scene: 2
  },

  // --- CHAPTER 3: PROBLEM STATEMENT (2:00 - 3:00) ---
  {
    start: 120,
    end: 135,
    text: "As developers added features, critical user experience bottlenecks and technical debt began to accumulate in the visual layout. The most significant issue was duplicated UI code blocks across multiple files.",
    camera: "camera-pan-left",
    scene: 3
  },
  {
    start: 135,
    end: 150,
    text: "The student dashboard and course details pages duplicated massive segments of HTML markup and styling definitions for course cards and action buttons, dragging down developer velocity and increasing bundle sizes.",
    camera: "camera-zoom-in",
    scene: 3
  },
  {
    start: 150,
    end: 165,
    text: "This code duplication led directly to styling inconsistencies across pages. Hover states, margins, and card borders varied wildly depending on which view the student was visiting, breaking design continuity.",
    camera: "camera-normal",
    scene: 3
  },
  {
    start: 165,
    end: 180,
    text: "Furthermore, page transitions were completely static and abrupt. Moving between pages instantly snapped the screen without visual feedback, creating jarring transitions that disrupted the student's cognitive flow.",
    camera: "camera-zoom-in",
    scene: 3
  },

  // --- CHAPTER 4: SOLUTION DESIGN (3:00 - 4:00) ---
  {
    start: 180,
    end: 195,
    text: "The engineers formulated a solution to establish a centralized component library and a unified page transition engine, integrating Tailwind CSS styling with Framer Motion physics-based animations.",
    camera: "camera-pan-right",
    scene: 4
  },
  {
    start: 195,
    end: 210,
    text: "By centralizing common widgets like cards, sidebars, and buttons, they ensured that any visual modifications would automatically propagate across every page, maintaining strict design consistency.",
    camera: "camera-zoom-in",
    scene: 4
  },
  {
    start: 210,
    end: 225,
    text: "Additionally, a global transition layout was designed to intercept route modifications, sliding pages in and out with smooth easing curves that mimic physical navigation sheets.",
    camera: "camera-normal",
    scene: 4
  },
  {
    start: 225,
    end: 240,
    text: "In the new component hierarchy, the main App shell manages the state and layout slots. It feeds props down to the Dashboard and Course Details pages, which mount the reusable leaf components cleanly, optimizing re-render pathways.",
    camera: "camera-zoom-in",
    scene: 4
  },

  // --- CHAPTER 5: IMPLEMENTATION WALKTHROUGH (4:00 - 5:00) ---
  {
    start: 240,
    end: 255,
    text: "Let's dive into the implementation walkthrough inside VS Code. In our React components, we import the motion utility from Framer Motion, swapping standard HTML divs with motion-dot-div elements.",
    camera: "camera-pan-left",
    scene: 5
  },
  {
    start: 255,
    end: 270,
    text: "We declare hover animations using spring physics, setting scale and translate attributes to lift cards when hovered. We also specify entrance transitions to fade elements in smoothly.",
    camera: "camera-zoom-in",
    scene: 5
  },
  {
    start: 270,
    end: 285,
    text: "Styling is handled with utility classes from Tailwind CSS, applying modern glassmorphic designs like semi-transparent borders, backdrop blurs, and dark theme gradients for a premium visual appearance.",
    camera: "camera-normal",
    scene: 5
  },
  {
    start: 285,
    end: 300,
    text: "On the right side, the running browser preview reflects these changes in real-time. As code is saved, the cards instantly update with responsive spring hovers and glass styling, illustrating the speed of reactive development workflows.",
    camera: "camera-zoom-in",
    scene: 5
  },

  // --- CHAPTER 6: FRONTEND WORKFLOW (5:00 - 6:00) ---
  {
    start: 300,
    end: 315,
    text: "Let's explore the reactive frontend loop that makes these transitions possible, tracing the lifecycle from a student's mouse click to the actual physical screen re-render.",
    camera: "camera-pan-right",
    scene: 6
  },
  {
    start: 315,
    end: 330,
    text: "When a student clicks a course, the browser catches the interaction event and fires a handler that modifies the local state or triggers a React Router location change.",
    camera: "camera-zoom-in",
    scene: 6
  },
  {
    start: 330,
    end: 345,
    text: "React instantly registers this state diff, schedules a re-render of the component tree, and updates the Virtual DOM before writing changes to the browser's actual document object model.",
    camera: "camera-normal",
    scene: 6
  },
  {
    start: 345,
    end: 360,
    text: "Finally, the Framer Motion library intercepts the draw call, applying mathematical easing algorithms to update CSS transform properties smoothly, rendering the final frame-rate-optimized interface transition.",
    camera: "camera-zoom-in",
    scene: 6
  },

  // --- CHAPTER 7: LIVE DEMONSTRATION (6:00 - 7:00) ---
  {
    start: 360,
    end: 375,
    text: "Let's run a live demonstration to compare the user experience side-by-side. On the left is the legacy dashboard: page navigation feels sudden, snapping instantly between layouts with zero feedback.",
    camera: "camera-pan-left",
    scene: 7
  },
  {
    start: 375,
    end: 390,
    text: "On the right is the new, enhanced student portal: notice the elegant spring-based card hovers, and the smooth page-slide transitions that guide the viewer to the course details page.",
    camera: "camera-zoom-in",
    scene: 7
  },
  {
    start: 390,
    end: 405,
    text: "The video player fades in gently, and the layout flows dynamically on mobile screens. This visual continuity and responsive feedback make the student experience feel high-fidelity and organic.",
    camera: "camera-normal",
    scene: 7
  },
  {
    start: 405,
    end: 420,
    text: "By replacing static snap-transitions with continuous physical motion and fluid layout calculations, we keep the student engaged and reduce cognitive friction as they move throughout the application.",
    camera: "camera-zoom-in",
    scene: 7
  },

  // --- CHAPTER 8: SUMMARY (7:00 - 8:00) ---
  {
    start: 420,
    end: 435,
    text: "In summary, this frontend enhancement demonstrates the impact of reusable component systems and interactive transitions in building scalable, user-centric software projects that look and feel professional.",
    camera: "camera-zoom-in",
    scene: 8
  },
  {
    start: 435,
    end: 450,
    text: "By consolidating components into a unified library, developers reduced visual code duplication by forty percent, enhancing long-term project maintainability and frontend developer velocity.",
    camera: "camera-normal",
    scene: 8
  },
  {
    start: 450,
    end: 465,
    text: "We hope this educational documentary has shown how Tailwind CSS and Framer Motion can elevate React interfaces, illustrating the benefits of structuring code for design consistency.",
    camera: "camera-zoom-in",
    scene: 8
  },
  {
    start: 465,
    end: 480,
    text: "Thank you for watching this open-source contribution presentation for the Hybrid Video LMS. This engineering project was developed and contributed by Sumit Prajapati and Subhash Maurya.",
    camera: "camera-zoom-in",
    scene: 8
  }
];
