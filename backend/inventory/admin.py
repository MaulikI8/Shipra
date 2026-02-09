from django.contrib import admin
from .models import Category, Product, InventoryItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'category', 'price', 'status', 'created_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('sku', 'name', 'description')


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'warehouse', 'quantity', 'low_stock_threshold')
    list_filter = ('warehouse',)

