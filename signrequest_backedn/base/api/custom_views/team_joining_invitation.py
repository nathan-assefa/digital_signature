"""

Django view for handling team invitations.

Functions:
    - invite_user(request): Invites a user to join a specific team.

"""


from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import secrets
from django.http import JsonResponse
from django.utils import timezone
from ..models import Team, Invitation, TeamMembership
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from django.db import transaction
from base.api.utils.send_team_join_invitation import send_team_join_invitation


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def invite_user(request):
    """
    API endpoint for inviting a user to join a specific team.

    HTTP Method: POST

    Parameters:
        - 'email' (str): Email address of the user to be invited.
        - 'team_id' (int): ID of the team to which the user is invited.

    Returns:
        - JsonResponse: Response indicating success or failure.

    Raises:
        - JsonResponse: Error response with details if the invitation cannot be sent.

    Usage:
        - Invoked when a team owner wants to invite a user to join a specific team.
        - Generates a secure token for the invitation and sends an email to the user.

    Example:
        - POST /api/invite-user/
          Body: {'email': 'user@example.com', 'team_id': 1}
          Response: {'message': 'Invitation sent successfully'}

    Edge Cases:
        - Returns an error response if the provided email is invalid.
        - Returns an error response if the user is already a member of the team.
        - Returns an error response if the specified team does not exist or if
          the user is not the owner of the team.
        - Returns an error response if there is an issue during
          processing(ex: if emailing fails).

    """
    if request.method == "POST":
        try:
            # Ensure the user is authenticated
            if not request.user.is_authenticated:
                print(request.user)
                return JsonResponse({"error": "User is not authenticated"}, status=401)

            email = request.data.get("email")
            team_id = request.data.get("team_id")

            # Validate the email format using Django's EmailValidator
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({"error": "Invalid email address"}, status=400)

            # Get the team associated with the authenticated user
            user = request.user
            team = Team.objects.filter(id=team_id, owner=user).first()

            if not team:
                return JsonResponse(
                    {"error": "Invalid team ID or user is not the owner of the team"},
                    status=400,
                )

            # Check if the user already exists in the team
            if TeamMembership.objects.filter(team=team, user__email=email).exists():
                return JsonResponse(
                    {"error": "User is already a member of the team"}, status=400
                )

            # Generate a secure token for the invitation
            unique_token = secrets.token_urlsafe(32)

            # If an exception occurs within the block, the transaction will be rolled
            # back automatically. Django's transaction.atomic context manager is designed
            # to handle the rollback implicitly.
            with transaction.atomic():
                # Create an invitation record
                Invitation.objects.create(
                    team=team,
                    recipient_email=email,
                    token=unique_token,
                    created_at=timezone.now(),
                )

                # Send an email with the invitation link to the user
                send_team_join_invitation(email, team_id, unique_token)  # Call the email sending function

            return JsonResponse({"message": "Invitation sent successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)