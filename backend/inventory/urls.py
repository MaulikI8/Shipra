from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, InventoryItemViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'items', InventoryItemViewSet, basename='inventory-item')

urlpatterns = [
    path('', include(router.urls)),
]

