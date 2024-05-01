"""
Module: signing_views.py

- This module defines Django REST Framework views for handling the signing of
  documents and updating their status.
- It includes a class-based view `SigningDocumentDetailAPIView` responsible
  for retrieving and updating signing instances.

Usage:
1. The `SigningDocumentDetailAPIView` class handles the retrieval and update
   of signing instances.
2. Users can send a PATCH request with the required data to sign a document and
   change its status.
3. Confirmation emails are sent to both the sender and recipient of the document
   upon successful signing.
4. Both the sender and recipient will have a log of the document for evidential
   purposes.

"""


from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from ..models import Signing
from ..serializers import (
    SigningSerializer,
)

from rest_framework import status

from base.api.utils.document_log_generator import generate_and_save_pdf
from base.api.utils.send_confirmation_email import send_confirmation_email

import logging
from django.db import transaction


logger = logging.getLogger(__name__)


class SigningDocumentDetailAPIView(generics.RetrieveUpdateAPIView):
    """
    Handle PATCH requests to sign a document and update its status.

    Args:
    - request: The HTTP request object.
    - *args: Additional positional arguments.
    - **kwargs: Additional keyword arguments.

    Returns:
    - Response: HTTP response indicating the result of the update.
    """

    queryset = Signing.objects.all()
    serializer_class = SigningSerializer
    lookup_field = "id"

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            signing_instance = self.get_object()

            # Check if both 'signature' and 'is_signed' fields are present in the request data
            signature_image = request.data.get("signature", None)
            is_signed = request.data.get("is_signed", None)

            if signature_image and is_signed:
                signing_instance.signature_image_url = signature_image
                signing_instance.is_signed = True
                generate_and_save_pdf(signing_instance)
                signing_instance.save()

                # Send confirmation emails to both sender and receiver
                send_confirmation_email(
                    signing_instance.document.owner.email,
                    signing_instance.recipient.email,
                    signing_instance.id,
                )

                return Response(
                    {"detail": "Document signed successfully."},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"detail": "Signature and is_signed fields are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            logger.error(f"Error updating signing document. Error: {str(e)}")
            transaction.set_rollback(True)
            return Response(
                {"error": "Internal server error."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
