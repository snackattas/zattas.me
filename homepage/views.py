from django.shortcuts import render, redirect
from django.urls import reverse
from collections import namedtuple
from .forms import ContactForm
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import logging
import os
import sys


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
    email_body = "This is an email sent from the contact form on https://zattas.me<br/><br/>" + email_body
    if not reason_for_contacting:
        reason_for_contacting = "Contact Form filled out on zattas.me"

    recipients = [os.environ.get('HOST_EMAIL')]
    if send_to_yourself:
        recipients.append(email)
    else:
        add_email_to_message = "<br/><br/>From: %s" % email
        email_body = email_body + add_email_to_message
    try:

        mail = Mail(
            from_email=os.environ.get('HOST_EMAIL'),
            to_emails=recipients,
            subject=reason_for_contacting,
            html_content=email_body)
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(mail)
        print(response.status_code, response.body, response.headers)
    except:
        print(sys.exc_info()[0])
        message = Message("Error submitting contact form", True)
    return message

def helper_create_menu_tuple():
    CustomMenu = namedtuple("CustomMenu",
        ["fancy_number", "menu_name", "menu_name_without_spaces"])
    menus = ["About Me", "Selenium Fun", "Experience", "Speaking", "Skills", "Podcasts", "Projects", "Contact"]
    menu_tuples = []
    for n, menu in enumerate(menus, 1):
        menu_tuples.append(CustomMenu(
            str(float(n)*.01)[1:],
            menu,
            menu.replace(" ","")))
    return menu_tuples
