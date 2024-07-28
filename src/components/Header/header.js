import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Logo from '../../assets/Logo.png';
import './styles.css';
import { useSearch } from '../../context/SearchContext';

function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const showSearchIcon = ['/filmes', '/series', '/tv-ao-vivo'].includes(location.pathname);

  const handleSearchIconClick = () => {
    setShowSearch(prevShowSearch => !prevShowSearch);
    setShowMenu(prevShowMenu => !prevShowMenu && !showSearch); // Toggle menu only when search is not active
  };

  const handleOutsideClick = useCallback((event) => {
    if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
      setShowSearch(false);
      setShowMenu(false);
    }
  }, []);

  useEffect(() => {
    if (showSearch) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showSearch, handleOutsideClick]);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    let url = '';
    if (location.pathname.startsWith('/filmes')) {
      url = `/filmes?search=${term}`;
    } else if (location.pathname.startsWith('/series')) {
      url = `/series?search=${term}`;
    }

    navigate(url);
  };

  const handleMenuToggle = () => {
    setShowMenu(prevShowMenu => !prevShowMenu);
    if (showMenu) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header className="header-padding">
      <Navbar expand="md" className="container">
        <Navbar.Brand as={Link} to="/">
          <img id="logo" src={Logo} style={{ width: '200px', height: 'auto' }} alt="Logo" />
        </Navbar.Brand>
        <div className="d-flex align-items-center">
          {showSearchIcon && (
            <FaSearch className="text-white search-icon d-md-none" onClick={handleSearchIconClick} />
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleMenuToggle} />
        </div>
        <Navbar.Collapse id="basic-navbar-nav" className={showMenu ? 'show' : ''}>
          {!showSearch && (
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
              <Nav.Link as={Link} to="/filmes" className="text-white">Filmes</Nav.Link>
              <Nav.Link as={Link} to="/series" className="text-white">Séries</Nav.Link>
              <Nav.Link as={Link} to="/tv-ao-vivo" className="text-white">Tv ao vivo</Nav.Link>
              {showSearchIcon && (
                <FaSearch className="text-white search-icon d-none d-md-block" onClick={handleSearchIconClick} />
              )}
            </Nav>
          )}
          {showSearch && (
            <div className="search-bar" ref={searchInputRef}>
              <input
                className="form-control"
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
              />
              <div className="search-results">
                {/* Placeholder para resultados de busca */}
              </div>
            </div>
          )}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default Header;
