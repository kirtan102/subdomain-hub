import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
import { Check, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SubdomainReservationProps {
  onReserve?: (subdomain: string) => void;
  domain?: string;
}

type AvailabilityState = 'idle' | 'loading' | 'available' | 'taken' | 'too-short';

export function SubdomainReservation({ 
  onReserve, 
  domain = "seeky.click" 
}: SubdomainReservationProps) {
  const [rawInput, setRawInput] = useState("");
  const [availabilityState, setAvailabilityState] = useState<AvailabilityState>('idle');
  const [hasBlurred, setHasBlurred] = useState(false);
  const checkInProgressRef = useRef(false);
  
  // Sanitize input: lowercase, only a-z, 0-9, hyphens
  const sanitizeInput = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
  };

  const sanitizedInput = sanitizeInput(rawInput);
  const debouncedInput = useDebounce(sanitizedInput, 800);
  
  const isValidLength = sanitizedInput.length >= 3;
  const isTooShort = sanitizedInput.length > 0 && sanitizedInput.length < 3;

  // Check availability function
  const checkAvailability = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      return;
    }

    // Validate format
    const formatValid = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(value);
    if (!formatValid && value.length >= 3) {
      setAvailabilityState('idle');
      return;
    }

    checkInProgressRef.current = true;
    setAvailabilityState('loading');
    
    try {
      const { data, error } = await supabase
        .rpc('is_subdomain_available', { subdomain_to_check: value });

      if (error) throw error;
      setAvailabilityState(data === true ? 'available' : 'taken');
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityState('idle');
    } finally {
      checkInProgressRef.current = false;
    }
  }, []);

  // Handle debounced input changes
  useEffect(() => {
    if (debouncedInput.length >= 3) {
      checkAvailability(debouncedInput);
    }
  }, [debouncedInput, checkAvailability]);

  // Reset state when input changes
  useEffect(() => {
    if (isTooShort && hasBlurred) {
      setAvailabilityState('too-short');
    } else if (sanitizedInput.length === 0) {
      setAvailabilityState('idle');
    } else if (sanitizedInput.length >= 3 && !checkInProgressRef.current) {
      // Show loading while waiting for debounce
      setAvailabilityState('loading');
    }
  }, [sanitizedInput, isTooShort, hasBlurred]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(e.target.value);
    setHasBlurred(false);
  };

  // Handle blur - immediate check if valid
  const handleBlur = () => {
    setHasBlurred(true);
    
    if (isTooShort) {
      setAvailabilityState('too-short');
    } else if (isValidLength && !checkInProgressRef.current) {
      // Immediate check on blur
      checkAvailability(sanitizedInput);
    }
  };

  // Handle reservation
  const handleReserve = () => {
    if (availabilityState === 'available' && onReserve) {
      onReserve(sanitizedInput);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Input Field */}
      <div className="relative">
        <div className="flex items-stretch rounded-xl border-2 border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 overflow-hidden">
          <input
            type="text"
            value={rawInput}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="mysubdomain"
            className={cn(
              "flex-1 px-5 py-4 text-lg bg-transparent border-none outline-none placeholder:text-muted-foreground/50",
              "font-mono tracking-wide"
            )}
          />
          <div className="flex items-center px-4 bg-muted/50 border-l border-border">
            <span className="text-muted-foreground font-mono text-base">.{domain}</span>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="min-h-[60px]">
        {/* Loading State - Skeleton */}
        {availabilityState === 'loading' && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {/* Too Short Warning */}
        {availabilityState === 'too-short' && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 animate-in slide-in-from-top-2 duration-200">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              Subdomain must be at least 3 characters.
            </span>
          </div>
        )}

        {/* Available State */}
        {availabilityState === 'available' && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-600 dark:text-green-400">
                <strong>{sanitizedInput}.{domain}</strong> is available!
              </span>
            </div>
            <Button 
              onClick={handleReserve}
              className="w-full py-6 text-lg font-semibold animate-in slide-in-from-bottom-2 duration-300"
            >
              Reserve Now
            </Button>
          </div>
        )}

        {/* Taken State */}
        {availabilityState === 'taken' && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 animate-in slide-in-from-top-2 duration-200">
            <X className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive">
              Sorry, <strong>{sanitizedInput}.{domain}</strong> is taken.
            </span>
          </div>
        )}

        {/* Idle State - Helper Text */}
        {availabilityState === 'idle' && sanitizedInput.length === 0 && (
          <p className="text-sm text-muted-foreground animate-in fade-in duration-200">
            Enter a subdomain to check availability. Only letters, numbers, and hyphens allowed.
          </p>
        )}
      </div>
    </div>
  );
}
