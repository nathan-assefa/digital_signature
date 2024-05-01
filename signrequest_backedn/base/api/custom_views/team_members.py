"""
Module: team_membership_api

- This module defines API views for managing team memberships
  using Django REST Framework.

Classes:
    TeamMembershipListCreateAPIView (generics.ListCreateAPIView):
        API view for listing all team memberships and creating a new team membership.

        Endpoint:
            GET /api/team-memberships/ - List all team memberships
            POST /api/team-memberships/ - Create a new team membership

    TeamMembershipRetrieveUpdateDestroyAPIView (generics.RetrieveUpdateDestroyAPIView):
        API view for retrieving, updating, and deleting a specific team membership.

        Endpoint:
            GET /api/team-memberships/{id}/ - Retrieve a specific team membership
            PUT /api/team-memberships/{id}/ - Update a specific team membership
            PATCH /api/team-memberships/{id}/ - Partially update a specific team membership
            DELETE /api/team-memberships/{id}/ - Delete a specific team membership

Usage:
    - These views can be included in the Django project's URL configuration
      to expose API endpoints
    - for managing team memberships. Additionally, they can be used with the
      Django REST Framework's
    - authentication and permission classes to control access to these endpoints.
"""


from rest_framework import generics
from ..models import TeamMembership
from ..serializers import TeamMembershipSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class TeamMembershipListCreateAPIView(generics.ListCreateAPIView):
    """
    API view for listing all team memberships and creating a new team membership.

    Endpoint:
        GET /api/team-memberships/ - List all team memberships
        POST /api/team-memberships/ - Create a new team membership
    """

    queryset = TeamMembership.objects.all()
    serializer_class = TeamMembershipSerializer


class TeamMembershipRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting a specific team membership.

    Endpoint:
        GET /api/team-memberships/{id}/ - Retrieve a specific team membership
        PUT /api/team-memberships/{id}/ - Update a specific team membership
        PATCH /api/team-memberships/{id}/ - Partially update a specific team membership
        DELETE /api/team-memberships/{id}/ - Delete a specific team membership
    """

    queryset = TeamMembership.objects.all()
    serializer_class = TeamMembershipSerializer


class TeamMembershipAPIView(APIView):
    """
    API view for fetching team memberships for a specific user.

    Endpoint:
        GET /api/team-memberships/<int:user_id>/ - Fetch team memberships for a user.

    Attributes:
        - None

    Methods:
        - get(self, request, user_id, format=None): Handles GET requests to fetch team memberships.

    Response:
        - 200 OK: Returns a list of team memberships for the specified user.
        - 404 NOT FOUND: If the user is not found or has no team memberships.
        - 500 INTERNAL SERVER ERROR: If there's an internal server error during the process.
    """
    def get(self, request, user_id, format=None):
        """
        Handles GET requests to fetch team memberships.

        Args:
            - request (HttpRequest): The HTTP request object.
            - user_id (int): The user ID for whom to fetch team memberships.
            - format (str, optional): The requested response format (default is None).

        Returns:
            - Response: JSON response containing the team memberships or an error message.
        """
        try:
            # Fetch team memberships for the user
            team_memberships = TeamMembership.objects.filter(user_id=user_id)
            
            # Serialize the data
            serializer = TeamMembershipSerializer(team_memberships, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TeamMembership.DoesNotExist:
            return Response({'detail': 'User not found or has no team memberships.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
