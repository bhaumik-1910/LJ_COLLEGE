// import { useEffect, useState, useContext, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import "./Sidebar.css";
// import { uniImage } from '../../../utils/Admin/images';
// import { SidebarContext } from '../../../context/Admin/sidebarContext';
// import { navigationLinks } from '../../../data/Admin/data';
// import { AuthContext } from '../../../context/AuthContext';

// const Sidebar = () => {
//   const [sidebarClass, setSidebarClass] = useState("");
//   const { isSidebarOpen } = useContext(SidebarContext);
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext);

//   useEffect(() => {
//     setSidebarClass(isSidebarOpen ? 'sidebar-change' : '');
//   }, [isSidebarOpen]);

//   const routeMap = useMemo(() => ({
//     'Dashboard': '/admin-dashboard',
//     'Universities': '/admin-dashboard/university-register',
//     'University Users': '/admin-dashboard/university-users',
//     'Users': '/admin-dashboard/users',
//     'Admins': '/admin-dashboard/admins',
//     'Profile': '/admin-dashboard/profile',
//     'Logout': '/logout',
//   }), []);

//   // Compute a single active title (exact match preferred; else longest-prefix)
//   const currentActiveTitle = useMemo(() => {
//     // exclude Logout from active calculation
//     const entries = Object.entries(routeMap).filter(([t]) => t !== 'Logout');
//     // exact match first
//     const exact = entries.find(([, path]) => pathname === path);
//     if (exact) return exact[0];
//     // then longest prefix
//     const prefixes = entries
//       .filter(([, path]) => pathname.startsWith(path + '/'))
//       .sort((a, b) => b[1].length - a[1].length);
//     return prefixes.length ? prefixes[0][0] : null;
//   }, [pathname, routeMap]);

//   const handleClick = (title) => {
//     if (title === 'Logout') {
//       try { localStorage.removeItem('email'); } catch { }
//       logout();
//       navigate('/login');
//       return;
//     }
//     const to = routeMap[title] || '/admin-dashboard';
//     navigate(to);
//   };

//   return (
//     <div className={`sidebar ${sidebarClass}`}>
//       <div className="user-info">
//         <div className="info-img img-fit-cover">
//           <img src={uniImage.uni_image} alt="profile image" />
//         </div>
//         <span className="info-name">University</span>
//       </div>

//       <nav className="navigation">
//         <ul className="nav-list">
//           {navigationLinks.map((link) => (
//             <li className="nav-item" key={link.id}>
//               <button
//                 type="button"
//                 className={`nav-link ${currentActiveTitle === link.title ? 'active' : ''}`}
//                 onClick={() => handleClick(link.title)}
//               >
//                 <img src={link.image} className="nav-link-icon" alt={link.title} />
//                 <span className="nav-link-text">{link.title}</span>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   )
// }

// export default Sidebar;
import { useEffect, useState, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import { uniImage, iconsImgs } from '../../../utils/Admin/images';
import { SidebarContext } from '../../../context/Admin/sidebarContext';
import { AuthContext } from '../../../context/AuthContext';

// --- Separate navigation data for each role ---
const adminLinks = [
  { id: 1, title: 'Dashboard', image: iconsImgs.home, path: '/admin-dashboard' },
  { id: 2, title: 'Universities', image: iconsImgs.add, path: '/admin-dashboard/university-register' },
  { id: 3, title: 'Register', image: iconsImgs.add, path: '/admin-dashboard/register' },
  { id: 4, title: 'University Users', image: iconsImgs.plane, path: '/admin-dashboard/university-users' },
  { id: 5, title: 'Faculty', image: iconsImgs.wallet, path: '/admin-dashboard/faculty' },
  { id: 6, title: 'Document', image: iconsImgs.wallet, path: '/admin-dashboard/document' },
  { id: 7, title: 'Admins', image: iconsImgs.bills, path: '/admin-dashboard/admins' },
  { id: 8, title: 'Profile', image: iconsImgs.profile, path: '/admin-dashboard/profile' },
  { id: 9, title: 'Logout', image: iconsImgs.logout, path: '/logout' },
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
    if (role === 'admin') {
      return adminLinks;
    } else if (role === 'faculty') {
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
          <img src={uniImage.uni_image} alt="profile image" />
        </div>
        <span className="info-name">
          {role === 'admin' ? 'Admin' : 'Faculty'}
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