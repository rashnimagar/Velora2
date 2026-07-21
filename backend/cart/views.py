from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import IsBuyer

from .models import CartItem
from .serializers import AddToCartSerializer, CartItemSerializer, UpdateCartItemSerializer


class CartView(APIView):
    """
    GET  /api/cart/          - list the buyer's cart with a computed total
    POST /api/cart/          - add a product (increments quantity if already present)
    """

    permission_classes = [IsBuyer]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user).select_related(
            "product", "product__seller"
        ).prefetch_related("product__images")
        serializer = CartItemSerializer(items, many=True, context={"request": request})
        total = sum(item.product.price * item.quantity for item in items)
        return Response({
            "success": True,
            "items": serializer.data,
            "total": str(total),
            "item_count": sum(item.quantity for item in items),
        })

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.product
        requested_qty = serializer.validated_data["quantity"]

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user, product=product, defaults={"quantity": 0}
        )
        new_quantity = cart_item.quantity + requested_qty
        if new_quantity > product.stock:
            return Response(
                {
                    "success": False,
                    "message": f"Only {product.stock} in stock "
                    f"({cart_item.quantity} already in your cart).",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity = new_quantity
        cart_item.save()
        return Response(
            {
                "success": True,
                "message": "Added to cart.",
                "item": CartItemSerializer(cart_item, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class CartItemDetailView(APIView):
    """
    PATCH  /api/cart/<id>/   - set an exact quantity (from the +/- selector)
    DELETE /api/cart/<id>/   - remove the line entirely
    """

    permission_classes = [IsBuyer]

    def _get_item(self, request, pk):
        return CartItem.objects.select_related("product").get(pk=pk, user=request.user)

    def patch(self, request, pk):
        try:
            item = self._get_item(request, pk)
        except CartItem.DoesNotExist:
            return Response(
                {"success": False, "message": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data["quantity"]

        if quantity > item.product.stock:
            return Response(
                {"success": False, "message": f"Only {item.product.stock} in stock."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item.quantity = quantity
        item.save()
        return Response(
            {"success": True, "item": CartItemSerializer(item, context={"request": request}).data}
        )

    def delete(self, request, pk):
        try:
            item = self._get_item(request, pk)
        except CartItem.DoesNotExist:
            return Response(
                {"success": False, "message": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        item.delete()
        return Response({"success": True, "message": "Removed from cart."})
