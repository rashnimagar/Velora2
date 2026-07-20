from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import SellerProfile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_seller_profile(sender, instance, created, **kwargs):
    """
    Auto-creates a SellerProfile the moment a user registers with
    role='seller', so the frontend can immediately show the
    "Complete Verification" screen (PRD: "Immediately after login,
    Seller sees Complete Verification").
    """
    if created and instance.role == "seller":
        SellerProfile.objects.get_or_create(user=instance)
