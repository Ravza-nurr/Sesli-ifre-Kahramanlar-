import React from 'react';
import { playSound } from '../services/audioService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  icon,
  onClick,
  ...props 
}) => {
  
  const baseStyles = "rounded-3xl font-bold transition-all transform active:scale-95 shadow-[0_6px_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-1 flex items-center justify-center gap-2 no-select";
  
  const variants = {
    primary: "bg-blue-400 text-white hover:bg-blue-500 border-b-4 border-blue-600",
    secondary: "bg-purple-400 text-white hover:bg-purple-500 border-b-4 border-purple-600",
    danger: "bg-red-400 text-white hover:bg-red-500 border-b-4 border-red-600",
    success: "bg-green-400 text-white hover:bg-green-500 border-b-4 border-green-600",
    ghost: "bg-white/50 text-gray-700 hover:bg-white/80 shadow-none border-2 border-gray-200 active:shadow-none"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl w-full max-w-xs",
    xl: "px-10 py-6 text-2xl w-full"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound('click');
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};