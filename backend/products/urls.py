from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import (
    CategoryViewSet,
    ProductImageDeleteView,
    ProductImageUploadView,
    PublicProductDetailView,
    PublicProductListView,
    SellerProductViewSet,
)

router = SimpleRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("my-products", SellerProductViewSet, basename="my-product")

urlpatterns = router.urls + [
    path(
        "my-products/<int:product_id>/images/",
        ProductImageUploadView.as_view(),
        name="product-image-upload",
    ),
    path(
        "my-products/<int:product_id>/images/<int:image_id>/",
        ProductImageDeleteView.as_view(),
        name="product-image-delete",
    ),
    # Public browsing - registered last since <slug> is a catch-all and
    # would otherwise shadow "categories/" and "my-products/" above.
    path("", PublicProductListView.as_view(), name="product-list"),
    path("<slug:slug>/", PublicProductDetailView.as_view(), name="product-detail"),
]
