"""
Module: views.py

- This module defines a Django REST Framework view for listing signing
  documents.

View:
- `SigningDocumentListAPIView`: View for listing signing documents.

"""


from rest_framework import generics
from ..models import Signing
from ..serializers import  (
    SigningSerializer,
)

from base.api.permissions.document_permission import IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404


class SigningDocumentListAPIView(generics.ListAPIView):
    """
        View for listing signing documents.

        Attributes:
        - queryset: Queryset containing all Signing objects.
        - serializer_class: Serializer class for serializing Signing
          objects.
        - permission_classes: List of permission classes, including
          IsOwnerOrReadOnly.

        Methods:
        - get_queryset(): Custom method to filter the queryset based on
          the requesting user.
    """
    queryset = Signing.objects.all()
    serializer_class = SigningSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        # Filter queryset based on the user making the request
        return self.queryset.filter(document__owner=self.request.user)
    

class SigningDetailView(APIView):
    """
    API View to retrieve a Signing instance by ID.

    This view expects a GET request with the Signing instance ID provided as a path parameter.
    If the specified Signing instance is found, it returns the serialized data for that instance.
    If the instance is not found, it returns a 404 Not Found response.

    Endpoint: /api/signings/<int:signing_id>/

    HTTP Methods:
        - GET: Retrieve the Signing instance by ID.

    Response status codes:
        - 200 OK: Successful retrieval of the Signing instance.
        - 404 Not Found: If the specified Signing instance is not found.

    Example usage:
        - GET /api/signings/123/
          Response:
          {
            "id": 123,
            "field1": "value1",
            "field2": "value2",
            ...
          }
    """
    def get(self, request, signing_id):
          signing_instance = get_object_or_404(Signing, pk=signing_id)
          serializer = SigningSerializer(signing_instance)
          return Response(serializer.data, status=status.HTTP_200_OK)