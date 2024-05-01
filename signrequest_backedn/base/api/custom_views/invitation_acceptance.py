"""
Module: views.py
Django views for handling team invitations and membership.

Functions:
    - accept_invitation(request): Accepts an invitation to join a team.

"""

from django.http import JsonResponse
from ..models import TeamMembership, Invitation
from django.utils import timezone
from datetime import timedelta

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_invitation(request):
    """
    API endpoint for accepting an invitation to join a team.

    HTTP Method: POST

    Parameters:
        - 'token' (str): Unique token associated with the invitation.

    Returns:
        - JsonResponse: Response indicating success or failure.

    Raises:
        - JsonResponse: Error response with details if the invitation is not valid.

    Usage:
        - Invoked when a user clicks on an invitation link to join a team.
        - Validates the invitation token, checks membership status, and allows
          the user to join the team.

    Example:
        - POST /api/accept-invitation/
          Body: {'token': 'unique_token'}
          Response: {'message': 'Invitation accepted successfully'}

    Edge Cases:
        - Returns an error response if the invitation has already been accepted.
        - Returns an error response if the invitation token is invalid or expired.
        - Returns an error response if the user is already a member of the team.
        - Returns an error response if there is an issue during processing.

    """
    if request.method == "POST":
        try:
            token = request.data.get("token")
            # token = request.query_params.get("token")
            invitation = Invitation.objects.get(token=token)

            # Validate the invitation
            if invitation.accepted:
                return JsonResponse(
                    {"error": "Invitation has already been accepted"}, status=400
                )

            # Check if the invitation has expired
            if invitation.updated_at < timezone.now() - timedelta(
                days=7
            ):
                return JsonResponse({"error": "Invitation has expired"}, status=400)

            # Extract the user from the request (if a user is authenticated)
            user = request.user

            # Check if the user is not already a member of the team
            if not TeamMembership.objects.filter(
                team=invitation.team, user=user
            ).exists():
                # Allow the user to join the team
                TeamMembership.objects.create(
                    team=invitation.team, user=user, role=TeamMembership.ROLE_MEMBER
                )

                # Mark the invitation as accepted
                invitation.accepted = True
                invitation.save()

                return JsonResponse({"message": "Invitation accepted successfully"})
            else:
                return JsonResponse(
                    {"error": "User is already a member of the team"}, status=400
                )

        except Invitation.DoesNotExist:
            return JsonResponse({"error": "Invalid invitation token"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
