from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
    path('revenue/', views.revenue_report, name='revenue-report'),
    path('products/', views.product_performance, name='product-performance'),
    path('category/', views.category_performance, name='category-performance'),
    path('warehouses/', views.warehouse_performance, name='warehouse-performance'),
]

