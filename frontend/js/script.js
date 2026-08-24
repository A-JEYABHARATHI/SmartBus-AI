document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const dashboardUser = document.getElementById('dashboardUser');
    const dashboardRole = document.getElementById('dashboardRole');
    const dashboardTime = document.getElementById('dashboardTime');

    document.querySelectorAll('.passenger-topbar').forEach((topbar) => {
        const navigation = topbar.querySelector('.passenger-nav');
        if (!navigation || navigation.querySelector('.mobile-menu-toggle')) return;

        const existingLinks = new Set(Array.from(navigation.querySelectorAll('a')).map((link) => link.textContent.trim()));
        const additionalLinks = [
            ['Dashboard', '/pages/user-dashboard.html'],
            ['Live Buses', '/pages/buses.html'],
            ['Predictions', '/pages/predictions.html']
        ];
        additionalLinks.forEach(([label, href]) => {
            if (existingLinks.has(label)) return;
            const link = document.createElement('a');
            link.href = href;
            link.textContent = label;
            navigation.insertBefore(link, navigation.querySelector('button'));
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
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    });

    if (dashboardTime) {
        const now = new Date();
        dashboardTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (dashboardUser || dashboardRole) {
        fetchCurrentUser(dashboardUser, dashboardRole);
    }

    if (loginForm) {
        const performLogin = async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showMessage('Invalid username or password.', 'error');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    window.location.href = '/pages/user-dashboard.html';
                    return;
                }

                let message = 'Invalid username or password.';
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        message = errorData.message;
                    }
                } catch (error) {
                    const text = await response.text();
                    if (text) {
                        message = text;
                    }
                }

                showMessage(message, 'error');
            } catch (error) {
                showMessage('Network error. Please check the backend server and try again.', 'error');
            }
        };

        loginForm.addEventListener('submit', performLogin);
    }

    const registerForm = document.getElementById('registerForm');
    const signinView = document.getElementById('signinView');
    const registerView = document.getElementById('registerView');
    const showRegister = document.getElementById('showRegister');
    const showSignin = document.getElementById('showSignin');

    const showAuthView = (view) => {
        const showRegistration = view === 'register';
        if (signinView) {
            signinView.hidden = showRegistration;
            signinView.classList.toggle('is-active', !showRegistration);
        }
        if (registerView) {
            registerView.hidden = !showRegistration;
            registerView.classList.toggle('is-active', showRegistration);
        }
        const message = document.getElementById('message');
        if (message) {
            message.textContent = '';
            message.className = 'message';
        }
    };

    if (showRegister) {
        showRegister.addEventListener('click', () => showAuthView('register'));
    }
    if (showSignin) {
        showSignin.addEventListener('click', () => showAuthView('signin'));
    }

    document.querySelectorAll('.password-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const input = document.getElementById(toggle.dataset.passwordTarget);
            if (!input) return;

            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggle.textContent = isPassword ? 'Hide' : 'Show';
            toggle.setAttribute('aria-label', `${isPassword ? 'Hide' : 'Show'} password`);
        });
    });

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!fullName || !email || !username || !password || !confirmPassword) {
                showMessage('Please complete all registration fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters.', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match.', 'error');
                return;
            }

            try {
                const registrationUrl = 'http://localhost:8080/api/auth/register';
                console.info('Registration request:', registrationUrl, {
                    method: 'POST',
                    username,
                    email
                });
                const response = await fetch(registrationUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ fullName, email, username, password })
                });
                console.info('Registration response status:', response.status);

                if (!response.ok) {
                    let errorMessage = 'Unable to create your account.';
                    try {
                        const errorData = await response.json();
                        console.error('Registration API error:', errorData);
                        if (errorData.message) errorMessage = errorData.message;
                    } catch (error) {
                        console.error('Registration API returned a non-JSON response:', error);
                    }
                    showMessage(errorMessage, 'error');
                    return;
                }

                registerForm.reset();
                showAuthView('signin');
                showMessage('Account created successfully. Please sign in.', 'success');
            } catch (error) {
                console.error('Registration request failed:', error);
                showMessage('Unable to connect to SmartBus backend. Start Spring Boot on port 8080 and try again.', 'error');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await fetch('http://localhost:8080/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                window.location.href = '/login.html';
            } catch (error) {
                window.location.href = '/login.html';
            }
        });
    }

    initializeLocationMap();


function initializeLocationMap() {
    const locationButton = document.getElementById('useMyLocation');
    const locationStatus = document.getElementById('locationStatus');
    const latitudeValue = document.getElementById('latitudeValue');
    const longitudeValue = document.getElementById('longitudeValue');
    const startingLocation = document.getElementById('fromStop');
    const mapElement = document.getElementById('userLocationMap');

    if (!locationButton || !locationStatus || !latitudeValue || !longitudeValue || !mapElement) {
        return;
    }

    if (!window.L || mapElement.dataset.mapInitialized === 'true') {
        return;
    }

    const locationMap = window.L.map(mapElement).setView([20, 0], 2);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(locationMap);
    mapElement.dataset.mapInitialized = 'true';

    let locationMarker = null;

    locationButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = 'Geolocation is not supported by this browser.';
            locationStatus.className = 'location-status error';
            return;
        }

        locationButton.disabled = true;
        locationStatus.textContent = 'Getting your location...';
        locationStatus.className = 'location-status pending';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const coordinates = [latitude, longitude];

                latitudeValue.textContent = latitude.toFixed(6);
                longitudeValue.textContent = longitude.toFixed(6);
                if (startingLocation) {
                    startingLocation.value = 'current-location';
                }
                locationStatus.textContent = '📍 Live location detected';
                locationStatus.className = 'location-status success';

                locationMap.setView(coordinates, 16);
                if (locationMarker) {
                    locationMarker.setLatLng(coordinates);
                } else {
                    locationMarker = window.L.marker(coordinates).addTo(locationMap);
                }
                locationMarker.bindPopup('📍 You are here').openPopup();
                locationButton.disabled = false;
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    locationStatus.textContent = 'Location permission denied.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    locationStatus.textContent = 'Unable to determine your location.';
                } else if (error.code === error.TIMEOUT) {
                    locationStatus.textContent = 'Location request timed out. Please try again.';
                } else {
                    locationStatus.textContent = 'Unable to get your location. Please try again.';
                }

                locationStatus.className = 'location-status error';
                locationButton.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });

    locationButton.click();
}
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'true') {
        showMessage('Invalid username or password.', 'error');
    }

    if (params.get('logout') === 'true') {
        showMessage('You have been logged out.', 'success');
    }
});

async function fetchCurrentUser(dashboardUser, dashboardRole) {
    try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.href = '/login.html';
            return;
        }

        const userData = await response.json();
        if (dashboardUser) {
            dashboardUser.textContent = userData.username || 'Operations Staff';
        }
        if (dashboardRole) {
            dashboardRole.textContent = userData.role || 'ADMIN';
        }
    } catch (error) {
        if (dashboardUser) {
            dashboardUser.textContent = 'Operations Staff';
        }
    }
}

function showMessage(message, type) {
    const box = document.getElementById('message');
    if (!box) return;

    box.textContent = message;
    box.className = `message ${type}`;
}
