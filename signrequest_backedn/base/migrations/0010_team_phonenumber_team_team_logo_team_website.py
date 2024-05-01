# Generated by Django 5.0.1 on 2024-01-26 13:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("base", "0009_teammembership_updated_at_invitation"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="phoneNumber",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="team",
            name="team_logo",
            field=models.ImageField(blank=True, null=True, upload_to="team_logos/"),
        ),
        migrations.AddField(
            model_name="team",
            name="website",
            field=models.URLField(blank=True, null=True),
        ),
    ]