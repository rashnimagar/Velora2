from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import IsAdmin, IsSeller

from .models import SellerProfile
from .serializers import (
    AdminSellerVerificationDecisionSerializer,
    AdminSellerVerificationListSerializer,
    SellerVerificationSerializer,
    SellerVerificationSubmitSerializer,
)


class MyVerificationView(RetrieveAPIView):
    """GET /api/sellers/verification/ - the logged-in seller's own status."""

    permission_classes = [IsSeller]
    serializer_class = SellerVerificationSerializer

    def get_object(self):
        profile, _ = SellerProfile.objects.get_or_create(user=self.request.user)
        return profile


class SubmitVerificationView(APIView):
    """
    POST /api/sellers/verification/submit/
    Handles both the first submission and resubmission after a rejection.
    """

    permission_classes = [IsSeller]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        profile, _ = SellerProfile.objects.get_or_create(user=request.user)

        serializer = SellerVerificationSubmitSerializer(
            profile, data=request.data, partial=False
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save(
            verification_status=SellerProfile.VerificationStatus.PENDING,
            admin_remarks="",
            submitted_at=timezone.now(),
            reviewed_at=None,
            reviewed_by=None,
        )
        return Response(
            {
                "success": True,
                "message": "Your verification request is pending. Please wait for administrator approval.",
                "profile": SellerVerificationSerializer(profile).data,
            },
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Admin - Seller Verification Management (Screen 33)
# ---------------------------------------------------------------------------

class AdminVerificationListView(ListAPIView):
    """
    GET /api/sellers/verification/admin/
    GET /api/sellers/verification/admin/?status=pending
    """

    permission_classes = [IsAdmin]
    serializer_class = AdminSellerVerificationListSerializer

    def get_queryset(self):
        qs = SellerProfile.objects.select_related("user").order_by("-submitted_at", "-created_at")
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(verification_status=status_filter)
        return qs


class AdminApproveVerificationView(APIView):
    """POST /api/sellers/verification/admin/<id>/approve/"""

    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            profile = SellerProfile.objects.get(pk=pk)
        except SellerProfile.DoesNotExist:
            return Response(
                {"success": False, "message": "Seller profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        profile.verification_status = SellerProfile.VerificationStatus.APPROVED
        profile.admin_remarks = ""
        profile.reviewed_at = timezone.now()
        profile.reviewed_by = request.user
        profile.save()

        return Response(
            {
                "success": True,
                "message": "Seller verification approved.",
                "profile": AdminSellerVerificationListSerializer(profile).data,
            }
        )


class AdminRejectVerificationView(APIView):
    """POST /api/sellers/verification/admin/<id>/reject/  body: { "remarks": "..." }"""

    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            profile = SellerProfile.objects.get(pk=pk)
        except SellerProfile.DoesNotExist:
            return Response(
                {"success": False, "message": "Seller profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminSellerVerificationDecisionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile.verification_status = SellerProfile.VerificationStatus.REJECTED
        profile.admin_remarks = serializer.validated_data["remarks"]
        profile.reviewed_at = timezone.now()
        profile.reviewed_by = request.user
        profile.save()

        return Response(
            {
                "success": True,
                "message": "Seller verification rejected.",
                "profile": AdminSellerVerificationListSerializer(profile).data,
            }
        )
