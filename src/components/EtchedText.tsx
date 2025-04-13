import React from "react";
import { motion } from "framer-motion";

interface EtchedTextProps {
  text: string;
  highlightPart?: string;
  highlightColor?: string;
  className?: string;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
}

const EtchedText = ({
  text,
  highlightPart,
  highlightColor = "text-blue-500",
  className = "",
  size = "8xl",
}: EtchedTextProps) => {
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  // Split text if there's a highlight part
  let beforeHighlight = text;
  let afterHighlight = "";

  if (highlightPart) {
    const parts = text.split(highlightPart);
    beforeHighlight = parts[0];
    afterHighlight = parts.length > 1 ? parts[1] : "";
  }

  return (
    <motion.div
      className={`relative ${className}`}
      variants={textVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="inline-block relative"
        animate="pulse"
        variants={pulseVariants}
      >
        <motion.div
          className="absolute -inset-10 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        <h1
          className={`text-${size} font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 select-none`}
          style={{
            textShadow: `
              -1px -1px 0 rgba(255,255,255,0.05), 
              1px -1px 0 rgba(255,255,255,0.05), 
              -1px 1px 0 rgba(255,255,255,0.05), 
              1px 1px 0 rgba(255,255,255,0.05),
              0 -2px 8px rgba(255,255,255,0.07),
              0 0 8px rgba(70,130,240,0.2),
              0 0 32px rgba(70,130,240,0.2)
            `,
          }}
        >
          {beforeHighlight}
          {highlightPart && (
            <span className={highlightColor}>{highlightPart}</span>
          )}
          {afterHighlight}
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default EtchedText;
