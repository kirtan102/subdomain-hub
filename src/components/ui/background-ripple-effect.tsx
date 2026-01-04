"use client";
import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BackgroundRippleEffectProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}

export function BackgroundRippleEffect({
  rows = 10,
  cols = 20,
  cellSize = 60,
  className,
}: BackgroundRippleEffectProps) {
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [rippleCells, setRippleCells] = useState<Set<string>>(new Set());

  const handleCellClick = useCallback((row: number, col: number) => {
    setClickedCell({ row, col });
    
    // Create ripple effect
    const newRippleCells = new Set<string>();
    const maxDistance = 5;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const distance = Math.sqrt(Math.pow(r - row, 2) + Math.pow(c - col, 2));
        if (distance <= maxDistance) {
          newRippleCells.add(`${r}-${c}`);
        }
      }
    }
    
    setRippleCells(newRippleCells);
    
    // Clear ripple after animation
    setTimeout(() => {
      setRippleCells(new Set());
      setClickedCell(null);
    }, 600);
  }, [rows, cols]);

  const getDelay = (row: number, col: number) => {
    if (!clickedCell) return 0;
    const distance = Math.sqrt(
      Math.pow(row - clickedCell.row, 2) + Math.pow(col - clickedCell.col, 2)
    );
    return distance * 50;
  };

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const cellKey = `${row}-${col}`;
        const isRippling = rippleCells.has(cellKey);
        
        return (
          <div
            key={cellKey}
            className={cn(
              "border border-border/30 transition-all cursor-pointer",
              isRippling && "animate-cell-ripple"
            )}
            style={{
              backgroundColor: isRippling 
                ? "hsl(0 0% 25%)" 
                : "transparent",
              animationDelay: isRippling ? `${getDelay(row, col)}ms` : "0ms",
            }}
            onClick={() => handleCellClick(row, col)}
            onMouseEnter={() => handleCellClick(row, col)}
          />
        );
      })}
    </div>
  );
}
