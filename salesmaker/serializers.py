from rest_framework.serializers import ModelSerializer

from salesmaker.models import *


class CounterSerializer(ModelSerializer):
    class Meta:
        model = Counter
        fields = '__all__'


class CounterItemSerializer(ModelSerializer):
    class Meta:
        model = CounterItem
        fields = '__all__'


class SalesSerializer(ModelSerializer):
    class Meta:
        model = Sales
        fields = '__all__'
