import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  repeatDelay?: number;
}

export function TextShimmer({
  children,
  className,
  duration = 1.5,
  repeatDelay = 0.5,
}: TextShimmerProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/60 to-white bg-[length:200%_100%]",
        className
      )}
      animate={{
        backgroundPosition: ["100% 0%", "-100% 0%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatDelay,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}
