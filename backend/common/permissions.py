"""
Shared role-based permissions for VELORA.

Business rules from the PRD this file exists to enforce:
  - Only verified sellers may create/manage products.
  - Only buyers may place orders and submit reviews.
  - Only admins may access admin routes.

Every app should import these rather than redefining role checks.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsBuyer(BasePermission):
    """Allows access only to authenticated users with role='buyer'."""

    message = "Only buyers can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "buyer"
        )


class IsSeller(BasePermission):
    """Allows access to authenticated users with role='seller' (verified or not)."""

    message = "Only sellers can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "seller"
        )


class IsVerifiedSeller(BasePermission):
    """
    Allows access only to sellers whose verification status is 'approved'.
    Enforces the PRD rule: "Only verified sellers may create products."
    """

    message = "Your seller account must be verified before you can do this."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated and getattr(user, "role", None) == "seller"):
            return False
        profile = getattr(user, "seller_profile", None)
        return bool(profile and profile.verification_status == "approved")


class IsAdmin(BasePermission):
    """Allows access only to authenticated users with role='admin'."""

    message = "Only administrators can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "admin"
        )


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission: read for anyone, write only for the
    object's owner (expects the object to expose an `.owner` or `.user`
    attribute referring to the requesting user).
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner = getattr(obj, "owner", None) or getattr(obj, "user", None)
        return owner == request.user
