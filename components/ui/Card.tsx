import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-8",
  };
  
  return (
    <div className={`bg-dark border border-gray-400 shadow-lg rounded-lg ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};