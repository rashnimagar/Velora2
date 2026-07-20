from rest_framework import serializers

from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "image", "is_active", "created_at"]
        read_only_fields = ["id", "slug", "created_at"]

    def validate_name(self, value):
        qs = Category.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A category with this name already exists.")
        return value


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_primary"]
        read_only_fields = ["id"]


class ProductSerializer(serializers.ModelSerializer):
    """Used for the seller's own product management (create/update/list/retrieve)."""

    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description", "price", "stock", "is_active",
            "category", "category_name", "images", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]

    def validate_category(self, value):
        if value is not None and not value.is_active:
            raise serializers.ValidationError("This category is not currently active.")
        return value


class PublicSellerSerializer(serializers.Serializer):
    """Minimal public seller info shown on a product's detail page."""

    username = serializers.CharField()
    id = serializers.IntegerField()


class PublicProductListSerializer(serializers.ModelSerializer):
    """Used for guest/buyer browsing - Product Listing grid (Screen 2/9)."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    primary_image = serializers.SerializerMethodField()
    seller_username = serializers.CharField(source="seller.username", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "price", "stock", "category_name",
            "primary_image", "seller_username",
        ]

    def get_primary_image(self, obj):
        request = self.context.get("request")
        primary = next((img for img in obj.images.all() if img.is_primary), None)
        if not primary:
            primary = obj.images.all()[0] if obj.images.all() else None
        if not primary:
            return None
        return request.build_absolute_uri(primary.image.url) if request else primary.image.url


class PublicProductDetailSerializer(serializers.ModelSerializer):
    """Used for the Product Details page (Screen 3)."""

    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    seller = PublicSellerSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description", "price", "stock",
            "category", "category_name", "images", "seller", "created_at",
        ]
