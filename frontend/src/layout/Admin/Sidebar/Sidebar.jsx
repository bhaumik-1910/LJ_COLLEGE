import { useEffect, useState, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Sidebar.css";
// import { personsImgs } from '../../../utils/Admin/images';
import { SidebarContext } from '../../../context/Admin/sidebarContext';
import { navigationLinks } from '../../../data/Admin/data';
import { AuthContext } from '../../../context/AuthContext';

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? 'sidebar-change' : '');
  }, [isSidebarOpen]);

  const routeMap = useMemo(() => ({
    'Dashboard': '/admin-dashboard',
    'Universities': '/admin-dashboard/university-register',
    'University Users': '/admin-dashboard/university-users',
    'Users': '/admin-dashboard/users',
    'Admins': '/admin-dashboard/admins',
    'Profile': '/admin-dashboard/profile',
    'Logout': '/logout',
  }), []);

  // Compute a single active title (exact match preferred; else longest-prefix)
  const currentActiveTitle = useMemo(() => {
    // exclude Logout from active calculation
    const entries = Object.entries(routeMap).filter(([t]) => t !== 'Logout');
    // exact match first
    const exact = entries.find(([, path]) => pathname === path);
    if (exact) return exact[0];
    // then longest prefix
    const prefixes = entries
      .filter(([, path]) => pathname.startsWith(path + '/'))
      .sort((a, b) => b[1].length - a[1].length);
    return prefixes.length ? prefixes[0][0] : null;
  }, [pathname, routeMap]);

  const handleClick = (title) => {
    if (title === 'Logout') {
      try { localStorage.removeItem('email'); } catch { }
      logout();
      navigate('/login');
      return;
    }
    const to = routeMap[title] || '/admin-dashboard';
    navigate(to);
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          {/* <img src={personsImgs.person_two} alt="profile image" /> */}
        </div>
        <span className="info-name">University</span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks.map((link) => (
            <li className="nav-item" key={link.id}>
              <button
                type="button"
                className={`nav-link ${currentActiveTitle === link.title ? 'active' : ''}`}
                onClick={() => handleClick(link.title)}
              >
                <img src={link.image} className="nav-link-icon" alt={link.title} />
                <span className="nav-link-text">{link.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar;
