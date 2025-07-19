// Centralized authentication storage management
export const authStorage = {
    // Get token from either storage location
    getToken: () => {
        return localStorage.getItem('token') || localStorage.getItem('JWTToken');
    },

    // Get refresh token
    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    },

    // Get user role
    getUserRole: () => {
        return localStorage.getItem('userRole');
    },

    // Get user ID
    getUserId: () => {
        return localStorage.getItem('adminId') || localStorage.getItem('guestId');
    },

    // Check if user is admin
    isAdmin: () => {
        return localStorage.getItem('isAdmin') === 'true';
    },

    // Check if user is teacher
    isTeacher: () => {
        return localStorage.getItem('isTeacher') === 'true';
    },

    // Check if user is logged in
    isLoggedIn: () => {
        const token = localStorage.getItem('token') || localStorage.getItem('JWTToken');
        const refreshToken = localStorage.getItem('refreshToken');
        return !!(token && refreshToken);
    },

    // Set authentication data
    setAuthData: (data) => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('JWTToken', data.token);
        }
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.expiration) {
            localStorage.setItem('expirationDate', data.expiration);
        }
        if (data.role) {
            localStorage.setItem('userRole', data.role);
        }
        if (data.userId) {
            if (data.isAdmin) {
                localStorage.setItem('adminId', data.userId);
            } else {
                localStorage.setItem('guestId', data.userId);
            }
        }
        if (data.isAdmin !== undefined) {
            localStorage.setItem('isAdmin', data.isAdmin.toString());
        }
        if (data.isTeacher !== undefined) {
            localStorage.setItem('isTeacher', data.isTeacher.toString());
        }
    },

    // Clear all authentication data
    clearAuthData: () => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isTeacher');
        localStorage.removeItem('token');
        localStorage.removeItem('JWTToken');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('guestId');
        localStorage.removeItem('adminId');
    },

    // Get initial auth state for Redux
    getInitialAuthState: () => {
        const token = localStorage.getItem('token') || localStorage.getItem('JWTToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const expirationDate = localStorage.getItem('expirationDate');
        const role = localStorage.getItem('userRole');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const isTeacher = localStorage.getItem('isTeacher') === 'true';
        const userId = localStorage.getItem('adminId') || localStorage.getItem('guestId');
        
        return {
            user: userId ? { id: userId } : null,
            refreshToken: refreshToken,
            expirationDate: expirationDate,
            token: token,
            isLogedin: !!token && !!refreshToken,
            role: role,
            isAdmin: isAdmin,
            isTeacher: isTeacher,
            loading: false,
            error: null,
        };
    }
}; 