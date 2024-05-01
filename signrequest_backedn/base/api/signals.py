"""
    Module: signals.py

    - This module defines Django signals to handle user profile creation
      and saving.

    Signals:
    - `create_user_profile(sender, instance, created, **kwargs)`: Signal
      to create a user profile when a new user is created.
    - `save_user_profile(sender, instance, **kwargs)`: Signal to save the
      user's profile when the user is saved.

    Dependencies:
    - `django.db.models.signals.post_save`: Signal sent after a model’s
      `save()` method is called.
    - `django.dispatch.receiver`: A decorator for connecting signal handlers.
"""


from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

# Create a profile for each new user
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
        Signal to create a user profile when a new user is created.

        Args:
        - sender: The model class.
        - instance: The actual instance being saved.
        - created: A boolean; `True` if a new record was created.

        Returns:
        - None

        Example Usage:
        ```
        post_save.connect(create_user_profile, sender=User)
        ```
    """
    if created:
        Profile.objects.create(user=instance)

# Save the user's profile when the user is saved
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal to save the user's profile when the user is saved.

    Args:
    - sender: The model class.
    - instance: The actual instance being saved.

    Returns:
    - None

    Example Usage:
    ```
    post_save.connect(save_user_profile, sender=User)
    ```
    """
    instance.profile.save()