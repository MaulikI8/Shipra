from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from inventory.models import Product
from inventory.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_id', 'quantity', 'unit_price', 'subtotal')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'order_number', 'tracking_number', 'customer', 'customer_name', 'status', 'total_amount', 
                  'items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'order_number', 'created_at', 'updated_at', 'total_amount')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total amount using product prices from DB for security
        total_amount = sum(item['quantity'] * item['product'].price for item in items_data)
        
        # Generate Order Number
        import uuid
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # Create Order
        validated_data['order_number'] = order_number
        validated_data['total_amount'] = total_amount
        
        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            
            # Create Order Items and Update Inventory
            for item_data in items_data:
                product = item_data['product']
                quantity = item_data['quantity']
                # Use price from DB, ignore frontend unit_price
                unit_price = product.price
                subtotal = quantity * unit_price
                
                # Check for sufficient stock in ANY warehouse
                # Logic: Find first warehouse with enough stock
                # In a real app, you'd likely select specific warehouse logic
                from inventory.models import InventoryItem
                
                inventory_item = InventoryItem.objects.filter(
                    product=product,
                    quantity__gte=quantity
                ).first()
                
                if not inventory_item:
                    raise serializers.ValidationError(
                        f"Insufficient stock for product '{product.name}'. Requested: {quantity}"
                    )
                
                # Decrement stock
                inventory_item.quantity -= quantity
                inventory_item.save()
                
                # Update product status based on total stock
                total_stock = sum(item.quantity for item in product.inventory_items.all())
                if total_stock == 0:
                    product.status = 'out_of_stock'
                elif total_stock < 10: # Threshold
                    product.status = 'low_stock'
                else:
                    product.status = 'in_stock'
                product.save()

                OrderItem.objects.create(
                    order=order, 
                    product=product, 
                    quantity=quantity,
                    unit_price=unit_price,
                    subtotal=subtotal
                )
            
        return order

