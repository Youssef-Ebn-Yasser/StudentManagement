<<<<<<< HEAD
import { logout } from '../../redux/auth/authSlice';
=======
import { logout } from '../../Redux/auth/authSlice';
>>>>>>> bd29697d762f5c0fbf91703556485a55bb4b28ca
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
            <div className={`fixed top-0 left-0 right-0 h-[56px] bg-white shadow-xs flex items-center px-4 sm:px-6 ${styles.navbar} z-50`}>

                {/* Logo */}
                <div className={`absolute top-[10px] left-[24px] w-[106px] h-[36px] text-black text-center text-lg font-extrabold flex items-center justify-center rounded-md ${styles.logo}`}>
                    E-learning
                </div>

                {/* Mobile Menu Toggle Button */}
                <button 
                    onClick={toggleMenu}
                    className="lg:hidden absolute right-4 top-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none z-[60]"
                    aria-label="Toggle menu"
                >
                    <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
                </button>

                {/* Navbar Links (Large Screens) */}
                <div className={`hidden lg:flex items-center gap-6 ml-[150px] ${styles.navLinks}`}>
                    <ul className="flex items-center gap-4">
                        {isLoggedIn && userRole === 'Student' && (
                          <>
                            <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Home</NavLink></li>
                            <li><NavLink to="/courses" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Courses</NavLink></li>
                            <li><NavLink to="/studentdashboard" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Dashboard</NavLink></li>
                            <li><NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>About</NavLink></li>
                          </>
                        )}
                        {isLoggedIn && userRole === 'Teacher' && (
                          <>
                            <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Home</NavLink></li>
                            <li><NavLink to="/teacher/courses" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>My Courses</NavLink></li>
                            <li><NavLink to="/studentdashboard" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Dashboard</NavLink></li>
                            <li><NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>About</NavLink></li>
                          </>
                        )}
                        {(!isLoggedIn || (!['Student', 'Teacher'].includes(userRole))) && (
                          <>
                            <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Home</NavLink></li>
                            <li><NavLink to="/courses" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Courses</NavLink></li>
                            <li><NavLink to="/studentdashboard" className={({ isActive }) => isActive ? `${styles.navlink} ${styles.active}` : styles.navlink}>Dashboard</NavLink></li>
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
                  <Link to="/studentprofile">
                    <div className={`w-[24px] h-[24px] overflow-hidden ${styles.profileIcon}`}>
                      <img src={img} alt="user profile" className="w-full h-full object-cover" />
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

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed top-[56px] left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-[55] ${
                isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            } ${styles.dropdownMenu}`}>
                <div className="p-4">
                    <ul className="flex flex-col gap-6 items-center">
                        {isLoggedIn && userRole === 'Student' && (
                            <>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/courses" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Courses
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/studentdashboard" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/about" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        About
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {isLoggedIn && userRole === 'Teacher' && (
                            <>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/teacher/courses" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        My Courses
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/studentdashboard" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/about" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        About
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {(!isLoggedIn || (!['Student', 'Teacher'].includes(userRole))) && (
                            <>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/courses" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Courses
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/studentdashboard" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="w-full text-center">
                                    <NavLink 
                                        to="/about" 
                                        className={({ isActive }) => 
                                            `block py-2 px-4 text-lg font-medium relative
                                            ${isActive 
                                                ? 'text-indigo-600 after:scale-x-100' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                            }
                                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                            after:w-12 after:h-[2px] after:bg-indigo-600 after:scale-x-0 
                                            after:origin-center after:transition-transform after:duration-300 after:ease-in-out
                                            hover:after:scale-x-100`
                                        }
                                    >
                                        About
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                    
                    {/* Mobile Search and Profile Section */}
                    <div className="mt-8 flex flex-col gap-6">
                        <div className="relative w-full">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="w-full h-[40px] pl-[40px] pr-[12px] text-base font-normal bg-gray-100 rounded-md border-0 outline-none hover:bg-white hover:text-gray-700 focus:bg-white focus:text-gray-700 transition-all duration-300 ease-in-out"
                            />
                            <span>
                                <i className="fa-solid fa-magnifying-glass absolute top-[12px] left-[14px] text-gray-500"></i>
                            </span>
                        </div>
                        
                        {isLoggedIn && (userRole === 'Student' || userRole === 'Teacher') && (
                            <div className="flex items-center justify-between px-4">
                                <div className="relative">
                                    <div className="w-[32px] h-[32px] text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors duration-200" onClick={toggleNotification}>
                                        <i className="fa-solid fa-bell text-xl"></i>
                                    </div>
                                    {isNotificationVisible && (
                                        <div className="absolute right-0 mt-2 w-[200px] bg-white shadow-lg rounded-md p-4">
                                            <p className="text-sm text-gray-700">No new notifications</p>
                                        </div>
                                    )}
                                </div>
                                <Link to="/studentprofile">
                                    <div className="w-[22px] h-[22px] rounded-full overflow-hidden border border-indigo-100 hover:border-indigo-300 transition-colors duration-200">
                                        <img src={img} alt="user profile" className="w-full h-full object-cover" />
                                    </div>
                                </Link>
                                <button 
                                    onClick={() => dispatch(logout())} 
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                        {(!isLoggedIn || !['Student', 'Teacher'].includes(userRole)) && (
                            <Link to="/auth/login" className="w-full">
                                <Button />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
