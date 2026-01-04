import { Globe } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-md opacity-50" />
        <div className="relative bg-gradient-primary p-2 rounded-lg">
          <Globe className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight">
          <span className="text-gradient">Sub</span>
          <span className="text-foreground">Domain</span>
        </span>
      )}
    </div>
  );
}
