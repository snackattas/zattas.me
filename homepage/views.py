from django.shortcuts import render, redirect
from django.urls import reverse
from collections import namedtuple
from .forms import ContactForm
from django.core.mail import send_mail
import logging
import os


def homepage(request):
    """
    Main endpoint.  Renders homepage with contact form.
    """
    message = None
    if request.POST:
        message = helper_send_email(request.POST)
    return render(request, 'homepage.html',
        {'menus':  helper_create_menu_tuple(), 'form': ContactForm(),
        'message': message})

def headerVideo(request):
    """
    Simple endpoint to render html content for header video
    """
    return render(request, 'headerVideo.html')


def helper_send_email(data):
    """
    Sends email and returns message determining whether email went through on our end (doesn't validate email address, bad emails will fail elsewhere)
    """
    # Define messagetuple to send back to client
    Message = namedtuple("Message", ["message", "error"])
    # Default success message
    message = Message(
        message="Contact form submitted successfully",
        error=False)

    # Reason for contacting transformed to email title
    reason_for_contacting = data.get('reason_for_contacting')
    if not reason_for_contacting:
        reason_for_contacting = "Contact Form filled out on zattas.me"

    # Determine who emails are sent to
    recipients = [os.environ.get('HOST_EMAIL')]
    email_body = data.get('message')
    email = data.get('email')
    send_to_yourself = data.get('send_to_yourself')
    if send_to_yourself:
        recipients.append(email)
    else:
        # If user doesn't want a copy sent to themselves, add their email to the email body
        add_email_to_message = "Email: %s\n\n" % email
        email_body = add_email_to_message + email_body

    try:
        send_mail(
            subject=reason_for_contacting,
            message=email_body,
            from_email=os.environ.get('HOST_EMAIL'),
            to_email=recipients,
            fail_silently=False)
    except:
        message = Message(
            message="Error submitting contact form.  Are you sure your "\
            "email is valid?",
            error=True)
    return message

def helper_create_menu_tuple():
    CustomMenu = namedtuple("CustomMenu",
        ["fancy_number", "menu_name", "menu_name_without_spaces"])
    menus = ["About Me", "Experience", "Projects", "Skills", "Contact"]
    menu_tuples = []
    for n, menu in enumerate(menus, 1):
        menu_tuples.append(CustomMenu(
            str(float(n)*.01)[1:],
            menu,
            menu.replace(" ","")))
    return menu_tuples
