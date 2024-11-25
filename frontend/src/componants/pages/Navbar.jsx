import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Dropdown } from 'flowbite-react';
import { logout, getMe } from '../../redux/action/auth.action';
import { NavLink } from 'react-router-dom'; // Import de NavLink
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
            {/* Affiche le lien Admin seulement si l'utilisateur est un admin */}
            {me?.role === 'admin' && (
  <Navbar.Link
    as={NavLink}
    to="/admin"
    className="block text-sm font-medium text-black hover:bg-gray-700 hover:text-white rounded-lg text-center px-2 py-2 transition-all duration-200"
    activeClassName="bg-gray-800 text-gray-100"
  >
    Admin
  </Navbar.Link>
)}

            <Dropdown.Item onClick={handleLogout}>Deconnexion</Dropdown.Item>
          </Dropdown>

          {/* Toggle button for mobile view */}
          <Navbar.Toggle />
        </div>

        {/* Menu links */}
        {/*  */}
      </Navbar>
    </>
  );
}

export default NavbarComponent;
