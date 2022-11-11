from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet

from .serializers import *


class SearchShopViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    search_fields = (
        'name',
    )


class SearchShopItemViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = ShopItem.objects.all()
    serializer_class = ShopItemSerializer
    filterset_fields = [
        'shop',
    ]
    search_fields = (
        'name',
    )


class ShopViewSet(ModelViewSet):
    serializer_class = ShopSerializer

    def get_queryset(self):
        return Shop.objects.all().filter(user=self.request.user)


class ShopItemViewSet(ModelViewSet):
    serializer_class = ShopItemSerializer

    def get_queryset(self):
        return ShopItem.objects.all().filter(shop__user=self.request.user)
