"""
ASGI config for the VELORA project.

Exposes a ProtocolTypeRouter so HTTP is handled by Django as normal and
WebSocket connections (real-time messaging) are handled by Channels.
The actual websocket_urlpatterns are wired up in the Messaging feature step;
for now this points at an empty router so the project runs cleanly.
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    # "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    # ^ wired up in the Messaging step
})
