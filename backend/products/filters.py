import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    """
    Powers the Product Listing page's filters (Screen 2):
    category, price range. Search (name) and ordering are handled
    separately via DRF's SearchFilter/OrderingFilter.
    """

    category = django_filters.NumberFilter(field_name="category_id")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["category", "min_price", "max_price"]
