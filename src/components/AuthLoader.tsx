import { Loader2 } from "lucide-react";
import { Logo } from "./Logo";

export function AuthLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-glow opacity-20" />
      <div className="relative flex flex-col items-center gap-6">
        <Logo />
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    </div>
  );
}
