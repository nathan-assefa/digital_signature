from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of an object to perform CRUD operations.
    """

    def has_permission(self, request, view):
        # Allow all CRUD operations only if the user is authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow all CRUD operations only if the user is the owner of the document
        return obj.created_by == request.user
"""
Here's a quick recap:

For GET Requests:

If the user is the owner, they can view their own documents.
If the user is not the owner, access is denied, and they won't be able to see the document.

For Other CRUD Requests (POST, PUT, PATCH, DELETE):

If the user is the owner, they are granted permission to perform these operations on
their own documents.
If the user is not the owner, access is denied, and they won't be able to modify or
delete the document.
"""
    
class DocumentPatchPermission(BasePermission):
    message = "You do not have permission to perform this action."

    def has_object_permission(self, request, view, obj):
        # Allow GET and PATCH operations for any authenticated user
        return request.method in ["GET", "PATCH"]