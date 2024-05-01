"""
Module: urls.py

This module defines Django URLs for various API endpoints.

Endpoints:
- `/register/`: POST endpoint for user registration.
- `/token/`: POST endpoint for obtaining JWT tokens for authentication.
- `/token/refresh/`: POST endpoint for refreshing JWT tokens.
- `/`: GET endpoint for a simple "hello" message.
- `/send-signing-request/`: POST endpoint for sending signing requests.
- `/sign-documents/`: GET endpoint for listing
   signing documents.
- `/sign-documents/<int:id>/`: PATCH endpoint for updating details of a
   specific signing document.
- `/profile/`: GET endpoint for retrieving the user profile.

"""


from django.urls import path, include
from .views import (
    hello,
    send_signing_request,
    MyTokenObtainPairView,
    register_user,
    SigningDocumentListAPIView,
    SigningDocumentDetailAPIView,
    GetUserProfile,
    UpdateProfile,
    TeamRetrieveUpdateDestroyAPIView,
    TeamListCreateAPIView,
    team_members,
    TeamMembershipListCreateAPIView,
    TeamMembershipAPIView,
    invite_user,
    accept_invitation,
    ListTeamDocumentsView,
    send_signing_request_for_team,
    ListAllTeamDocumentsView,
    TeamSigningDocumentDetailAPIView,
    RemoveDocumentsView,
    RemoveTeamDocumentsView,
    RemoveTeamMembers,
    SigningDetailView,
    TeamDocumentSigningDetailView
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register_user, name='register_user'),

    path('token/', MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', hello, name='hello'),
    path('send-signing-request/', send_signing_request, name='send-signing-request'),
    path('sign-documents/', SigningDocumentListAPIView.as_view(), name='signing_document_list_create'),
    path('sign-documents/<int:id>/', SigningDocumentDetailAPIView.as_view(), name='signing-document-detail'),
    path('profile/', GetUserProfile.as_view(), name="user_profile"),
    path('update-profile/', UpdateProfile.as_view(), name='update_profile'),
    path('remove_documents/', RemoveDocumentsView.as_view(), name='remove_documents'),

    path('signings/<int:signing_id>/', SigningDetailView.as_view(), name='signing-detail'),

    # Teams
    path('teams/', TeamListCreateAPIView.as_view(), name='team-list-create'),
    path('teams/<int:pk>/', TeamRetrieveUpdateDestroyAPIView.as_view(), name='team-retrieve-update-destroy'),

    # Team Members
    path('teams/<int:pk>/members/', team_members, name='team-members'),
    path('team-memberships/', TeamMembershipListCreateAPIView.as_view(), name='team-membership-list-create'),
    path('team-memberships/<int:user_id>/', TeamMembershipAPIView.as_view(), name='team-memberships-api'),
    path('invite-user/', invite_user, name='invite_user'),
    path('accept-invitation/', accept_invitation, name='accept_invitation'),

    # Team documents
    path('list-team-documents/<int:team_id>/', ListTeamDocumentsView.as_view(), name='list-team-documents'),
    path('team-document-signing/<int:document_signing_id>/', TeamDocumentSigningDetailView.as_view(), name='team-document-signing-detail'),
    path('team/<int:team_id>/send-signing-request/', send_signing_request_for_team, name='send_signing_request_for_team'),
    path('all-team-documents/', ListAllTeamDocumentsView.as_view(), name='list-all-team-documents'),
    path('team/team-sign-documents/<int:id>/', TeamSigningDocumentDetailAPIView.as_view(), name='team-signing-document-detail'),
    path('remove-team-documents/', RemoveTeamDocumentsView.as_view(), name='remove_team_documents'),
    path('remove_team_members/<team_id>/', RemoveTeamMembers.as_view(), name='remove_team_members'),
]