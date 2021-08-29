# To compile new sass:

```
sass homepage/static/scss/main.scss homepage/static/css/output.css
```

# To run on your local
```
DJANGO_KEY=yourkey HOST_EMAIL=myfromemail SENDGRID_API_KEY=apikey python manage.py runserver
```

# To virtualenv
```
 python3 -m virtualenv venv -p ~/.pyenv/versions/3.6.7/bin/python3
 source venv/bin/activate
 pip install -r requirements.txt
 ```
