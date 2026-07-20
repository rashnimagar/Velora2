from django.conf import settings
from django.db import models

from common.models import TimeStampedModel


def seller_document_path(instance, filename):
    return f"seller_verification/{instance.user_id}/{filename}"


class SellerProfile(TimeStampedModel):
    """
    One-to-one extension of User for sellers. Holds verification state
    per the PRD's Seller Verification workflow:

        Seller Registers -> Uploads Documents -> Pending -> Admin Reviews
        -> Approved (can list products) OR Rejected (must resubmit)
    """

    class VerificationStatus(models.TextChoices):
        UNSUBMITTED = "unsubmitted", "Not Submitted"
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_profile",
    )

    identity_document = models.FileField(upload_to=seller_document_path, blank=True, null=True)
    shop_document = models.FileField(upload_to=seller_document_path, blank=True, null=True)

    verification_status = models.CharField(
        max_length=15,
        choices=VerificationStatus.choices,
        default=VerificationStatus.UNSUBMITTED,
    )
    admin_remarks = models.TextField(blank=True)

    submitted_at = models.DateTimeField(blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="verifications_reviewed",
    )

    def __str__(self):
        return f"{self.user.email} - {self.verification_status}"
