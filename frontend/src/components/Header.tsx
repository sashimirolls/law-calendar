import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: '#00458C', margin:'0px 0px 40px 0px', padding: '15px 30px', color: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'20px'}}>
        <img src="/logo.jpg" alt="Logo" style={{ height: '50px', width: 'auto' }} />
        <div style={{display:'flex', flexDirection:'column'}}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#fff' }}>Ludwig, Smith & Walker</h1>
        <p style={{ margin: 0, fontSize: '12px', color: '#fff' }}>Manufacturers Representatives</p>
        </div>
        </div>
        <div style={{display:'flex', flexDirection:'column'}}>
        <p style={{color:"Yellow"}}>Your Plumbing Reps in the Carolinas</p>
        <p style={{textAlign:'right',fontSize:'12px'}}>Since 1979</p>
        </div>
        
      </div>
    </header>
  );
};

export default Header;
