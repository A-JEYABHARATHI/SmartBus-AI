document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // SMARTBUS AI - BACKEND CONFIGURATION
    // =========================================================
    const API_BASE_URL = 'https://smartbus-ai.onrender.com';

    // =========================================================
    // COMMON ELEMENTS
    // =========================================================
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const dashboardUser = document.getElementById('dashboardUser');
    const dashboardRole = document.getElementById('dashboardRole');
    const dashboardTime = document.getElementById('dashboardTime');

    // =========================================================
    // PASSENGER NAVIGATION
    // =========================================================
    document.querySelectorAll('.passenger-topbar').forEach((topbar) => {
        const navigation = topbar.querySelector('.passenger-nav');

        if (!navigation || navigation.querySelector('.mobile-menu-toggle')) {
            return;
        }

        const existingLinks = new Set(
            Array.from(navigation.querySelectorAll('a'))
                .map((link) => link.textContent.trim())
        );

        const additionalLinks = [
            ['Dashboard', 'user-dashboard.html'],
            ['Live Buses', 'buses.html'],
            ['Predictions', 'predictions.html']
        ];

        additionalLinks.forEach(([label, href]) => {
            if (existingLinks.has(label)) {
                return;
            }

            const link = document.createElement('a');
            link.href = href;
            link.textContent = label;

            navigation.insertBefore(
                link,
                navigation.querySelector('button')
            );
        });

        const menuButton = document.createElement('button');

        menuButton.type = 'button';
        menuButton.className = 'mobile-menu-toggle';
        menuButton.setAttribute('aria-label', 'Toggle navigation');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = 'Menu';

        topbar.insertBefore(menuButton, navigation);

        menuButton.addEventListener('click', () => {
            const isOpen = navigation.classList.toggle('is-open');

            menuButton.setAttribute(
                'aria-expanded',
                String(isOpen)
            );
        });
    });

    // =========================================================
    // DASHBOARD TIME
    // =========================================================
    if (dashboardTime) {
        const now = new Date();

        dashboardTime.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // =========================================================
    // FETCH CURRENT USER
    // =========================================================
    if (dashboardUser || dashboardRole) {
        fetchCurrentUser(dashboardUser, dashboardRole);
    }

    // =========================================================
    // LOGIN
    // =========================================================
    if (loginForm) {
        const performLogin = async (event) => {
            event.preventDefault();

            const usernameElement = document.getElementById('username');
            const passwordElement = document.getElementById('password');

            if (!usernameElement || !passwordElement) {
                showMessage(
                    'Login fields could not be found.',
                    'error'
                );
                return;
            }

            const username = usernameElement.value.trim();
            const password = passwordElement.value;

            if (!username || !password) {
                showMessage(
                    'Invalid username or password.',
                    'error'
                );
                return;
            }

            try {
                // CORRECT LOGIN ENDPOINT
                const loginUrl = `${API_BASE_URL}/api/auth/login`;

                console.info('Login request:', loginUrl);

                const response = await fetch(loginUrl, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    credentials: 'include',

                    body: JSON.stringify({
                        username,
                        password
                    })
                });

                console.info(
                    'Login response status:',
                    response.status
                );

                if (response.ok) {
                    window.location.href = 'home.html';
                    return;
                }

                let message = 'Invalid username or password.';

                try {
                    const errorData = await response.json();

                    if (errorData && errorData.message) {
                        message = errorData.message;
                    }
                } catch (error) {
                    try {
                        const text = await response.text();

                        if (text) {
                            message = text;
                        }
                    } catch (textError) {
                        console.error(
                            'Unable to read login error:',
                            textError
                        );
                    }
                }

                showMessage(message, 'error');

            } catch (error) {
                console.error(
                    'Login request failed:',
                    error
                );

                showMessage(
                    'Unable to connect to SmartBus backend. Please try again.',
                    'error'
                );
            }
        };

        loginForm.addEventListener(
            'submit',
            performLogin
        );
    }

    // =========================================================
    // REGISTRATION ELEMENTS
    // =========================================================
    const registerForm =
        document.getElementById('registerForm');

    const signinView =
        document.getElementById('signinView');

    const registerView =
        document.getElementById('registerView');

    const showRegister =
        document.getElementById('showRegister');

    const showSignin =
        document.getElementById('showSignin');

    // =========================================================
    // SWITCH SIGN IN / CREATE ACCOUNT
    // =========================================================
    const showAuthView = (view) => {
        const showRegistration = view === 'register';

        if (signinView) {
            signinView.hidden = showRegistration;

            signinView.classList.toggle(
                'is-active',
                !showRegistration
            );
        }

        if (registerView) {
            registerView.hidden = !showRegistration;

            registerView.classList.toggle(
                'is-active',
                showRegistration
            );
        }

        const message =
            document.getElementById('message');

        if (message) {
            message.textContent = '';
            message.className = 'message';
        }
    };

    if (showRegister) {
        showRegister.addEventListener(
            'click',
            () => showAuthView('register')
        );
    }

    if (showSignin) {
        showSignin.addEventListener(
            'click',
            () => showAuthView('signin')
        );
    }

    // =========================================================
    // PASSWORD SHOW / HIDE
    // =========================================================
    document.querySelectorAll('.password-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const input = document.getElementById(
                toggle.dataset.passwordTarget
            );

            if (!input) {
                return;
            }

            const isPassword =
                input.type === 'password';

            input.type =
                isPassword ? 'text' : 'password';

            toggle.textContent =
                isPassword ? 'Hide' : 'Show';

            toggle.setAttribute(
                'aria-label',
                `${isPassword ? 'Hide' : 'Show'} password`
            );
        });
    });

    // =========================================================
    // CREATE ACCOUNT / REGISTRATION
    // =========================================================
    if (registerForm) {
        registerForm.addEventListener(
            'submit',
            async (event) => {
                event.preventDefault();

                const fullNameElement =
                    document.getElementById('fullName');

                const emailElement =
                    document.getElementById('email');

                const usernameElement =
                    document.getElementById('registerUsername');

                const passwordElement =
                    document.getElementById('registerPassword');

                const confirmPasswordElement =
                    document.getElementById('confirmPassword');

                if (
                    !fullNameElement ||
                    !emailElement ||
                    !usernameElement ||
                    !passwordElement ||
                    !confirmPasswordElement
                ) {
                    showMessage(
                        'Registration fields could not be found.',
                        'error'
                    );
                    return;
                }

                const fullName =
                    fullNameElement.value.trim();

                const email =
                    emailElement.value.trim();

                const username =
                    usernameElement.value.trim();

                const password =
                    passwordElement.value;

                const confirmPassword =
                    confirmPasswordElement.value;

                // ---------------------------------------------
                // VALIDATION
                // ---------------------------------------------
                if (
                    !fullName ||
                    !email ||
                    !username ||
                    !password ||
                    !confirmPassword
                ) {
                    showMessage(
                        'Please complete all registration fields.',
                        'error'
                    );
                    return;
                }

                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ) {
                    showMessage(
                        'Please enter a valid email address.',
                        'error'
                    );
                    return;
                }

                if (password.length < 8) {
                    showMessage(
                        'Password must be at least 8 characters.',
                        'error'
                    );
                    return;
                }

                if (password !== confirmPassword) {
                    showMessage(
                        'Passwords do not match.',
                        'error'
                    );
                    return;
                }

                // ---------------------------------------------
                // SEND REGISTRATION REQUEST
                // ---------------------------------------------
                try {
                    const registrationUrl =
                        `${API_BASE_URL}/api/auth/register`;

                    console.info(
                        'Registration request:',
                        registrationUrl
                    );

                    const response = await fetch(
                        registrationUrl,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type': 'application/json'
                            },

                            credentials: 'include',

                            body: JSON.stringify({
                                fullName,
                                email,
                                username,
                                password
                            })
                        }
                    );

                    console.info(
                        'Registration response status:',
                        response.status
                    );

                    // -----------------------------------------
                    // REGISTRATION FAILED
                    // -----------------------------------------
                    if (!response.ok) {
                        let errorMessage =
                            'Unable to create your account.';

                        try {
                            const errorData =
                                await response.json();

                            console.error(
                                'Registration API error:',
                                errorData
                            );

                            if (
                                errorData &&
                                errorData.message
                            ) {
                                errorMessage =
                                    errorData.message;
                            }

                        } catch (error) {
                            console.error(
                                'Registration API returned a non-JSON response:',
                                error
                            );
                        }

                        showMessage(
                            errorMessage,
                            'error'
                        );

                        return;
                    }

                    // -----------------------------------------
                    // REGISTRATION SUCCESS
                    // -----------------------------------------
                    registerForm.reset();

                    showAuthView('signin');

                    showMessage(
                        'Account created successfully. Please sign in.',
                        'success'
                    );

                } catch (error) {
                    console.error(
                        'Registration request failed:',
                        error
                    );

                    showMessage(
                        'Unable to connect to SmartBus backend. Please try again.',
                        'error'
                    );
                }
            }
        );
    }

    // =========================================================
    // LOGOUT
    // =========================================================
    if (logoutButton) {
        logoutButton.addEventListener(
            'click',
            async () => {
                try {
                    await fetch(
                        `${API_BASE_URL}/api/auth/logout`,
                        {
                            method: 'POST',
                            credentials: 'include'
                        }
                    );

                    window.location.href =
                        'login.html';

                } catch (error) {
                    console.error(
                        'Logout request failed:',
                        error
                    );

                    window.location.href =
                        'login.html';
                }
            }
        );
    }

    // =========================================================
    // INITIALIZE LOCATION MAP
    // =========================================================
    initializeLocationMap();

    // =========================================================
    // LOCATION MAP FUNCTION
    // =========================================================
    function initializeLocationMap() {
        const locationButton =
            document.getElementById('useMyLocation');

        const locationStatus =
            document.getElementById('locationStatus');

        const latitudeValue =
            document.getElementById('latitudeValue');

        const longitudeValue =
            document.getElementById('longitudeValue');

        const startingLocation =
            document.getElementById('fromStop');

        const mapElement =
            document.getElementById('userLocationMap');

        if (
            !locationButton ||
            !locationStatus ||
            !latitudeValue ||
            !longitudeValue ||
            !mapElement
        ) {
            return;
        }

        if (
            !window.L ||
            mapElement.dataset.mapInitialized === 'true'
        ) {
            return;
        }

        // ---------------------------------------------
        // CREATE MAP
        // ---------------------------------------------
        const locationMap =
            window.L
                .map(mapElement)
                .setView([20, 0], 2);

        window.L
            .tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution:
                        '&copy; OpenStreetMap contributors',

                    maxZoom: 19
                }
            )
            .addTo(locationMap);

        mapElement.dataset.mapInitialized =
            'true';

        let locationMarker = null;

        // ---------------------------------------------
        // GET USER LOCATION
        // ---------------------------------------------
        locationButton.addEventListener(
            'click',
            () => {
                if (!navigator.geolocation) {
                    locationStatus.textContent =
                        'Geolocation is not supported by this browser.';

                    locationStatus.className =
                        'location-status error';

                    return;
                }

                locationButton.disabled = true;

                locationStatus.textContent =
                    'Getting your location...';

                locationStatus.className =
                    'location-status pending';

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const {
                            latitude,
                            longitude
                        } = position.coords;

                        const coordinates = [
                            latitude,
                            longitude
                        ];

                        // ---------------------------------
                        // DISPLAY COORDINATES
                        // ---------------------------------
                        latitudeValue.textContent =
                            latitude.toFixed(6);

                        longitudeValue.textContent =
                            longitude.toFixed(6);

                        if (startingLocation) {
                            startingLocation.value =
                                'current-location';
                        }

                        locationStatus.textContent =
                            '📍 Live location detected';

                        locationStatus.className =
                            'location-status success';

                        // ---------------------------------
                        // MOVE MAP
                        // ---------------------------------
                        locationMap.setView(
                            coordinates,
                            16
                        );

                        // ---------------------------------
                        // CREATE / UPDATE MARKER
                        // ---------------------------------
                        if (locationMarker) {
                            locationMarker.setLatLng(
                                coordinates
                            );
                        } else {
                            locationMarker =
                                window.L
                                    .marker(coordinates)
                                    .addTo(locationMap);
                        }

                        locationMarker
                            .bindPopup(
                                '📍 You are here'
                            )
                            .openPopup();

                        locationButton.disabled =
                            false;
                    },

                    (error) => {
                        if (
                            error.code ===
                            error.PERMISSION_DENIED
                        ) {
                            locationStatus.textContent =
                                'Location permission denied.';

                        } else if (
                            error.code ===
                            error.POSITION_UNAVAILABLE
                        ) {
                            locationStatus.textContent =
                                'Unable to determine your location.';

                        } else if (
                            error.code ===
                            error.TIMEOUT
                        ) {
                            locationStatus.textContent =
                                'Location request timed out. Please try again.';

                        } else {
                            locationStatus.textContent =
                                'Unable to get your location. Please try again.';
                        }

                        locationStatus.className =
                            'location-status error';

                        locationButton.disabled =
                            false;
                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            }
        );

        // Automatically request location
        locationButton.click();
    }

    // =========================================================
    // URL ERROR / LOGOUT MESSAGES
    // =========================================================
    const params =
        new URLSearchParams(
            window.location.search
        );

    if (params.get('error') === 'true') {
        showMessage(
            'Invalid username or password.',
            'error'
        );
    }

    if (params.get('logout') === 'true') {
        showMessage(
            'You have been logged out.',
            'success'
        );
    }
});

// =============================================================
// FETCH CURRENT LOGGED-IN USER
// =============================================================
async function fetchCurrentUser(
    dashboardUser,
    dashboardRole
) {
    const API_BASE_URL =
        'https://smartbus-ai.onrender.com';

    try {
        // CORRECT CURRENT USER ENDPOINT
        const response = await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: 'GET',
                credentials: 'include'
            }
        );

        if (!response.ok) {
            window.location.href =
                'login.html';

            return;
        }

        const userData =
            await response.json();

        if (dashboardUser) {
            dashboardUser.textContent =
                userData.username ||
                'Operations Staff';
        }

        if (dashboardRole) {
            dashboardRole.textContent =
                userData.role ||
                'ADMIN';
        }

    } catch (error) {
        console.error(
            'Unable to fetch current user:',
            error
        );

        if (dashboardUser) {
            dashboardUser.textContent =
                'Operations Staff';
        }
    }
}

// =============================================================
// SHOW MESSAGE
// =============================================================
function showMessage(
    message,
    type
) {
    const box =
        document.getElementById('message');

    if (!box) {
        return;
    }

    box.textContent =
        message;

    box.className =
        `message ${type}`;
}