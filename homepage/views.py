from django.shortcuts import render, redirect
from django.urls import reverse
from collections import namedtuple
from .forms import ContactForm
from django.core.mail import send_mail
import logging
import os


def homepage(request):
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
    Message = namedtuple("Message", ["message", "error"])
    message = Message("Contact form submitted successfully", False)

    email = data.get('email')
    reason_for_contacting = data.get('reason_for_contacting')
    email_body = data.get('message')
    send_to_yourself = data.get('send_to_yourself')

    if not reason_for_contacting:
        reason_for_contacting = "Contact Form filled out on zattas.me"

    recipients = [os.environ.get('HOST_EMAIL')]
    if send_to_yourself:
        recipients.append(email)
    else:
        add_email_to_message = "Email: %s\n\n" % email
        email_body = add_email_to_message + email_body
    try:
        send_mail(
            reason_for_contacting,
            email_body,
            os.environ.get('HOST_EMAIL'),
            recipients,
            fail_silently=False)
    except:
        message = Message("Error submitting contact form.  Are you sure your "\
            "email is valid?", True)
    return message

def helper_create_menu_tuple():
    CustomMenu = namedtuple("CustomMenu",
        ["fancy_number", "menu_name", "menu_name_without_spaces"])
    menus = ["About Me", "Experience", "Speaking", "Podcasts", "Projects", "Skills", "Contact"]
    menu_tuples = []
    for n, menu in enumerate(menus, 1):
        menu_tuples.append(CustomMenu(
            str(float(n)*.01)[1:],
            menu,
            menu.replace(" ","")))
    return menu_tuples
