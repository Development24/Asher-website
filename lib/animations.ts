// Animation configuration for consistent UX across the application
export const animations = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Card hover effects
  card: {
    hover: { 
      scale: 1.02, 
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)" 
    },
    tap: { scale: 0.98 },
    transition: { 
      type: "spring" as const, 
      stiffness: 300, 
      damping: 20 
    }
  },

  // Button interactions
  button: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transition: { duration: 0.2, ease: "easeInOut" }
  },

  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Staggered animations
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },

  // Modal animations
  modal: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },

  // Loading states
  loading: {
    pulse: {
      animate: {
        opacity: [1, 0.5, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  }
};

// Common transition presets
export const transitions = {
  fast: { duration: 0.2, ease: "easeInOut" },
  normal: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.5, ease: "easeOut" },
  spring: { type: "spring", stiffness: 300, damping: 20 }
};

// CSS classes for common animations
export const animationClasses = {
  // Hover effects
  hoverScale: "transition-transform duration-200 hover:scale-105",
  hoverLift: "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
  
  // Focus states
  focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  
  // Loading states
  pulse: "animate-pulse",
  spin: "animate-spin",
  
  // Transitions
  smooth: "transition-all duration-300 ease-in-out",
  fast: "transition-all duration-200 ease-in-out"
}; 