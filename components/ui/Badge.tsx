import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantStyles = {
    success: "bg-primary/10 text-primary",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-danger/10 text-danger",
    info: "bg-secondary/10 text-secondary",
    default: "bg-gray-100 text-gray-800",
  };
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};