import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#00458C', padding: '15px 0', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
        {/* Left: Logo and Company Name */}
        <div style={{ textAlign: 'left' }}>
          <img src="./logo.jpg" alt="Logo" style={{ height: '50px', width: 'auto', marginBottom: '8px' }} />
          <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>Ludwig, Smith & Walker</p>
          <p style={{ margin: 0, fontSize: '0.6rem', color: '#fff' }}>Manufacturers Representatives</p>
        </div>

        {/* Right: Contact Details */}
        <div style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: '1.4' }}>
          <h3 style={{ margin: 0, fontWeight: '300' }}>Get In Touch:</h3>
          <p style={{ margin: 0 }}>7120 Weddington Road, STE 144, Concord, NC 28027</p>
          <p style={{ margin: 0 }}>Phone: (704) 342-9690</p>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', opacity: 0.8 }}>
        <p style={{ margin: 0 }}>Copyright © 2025 Ludwig, Smith & Walker, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
