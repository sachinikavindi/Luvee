import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)

    // Initialize auth state from localStorage or create real user
    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = localStorage.getItem('user-token');
            const savedUser = localStorage.getItem('user-data');
            
            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                console.log('Restored user session:', JSON.parse(savedUser));
                return;
            }

            // Create a real user account for testing
            try {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
                
                // Try to register a test user
                const registerResponse = await fetch(`${BACKEND_URL}/api/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: 'Test',
                        lastName: 'User',
                        email: 'testuser@gmail.com',
                        password: 'password123'
                    })
                });

                const registerData = await registerResponse.json();
                
                if (registerData.success) {
                    // Registration successful
                    setUser(registerData.user);
                    setToken(registerData.token);
                    localStorage.setItem('user-token', registerData.token);
                    localStorage.setItem('user-data', JSON.stringify(registerData.user));
                    console.log('Created new user account:', registerData.user);
                } else if (registerData.message?.includes('already exists')) {
                    // User already exists, try to login
                    const loginResponse = await fetch(`${BACKEND_URL}/api/users/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: 'testuser@gmail.com',
                            password: 'password123'
                        })
                    });

                    const loginData = await loginResponse.json();
                    
                    if (loginData.success) {
                        setUser(loginData.user);
                        setToken(loginData.token);
                        localStorage.setItem('user-token', loginData.token);
                        localStorage.setItem('user-data', JSON.stringify(loginData.user));
                        console.log('Logged in existing user:', loginData.user);
                    } else {
                        console.error('Login failed:', loginData.message);
                        // Fallback to temp user
                        createTempUser();
                    }
                } else {
                    console.error('Registration failed:', registerData.message);
                    // Fallback to temp user
                    createTempUser();
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                // Fallback to temp user
                createTempUser();
            }
        };

        const createTempUser = () => {
            const tempUser = {
                id: 'temp-user-id',
                email: 'test@gmail.com',
                firstName: 'Test',
                lastName: 'User'
            };
            const tempToken = 'temp-auth-token-' + Date.now();
            
            setUser(tempUser);
            setToken(tempToken);
            localStorage.setItem('user-token', tempToken);
            localStorage.setItem('user-data', JSON.stringify(tempUser));
            console.log('Created temporary user session for testing');
        };

        initializeAuth();
    }, []);

    // Login function
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user-token', authToken);
        localStorage.setItem('user-data', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-data');
    };

    const value = {
        navigate, user, setUser, token, setToken, login, logout, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, search, setSearch,
        showSearch, setShowSearch
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}