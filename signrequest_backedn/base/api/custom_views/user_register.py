"""
    Module: user_registration_views.py

    This module defines Django views for user registration.

    Views:
    - `register_user`: View for handling user registration.

"""

import re
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
# from django.core.validators import validate_email
from django.core.exceptions import ValidationError


def validate_email_address(email):
    # Regular expression pattern for email validation
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email)


@csrf_exempt
@require_POST
def register_user(request):
    """
        View for handling user registration.

        Attributes:
        - csrf_exempt: Decorator to exempt the view from CSRF protection.
        - require_POST: Decorator to ensure that the view only responds to
          POST requests.

        Methods:
        - register_user(request): Handle user registration based on POST data.
    """
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        email = data.get("email")
        first_name = data.get("first_name")
        last_name = data.get("last_name")

        if not username or not password or not email:
            return JsonResponse({"error": "Incomplete registration data"}, status=400)

        try:
            if not validate_email_address(email):
                return JsonResponse({"error": "Invalid email address"}, status=400)
        except ValidationError as e:
            return JsonResponse({"error": "Invalid email address"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username is already taken"}, status=400)

        # Password strength validation
        password_pattern = r"^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$"
        if not re.match(password_pattern, password):
            return JsonResponse(
                {"error": "Password does not meet strength requirements"}, status=400
            )

        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        # Create the user
        user_data = {
            "username": username,
            "password": password,
            "email": email,
            "first_name": first_name,
        }

        if last_name:
            user_data["last_name"] = last_name

        User.objects.create_user(**user_data)

        return JsonResponse({"message": "User registered successfully"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
