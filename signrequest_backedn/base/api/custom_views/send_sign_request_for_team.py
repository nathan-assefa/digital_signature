#!/user/bin/env python3
"""
*** Module: team_document_views ***

- This module defines Django REST Framework API endpoints related to
  team documents and signing requests for teams.
- It includes a view for sending signing requests for team documents.

*** Endpoints: ***
- POST /send-signing-request-for-team/<int:team_id>/ (Requires authentication)

*** Usage: ***
1. A user with proper authentication sends a POST request to create
   and send signing requests for team documents.
2. Uploaded documents are associated with the specified team through the
   creation of TeamDocument objects.
3. Emails containing signing links are sent to recipients.
4. If email sending fails at any point, database changes are rolled back
   to maintain a consistent state.

Note:
- The module relies on Django REST Framework, Django's database transactions,
  and TanStack's React Query for asynchronous data fetching.
- Logging is used to capture success and error messages during the email
  sending process.
- The 'transaction.atomic()' block ensures that either all changes in the block
  are committed or none, maintaining atomicity.
- Error responses with appropriate status codes are returned in case of failures.
"""

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from ..models import TeamDocument, ExternalRecipient, TeamDocumentSigning, Team
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

import json


import logging
from django.db import transaction


logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_signing_request_for_team(request, team_id):
    """
    Endpoint for sending signing requests for team documents.

    Args:
    - request: Django REST Framework request object.
    - team_id: Integer representing the ID of the target team.

    Returns:
    - JSON response indicating success or failure.

    Raises:
    - 404 Not Found: If the specified team ID does not exist.
    - 500 Internal Server Error: If an unexpected error occurs.
    """
    try:
        with transaction.atomic():
            data = request.data

            # Extract data from the request
            recipient_emails = json.loads(data.get("recipient_emails", []))
            message = data.get("message", [])

            # Access uploaded files
            uploaded_files = request.FILES.getlist("files")

            # Get the team
            try:
                team = Team.objects.filter(id=team_id).first()
            except Team.DoesNotExist:
                return Response(
                    {"error": f"Team with id {team_id} does not exist."}, status=404
                    )


            # Create Document objects
            documents = []
            for file in uploaded_files:
                document = TeamDocument.objects.create(
                    team=team, file=file, name=file.name, message=message
                )
                documents.append(document)

            recipients = []
            for recipient in recipient_emails:
                recipient, created = ExternalRecipient.objects.get_or_create(
                    email=recipient
                )
                recipients.append(recipient)

            # Link recipients to the documents through Signing
            for document in documents:
                for recipient in recipients:
                    signing = TeamDocumentSigning.objects.create(
                        document=document, recipient=recipient
                    )

                    link_app = f"http://localhost:5173/team/sign-documents/{signing.id}"

                    context = {
                        "link_app": link_app,
                    }

                    html_message = render_to_string("email.html", context=context)
                    plain_message = strip_tags(html_message)

                    message = EmailMultiAlternatives(
                        subject="Sign Request for Document",
                        body=plain_message,
                        from_email=None,
                        to=[recipient.email],
                    )

                    message.attach_alternative(html_message, "text/html")
                    try:
                        message.send()
                        # Log success or handle success scenario
                        logger.info(f"Email sent successfully to {recipient.email}")
                    except Exception as e:
                        # Log the error or handle the failure scenario
                        logger.error(
                            f"Failed to send email to {recipient.email}. Error: {str(e)}"
                        )

                        # Here, since email sending failed, we need to roll back all the changes
                        # made in the database to maintain a consistent environment.
                        transaction.set_rollback(True)

                        return Response(
                            {"error": "Failed to send signing request email."},
                            status=500,
                        )

        return Response({"message": "Signing requests sent successfully!"})
    except Exception as e:
        logger.error(f"Error in send_signing_request view. Error: {str(e)}")
        # Return a response with an error status code
        return Response({"error": "Internal server error."}, status=500)
