from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from common.models import TimeStampedModel
from products.models import Product


class CartItem(TimeStampedModel):
    """
    One line in a buyer's cart. Per the PRD's business rules, a cart
    belongs only to a buyer, and there's no separate Cart model - the
    buyer's cart is simply "all their CartItem rows."
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart_items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])

    class Meta:
        unique_together = ("user", "product")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.product.name} x{self.quantity}"
