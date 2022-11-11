from rest_framework.serializers import ModelSerializer

from listmaker.models import *


class ListSerializer(ModelSerializer):
    class Meta:
        model = List
        fields = '__all__'


class ListItemSerializer(ModelSerializer):
    class Meta:
        model = ListItem
        fields = '__all__'
