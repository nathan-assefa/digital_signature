from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from ..models import TeamDocumentSigning
from ..serializers import (
    TeamSigningSerializer,
)

from rest_framework import status

from base.api.utils.team_document_log_generator import generate_and_save_team_document_log
from base.api.utils.send_team_confirmation_email import send_team_confirmation_email

import logging
from django.db import transaction


logger = logging.getLogger(__name__)


class TeamSigningDocumentDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = TeamDocumentSigning.objects.all()
    serializer_class = TeamSigningSerializer
    lookup_field = "id"
    print("outtt")

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            print("ininsgsgsdin")
            signing_instance = self.get_object()
            print("signigning instance: " , signing_instance)

            # Check if both 'signature' and 'is_signed' fields
            # are present in the request data
            signature_image = request.data.get("signature", None)
            is_signed = request.data.get("is_signed", None)

            if signature_image and is_signed:
                signing_instance.signature_image_url = signature_image
                signing_instance.is_signed = True
                generate_and_save_team_document_log(signing_instance)
                signing_instance.save()

                # Send confirmation emails to both sender and receiver
                send_team_confirmation_email(
                    signing_instance.recipient.email,
                    signing_instance.id,
                    signing_instance.document.team.id
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
