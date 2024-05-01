"""
Module: user_views.py

- This module defines a Django REST Framework view for retrieving
  the profile of the authenticated user.

View:
- `GetUserProfile`: RetrieveAPIView allowing users to retrieve their
  own profile information.

"""


from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from ..serializers import ProfileSerializer, UserSerializer
from rest_framework.response import Response


class GetUserProfile(RetrieveAPIView):
    """
        RetrieveAPIView for retrieving the profile of the authenticated user.

        Attributes:
        - serializer_class (Serializer): Serializer for the user profile.
        - permission_classes (list): List of permission classes required for
          accessing this view.

        Methods:
        - get_object(self): Retrieve the user profile associated with the
          authenticated user.
    """
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class UpdateProfile(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def perform_update(self, serializer):
        # Update the User model fields
        user_instance = self.request.user
        user_instance.first_name = serializer.validated_data.get('first_name', user_instance.first_name)
        user_instance.last_name = serializer.validated_data.get('last_name', user_instance.last_name)
        user_instance.email = serializer.validated_data.get('email', user_instance.email)
        user_instance.save()

        # Update the Profile model fields
        serializer.save()

        return Response(serializer.data)