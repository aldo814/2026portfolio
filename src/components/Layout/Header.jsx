import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const codeBtnRef = useRef(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleNavClick = (e, id) => {
    if (e) e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname === "/") {
      const target = document.getElementById(id);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const btn = codeBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${mouseX * 0.4}px, ${mouseY * 0.4}px) scale(1.15)`;
  };

  const handleMouseLeave = () => {
    const btn = codeBtnRef.current;
    if (!btn) return;
    btn.style.transform = 'translate(0, 0) scale(1)';
  };

  useEffect(() => {
    setIsMenuOpen(false);

    if (location.pathname !== "/") setActive('');

    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      return () => clearTimeout(timer);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 300);

      if (location.pathname === "/") {
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
          const top = section.offsetTop - 150;
          const height = section.offsetHeight;
          const id = section.getAttribute('id');
          if (scrollY >= top && scrollY < top + height) setActive(id);
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <header className={`header ${scrolled ? 'active' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="inner">
        <h1 className="header-logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <span>&lt;</span>eun-yoeng<span>/&gt;</span>
          </Link>
        </h1>

        {/* PC 내비게이션 */}
        <nav className="header-nav pc-only">
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={active === 'about' ? 'active' : ''}>About</a>
          <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className={active === 'skills' ? 'active' : ''}>Skills</a>
          <a href="#work" onClick={(e) => handleNavClick(e, 'work')} className={active === 'work' ? 'active' : ''}>Work</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={active === 'contact' ? 'active' : ''}>Contact</a>
          <Link
            to="/AllWork"
            className={`code ${location.pathname === '/AllWork' ? 'active' : ''}`}
            ref={codeBtnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => sessionStorage.removeItem("scrollY")}
          >
            <span className="tag">&lt;</span><span className="name">all-work</span><span className="tag">/&gt;</span>
          </Link>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          className={`m-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          <p>메뉴 열기</p>
          <div className="burger-icon">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>

      {/* 모바일 전체 화면 메뉴 */}
      <div className={`m-nav-wrap ${isMenuOpen ? 'show' : ''}`}>
        <div className="m-nav-header">
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}></button>
        </div>
        <nav className="m-nav-list">
          <Link to="/" onClick={(e) => handleNavClick(e, 'home')} className="m-nav-item">Home</Link>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="m-nav-item">About Me <span>(01)</span></a>
          <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="m-nav-item">My Skill <span>(02)</span></a>
          <a href="#work" onClick={(e) => handleNavClick(e, 'work')} className="m-nav-item">Works <span>(03)</span></a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="m-nav-item">Contact <span>(04)</span></a>
          <div className="m-nav-divider"></div>
          <Link
            to="/AllWork"
            onClick={() => { setIsMenuOpen(false); sessionStorage.removeItem("scrollY"); }}
            className="m-nav-item big"
          >
            All-Work
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;