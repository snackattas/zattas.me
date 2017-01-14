from django import forms
from django.core.exceptions import ValidationError
from .models import Contact
from django.core.mail import send_mail


EMPTY_ITEM_ERROR = "You must fill in an email and a message"

class ContactForm(forms.models.ModelForm):
    class Meta:

        model = Contact
        fields = ('email', 'reason_for_contacting', 'message',\
            'send_to_yourself')
        widgets = {
            'email': forms.fields.TextInput(attrs={
                'placeholder': 'required',
                'class': "u-full-width",}),
            'reason_for_contacting': forms.fields.TextInput(attrs={
                'placeholder': 'optional',
                'class': "u-full-width"}),
            'message': forms.Textarea(attrs={
                'placeholder': 'required',
                'class': 'u-full-width'}),
            'send_to_yourself': forms.fields.CheckboxInput()
            }

        error_messages = {
            'email': {'required': EMPTY_ITEM_ERROR},
            'message': {'required': EMPTY_ITEM_ERROR}}

    def __init__(self, *args, **kwargs):
        super(ContactForm, self).__init__(*args, **kwargs)
        self.fields['reason_for_contacting'].required = False
