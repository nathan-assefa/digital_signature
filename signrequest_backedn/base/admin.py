"""
    Module: admin.py

    This module registers Django models with the Django admin site.

    Models Registered:
    - `UploadedDocument`: Model for uploaded documents.
    - `ExternalRecipient`: Model for external recipients.
    - `Signing`: Model for signatory relationships between
      documents and recipients.
    - `Profile`: Model for user profiles.

"""

from django.contrib import admin
from base.api.models import (
    UploadedDocument,
    ExternalRecipient,
    Signing,
    Profile,
    Team,
    TeamMembership,
    Invitation,
    TeamDocument,
    TeamDocumentSigning
)

# Register your models here.
admin.site.register(UploadedDocument)
admin.site.register(ExternalRecipient)
admin.site.register(Signing)
admin.site.register(Profile)
admin.site.register(Team)
admin.site.register(TeamMembership),
admin.site.register(Invitation)
admin.site.register(TeamDocument)
admin.site.register(TeamDocumentSigning)
