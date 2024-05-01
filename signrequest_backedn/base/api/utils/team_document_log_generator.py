"""
Module: team_document_log_generator

This module provides functions for generating and saving PDF
document logs for the TeamDocumentSigning model.

Functions:
- generate_and_save_team_document_log(signing_instance): Generates
  and saves a PDF document log for a TeamDocumentSigning instance.

"""


import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from django.urls import reverse
import hashlib

def generate_and_save_team_document_log(signing_instance):
    """
    Generates and saves a PDF document log for a TeamDocumentSigning instance.

    Args:
    - signing_instance (TeamDocumentSigning): An instance of the
      TeamDocumentSigning model.

    Returns:
    None

    The function generates a PDF document log containing relevant information
    about the TeamDocumentSigning instance, such as document ID, team name,
    user email, document name, SHA256 security hash, email details,
    verification and signature details, document URL, and signature image URL.
    The generated PDF is then saved as a FileField in thedocument_log_file
    attribute of the TeamDocumentSigning instance.

    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    # Define styles for different sections
    heading_style = styles['Heading1']
    subheading_style = styles['Heading2']
    body_style = styles['BodyText']

    # Modify font color to grey
    body_style.textColor = colors.grey

    # Extract relevant data from models
    document_id = signing_instance.document.id
    team_name = signing_instance.document.team.name
    user_email = signing_instance.recipient.email
    document_name = signing_instance.document.name

    # Calculate SHA256 hash of the file content
    file_content = signing_instance.document.file.read()
    security_hash = hashlib.sha256(file_content).hexdigest()

    sent_on = signing_instance.date_requested.strftime('%b. %d, %Y, %I:%M %p (UTC)')

    # Section 1: Document Information
    section1 = [
        [Paragraph(f"<b>Document ID:</b> {document_id}", body_style)],
        [Paragraph(f"<b>Team:</b> {team_name}", body_style)],
        [Paragraph(f"<b>User:</b> {user_email}", body_style)],
        # Two-column layout
        [Paragraph("<b>Document name:</b>", body_style), Paragraph(document_name, body_style)],
        [Paragraph("<b>SHA256 security hash:</b>", body_style), Paragraph(security_hash, body_style)],
        [Spacer(1, 12)],
    ]

    # Section 2: Email Details
    section2 = [
        [Paragraph(f"<b>From:</b> SignRequest <no-reply@signrequest.com> on behalf of {user_email}", body_style)],
        [Spacer(1, 12)],
        # Two-column layout
        [Paragraph("<b>To:</b>", body_style), Paragraph("Nathan Assefa (nnathanassefa@gmail.com), aasamnew@gmail.com", body_style)],
        [Paragraph("<b>Subject:</b>", body_style), Paragraph(f"{user_email} has sent you a SignRequest", body_style)],
        [Paragraph("<b>Message:</b>", body_style), Paragraph(signing_instance.document.message, body_style)],
        [Spacer(1, 12)],
    ]

    # Section 3: Verification and Signature Details
    section3 = [
        # Two-column layout
        [Paragraph(f"<b>{user_email}</b>", body_style), Paragraph("<b>Email address verification:</b> Verified by SignRequest", body_style)],
        [Paragraph(f"<b>{signing_instance.recipient.email}</b>", body_style), Paragraph("<b>Email address verification:</b> Verified by SignRequest", body_style)],
        [Paragraph("<b>Signature added, page 2:</b>", body_style)],
        [Spacer(1, 12)],
    ]

    signature_image_url = signing_instance.signature_image_url
    section4 = [
        [Paragraph("<b>Document URL:</b>", body_style)],
        [Paragraph(f"<a href='{signing_instance.document.file.url}' target='_blank'>View Document</a>", body_style)],
        [Spacer(1, 12)],
        [Paragraph("<b>Signature Image URL:</b>", body_style)],
        [Paragraph(f"{signature_image_url}", body_style)],
        [Spacer(1, 12)],
    ]

    # Build the story with sections
    section1 = [item for sublist in section1 for item in sublist]
    section2 = [item for sublist in section2 for item in sublist]
    section3 = [item for sublist in section3 for item in sublist]
    section4 = [item for sublist in section4 for item in sublist]

    # Build the story with sections
    story = [
        Paragraph("Team Document Log", heading_style),
        Spacer(1, 12),
        *section1,
        *section2,
        *section3,
        *section4,
    ]

    doc.build(story)

    # Move the buffer's position to the beginning
    buffer.seek(0)

    # Save the PDF as a FileField in your TeamDocumentSigning model
    signing_instance.document_log_file.save(f"team_document_log_{signing_instance.id}.pdf", buffer)
    # Optionally, you can save the buffer to an external storage (e.g., S3) if needed
