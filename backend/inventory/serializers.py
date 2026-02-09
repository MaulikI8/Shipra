from rest_framework import serializers
from .models import Product, Category, InventoryItem
from warehouses.serializers import WarehouseSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description')


class InventoryItemSerializer(serializers.ModelSerializer):
    warehouse = WarehouseSerializer(read_only=True)
    warehouse_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = InventoryItem
        fields = ('id', 'warehouse', 'warehouse_id', 
                  'quantity', 'low_stock_threshold', 'updated_at')
        read_only_fields = ('id', 'updated_at')


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    total_stock = serializers.SerializerMethodField()
    inventory_items = InventoryItemSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'sku', 'name', 'description', 'category', 'category_id', 
                  'price', 'cost', 'image', 'status', 'total_stock', 'inventory_items', 
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_total_stock(self, obj):
        return sum(item.quantity for item in obj.inventory_items.all())
    
    def get_status(self, obj):
        """Calculate status based on actual inventory levels."""
        total_stock = self.get_total_stock(obj)
        
        if total_stock == 0:
            return 'out_of_stock'
        
        # Check if any warehouse is below its threshold
        for item in obj.inventory_items.all():
            if item.quantity > 0 and item.quantity <= item.low_stock_threshold:
                return 'low_stock'
        
        return 'in_stock'
