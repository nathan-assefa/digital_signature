from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Team
from ..serializers import TeamSerializer
from django.db.models import Q
from rest_framework.views import APIView

from base.api.permissions.teams_permission import TeamPermission
    

class TeamListCreateAPIView(APIView):
    """
    API view for listing all teams and creating a new team.

    Endpoint:
        GET /api/teams/ - List all teams
        POST /api/teams/ - Create a new team
    """
    permission_classes = [TeamPermission]


    def get(self, request, format=None):
        # Filter teams based on ownership and membership
        teams = Team.objects.filter(
            Q(owner=request.user) | Q(members=request.user)
        ).distinct()

        if not teams:
            # Handleing case where queryset is empty
            return Response([])

        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        mutable_data = request.data.copy()
        print("mutable_data: ", mutable_data)
         # Set the owner to the user making the request
        mutable_data['owner'] = request.user.id 
        # serializer = TeamSerializer(data=mutable_data)
        serializer = TeamSerializer(data=mutable_data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeamRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting a specific team.

    Endpoint:
        GET /api/teams/{id}/ - Retrieve a specific team
        PUT /api/teams/{id}/ - Update a specific team
        PATCH /api/teams/{id}/ - Partially update a specific team
        DELETE /api/teams/{id}/ - Delete a specific team
    """

    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [TeamPermission]


@api_view(["GET"])
def team_members(request, pk):
    """
    API view for retrieving the members of a specific team.

    Endpoint:
        GET /api/teams/{id}/members/ - Retrieve the members of a specific team
    """
    try:
        team = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    members = team.members.all()
    serializer = TeamSerializer(members, many=True)
    return Response(serializer.data)
