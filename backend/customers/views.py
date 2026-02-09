from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Customer
from .serializers import CustomerSerializer
from orders.models import Order
from django.db.models import Sum, Avg, Q

class CustomerViewSet(viewsets.ModelViewSet):
    """ViewSet for Customer CRUD operations."""
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Customer.objects.all().prefetch_related('orders')
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(company_name__icontains=search)
            )
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get customer analytics stats."""
        total_customers = Customer.objects.count()
        # active_customers = Customer.objects.filter(is_active=True).count() # Assuming is_active exists, if not using total
        active_customers = total_customers # Placeholder if no inactive logic yet
        
        total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        avg_value = Order.objects.aggregate(Avg('total_amount'))['total_amount__avg'] or 0
        
        return Response({
            'total': total_customers,
            'active': active_customers,
            'totalRevenue': total_revenue,
            'avgValue': avg_value
        })

