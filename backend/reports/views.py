from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from orders.models import Order, OrderItem
from inventory.models import Product, InventoryItem
from customers.models import Customer
from warehouses.models import Warehouse
from orders.serializers import OrderSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard overview statistics."""
    user = request.user
    
    # Filter orders by user
    user_orders = Order.objects.filter(user=user)
    
    # Total revenue (all time)
    total_revenue = sum(order.total_amount for order in user_orders)
    
    # Orders count
    total_orders = user_orders.count()
    
    # Recent orders (last 5)
    recent_orders = user_orders[:5]
    recent_orders_data = OrderSerializer(recent_orders, many=True).data
    
    # Inventory stats
    inventory_items = InventoryItem.objects.filter(
        warehouse__is_active=True
    )
    total_products = Product.objects.count()
    total_stock = sum(item.quantity for item in inventory_items)
    
    # Top products by revenue
    top_products_data = []
    products_with_revenue = {}
    for order in user_orders.filter(status__in=['delivered', 'shipped', 'pending', 'processing']):
        for item in order.items.all():
            product_id = item.product.id
            if product_id not in products_with_revenue:
                products_with_revenue[product_id] = {
                    'name': item.product.name,
                    'revenue': 0,
                    'sales': 0
                }
            products_with_revenue[product_id]['revenue'] += float(item.subtotal)
            products_with_revenue[product_id]['sales'] += item.quantity
    
    top_products = sorted(
        products_with_revenue.values(),
        key=lambda x: x['revenue'],
        reverse=True
    )[:5]
    
    # Weekly sales data (last 7 days)
    weekly_data = []
    for i in range(6, -1, -1):
        day = timezone.now() - timedelta(days=i)
        day_orders = user_orders.filter(
            created_at__date=day.date()
        )
        revenue = sum(order.total_amount for order in day_orders)
        weekly_data.append({
            'name': day.strftime('%a')[0],  # First letter of day
            'value': float(revenue),
            'orders': day_orders.count()
        })
    
    return Response({
        'total_revenue': float(total_revenue),
        'total_orders': total_orders,
        'total_products': total_products,
        'total_stock': total_stock,
        'recent_orders': recent_orders_data,
        'top_products': top_products,
        'weekly_data': weekly_data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def revenue_report(request):
    """Get revenue report data."""
    user = request.user
    months = int(request.query_params.get('months', 6))
    end_date = timezone.now()
    start_date = end_date - timedelta(days=30 * months)
    
    orders = Order.objects.filter(
        user=user,
        created_at__gte=start_date,
        created_at__lte=end_date
    )
    
    # Group by month
    monthly_data = []
    current = start_date.replace(day=1) 
    # Use day 28 for comparison to ensure we don't skip the last month if end_date is early in month
    target_end = end_date.replace(day=28)
    while current <= target_end:
        month_orders = orders.filter(
            created_at__year=current.year,
            created_at__month=current.month
        )
        revenue = sum(order.total_amount for order in month_orders)
        monthly_data.append({
            'month': current.strftime('%b'),
            'revenue': float(revenue),
            'orders': month_orders.count()
        })
        
        # Move to next month safely
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)
            
    # Post-loop check using target_end to be consistent
    if monthly_data and monthly_data[-1]['month'] != target_end.strftime('%b'):
         month_orders = orders.filter(
            created_at__year=target_end.year,
            created_at__month=target_end.month
        )
         revenue = sum(order.total_amount for order in month_orders)
         monthly_data.append({
            'month': target_end.strftime('%b'),
            'revenue': float(revenue),
            'orders': month_orders.count()
        })
    
    return Response(monthly_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product_performance(request):
    """Get product performance data."""
    user = request.user
    user_orders = Order.objects.filter(user=user)
    
    # Get products from user's orders
    products_with_data = {}
    total_revenue = 0
    
    for order in user_orders.filter(status__in=['delivered', 'shipped', 'pending', 'processing']):
        for item in order.items.all():
            product_id = item.product.id
            if product_id not in products_with_data:
                products_with_data[product_id] = {
                    'name': item.product.name,
                    'revenue': 0,
                    'orders': set(),
                    'sales': 0,
                    'status': item.product.status
                }
            products_with_data[product_id]['revenue'] += float(item.subtotal)
            products_with_data[product_id]['orders'].add(order.id)
            products_with_data[product_id]['sales'] += item.quantity
            total_revenue += float(item.subtotal)
    
    # Convert to list and calculate percentages
    data = []
    for product_data in products_with_data.values():
        percentage = (product_data['revenue'] / total_revenue * 100) if total_revenue > 0 else 0
        data.append({
            'name': product_data['name'],
            'revenue': product_data['revenue'],
            'orders': len(product_data['orders']),
            'sales': product_data['sales'],
            'status': product_data['status'],
            'percentage': round(percentage, 1)
        })
    
    # Sort by revenue and take top 10
    data.sort(key=lambda x: x['revenue'], reverse=True)
    return Response(data[:10])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def warehouse_performance(request):
    """Get warehouse performance data."""
    user = request.user
    warehouses = Warehouse.objects.filter(is_active=True)
    user_orders = Order.objects.filter(user=user, status__in=['delivered', 'shipped'])
    
    data = []
    for warehouse in warehouses:
        # Count inventory items in this warehouse
        inventory_items = InventoryItem.objects.filter(warehouse=warehouse)
        # Calculate currently used space (sum of all product quantities)
        used_space = sum(item.quantity for item in inventory_items)
        
        # Get orders count (simplified distribution)
        orders_count = user_orders.count() // warehouses.count() if warehouses.count() > 0 else 0
        
        # Calculate real efficiency based on Warehouse capacity
        if warehouse.capacity > 0:
            efficiency = round((used_space / warehouse.capacity) * 100, 1)
        else:
            # Fallback if capacity not set: assume 1000 units max for calculation context
            # or return 0 to encourage setting capacity
            efficiency = round((used_space / 1000) * 100, 1) if used_space > 0 else 0
        
        # Cap at 100%
        efficiency = min(100, efficiency)
        
        # Revenue from orders (distributed evenly for simplicity as we don't track source warehouse yet)
        revenue = float(sum(order.total_amount for order in user_orders)) / warehouses.count() if warehouses.count() > 0 else 0
        
        data.append({
            'name': warehouse.name,
            'orders': orders_count,
            'efficiency': efficiency,
            'revenue': revenue
        })
    
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_performance(request):
    """Get performance data grouped by category."""
    user = request.user
    user_orders = Order.objects.filter(user=user)
    
    # helper for category name
    def get_category_name(product):
        return product.category.name if product.category else 'Uncategorized'

    categories_data = {}
    total_revenue = 0
    
    for order in user_orders.filter(status__in=['delivered', 'shipped', 'pending', 'processing']):
        for item in order.items.all():
            cat_name = get_category_name(item.product)
            
            if cat_name not in categories_data:
                categories_data[cat_name] = {
                    'name': cat_name,
                    'revenue': 0,
                    'sales': 0
                }
            
            categories_data[cat_name]['revenue'] += float(item.subtotal)
            categories_data[cat_name]['sales'] += item.quantity
            total_revenue += float(item.subtotal)
            
    # Format for chart
    data = []
    for cat in categories_data.values():
         percentage = (cat['revenue'] / total_revenue * 100) if total_revenue > 0 else 0
         data.append({
             'name': cat['name'],
             'revenue': cat['revenue'],
             'sales': cat['sales'],
             'percentage': round(percentage, 1),
             'value': cat['revenue'] # for Recharts
         })
         
    return Response(data)

