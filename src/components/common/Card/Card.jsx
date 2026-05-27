// ============================================================
// FlashCart — Card Component
// Universal container card for all content blocks.
// ============================================================

import React from 'react';
import './Card.css';

/**
 * Card — Content container.
 *
 * @param {node}    children   - Card content
 * @param {boolean} hover      - Enable hover lift effect
 * @param {boolean} clickable  - Makes entire card clickable looking
 * @param {string}  padding    - 'none'|'sm'|'md'|'lg'
 * @param {string}  className  - Additional classes
 * @param {function}onClick    - Click handler
 */
const Card = ({
  children,
  hover = false,
  clickable = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) => {

  // Build class names
  const classes = [
    'fc-card',
    hover || clickable ? 'fc-card-hover' : '',
    clickable ? 'fc-card-clickable' : '',
    `fc-card-pad-${padding}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      role={clickable ? 'button' : undefined}   // ARIA role for clickable
      tabIndex={clickable ? 0 : undefined}       // Keyboard focusable if clickable
      onKeyDown={clickable ? (e) => {
        // Keyboard activation — Enter or Space
        if (e.key === 'Enter' || e.key === ' ') onClick?.(e);
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
