"""
Consistent API error responses across VELORA.

Per the Development Guide: "Return consistent API responses" and
"User-friendly error messages." Every error from the API — validation,
permission, auth, not-found, or unhandled server error — comes back in
the same shape:

    {
        "success": false,
        "message": "Human readable summary",
        "errors": { ... field-level or detail errors ... }
    }
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        # Unhandled exception -> don't leak internals, return a generic 500.
        return Response(
            {
                "success": False,
                "message": "Something went wrong. Please try again.",
                "errors": None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    message = "Request failed."
    if response.status_code == status.HTTP_401_UNAUTHORIZED:
        message = "Authentication required or credentials invalid."
    elif response.status_code == status.HTTP_403_FORBIDDEN:
        message = "You don't have permission to perform this action."
    elif response.status_code == status.HTTP_404_NOT_FOUND:
        message = "The requested resource was not found."
    elif response.status_code == status.HTTP_400_BAD_REQUEST:
        message = "Please check the submitted data."

    response.data = {
        "success": False,
        "message": message,
        "errors": response.data,
    }
    return response
