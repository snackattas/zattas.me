from django.db import models

# Create your models here.
class Contact(models.Model):
    email = models.EmailField()
    reason_for_contacting = models.CharField(max_length=80, blank=True, )
    message = models.TextField(default='')
    send_to_yourself = models.BooleanField(default=False)
