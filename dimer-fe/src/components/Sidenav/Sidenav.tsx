import { NavItem } from "src/components/Navbar/Navbar";
import { NavLink } from 'react-router-dom';
import styles from 'src/components/Sidenav/Sidenav.module.scss';
import { useRef } from "react";

export interface SidenavProps {
  navItems: NavItem[];
  title: string;
}

const Sidenav = ({
  navItems,
  title
}: SidenavProps) => {

  const sidenavRef = useRef<HTMLElement>(null);

  const toggleSidenav = () => {
    if (sidenavRef.current) {
      if (sidenavRef.current.getAttribute('opened') === 'true') {
        sidenavRef.current.setAttribute('opened', 'false');
      } else {
        sidenavRef.current.setAttribute('opened', 'true');
      }
    }
  };

  const getSidenavOptions = () => {
    return (
      <ul>
        {navItems.map((navItem) => (
          <NavLink key={`${navItem.label}-nav-link`} to={navItem.route}>
            <li>
              {navItem.icon}
              <div className={styles.label}>{navItem.label}</div>
            </li>
          </NavLink>
        ))}
      </ul>
    );
  };

  return (
    <nav className={styles['sidenav-component']} ref={sidenavRef}>
      <h1>{title}</h1>
      {getSidenavOptions()}
      <button onClick={toggleSidenav}>Test</button>
    </nav>
  );
};

export { Sidenav };
