from rest_framework import routers

from listmaker.views import *

router = routers.DefaultRouter()
router.register('lists', ListViewSet, basename='list')
router.register('listitems', ListItemViewSet, basename='listitem')

urlpatterns = router.urls
