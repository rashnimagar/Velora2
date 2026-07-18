import uuid

from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model providing created/updated timestamps.
    Every VELORA model should inherit from this instead of redefining
    these fields (Dev Guide: avoid duplicating code, keep things modular).
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """
    Abstract base model that swaps the default integer PK for a UUID.
    Useful for models exposed directly in public-facing URLs (e.g. orders)
    where sequential integer IDs would leak business volume.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True
