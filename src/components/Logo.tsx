import { Globe } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
        <Globe className="w-4 h-4 text-background" />
      </div>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          SubDomain
        </span>
      )}
    </div>
  );
}
