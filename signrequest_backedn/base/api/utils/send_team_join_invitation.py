from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.crypto import get_random_string


def send_team_join_invitation(receiver_email, team_id, invitation_token):
    home_page = "http://localhost:5173"

    invitation_link = f"{home_page}/accept-invitation/?token={invitation_token}&team_id={team_id}"

    context = {
        "home_page": home_page,
        "invitation_link": invitation_link
    }

    # Receiver email
    html_message_receiver = render_to_string("team_invitation.html", context=context)
    plain_message_receiver = strip_tags(html_message_receiver)

    subject = "Join Our Team Invitation"  # Adjust the subject as needed

    message_receiver = EmailMultiAlternatives(
        subject=subject,
        body=plain_message_receiver,
        from_email=None,
        to=[receiver_email]
    )

    message_receiver.attach_alternative(html_message_receiver, "text/html")
    message_receiver.send()
