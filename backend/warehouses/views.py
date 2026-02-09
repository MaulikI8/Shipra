from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Warehouse
from .serializers import WarehouseSerializer
from .geocoding import geocode_address
from inventory.models import InventoryItem
from orders.models import Order
from django.db.models import Sum

class WarehouseViewSet(viewsets.ModelViewSet):
    """ViewSet for Warehouse CRUD operations."""
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]
    queryset = Warehouse.objects.filter(is_active=True)

    def perform_create(self, serializer):
        """Auto-geocode address if coordinates not provided."""
        if not serializer.validated_data.get('latitude') or not serializer.validated_data.get('longitude'):
            coords = geocode_address(
                serializer.validated_data.get('address', ''),
                serializer.validated_data.get('city', ''),
                serializer.validated_data.get('state', ''),
                serializer.validated_data.get('country', 'USA')
            )
            if coords:
                serializer.save(latitude=coords[0], longitude=coords[1])
            else:
                serializer.save()
        else:
            serializer.save()

    def perform_update(self, serializer):
        """Auto-geocode address if coordinates not provided and address changed."""
        instance = self.get_object()
        address_changed = (
            serializer.validated_data.get('address') != instance.address or
            serializer.validated_data.get('city') != instance.city or
            serializer.validated_data.get('state') != instance.state
        )
        
        if address_changed and (not serializer.validated_data.get('latitude') or not serializer.validated_data.get('longitude')):
            coords = geocode_address(
                serializer.validated_data.get('address', instance.address),
                serializer.validated_data.get('city', instance.city),
                serializer.validated_data.get('state', instance.state),
                serializer.validated_data.get('country', instance.country)
            )
            if coords:
                serializer.save(latitude=coords[0], longitude=coords[1])
            else:
                serializer.save()
        else:
            serializer.save()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get warehouse aggregated stats."""
        total_capacity = Warehouse.objects.aggregate(Sum('capacity'))['capacity__sum'] or 0
        total_stock = InventoryItem.objects.aggregate(Sum('quantity'))['quantity__sum'] or 0
        
        # Calculate efficiency (utilization)
        efficiency = 0
        if total_capacity > 0:
            efficiency = (total_stock / total_capacity) * 100
            
        # Global active orders (Processing/Pending)
        active_orders = Order.objects.filter(status__in=['pending', 'processing']).count()
        
        return Response({
            'totalCapacity': total_capacity,
            'totalStock': total_stock,
            'avgEfficiency': round(efficiency, 1),
            'activeOrders': active_orders,
            'warehouseCount': Warehouse.objects.count()
        })

