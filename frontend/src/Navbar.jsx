// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css'
import logo from '../src/assets/npl logo.jpg'


export default function Navbar() {
  return (
    <nav>
      <div className="logo">
    <Link to='/'> <img src={logo}/> </Link>
    </div>
   
    
      <ul>
          <div className="nav-item">
        <li><Link to="/">Home</Link></li></div>

           <div className='nav-item'>
            Game<br/>
      <div className='dropdown'>
        <Link to='/today-live'>Today Live</Link><br/>
        <Link to='/upcoming-event'>Upcoming Event</Link><br/>
        <Link to='/game-history'>Histoy</Link>
      </div>
      </div>
      
     
<div className="nav-item">
        <li><Link to="/shop">Shop</Link></li>
        </div>
        <div className="nav-item">
        <li><Link to="/user-profile">User Profile</Link></li>
        </div>
        
         
      </ul>
    </nav>
  );
}
