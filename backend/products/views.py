from rest_framework import viewsets, filters, status, generics
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from common.permissions import IsAdmin, IsVerifiedSeller

from .filters import ProductFilter
from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer,
    PublicProductDetailSerializer,
    PublicProductListSerializer,
    ProductImageSerializer,
    ProductSerializer,
)

MAX_IMAGES_PER_PRODUCT = 6


class CategoryViewSet(viewsets.ModelViewSet):
    """
    GET (list/retrieve) - open to everyone (guests browsing, product
    filters). Buyers/guests only ever see active categories; admins
    managing the list (Screen 36) see everything, active or not.

    POST/PUT/PATCH/DELETE - admin only, per the PRD's Category
    Management being an admin-only capability.
    """

    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, "role", None) == "admin":
            return Category.objects.all()
        return Category.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdmin()]
        return [AllowAny()]


class SellerProductViewSet(viewsets.ModelViewSet):
    """
    A verified seller's own product catalog (Screen 24 - Seller
    Products table; Screen 25/26 - Add/Edit Product). Scoped so a
    seller can only ever see/modify their own products - other
    sellers' products simply aren't in the queryset (404, not 403,
    so we don't leak that they exist).
    """

    serializer_class = ProductSerializer
    permission_classes = [IsVerifiedSeller]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ProductImageUploadView(APIView):
    """
    POST /api/products/my-products/<product_id>/images/
    Accepts one or more files under the 'images' form field.
    """

    permission_classes = [IsVerifiedSeller]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id, seller=request.user)
        except Product.DoesNotExist:
            return Response(
                {"success": False, "message": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        files = request.FILES.getlist("images")
        if not files:
            return Response(
                {"success": False, "message": "No images provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing_count = product.images.count()
        if existing_count + len(files) > MAX_IMAGES_PER_PRODUCT:
            return Response(
                {
                    "success": False,
                    "message": f"A product can have at most {MAX_IMAGES_PER_PRODUCT} images "
                    f"({existing_count} already uploaded).",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        created = []
        for f in files:
            is_primary = existing_count == 0 and not created
            img = ProductImage.objects.create(product=product, image=f, is_primary=is_primary)
            created.append(img)

        return Response(
            {
                "success": True,
                "message": "Images uploaded.",
                "images": ProductImageSerializer(created, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ProductImageDeleteView(APIView):
    """DELETE /api/products/my-products/<product_id>/images/<image_id>/"""

    permission_classes = [IsVerifiedSeller]

    def delete(self, request, product_id, image_id):
        try:
            image = ProductImage.objects.get(
                pk=image_id, product_id=product_id, product__seller=request.user
            )
        except ProductImage.DoesNotExist:
            return Response(
                {"success": False, "message": "Image not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        was_primary = image.is_primary
        image.delete()

        if was_primary:
            next_image = ProductImage.objects.filter(product_id=product_id).first()
            if next_image:
                next_image.is_primary = True
                next_image.save()

        return Response({"success": True, "message": "Image deleted."})


# ---------------------------------------------------------------------------
# Public - Product Browsing (guest/buyer facing, Screens 2 & 3)
# ---------------------------------------------------------------------------

class PublicProductListView(generics.ListAPIView):
    """
    GET /api/products/
    Only ever shows active products in active categories - a buyer/guest
    should never see a product a seller or admin has hidden.
    """

    serializer_class = PublicProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description"]
    ordering_fields = ["price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True, category__is_active=True)
            .select_related("category", "seller")
            .prefetch_related("images")
        )

    def get_serializer_context(self):
        return {"request": self.request}


class PublicProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<slug>/"""

    serializer_class = PublicProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, category__is_active=True
        ).select_related("category", "seller").prefetch_related("images")
