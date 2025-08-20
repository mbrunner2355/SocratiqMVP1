interface SophieLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SophieLogo({ className = "", size = 'md' }: SophieLogoProps) {
  const dimensions = {
    sm: { width: 24, height: 28, fontSize: '11px' },
    md: { width: 32, height: 36, fontSize: '15px' },
    lg: { width: 48, height: 54, fontSize: '22px' }
  };

  const { width, height, fontSize } = dimensions[size];

  return (
    <div className={`inline-block ${className}`} style={{ width: width, height: height }}>
      <svg width={width} height={height} viewBox="0 0 32 36" xmlns="http://www.w3.org/2000/svg">
        {/* Speech bubble main body */}
        <rect x="2" y="2" width="28" height="20" rx="6" ry="6" fill="#1e3a8a" />
        {/* Speech bubble tail */}
        <polygon points="10,22 16,30 18,22" fill="#1e3a8a" />
        {/* Letter S */}
        <text 
          x="16" 
          y="13" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fill="white" 
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily="'Roboto', 'Open Sans', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif"
        >
          S
        </text>
      </svg>
    </div>
  );
}