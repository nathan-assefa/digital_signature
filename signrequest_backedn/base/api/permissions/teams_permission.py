from rest_framework import permissions
from base.api.models import Team
from django.db.models import Q

class TeamPermission(permissions.BasePermission):
    """
    Custom permission to restrict access to teams.
    """

    def has_permission(self, request, view):
        # Allow POST requests from any authenticated user
        if request.method == 'POST' and request.user.is_authenticated:
            return True

        # Filter teams based on the user's ownership and membership
        teams = Team.objects.filter(Q(owner=request.user) | Q(members=request.user))

        # Check if the requested view is for a specific team
        team_id = view.kwargs.get('team_id')
        if team_id:
            # Allow access only if the user is a member or owner of the specified team
            return teams.filter(id=team_id).exists()

        # Allow access to all teams the user is a member or owner of
        return teams.exists()

    def has_object_permission(self, request, view, obj):
        # Allow owners to perform any action on the team
        if obj.owner == request.user:
            return True

        # Allow members to view the team
        if request.method == 'GET':
            return obj.members.filter(id=request.user.id).exists()

        return False
