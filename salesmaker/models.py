from django.db import models
from shopmanager.models import Shop, ShopItem


class Counter(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=120, default="Unknown Buyer", blank=True)
    additional_info = models.CharField(max_length=240, blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.customer_name

    class Meta:
        ordering = ['-created_at']


class CounterItem(models.Model):
    counter = models.ForeignKey(Counter, on_delete=models.CASCADE)
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE)
    price = models.FloatField(default=0, blank=True)
    quantity = models.PositiveIntegerField(default=0, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.item

    class Meta:
        ordering = ['-created_at']


class Sales(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.date

    class Meta:
        ordering = ['-date']


