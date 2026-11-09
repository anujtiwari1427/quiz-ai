import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface MarklabButtonProps {
  children: string;
  onClick?: () => void;
  variant?: 'primary' | 'dark' | 'outline' | 'white';
  className?: string;
  href?: string;
  target?: string;
  showIcon?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const MarklabButton: React.FC<MarklabButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  href,
  target,
  showIcon = true,
  type = 'button',
}) => {
  const variantClass = {
    primary: 'marklab-btn marklab-btn-primary',
    dark: 'marklab-btn marklab-btn-dark',
    outline: 'marklab-btn marklab-btn-outline',
    white: 'marklab-btn marklab-btn-white',
  }[variant];

  const content = (
    <>
      <div className="btn-text-roll">
        <span>{children}</span>
        <span>{children}</span>
      </div>
      {showIcon && (
        <div className="btn-icon-slide">
          <ArrowUpRight className="icon-1 w-3.5 h-3.5" />
          <ArrowUpRight className="icon-2 w-3.5 h-3.5" />
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={`${variantClass} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variantClass} ${className}`}
    >
      {content}
    </button>
  );
};

export default MarklabButton;
