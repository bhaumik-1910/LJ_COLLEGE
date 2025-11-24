import { useEffect, useState, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import { uniImage, iconsImgs } from '../../../utils/SuperAdmin/images';
import { SidebarContext } from '../../../context/SuperAdmin/sidebarContext';
import { AuthContext } from '../../../context/AuthContext';

// --- Separate navigation data for each role ---
const superAdminLinks = [
  { id: 1, title: 'Dashboard', image: iconsImgs.home, path: '/superadmin-dashboard' },
  { id: 2, title: 'Universities', image: iconsImgs.add, path: '/superadmin-dashboard/university-register' },
  { id: 3, title: 'Register', image: iconsImgs.add, path: '/superadmin-dashboard/register' },
  { id: 4, title: 'University Users', image: iconsImgs.users, path: '/superadmin-dashboard/university-users' },
  { id: 5, title: 'Institution', image: iconsImgs.users, path: '/superadmin-dashboard/institution' },
  { id: 6, title: 'Institution List', image: iconsImgs.users, path: '/superadmin-dashboard/institution-list' },
  { id: 7, title: 'Document', image: iconsImgs.document, path: '/superadmin-dashboard/document' },
  { id: 8, title: 'Super Admin', image: iconsImgs.admin, path: '/superadmin-dashboard/superadmin' },
  { id: 9, title: 'Admins', image: iconsImgs.admin, path: '/superadmin-dashboard/admins' },
  { id: 10, title: 'Faculty', image: iconsImgs.faculty, path: '/superadmin-dashboard/faculty' },
  { id: 11, title: 'Profile', image: iconsImgs.profile, path: '/superadmin-dashboard/profile' },
  { id: 12, title: 'Logout', image: iconsImgs.logout, path: '/logout' },
];

const AdminLinks = [
  { id: 1, title: 'Dashboard', image: iconsImgs.home, path: '/admin-dashboard' },
  { id: 2, title: 'Add Faculty', image: iconsImgs.add, path: '/admin-dashboard/add-faculty' },
  { id: 3, title: 'Student List', image: iconsImgs.list, path: '/admin-dashboard/student-list' },
  { id: 4, title: 'Document List', image: iconsImgs.document, path: '/admin-dashboard/document-list' },
  { id: 5, title: 'Faculty List', image: iconsImgs.faculty, path: '/admin-dashboard/faculty-list' },
  { id: 6, title: 'Profile', image: iconsImgs.profile, path: '/admin-dashboard/profile' },
  { id: 7, title: 'Logout', image: iconsImgs.logout, path: '/logout' },
];

const facultyLinks = [
  { id: 1, title: 'Dashboard', image: iconsImgs.home, path: '/faculty-dashboard' },
  { id: 2, title: 'Add Student', image: iconsImgs.add, path: '/faculty-dashboard/add-student' },
  { id: 3, title: 'Add Document', image: iconsImgs.add_d, path: '/faculty-dashboard/add-document' },
  { id: 4, title: 'Student List', image: iconsImgs.list, path: '/faculty-dashboard/student-list' },
  { id: 5, title: 'Document List', image: iconsImgs.document, path: '/faculty-dashboard/document-list' },
  { id: 6, title: 'Profile', image: iconsImgs.profile, path: '/faculty-dashboard/profile' },
  { id: 7, title: 'Logout', image: iconsImgs.logout, path: '/logout' },
];

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState('');
  const { isSidebarOpen } = useContext(SidebarContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, role } = useContext(AuthContext);

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? 'sidebar-change' : '');
  }, [isSidebarOpen]);

  // Select the correct set of links based on the user's role
  const links = useMemo(() => {
    if (role === 'superadmin') {
      return superAdminLinks;
    }
    else if (role === 'admin') {
      return AdminLinks;
    }
    else if (role === 'admin') {
      return AdminLinks;
    }
    else if (role === 'faculty') {
      return facultyLinks;
    }
    return [];
  }, [role]);

  const routeMap = useMemo(() => {
    const map = {};
    links.forEach(link => {
      map[link.title] = link.path;
    });
    return map;
  }, [links]);

  const currentActiveTitle = useMemo(() => {
    const entries = Object.entries(routeMap).filter(([t]) => t !== 'Logout');
    const exact = entries.find(([, path]) => pathname === path);
    if (exact) return exact[0];
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
    const to = routeMap[title];
    if (to) {
      navigate(to);
    }
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          {/* <img src={uniImage.uni_image} alt="profile image" /> */}
          <img src={uniImage.C_Logo} alt="profile image" />
        </div>
        {/* <span className="info-name">
          {role === 'admin' ? 'Admin' : 'Faculty'}
        </span> */}
        <span className="info-name">
          {role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Faculty'}
        </span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {links.map((link) => (
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
  );
};

export default Sidebar;