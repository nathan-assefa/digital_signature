"""
    Module: document_log_generator.py

    - This module defines a function for generating and saving a PDF
      document log for a signing instance.

    Functions:
    - `generate_and_save_pdf(signing_instance)`: Function to generate and
      save a PDF document log for a signing instance.

    Dependencies:
    - `io`: Input/output library for handling binary data.
    - `reportlab`: Library for creating PDF documents in Python.
    - `django.urls.reverse`: Utility for reversing Django URLs.
    - `hashlib`: Library for hashing algorithms.
"""

import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from django.urls import reverse
import hashlib

def generate_and_save_pdf(signing_instance):
    """
        ** Function to generate and save a PDF document log for a signing
        instance.

        ** Args:
        - signing_instance: Instance of the Signing model.

        ** Returns:
        - None

        Example Usage:
        ```
        generate_and_save_pdf(signing_instance)
        ```

        - This function generates a PDF document log with information about
          the document, email details, verification and signature details,
          and links to the document and signature image. The generated PDF
          is saved as a FileField in the associated Signing model.
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
    user_email = signing_instance.recipient.email
    document_name = signing_instance.document.name

    # Calculate SHA256 hash of the file content
    file_content = signing_instance.document.file.read()
    security_hash = hashlib.sha256(file_content).hexdigest()

    sent_on = signing_instance.date_requested.strftime('%b. %d, %Y, %I:%M %p (UTC)')

    # Section 1: Document Information
    section1 = [
        [Paragraph(f"<b>Document ID:</b> {document_id}", body_style)],
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

    # Section 4: Sent On Details
    # section4 = [
    #     [Paragraph("<b>Document URL:</b>", body_style)],
    #     [Paragraph(f"<a href='{signing_instance.document.file.url}'>View Document</a>", body_style)],
    #     [Spacer(1, 12)],
    #     [Paragraph("<b>Signature Image URL:</b>", body_style)],
    #     [Paragraph(f"<a href='{signing_instance.signature_image_url}'>View Signature</a>", body_style)],
    #     [Spacer(1, 12)],
    # ]
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
        Paragraph("Document Log", heading_style),
        Spacer(1, 12),
        *section1,
        *section2,
        *section3,
        *section4,
    ]

    doc.build(story)

    # Move the buffer's position to the beginning
    buffer.seek(0)

    # Save the PDF as a FileField in your Signing model
    signing_instance.document_log_file.save(f"document_log_{signing_instance.id}.pdf", buffer)
        # Optionally, you can save the buffer to an external storage (e.g., S3) if needed