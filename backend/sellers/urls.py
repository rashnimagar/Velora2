from django.urls import path

from .views import (
    AdminApproveVerificationView,
    AdminRejectVerificationView,
    AdminVerificationListView,
    MyVerificationView,
    SubmitVerificationView,
)

urlpatterns = [
    path("verification/", MyVerificationView.as_view(), name="seller-verification-me"),
    path("verification/submit/", SubmitVerificationView.as_view(), name="seller-verification-submit"),

    path("verification/admin/", AdminVerificationListView.as_view(), name="admin-verification-list"),
    path("verification/admin/<int:pk>/approve/", AdminApproveVerificationView.as_view(), name="admin-verification-approve"),
    path("verification/admin/<int:pk>/reject/", AdminRejectVerificationView.as_view(), name="admin-verification-reject"),
]
