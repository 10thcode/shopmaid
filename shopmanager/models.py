from django.db import models
from django.contrib.auth.models import User


class Shop(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, blank=True)
    category = models.CharField(max_length=60, blank=True)
    description = models.CharField(max_length=720, blank=True)
    image = models.ImageField(upload_to='images/shops', default='images/shops/default.jpg', blank=True)
    opens_at = models.TimeField(null=True, blank=True)
    closes_at = models.TimeField(null=True, blank=True)
    address = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=10, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    whatsapp = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class ShopItem(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, blank=True)
    description = models.CharField(max_length=240, blank=True)
    price = models.FloatField(blank=True)
    image = models.ImageField(upload_to='images/shopitems', default='images/items/default.png', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']



