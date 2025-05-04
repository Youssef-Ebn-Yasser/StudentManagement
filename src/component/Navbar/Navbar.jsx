import { logout } from '@/Redux/auth/authSlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import img from '../../assets/avatar.png'; // Import the logo image
import Button from './Button';
import styles from './Navbar.module.css'; // Import the CSS module
import SearchBar from './SearchBar';
// import { useAuth } from '@/contexts/AuthContext';


function Navbar() {
    const dispatch = useDispatch();
    const authStore = useSelector((state) => state.auth || {});
    const userRole = authStore.role;
    const isLoggedIn = authStore.isLogedin;
    const [isNotificationVisible, setIsNotificationVisible] = useState(false); // State for notification dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for the toggle menu
    const navigate = useNavigate();

    const toggleNotification = () => {
        setIsNotificationVisible(!isNotificationVisible);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = (query) => {
        navigate(`/courses?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className='h-[56px]'>
            <div className={`fixed top-0 left-0 right-0 h-[56px] bg-white shadow-xs flex items-center px-6 ${styles.navbar} z-50`}>

                {/* Logo */}
                <div className={`absolute top-[10px] left-[24px] w-[106px] h-[36px] text-black text-center text-lg font-extrabold flex items-center justify-center rounded-md ${styles.logo}`}>
                    E-learning
                </div>

                {/* Navbar Links (Large Screens) */}
                <div className={`hidden lg:flex items-center gap-6 ml-[150px] ${styles.navLinks}`}>
                    <ul className="flex items-center gap-4">
                        {isLoggedIn && userRole === 'Student' && (
                          <>
                            <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Home</NavLink></li>
                            <li><NavLink to="/courses" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Courses</NavLink></li>
                            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Dashboard</NavLink></li>
                            <li><NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>About</NavLink></li>
                          </>
                        )}
                        {isLoggedIn && userRole === 'Teacher' && (
                          <>
                            <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Home</NavLink></li>
                            <li><NavLink to="/teacher/courses" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>My Courses</NavLink></li>
                            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Dashboard</NavLink></li>
                            <li><NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>About</NavLink></li>
                          </>
                        )}
                        {(!isLoggedIn || (!['Student', 'Teacher'].includes(userRole))) && (
                          <>
                            <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Home</NavLink></li>
                            <li><NavLink to="/courses" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Courses</NavLink></li>
                            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Dashboard</NavLink></li>
                            <li><NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>About</NavLink></li>
                          </>
                        )}
                    </ul>
                </div>

                {/* Search, Bell, and Profile Icons (Large Screens) */}
                <div className={`hidden lg:flex items-center gap-4 ml-auto ${styles.icons}`}>
                  <div className="relative">
                    <SearchBar onSearch={handleSearch} />
                  </div>
                  {isLoggedIn && (userRole === 'Student' || userRole === 'Teacher') && (
                    <div className="relative">
                      <div className={`w-[24px] h-[24px] text-neutral-700 cursor-pointer ${styles.bellIcon}`} onClick={toggleNotification}>
                        <i className="fa-solid fa-bell"></i>
                      </div>
                      {/* Notification Dropdown */}
                      {isNotificationVisible && (
                        <div className={`absolute right-0 mt-2 w-[200px] bg-white shadow-lg rounded-md p-4 ${styles.notificationDropdown}`}>
                          <p className="text-sm text-neutral-700">No new notifications</p>
                        </div>
                      )}
                    </div>
                  )}
                  <Link to={isLoggedIn && userRole === 'Teacher' ? "/teacher/profile" : "/profile"}>
                    <div className={`w-[20px] h-[25px] text-neutral-700 text-3xl ${styles.cartIcon}`}>
                      <img src={img} alt="user picture" />
                    </div>
                  </Link>
                </div>

                {/* Auth Button (Large Screens) */}
                <div className={`hidden lg:block ml-4 ${styles.button}`}>
                  {(isLoggedIn && (userRole === 'Student' || userRole === 'Teacher')) ? (
                    <button onClick={() => dispatch(logout())} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
                  ) : (
                    <Link to="/auth/login"><Button /></Link>
                  )}
                </div>
            </div>

            {/* Dropdown Menu for Small Screens */}
            <div
                className={`lg:hidden z-50 absolute top-[56px] left-0 w-full bg-white shadow-lg p-4 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                } ${styles.dropdownMenu}`}
            >
                <ul className="flex flex-col gap-4 items-center">
                  {isLoggedIn && userRole === 'Student' && (
                    <>
                      <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Home</NavLink></li>
                      <li><NavLink to="/courses" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Courses</NavLink></li>
                      <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Dashboard</NavLink></li>
                      <li><NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>About</NavLink></li>
                    </>
                  )}
                </ul>
                {isLoggedIn && userRole === 'Student' && (
                  <div className={`mt-4 flex items-center gap-4 ps-8 ${styles.searchAndButton}`}>
                      <div className={`relative w-full max-w-[300px] ${styles.searchInputWrapper}`}>
                          <input type="text" placeholder="Search..." className={`w-full h-[36px] pl-[34px] pr-[12px] text-sm font-normal bg-neutral-200 rounded-md border-0 outline-none hover:bg-white hover:text-neutral-400 focus:bg-white focus:text-neutral-400 transition-all duration-300 ease-in-out ${styles.searchInput}`}/>
                          <span><i className={`fa-solid fa-magnifying-glass absolute top-[10px] left-[12px] text-neutral-900 ${styles.searchIcon}`}></i></span>
                      </div>
                      <div className="relative">
                          <div className={`w-[24px] h-[24px] text-neutral-700 cursor-pointer ${styles.bellIcon}`} onClick={toggleNotification}>
                              <i className="fa-solid fa-bell"></i>
                          </div>
                          {isNotificationVisible && (
                              <div className={`absolute right-0 mt-2 w-[200px] bg-white shadow-lg rounded-md p-4 ${styles.notificationDropdown}`}>
                                  <p className="text-sm text-neutral-700">No new notifications</p>
                              </div>
                          )}
                      </div>
                      <Link to="/profile">
                          <div className={`w-[30px] h-[30px] text-neutral-700 text-3xl  ${styles.cartIcon}`}>
                              <img src={img} alt="user picture" />
                          </div>
                      </Link>
                      <button onClick={() => dispatch(logout())} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
                  </div>
                )}
                {(!isLoggedIn || userRole !== 'Student') && (
                  <div className={`mt-4 flex items-center gap-4 ps-8 ${styles.searchAndButton}`}>
                    <Link to="/auth/login"><Button /></Link>
                  </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
