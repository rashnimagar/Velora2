from django.contrib import admin

from .models import SellerProfile


@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "verification_status", "submitted_at", "reviewed_at", "reviewed_by")
    list_filter = ("verification_status",)
    search_fields = ("user__email", "user__username")
    readonly_fields = ("submitted_at", "reviewed_at")
