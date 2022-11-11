from rest_framework import routers

from salesmaker.views import *

router = routers.DefaultRouter()
router.register('counters', CounterViewSet, basename='counters')
router.register('counteritems', CounterItemViewSet, basename='counteritems')
router.register('sales', SalesViewSet, basename='sales')

urlpatterns = router.urls
