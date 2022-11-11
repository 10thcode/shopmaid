from rest_framework.viewsets import ModelViewSet

from .serializers import *


class ListViewSet(ModelViewSet):
    serializer_class = ListSerializer

    def get_queryset(self):
        return List.objects.all().filter(user=self.request.user)


class ListItemViewSet(ModelViewSet):
    serializer_class = ListItemSerializer
    filterset_fields = [
        'list',
        'checked',
    ]

    def get_queryset(self):
        return ListItem.objects.all().filter(list__user=self.request.user)
