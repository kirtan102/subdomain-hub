import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTabsProps {
  tabs: { label: string; href: string }[];
  className?: string;
}

export function AnimatedTabs({ tabs, className }: AnimatedTabsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {tabs.map((tab, index) => (
        <a
          key={tab.label}
          href={tab.href}
          className="relative px-4 py-2 text-sm text-white transition-colors whitespace-nowrap"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {hoveredIndex === index && (
            <motion.span
              className="absolute inset-0 rounded-full bg-white/10"
              layoutId="navHover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </a>
      ))}
    </div>
  );
}
