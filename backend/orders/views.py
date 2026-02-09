from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer
from notifications.utils import create_notification


# This ViewSet automatically gives us CRUD operations for orders
# GET /orders/ - list all orders
# POST /orders/ - create new order
# GET /orders/{id}/ - get specific order
# PUT /orders/{id}/ - update order
# DELETE /orders/{id}/ - delete order
class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order CRUD operations."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in

    # Only show orders that belong to the current user
    # select_related and prefetch_related optimize database queries
    def get_queryset(self):
        queryset = Order.objects.filter(user=self.request.user).select_related('customer').prefetch_related('items')
        
        # Filter by status (e.g. /orders/?status=pending)
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        # Search by Order ID or Customer Name (e.g. /orders/?search=ORD-123)
        search = self.request.query_params.get('search')
        if search:
            # We use Q objects for OR logic (search ID OR Customer Name)
            from django.db.models import Q
            queryset = queryset.filter(
                Q(order_number__icontains=search) | 
                Q(customer__name__icontains=search)
            )
            
        return queryset

    # When creating an order, automatically assign it to the current user
    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        create_notification(
            user=self.request.user,
            title="New Order Created",
            message=f"Order {order.order_number} has been successfully created.",
            type="success"
        )

    # Custom action - updates just the order status
    # Accessible at PATCH /orders/{id}/update_status/
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status."""
        order = self.get_object()
        new_status = request.data.get('status')
        # Make sure it's a valid status (pending, processing, shipped, etc.)
        if new_status in dict(Order.STATUS_CHOICES):
            old_status = order.status
            order.status = new_status
            order.save()
            
            if old_status != new_status:
                create_notification(
                    user=self.request.user,
                    title="Order Status Updated",
                    message=f"Order {order.order_number} is now {new_status}.",
                    type="info"
                )
            
            return Response(OrderSerializer(order).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

