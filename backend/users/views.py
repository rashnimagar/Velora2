from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import User
from .serializers import (
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
)

token_generator = PasswordResetTokenGenerator()


def _tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class RegisterView(APIView):
    """POST /api/auth/register/ - Buyer or Seller registration."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "success": True,
                "message": "Account created successfully.",
                "user": UserSerializer(user).data,
                "tokens": _tokens_for_user(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """POST /api/auth/login/"""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return Response(
            {
                "success": True,
                "message": "Logged in successfully.",
                "user": UserSerializer(user).data,
                "tokens": _tokens_for_user(user),
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """POST /api/auth/logout/ - blacklists the refresh token."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except (KeyError, TokenError):
            return Response(
                {"success": False, "message": "Invalid or missing refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"success": True, "message": "Logged out successfully."})


class MeView(APIView):
    """GET /api/auth/me/ - current authenticated user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"success": True, "user": UserSerializer(request.user).data})


class PasswordResetRequestView(APIView):
    """
    POST /api/auth/password-reset/
    Always responds the same way whether or not the email exists, so we
    don't leak which emails are registered.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        user = User.objects.filter(email__iexact=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"

            send_mail(
                subject="Reset your VELORA password",
                message=(
                    f"Hi {user.username},\n\n"
                    f"We received a request to reset your VELORA password. "
                    f"Click the link below to choose a new one:\n\n{reset_link}\n\n"
                    f"If you didn't request this, you can safely ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

        return Response(
            {
                "success": True,
                "message": "If an account exists with that email, a reset link has been sent.",
            }
        )


class PasswordResetConfirmView(APIView):
    """POST /api/auth/password-reset/confirm/"""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            uid = force_str(urlsafe_base64_decode(data["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response(
                {"success": False, "message": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not token_generator.check_token(user, data["token"]):
            return Response(
                {"success": False, "message": "This reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(data["new_password"])
        user.save()
        return Response({"success": True, "message": "Password reset successfully. You can now log in."})
