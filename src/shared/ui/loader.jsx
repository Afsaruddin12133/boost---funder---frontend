import React from 'react';
import { cn } from './utils';
import './loader.css';

/**
 * A modern, creative loading spinner for BoostFundr.
 * 
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} props.size - The size of the loader.
 * @param {string} props.label - Optional text to display below the loader.
 * @param {boolean} props.fullPage - Whether to display as a full-page overlay.
 * @param {string} props.className - Additional classes for the container.
 */
export function Loader({ 
  size = 'md', 
  label, 
  fullPage = false, 
  className 
}) {
  return (
    <div className={cn(
      "loader-container", 
      fullPage && "full-page", 
      className
    )}>
      <div className={cn("nexus-loader", size)}>
        {/* Outer Ring */}
        <div className="nexus-ring-outer" />
        
        {/* Middle Ring */}
        <div className="nexus-ring-mid" />
        
        {/* Core Orb */}
        <div className="nexus-core" />
        
        {/* Particles for extra detail */}
        {size !== 'sm' && (
          <>
            <div className="nexus-particle nexus-particle-1" />
            <div className="nexus-particle nexus-particle-2" />
          </>
        )}
      </div>
      
      {label && (
        <div className="loader-label">
          {label}
        </div>
      )}
    </div>
  );
}

export default Loader;
