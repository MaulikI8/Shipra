from rest_framework import serializers
from .models import Customer
from orders.serializers import OrderSerializer


class CustomerSerializer(serializers.ModelSerializer):
    total_orders = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    recent_orders = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = ('id', 'name', 'company', 'email', 'phone', 'address', 'status',
                  'credit_limit', 'payment_terms', 'total_orders', 'total_spent',
                  'recent_orders', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_total_orders(self, obj):
        return obj.orders.count()

    def get_total_spent(self, obj):
        total = sum(order.total_amount for order in obj.orders.filter(status='delivered'))
        return str(total)

    def get_recent_orders(self, obj):
        orders = obj.orders.all().order_by('-created_at')[:5]
        return OrderSerializer(orders, many=True).data

