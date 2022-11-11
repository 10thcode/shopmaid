from rest_framework.viewsets import ModelViewSet

from .serializers import *


class CounterViewSet(ModelViewSet):
    serializer_class = CounterSerializer
    filterset_fields = {
        'completed': ['exact'],
        'created_at': ['month', 'day', 'year'],
    }

    def get_queryset(self):
        return Counter.objects.all().filter(shop__user=self.request.user)


class CounterItemViewSet(ModelViewSet):
    serializer_class = CounterItemSerializer
    filterset_fields = ['counter']

    def get_queryset(self):
        return CounterItem.objects.all().filter(counter__shop__user=self.request.user)


class SalesViewSet(ModelViewSet):
    serializer_class = SalesSerializer
    filterset_fields = {'date': ['month', 'year']}

    def get_queryset(self):
        return Sales.objects.all().filter(shop__user=self.request.user)
