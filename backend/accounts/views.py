from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .models import User


# This endpoint lets new users create an account
# We use AllowAny because obviously they're not logged in yet!
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """Register a new user."""
    # The serializer handles validation and creates the user
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()  # Creates the user in the database
        # Generate JWT tokens so they're automatically logged in after registration
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context={'request': request}).data,  # Send back user info
            'tokens': {
                'refresh': str(refresh),  # Long-lived token for getting new access tokens
                'access': str(refresh.access_token),  # Short-lived token for API calls
            }
        }, status=status.HTTP_201_CREATED)
    # If validation failed, send back the errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login endpoint - validates email/password and returns tokens
@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # Anyone can try to login
def login(request):
    """Login user and return JWT tokens."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        # The serializer already checked the password, so we can trust this user
        user = serializer.validated_data['user']
        # Create tokens for this user
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    # Wrong email or password
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Logout endpoint - invalidates the refresh token so it can't be used again
# This is important for security - if someone steals a token, they can't use it after logout
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])  # Must be logged in to logout (makes sense, right?)
def logout(request):
    """Logout user by blacklisting refresh token."""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Mark this token as invalid - can't be used anymore
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Token might be invalid or already blacklisted
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Profile endpoint - users can view and update their own profile
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])  # Must be logged in
def profile(request):
    """Get or update user profile."""
    if request.method == 'GET':
        # Just return the current user's info
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        # Update the user's profile
        # partial=True means they don't have to send all fields, just the ones they want to change
        serializer = UserSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # Save the changes
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

