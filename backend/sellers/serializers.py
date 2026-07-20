from rest_framework import serializers

from .models import SellerProfile


class SellerVerificationSerializer(serializers.ModelSerializer):
    """Read-only snapshot of a seller's own verification state."""

    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = SellerProfile
        fields = [
            "id", "email", "username", "identity_document", "shop_document",
            "verification_status", "admin_remarks", "submitted_at", "reviewed_at",
        ]
        read_only_fields = fields


class SellerVerificationSubmitSerializer(serializers.ModelSerializer):
    """Used when a seller uploads/resubmits their verification documents."""

    identity_document = serializers.FileField(required=True)
    shop_document = serializers.FileField(required=True)

    class Meta:
        model = SellerProfile
        fields = ["identity_document", "shop_document"]


class AdminSellerVerificationListSerializer(serializers.ModelSerializer):
    """Used in the Admin's Seller Verification Management table."""

    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    phone = serializers.CharField(source="user.phone", read_only=True)

    class Meta:
        model = SellerProfile
        fields = [
            "id", "email", "username", "phone", "identity_document", "shop_document",
            "verification_status", "admin_remarks", "submitted_at", "reviewed_at",
        ]
        read_only_fields = fields


class AdminSellerVerificationDecisionSerializer(serializers.Serializer):
    """Body for the approve/reject admin actions."""

    remarks = serializers.CharField(required=False, allow_blank=True, default="")
