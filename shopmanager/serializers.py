from rest_framework.serializers import ModelSerializer

from shopmanager.models import *


class ShopSerializer(ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'


class ShopItemSerializer(ModelSerializer):
    class Meta:
        model = ShopItem
        fields = '__all__'
