"""
Module: team_document_views

- This module contains views related to team documents in a Django
  REST framework API.

Classes:
    - ListTeamDocumentsView: A view class that retrieves and serializes
                             TeamDocumentSigning instances associated with
                             a specific team.
    - ListAllTeamDocumentsView: A view class that retrieves and serializes
                                all TeamDocumentSigning instances
                                without being specific to a single team.

Note: This module assumes the existence of the following:
    - Models: TeamDocumentSigning
    - Serializers: TeamSigningSerializer
"""

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import TeamDocumentSigning
from ..serializers import TeamSigningSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class ListTeamDocumentsView(ListAPIView):
    """
    - View class for listing TeamDocumentSigning instances related to a
      specific team.

    Attributes:
        - serializer_class (class): The serializer class to use for
          serializing the data.
        - permission_classes (list): The list of permission classes
          required for accessing the view.

    Methods:
        - get_queryset(): Returns a queryset of TeamDocumentSigning instances
          filtered by team_id.
        - list(request, *args, **kwargs): Retrieves and serializes the queryset,
          then returns the response.
    """
    serializer_class = TeamSigningSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Returns a queryset of TeamDocumentSigning instances filtered by team_id.

        Returns:
            queryset: A filtered queryset of TeamDocumentSigning instances.
        """
        # Filter documents based on the team_id parameter
        team_id = self.kwargs.get('team_id')
        # Here, we are filtering TeamDocumentSigning instances based on the related Team
        # through the document foreign key. The __team_id part is referencing the
        # team field in the TeamDocument model.
        return TeamDocumentSigning.objects.filter(document__team_id=team_id)
    
    def list(self, request, *args, **kwargs):
        """
        Retrieves and serializes the queryset, then returns the response.

        Args:
            request: The HTTP request object.
            args: Additional positional arguments.
            kwargs: Additional keyword arguments.

        Returns:
            Response: The serialized data wrapped in a Response object.
        """
        queryset = self.get_queryset()

        # Serialize the team documents data
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

class ListAllTeamDocumentsView(ListAPIView):
    """
    View class for listing all TeamDocumentSigning instances.

    Attributes:
        - queryset (queryset): The queryset of all TeamDocumentSigning
          instances.
        - serializer_class (class): The serializer class to use for
          serializing the data.
        - permission_classes (list): The list of permission classes
          required for accessing the view.
    """
    queryset = TeamDocumentSigning.objects.all()
    serializer_class = TeamSigningSerializer
    permission_classes = [IsAuthenticated]


class TeamDocumentSigningDetailView(APIView):
    """
    API View to retrieve a TeamDocumentSigning instance by ID.

    This view expects a GET request with the TeamDocumentSigning instance ID provided as a path parameter.
    If the specified TeamDocumentSigning instance is found, it returns the serialized data for that instance.
    If the instance is not found, it returns a 404 Not Found response.

    Endpoint: /api/team-document-signings/<int:document_signing_id>/

    HTTP Methods:
        - GET: Retrieve the TeamDocumentSigning instance by ID.

    Response status codes:
        - 200 OK: Successful retrieval of the TeamDocumentSigning instance.
        - 404 Not Found: If the specified TeamDocumentSigning instance is not found.

    Example usage:
        - GET /api/team-document-signings/456/
          Response:
          {
            "id": 456,
            "field1": "value1",
            "field2": "value2",
            ...
          }
    """
    def get(self, request, document_signing_id):
        # Get the TeamDocumentSigning instance by ID or return 404 if not found
        document_signing = get_object_or_404(TeamDocumentSigning, pk=document_signing_id)

        # Serialize the TeamDocumentSigning instance
        serializer = TeamSigningSerializer(document_signing)

        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)

