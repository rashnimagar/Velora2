"""
VELORA root URL configuration.

Each app owns its own urls.py; this file just namespaces them under /api/.
Apps are wired in here as each feature step builds them out.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(request):
    return JsonResponse({"status": "ok", "service": "velora-backend"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check),

    path('api/auth/', include('users.urls')),
    path('api/sellers/', include('sellers.urls')),
    path('api/products/', include('products.urls')),
    # path('api/cart/', include('cart.urls')),             # Cart step
    # path('api/wishlist/', include('wishlist.urls')),     # Wishlist step
    # path('api/orders/', include('orders.urls')),         # Orders step
    # path('api/messages/', include('messaging.urls')),    # Messaging step
    # path('api/reviews/', include('reviews.urls')),       # Reviews step
    # path('api/admin-panel/', include('admin_panel.urls')),  # Admin dashboards step
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
