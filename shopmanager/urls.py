from rest_framework import routers

from shopmanager.views import *

router = routers.DefaultRouter()
router.register('shops', ShopViewSet, basename='shops')
router.register('searchshops', SearchShopViewSet)
router.register('shopitems', ShopItemViewSet, basename='shopitems')
router.register('searchshopitems', SearchShopItemViewSet)

urlpatterns = router.urls
