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
    lg: "p-6",
  };
  
  return (
    <div className={`bg-light border border-gray-200 rounded-lg ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};