import { NavLink } from 'react-router-dom';
import styles from 'src/components/Navbar/Navbar.module.scss';
import { useRef } from 'react';

export interface NavItem {
  label: string;
  route: string;
  icon: JSX.Element;
}

export interface NavbarProps {
  title: string;
  navItems: NavItem[];
}


const Navbar = ({
  title,
  navItems
}: NavbarProps) => {

  const mobileMenuRef = useRef<HTMLMenuElement>(null);

  const toggleMenu = () => {
    if (mobileMenuRef.current?.getAttribute('opened') === 'true') {
      mobileMenuRef.current?.setAttribute('opened', 'false');
    } else {
      mobileMenuRef.current?.setAttribute('opened', 'true');
    }
  };

  const getNavLinks = () => {
    return (
      <menu className={styles.desktop}>
        {navItems.map((navItem) => (
          <NavLink key={`${navItem.label}-nav-item`} to={navItem.route}>
            <li>
              {navItem.label}
            </li>
          </NavLink>
        ))}
      </menu>
    );
  };

  const getNavLinksMenu = () => {
    return (
      <menu className={styles.mobile} ref={mobileMenuRef}>
        {navItems.map((navItem) => (
          <NavLink key={`${navItem.label}-mobile-nav-item`} to={navItem.route} onClick={toggleMenu}>
            <li>
              {navItem.label}
            </li>
          </NavLink>
        ))}
      </menu>
    );
  };

  return (
    <nav className={styles['navbar-component']}>
      <div className={styles.main}>
        <NavLink to='/'>
          <h1>{title}</h1>
        </NavLink>
        {getNavLinks()}

        <button className={styles.mobile} onClick={toggleMenu}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z"
              fill="currentColor"
            />
            <path
              d="M2 12.0322C2 11.4799 2.44772 11.0322 3 11.0322H21C21.5523 11.0322 22 11.4799 22 12.0322C22 12.5845 21.5523 13.0322 21 13.0322H3C2.44772 13.0322 2 12.5845 2 12.0322Z"
              fill="currentColor"
            />
            <path
              d="M3 17.0645C2.44772 17.0645 2 17.5122 2 18.0645C2 18.6167 2.44772 19.0645 3 19.0645H21C21.5523 19.0645 22 18.6167 22 18.0645C22 17.5122 21.5523 17.0645 21 17.0645H3Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      {getNavLinksMenu()}
    </nav>

  );
};

export { Navbar };
