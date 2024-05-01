"""
    Module: send_confirmation_email.py

    - This module provides a function for sending confirmation emails
    to both the sender and receiver after a document has been signed.

    Functions:
    - `send_confirmation_email(sender_email, receiver_email, sign_id)`:
      Function to send confirmation emails.

    Dependencies:
    - `django.core.mail.EmailMultiAlternatives`: Django's EmailMultiAlternatives
      class for sending HTML emails.
    - `django.template.loader.render_to_string`: Function to render templates to
      a string.
    - `django.utils.html.strip_tags`: Function to strip HTML tags from a string.
"""

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_team_confirmation_email(receiver_email, sign_id, team_id):
    """
        - Function to send confirmation emails to both the sender and
          receiver after a document has been signed.

        Args:
        - sender_email: Email address of the sender.
        - receiver_email: Email address of the receiver.
        - sign_id: ID of the signing instance.

        Returns:
        - None

        Example Usage:
        ```
        send_confirmation_email("sender@example.com", "receiver@example.com", 1)
        ```

        This function sends confirmation emails to both the sender and receiver
        with links to the home page and the document log files.
    """
    home_page = "http://localhost:5173/"
    log_files = f"http://localhost:5173/team/download-document-log-file/{team_id}/{sign_id}"

    context = {
        "home_page": home_page,
        "log_files": log_files
    }

    # Receiver email
    html_message_receiver = render_to_string("confirmation.html", context=context)
    plain_message_receiver = strip_tags(html_message_receiver)

    message_receiver = EmailMultiAlternatives(
        subject="Sign Request Document Signed", 
        body=plain_message_receiver,
        from_email=None,
        to=[receiver_email]
    )

    message_receiver.attach_alternative(html_message_receiver, "text/html")
    message_receiver.send()
