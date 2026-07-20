from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

from common.models import TimeStampedModel


class VeloraUserManager(UserManager):
    """
    Ensures accounts created via `createsuperuser` always get role='admin'.
    Without this override they'd default to Role.BUYER, silently breaking
    every IsAdmin permission check for admin accounts.
    """

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser, TimeStampedModel):
    """
    Custom user model for VELORA.

    Role drives the whole permission system (see common/permissions.py
    and the PRD's role tables): buyer, seller, or admin. Guests are simply
    unauthenticated requests and have no corresponding role value.
    """

    class Role(models.TextChoices):
        BUYER = "buyer", "Buyer"
        SELLER = "seller", "Seller"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.BUYER)
    phone = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True)

    objects = VeloraUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"
