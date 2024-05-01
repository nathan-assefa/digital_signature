"""
    Module: views.py

    - This module defines Django REST Framework views for various functionalities
      related to user authentication, document signing, and more.

    Views:
    - `MyTokenObtainPairSerializer`: Custom TokenObtainPairSerializer adding
      custom claims to JWT tokens.
    - `MyTokenObtainPairView`: Custom TokenObtainPairView using the custom
      serializer.
    - `hello`: Function-based view for rendering a simple HTML page.
    - `register_user`: Function-based view for user registration.
    - `GetUserProfile`: Class-based view for retrieving user profiles.
    - `send_signing_request`: Function-based view for sending signing requests.
    - `SigningDocumentDetailAPIView`: Class-based view for retrieving details
      of a specific signing document.
    - `SigningDocumentListAPIView`: Class-based view for listing signing documents.

    Dependencies:
    - Various utility functions imported for generating PDF document logs and
      sending confirmation emails.
"""


from django.shortcuts import render
from rest_framework.decorators import api_view


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from base.api.utils.document_log_generator import generate_and_save_pdf
from base.api.utils.send_confirmation_email import send_confirmation_email


from base.api.custom_views.user_register import register_user 
from base.api.custom_views.user_profile import GetUserProfile, UpdateProfile
from base.api.custom_views.send_sign_request import send_signing_request
from base.api.custom_views.sign_document import SigningDocumentDetailAPIView
from base.api.custom_views.list_all_documents import SigningDocumentListAPIView
from base.api.custom_views.team import(
    TeamRetrieveUpdateDestroyAPIView,
    TeamListCreateAPIView,
    team_members
)
from base.api.custom_views.team_members import (
    TeamMembershipListCreateAPIView,
    TeamMembershipAPIView,
)
from base.api.custom_views.team_joining_invitation import invite_user
from base.api.custom_views.invitation_acceptance import accept_invitation
from base.api.custom_views.list_team_documents import ListTeamDocumentsView, ListAllTeamDocumentsView
from base.api.custom_views.send_sign_request_for_team import send_signing_request_for_team
from base.api.custom_views.team_sign_document import TeamSigningDocumentDetailAPIView
from base.api.custom_views.remove_documents import RemoveDocumentsView
from base.api.custom_views.remove_team_documents import RemoveTeamDocumentsView
from base.api.custom_views.remove_team_membership import RemoveTeamMembers
from base.api.custom_views.list_all_documents import SigningDetailView
from base.api.custom_views.list_team_documents import TeamDocumentSigningDetailView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def hello(request):
    # return Response("Hello world")
    return render(request, 'email.html')
