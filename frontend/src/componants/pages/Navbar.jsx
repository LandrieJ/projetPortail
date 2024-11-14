import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Dropdown } from 'flowbite-react';
import { logout, getMe } from '../../redux/action/auth.action';
import logo from '../../assets/LOGO.png';

function NavbarComponent() {
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { me } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <Navbar fluid rounded className="bg-blue-400 w-full">
        <Navbar.Brand>
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="App Logo" />
          <span className="text-white self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Poles Anti-corruption
          </span>
        </Navbar.Brand>

        {/* Menu Toggle for small screens */}
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<h4 className="text-white font-semibold">{me?.name || "Identifier"}</h4>}
          >
            <Dropdown.Header>
              <span className="block text-sm">{me?.name}</span>
              <span className="block truncate text-sm font-medium">{me?.email || 'name@flowbite.com'}</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Deconnexion</Dropdown.Item>
          </Dropdown>

          {/* Toggle button for mobile view */}
          <Navbar.Toggle />
        </div>

        {/* Menu links */}
        <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          {me?.role === 'admin' && <Navbar.Link href="/admin">Admin</Navbar.Link>}
          <Navbar.Link href="#">About</Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
