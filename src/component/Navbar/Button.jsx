import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="cta">
        <span>Sign in</span>
        <svg width="12px" height="8px" viewBox="0 0 13 10">
          <path d="M1,5 L11,5" />
          <polyline points="8 1 12 5 8 9" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .cta {
    position: relative;
    margin: auto;
    padding: 8px 14px; /* Reduced padding for a smaller button */
    transition: all 0.2s ease;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center; /* Center text and arrow vertically */
    justify-content: center; /* Center text and arrow horizontally */
    gap: 6px; /* Space between text and arrow */
  }

  .cta:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border-radius: 50px;
    background: #b1dae7;
    width: 40px; /* Reduced width */
    height: 40px; /* Reduced height */
    transition: all 0.3s ease;
  }

  .cta span {
    position: relative;
    font-family: "Ubuntu", sans-serif;
    font-size: 14px; /* Reduced font size */
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #234567;
  }

  .cta svg {
    position: relative;
    top: 0;
    margin-left: 0; /* Removed extra margin */
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #234567;
    stroke-width: 2;
    transform: translateX(0); /* Center alignment */
    transition: all 0.3s ease;
  }

  .cta:hover:before {
    width: 100%;
    background: #b1dae7;
  }

  .cta:hover svg {
    transform: translateX(2px); /* Slight movement on hover */
  }

  .cta:active {
    transform: scale(0.95);
  }
`;

export default Button;