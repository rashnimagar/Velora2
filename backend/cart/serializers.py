from rest_framework import serializers

from products.models import Product

from .models import CartItem


class CartProductSerializer(serializers.ModelSerializer):
    """Minimal product snapshot shown inside a cart item."""

    primary_image = serializers.SerializerMethodField()
    seller_username = serializers.CharField(source="seller.username", read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "price", "stock", "is_active", "primary_image", "seller_username"]

    def get_primary_image(self, obj):
        request = self.context.get("request")
        primary = next((img for img in obj.images.all() if img.is_primary), None)
        if not primary:
            primary = obj.images.all()[0] if obj.images.all() else None
        if not primary:
            return None
        return request.build_absolute_uri(primary.image.url) if request else primary.image.url


class CartItemSerializer(serializers.ModelSerializer):
    product = CartProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "subtotal", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_subtotal(self, obj):
        return str(obj.product.price * obj.quantity)


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(pk=value, is_active=True, category__is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("This product is not available.")
        self.product = product
        return value


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
