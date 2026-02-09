"""
Django settings for B2B OMS Platform.
This is where all the magic happens - configuration for our entire backend.
"""

from pathlib import Path
from datetime import timedelta
from decouple import config  # Makes it easy to read from .env files

# Figure out where we are in the filesystem - this helps with relative paths
# Basically, this points to the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent

# This is super important - never commit this to git!
# In production, you'll want to generate a new one and store it securely
# Pro tip: run `python manage.py shell` then `from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())`
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-this-in-production')

# When this is True, Django shows detailed error pages (super helpful for debugging)
# But you definitely don't want this in production - it exposes too much info
DEBUG = config('DEBUG', default=True, cast=bool)

# These are the domains/hosts that Django will accept requests from
# Add your production domain here when you deploy
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# All the apps that make up our project
# Django apps are like plugins - each one adds functionality
INSTALLED_APPS = [
    # These come with Django by default - admin panel, auth, etc.
    'django.contrib.admin',  # The admin interface (super useful for managing data)
    'django.contrib.auth',  # Handles user authentication
    'django.contrib.contenttypes',  # Tracks what types of content we have
    'django.contrib.sessions',  # Manages user sessions
    'django.contrib.messages',  # Flash messages (like "Order created successfully!")
    'django.contrib.staticfiles',  # Serves CSS, JS, images, etc.
    
    # Third party packages we installed
    'rest_framework',  # Makes building APIs way easier
    'rest_framework_simplejwt',  # JWT tokens for authentication
    'rest_framework_simplejwt.token_blacklist',  # Lets us invalidate tokens on logout
    'corsheaders',  # Allows our React frontend to talk to this backend
    
    # Our custom apps - each handles a specific part of the business
    'accounts',  # User accounts, login, registration
    'orders',  # Order management
    'inventory',  # Products and stock levels
    'customers',  # Customer information
    'warehouses',  # Warehouse locations and details
    'reports',  # Analytics and reporting
    'notifications',  # Real-time user notifications
]

# Middleware runs on every request - think of it as layers of processing
# Order matters here! They execute top to bottom on request, then bottom to top on response
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Adds security headers
    'corsheaders.middleware.CorsMiddleware',  # Handles CORS - must be early in the stack
    'django.contrib.sessions.middleware.SessionMiddleware',  # Manages user sessions
    'django.middleware.common.CommonMiddleware',  # Common utilities (like trailing slash handling)
    'django.middleware.csrf.CsrfViewMiddleware',  # Protects against CSRF attacks
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Attaches user to request
    'django.contrib.messages.middleware.MessageMiddleware',  # Handles flash messages
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Prevents clickjacking
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database configuration
# SQLite is great for development - it's just a file, no setup needed
# For production, you'll want PostgreSQL or MySQL for better performance
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Simple file-based database
        'NAME': BASE_DIR / 'db.sqlite3',  # The actual database file lives here
    }
}

# These validators check passwords when users register
# They make sure passwords aren't too weak or similar to username
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',  # Can't be too similar to username
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',  # Must be at least 8 chars (default)
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',  # Blocks common passwords like "password123"
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',  # Can't be all numbers
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# REST Framework settings - this configures how our API works
REST_FRAMEWORK = {
    # How we authenticate users - JWT tokens in this case
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Bearer token auth
    ),
    # By default, require users to be logged in to access any endpoint
    # Individual views can override this if needed
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    # Split large lists into pages - keeps responses manageable
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,  # 20 items per page
    # Only return JSON (no HTML/XML)
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}

# JWT token configuration
# JWTs are like temporary ID cards - they prove who you are without storing sessions
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),  # Access tokens expire after 1 hour
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Refresh tokens last 7 days
    'ROTATE_REFRESH_TOKENS': True,  # Get a new refresh token each time we refresh
    'BLACKLIST_AFTER_ROTATION': True,  # Old refresh tokens become invalid (security best practice)
    'UPDATE_LAST_LOGIN': True,  # Track when users last logged in
    'ALGORITHM': 'HS256',  # How we sign the tokens
    'SIGNING_KEY': SECRET_KEY,  # Secret key used to sign tokens
    'AUTH_HEADER_TYPES': ('Bearer',),  # Frontend sends "Bearer <token>"
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',  # Header name to look for
    'USER_ID_FIELD': 'id',  # Which field on User model to use
    'USER_ID_CLAIM': 'user_id',  # What to call it in the token
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# CORS (Cross-Origin Resource Sharing) settings
# This lets our React app (running on a different port) talk to this backend
# Without this, browsers would block the requests for security reasons
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://localhost:3000'  # Vite default port, and Create React App default
).split(',')

CORS_ALLOW_CREDENTIALS = True  # Allow cookies/auth headers to be sent

# Which HTTP methods are allowed
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',  # Preflight requests
    'PATCH',
    'POST',
    'PUT',
]

# Which headers the frontend can send
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',  # For JWT tokens
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Media files - user-uploaded content like product images
# These are different from static files (which are part of the codebase)
MEDIA_URL = '/media/'  # URL prefix for accessing media files
MEDIA_ROOT = BASE_DIR / 'media'  # Where uploaded files are stored on disk

