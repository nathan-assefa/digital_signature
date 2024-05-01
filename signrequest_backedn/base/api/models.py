"""
    Module: models.py

    - This module defines Django models for user profiles, external
      recipients, uploaded documents, and signing relationships.

    Models:
    - `Profile`: Model representing user profiles.
    - `ExternalRecipient`: Model representing external recipients.
    - `UploadedDocument`: Model representing uploaded documents.
    - `Signing`: Model representing signing relationships between
       documents and recipients.
"""

from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """
    Model representing user profiles.

    Attributes:
    - created_at: DateTimeField recording the creation timestamp.
    - updated_at: DateTimeField recording the last update timestamp.
    - user: OneToOneField linking to the User model, creating a
      one-to-one relationship.

    Methods:
    - __str__(): Returns a string representation of the profile.
    """

    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    def __str__(self):
        return self.user.username


class ExternalRecipient(models.Model):
    """
    Model representing external recipients.

    Attributes:
    - email: EmailField storing the recipient's email address.

    Methods:
    - __str__(): Returns a string representation of the external
      recipient.
    """

    email = models.EmailField()

    def __str__(self):
        return self.email


class UploadedDocument(models.Model):
    """
    Model representing uploaded documents.

    Attributes:
    - name: CharField storing the document name.
    - file: FileField storing the uploaded document file.
    - owner: ForeignKey linking to the User model, establishing a
      many-to-one relationship.
    - message: TextField storing a default message for the document.
    - signings: ManyToManyField linking to ExternalRecipient through the
      Signing model.
    - date_uploaded: DateTimeField recording the document's upload timestamp.

    Methods:
    - __str__(): Returns a string representation of the uploaded document.
    """

    name = models.CharField(max_length=500, default="Unknown")
    file = models.FileField(upload_to="uploaded_documents/", blank=True, null=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="owned_documents",
    )
    message = models.TextField(default="Default message")
    signings = models.ManyToManyField(
        ExternalRecipient,
        through="Signing",
        related_name="signed_documents",
        blank=True,
    )
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Uploaded document: {self.owner.username}"


class Signing(models.Model):
    """
    - Model representing signing relationships between documents and
      recipients.

    Attributes:
    - document: ForeignKey linking to the UploadedDocument model.
    - recipient: ForeignKey linking to the ExternalRecipient model.
    - is_signed: BooleanField indicating whether the document is signed.
    - signature: ImageField storing the signature image.
    - signature_image_url: URLField storing the URL of the signature image.
    - document_log_file: FileField storing the generated PDF document log file.
    - date_requested: DateTimeField recording the signing request timestamp.

    Methods:
    - __str__(): Returns a string representation of the signing relationship.
    """

    document = models.ForeignKey(UploadedDocument, on_delete=models.CASCADE)
    recipient = models.ForeignKey(ExternalRecipient, on_delete=models.CASCADE)
    is_signed = models.BooleanField(default=False)
    signature = models.ImageField(
        upload_to="document-signatures/", blank=True, null=True
    )
    signature_image_url = models.URLField(blank=True, null=True)
    document_log_file = models.FileField(
        upload_to="generated-pdfs/", blank=True, null=True
    )

    date_requested = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Owner: {self.document.owner} - recipient email: {self.recipient.email}"


class Team(models.Model):
    """
    Model representing a team in the application.

    Attributes:
        name (str): The name of the team.
        owner (User): The user who owns the team.
        members (ManyToManyField): The members of the team, associated through TeamMembership.
        website (str, optional): The team's website.
        phoneNumber (str, optional): The team's phone number.
        team_logo (ImageField, optional): The team's logo as an image.
        created_at (DateTimeField): The date and time when the team was created.
        updated_at (DateTimeField): The date and time when the team was last updated.
    """

    name = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_teams"
    )
    members = models.ManyToManyField(
        User, related_name="teams", through="TeamMembership"
    )
    website = models.URLField(null=True, blank=True)
    phoneNumber = models.CharField(max_length=20, null=True, blank=True)
    team_logo = models.ImageField(upload_to="team_logos/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (Owner: {self.owner.username})"


class TeamMembership(models.Model):
    """
    Model representing the membership of a user in a team.

    Attributes:
        ROLE_ADMIN (str): Constant representing the 'admin' role (equivalent to owner).
        ROLE_MEMBER (str): Constant representing the 'member' role.

        team (ForeignKey): The team to which the user belongs.
        user (ForeignKey): The user who is a member of the team.
        role (CharField): The role of the user in the team (admin or member).
        created_at (DateTimeField): The date and time when the team membership was created.
    """

    ROLE_ADMIN = "admin"
    ROLE_MEMBER = "member"

    ROLE_CHOICES = [
        (ROLE_ADMIN, "Admin"),
        (ROLE_MEMBER, "Member"),
    ]

    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.role} of {self.team.name}"


class TeamDocument(models.Model):
    """
    Model representing documents within a team.

    Attributes:
        name (str): The name of the document.
        file (FileField, optional): The uploaded document file.
        team (ForeignKey): The team to which the document belongs.
        message (TextField): A default message for the document.
        team_document_signings (ManyToManyField): Signing relationships with external recipients.
        date_uploaded (DateTimeField): The timestamp when the document was uploaded.

    Methods:
        __str__(): Returns a string representation of the TeamDocument.
    """
    name = models.CharField(max_length=500, default="Unknown")
    file = models.FileField(upload_to="uploaded_documents/", blank=True, null=True)
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name="team_documents"
    )
    message = models.TextField(default="Default message")
    team_document_signings = models.ManyToManyField(
        ExternalRecipient,
        through="TeamDocumentSigning",
        related_name="team_signed_documents",
        blank=True,
    )
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TeamDocument: {self.name} - Team: {self.team.name}"


class TeamDocumentSigning(models.Model):
    """
    Model representing signing relationships for team documents.

    Attributes:
        document (ForeignKey): The team document being signed.
        recipient (ForeignKey): The external recipient involved in the signing.
        is_signed (BooleanField): Indicates whether the document is signed.
        signature (ImageField, optional): The signature image.
        signature_image_url (URLField, optional): The URL of the signature image.
        document_log_file (FileField, optional): The generated PDF document log file.
        date_requested (DateTimeField): The timestamp when the signing request was made.

    Methods:
        __str__(): Returns a string representation of the TeamDocumentSigning.
    """
    document = models.ForeignKey(
        TeamDocument, on_delete=models.CASCADE, related_name="document_signings"
    )
    recipient = models.ForeignKey(ExternalRecipient, on_delete=models.CASCADE)
    is_signed = models.BooleanField(default=False)
    signature = models.ImageField(
        upload_to="team-document-signatures/", blank=True, null=True
    )
    signature_image_url = models.URLField(blank=True, null=True)
    document_log_file = models.FileField(
        upload_to="team-generated-pdfs/", blank=True, null=True
    )
    date_requested = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TeamDocumentSigning - Document: \
            {self.document.name} - Recipient: {self.recipient.email}"


class Invitation(models.Model):
    """
    Model representing an invitation to join a team.

    Attributes:
        team (ForeignKey): The team to which the user is invited.
        recipient_email (EmailField): The email address of the recipient.
        token (CharField): A unique token associated with the invitation.
        created_at (DateTimeField): The date and time when the invitation was created.
        updated_at (DateTimeField): The date and time when the invitation status was updated.
        accepted (BooleanField): Whether the invitation has been accepted or not.

    Usage:
        - Invitations are used to facilitate the onboarding of users to a team.
          Each invitation
        - includes a unique token, which is used to validate and link users to
          specific teams.

    Example:
        - An invitation can be created when a team owner invites a user
          to join their team.
        - The recipient receives an email with an invitation link containing
          the unique token.

    Related Classes:
        Team: The team to which the invitation is associated.

    Related Models:
        None
    """

    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    recipient_email = models.EmailField()
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        """
        Returns a string representation of the invitation.
        """
        return f"Invitation for {self.recipient_email} to join {self.team.name}"
