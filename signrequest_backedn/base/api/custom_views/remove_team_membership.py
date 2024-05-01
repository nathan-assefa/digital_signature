"""
Module: team_management.views

This module contains API views related to team management.

Classes:
    - RemoveTeamMembers(APIView): API view for removing users from a
      specific team.

"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import Team
from django.contrib.auth.models import User

class RemoveTeamMembers(APIView):
    """
    API View to remove users from a specific team.

    Attributes:
        None

    Methods:
        - delete(request, team_id): Handles the DELETE request
          to remove users from a team.

    """

    def delete(self, request, team_id):
        """
        Handles the DELETE request to remove users from a team.

        Args:
            - request (HttpRequest): The HTTP request object.
            - team_id (int): The ID of the team from which users will be
              removed.

        Returns:
            - Response: The HTTP response indicating the success or
              failure of the operation.

        """
        # Extract user IDs from the request data
        user_ids = request.data.get('user_ids', [])

        try:
            # Get the team
            team = get_object_or_404(Team, pk=team_id)

            # Check if the requesting user is the owner of the team
            if request.user != team.owner:
                return Response({'detail': 'You are not the owner of this team.'}, status=status.HTTP_403_FORBIDDEN)

            # Get the users to be removed
            users_to_remove = User.objects.filter(pk__in=user_ids)

            # Remove the users from the team
            team.members.remove(*users_to_remove)

            return Response({'detail': 'Users removed from the team successfully.'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
