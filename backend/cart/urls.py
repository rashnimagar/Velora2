from django.urls import path

from .views import CartItemDetailView, CartView

urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("<int:pk>/", CartItemDetailView.as_view(), name="cart-item-detail"),
]
