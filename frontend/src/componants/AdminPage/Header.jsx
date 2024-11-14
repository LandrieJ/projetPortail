import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, getMe } from '../../redux/action/auth.action';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import logo from '../../assets/LOGO.png';

function Header() {
  const menuRef = useRef(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Récupération des informations de l'utilisateur
  const { me } = useSelector(state => state.auth);

  // Appel à getMe pour récupérer les informations de l'utilisateur à chaque montage du composant
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Vérifier le rôle de l'utilisateur pour le debug
  useEffect(() => {
    console.log("User role:", me?.role); // Vérifiez le rôle utilisateur
  }, [me]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <Navbar fluid rounded className="bg-gray-300">
      <Navbar.Brand>
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MyApp</span> */}
      </Navbar.Brand>
      <div className="flex md:order-2" ref={menuRef}>
        <Dropdown
          arrowIcon={false}
          inline
          label={<h4 className="text-gray-900 font-semibold">{me?.name || "Identifier"}</h4>} // Utilisation de la couleur text-gray-900
          isOpen={isDropdownOpen}  // Utilisation de l'état pour ouvrir/fermer le dropdown
          onClick={() => setDropdownOpen(!isDropdownOpen)} // Gestion du click pour ouvrir/fermer
        >
          <Dropdown.Header>
            <span className="block text-sm">{me?.name}</span>
            <span className="block truncate text-sm font-medium">{me?.email}</span>
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Deconnexion</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}

export default Header;
