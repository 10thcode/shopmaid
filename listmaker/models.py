from django.contrib.auth.models import User
from django.db import models


class List(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=120, blank=True)
    description = models.CharField(max_length=240, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class ListItem(models.Model):
    list = models.ForeignKey(List, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, blank=True)
    image = models.ImageField(upload_to='images/items', default='images/items/default.png', blank=True)
    price = models.FloatField(default=0, blank=True)
    description = models.CharField(max_length=240, blank=True)
    quantity = models.PositiveIntegerField(default=0, blank=True)
    checked = models.BooleanField(default=False, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
