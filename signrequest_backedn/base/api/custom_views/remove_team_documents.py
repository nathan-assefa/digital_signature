"""
Module: views.py
Description: Contains Django REST Framework views for handling team document removal.
"""

from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from ..models import TeamDocumentSigning
from ..serializers import TeamSigningSerializer
from django.core.exceptions import ObjectDoesNotExist

import json

class RemoveTeamDocumentsView(generics.DestroyAPIView):
    """
    View for removing a list of TeamDocumentSigning instances based on provided IDs.

    This view expects a JSON payload in the request body with a key named 'signing_ids',
    containing a list of TeamDocumentSigning IDs that you want to delete.

    If successful, it returns a 204 No Content response. If any specified
    TeamDocumentSigning instances are not found, it returns a 404 Not Found response.
    """
    queryset = TeamDocumentSigning.objects.all()
    serializer_class = TeamSigningSerializer

    def delete(self, request, *args, **kwargs):
        try:
            signing_ids = request.data.get('signed_ids', [])
            print("signing_IDS: ", signing_ids)

            signing_ids = [int(signing_id) for signing_id in signing_ids]

            # Remove Signing instances with the specified IDs
            signers = TeamDocumentSigning.objects.filter(id__in=signing_ids)
            signers.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except json.JSONDecodeError:
            return Response({'detail': 'Invalid JSON format for signing IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return Response({'detail': 'Invalid data format for signing IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        except ObjectDoesNotExist:
            return Response({'detail': 'One or more Signing instances not found.'}, status=status.HTTP_404_NOT_FOUND)