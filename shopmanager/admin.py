from django.contrib import admin

from shopmanager.models import *
from salesmaker.models import *

# Register your models here.
admin.site.register(Shop)
admin.site.register(ShopItem)
admin.site.register(Counter)
admin.site.register(CounterItem)
