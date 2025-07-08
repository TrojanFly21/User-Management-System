from django.db import models

class Users(models.Model):
  id = models.AutoField(primary_key=True)
  firstname = models.CharField(max_length=255)
  lastname = models.CharField(max_length=255,blank=True, null=True)
  email = models.EmailField(max_length=255, unique=True)