from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ("email", "username", "role", "is_active", "is_staff", "created_at")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("email", "username", "phone")
    ordering = ("-created_at",)
    fieldsets = BaseUserAdmin.fieldsets + (
        ("VELORA Profile", {"fields": ("role", "phone", "profile_picture")}),
    )
