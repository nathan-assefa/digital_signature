"""
    Module: serializers.py

    This module defines Django REST Framework serializers for various models.

    Serializers:
    - `UserSerializer`: Serializer for the User model.
    - `UploadedDocumentSerializer`: Serializer for the UploadedDocument model.
    - `ExternalRecipientSerializer`: Serializer for the ExternalRecipient model.
    - `SigningSerializer`: Serializer for the Signing model.
    - `ProfileSerializer`: Serializer for the Profile model.
"""


from rest_framework.serializers import ModelSerializer
from .models import (UploadedDocument,
                     Signing,
                     Profile,
                     Team,
                     TeamMembership,
                     TeamDocument,
                     TeamDocumentSigning
)
from django.contrib.auth.models import User
from rest_framework import serializers



class UserSerializer(ModelSerializer):
    """
        Serializer for the User model.

        Attributes:
        - Meta: Class containing metadata for the serializer, specifying
          the model and fields.

        Example Usage:
        ```
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user_instance = user_serializer.save()
        ```
    """
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']


class UploadedDocumentSerializer(ModelSerializer):
    """
        Serializer for the UploadedDocument model.

        Attributes:
        - owner: Nested UserSerializer for the 'owner' field.
        - Meta: Class containing metadata for the serializer,
          specifying the model and fields.

        Example Usage:
        ```
        document_serializer = UploadedDocumentSerializer(data=document_data)
        if document_serializer.is_valid():
            document_instance = document_serializer.save()
        ```
    """
    owner = UserSerializer(many=False)
    class Meta:
        model = UploadedDocument
        fields = '__all__'


class ExternalRecipientSerializer(ModelSerializer):
    """
        Serializer for the ExternalRecipient model.

        Attributes:
        - Meta: Class containing metadata for the serializer,
          specifying the model and fields.

        Example Usage:
        ```
        recipient_serializer = ExternalRecipientSerializer(data=recipient_data)
        if recipient_serializer.is_valid():
            recipient_instance = recipient_serializer.save()
        ```
    """
    class Meta:
        model = UploadedDocument
        fields = '__all__'


class SigningSerializer(ModelSerializer):
    """
        Serializer for the Signing model.

        Attributes:
        - document: Nested UploadedDocumentSerializer for the 'document' field.
        - recipient: Nested UserSerializer for the 'recipient' field.
        - Meta: Class containing metadata for the serializer, specifying
          the model and fields.

        Example Usage:
        ```
        signing_serializer = SigningSerializer(data=signing_data)
        if signing_serializer.is_valid():
            signing_instance = signing_serializer.save()
        ```
    """
    document = UploadedDocumentSerializer(many=False)
    recipient = UserSerializer(many=False, read_only=True, required=False)
    class Meta:
        model = Signing
        fields = '__all__'


class ProfileSerializer(ModelSerializer):
    """
        Serializer for the Profile model.

        Attributes:
        - user: Nested UserSerializer for the 'user' field.
        - Meta: Class containing metadata for the serializer,
          specifying the model and fields.

        Example Usage:
        ```
        profile_serializer = ProfileSerializer(data=profile_data)
        if profile_serializer.is_valid():
            profile_instance = profile_serializer.save()
        ```
    """
    user = UserSerializer(many=False)
    class Meta:
        model = Profile
        fields = "__all__"


class TeamSerializer(ModelSerializer):
    """
        Serializer for the Team model.
    """
    members = UserSerializer(many=True, required=False)
    members_count = serializers.SerializerMethodField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Team
        fields = '__all__'

    def get_members_count(self, obj):
        """
        Custom method to get the count of members for a team.
        """
        return obj.members.count()

    def to_representation(self, instance):
        """
        The **to_representation** method in a Django REST framework serializer
        is responsible for transforming the internal representation of the
        object into a format that can be rendered into JSON or other content types.
        It is called when you are preparing the data to be sent in a response, such
        as when you use the serializer.data property or when the serializer is
        used in a response by a view.

        *** When is to_representation Called? ***
        - Response Rendering: When you use the serializer to convert an object to a
          Python dictionary using serializer.data, DRF calls to_representation to
          generate the dictionary.

        - Response Serialization: When the serializer is used to serialize data for
          a response in a view, DRF calls to_representation to convert the internal
          representation of the object into a format suitable for rendering,
          such as JSON.
        """
        data = super().to_representation(instance)
        # Customize the serialization of the 'owner' field
        data['owner'] = UserSerializer(instance.owner).data
        return data
        


class TeamMembershipSerializer(ModelSerializer):
    """
    Serializer for the TeamMembership model.

    Attributes:
        id (int): The unique identifier for the team membership.
        team (int): The ID of the team to which the user belongs.
        user (int): The ID of the user who is a member of the team.
        role (str): The role of the user in the team (admin or member).
        created_at (str): The date and time when the team membership was created.
    """
    user = UserSerializer(many=False)
    class Meta:
        model = TeamMembership
        fields = '__all__'


class TeamDocumentSerializer(ModelSerializer):
    team = TeamSerializer(many=False)
    class Meta:
        model = TeamDocument
        fields = "__all__"


class TeamSigningSerializer(ModelSerializer):
    document = TeamDocumentSerializer(many=False)
    recipient = UserSerializer(many=False, read_only=True, required=False)
    class Meta:
        model = TeamDocumentSigning
        fields = "__all__"