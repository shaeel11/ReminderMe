import React, { useState, useEffect, useContext } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faXmark, faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', showButton);
    return () => window.removeEventListener('resize', showButton);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            ReminderMe <FontAwesomeIcon icon={faCalendar} />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <FontAwesomeIcon icon={click ? faXmark : faBars} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              {isLoggedIn ? (
                <span
                  className='nav-links'
                  onClick={() => { window.location.href = '/calendar'; closeMobileMenu(); }}>
                    Calendar
                </span>
              ) : (
                <Link to='/sign-in' className='nav-links-mobile' onClick={closeMobileMenu}>
                  Sign In
                </Link>
              )}
            </li>
          </ul>
          {button && (
            isLoggedIn ? (
              <Button buttonStyle='btn--outline' onClick={logout}>
                LOGOUT
              </Button>
            ) : (
              <Button>SIGN IN</Button>
            )
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;