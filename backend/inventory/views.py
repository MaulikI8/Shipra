from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product, InventoryItem
from .serializers import ProductSerializer, InventoryItemSerializer
from notifications.utils import create_notification


# Handles all product operations - create, read, update, delete products
class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product CRUD operations."""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    # Optimize queries by fetching related data in one go
    queryset = Product.objects.all().select_related('category').prefetch_related('inventory_items')

    # Custom action to add stock to a product at a specific warehouse
    # POST /products/{id}/restock/
    @action(detail=True, methods=['post'])
    def restock(self, request, pk=None):
        """Restock product inventory."""
        product = self.get_object()
        warehouse_id = request.data.get('warehouse_id')
        quantity = request.data.get('quantity', 0)
        
        if not warehouse_id:
            return Response({'error': 'warehouse_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find or create the inventory item for this product at this warehouse
            # If it doesn't exist, create it with 0 quantity
            inventory_item, created = InventoryItem.objects.get_or_create(
                product=product,
                warehouse_id=warehouse_id,
                defaults={'quantity': 0}
            )
            # Add the new quantity to existing stock
            inventory_item.quantity += int(quantity)
            inventory_item.save()
            
            # Update the product's overall status based on total stock across all warehouses
            total_stock = sum(item.quantity for item in product.inventory_items.all())
            old_status = product.status
            
            if total_stock == 0:
                product.status = 'out_of_stock'
                if old_status != 'out_of_stock':
                    create_notification(
                        user=self.request.user,
                        title="Alert: Product Out of Stock",
                        message=f"{product.name} is now out of stock!",
                        type="error"
                    )
            elif total_stock < 50:
                product.status = 'low_stock'
                if old_status != 'low_stock' and old_status != 'out_of_stock':
                    create_notification(
                        user=self.request.user,
                        title="Alert: Low Stock",
                        message=f"{product.name} has low stock ({total_stock} units).",
                        type="alert"
                    )
            else:
                product.status = 'in_stock'
            product.save()
            
            return Response(ProductSerializer(product).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Manages inventory items - the actual stock levels at each warehouse
# This is the junction between products and warehouses
class InventoryItemViewSet(viewsets.ModelViewSet):
    """ViewSet for InventoryItem operations."""
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]
    # Optimize by fetching product and warehouse data together
    queryset = InventoryItem.objects.all().select_related('product', 'warehouse')

