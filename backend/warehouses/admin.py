from django.contrib import admin
from .models import Warehouse


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'is_active', 'created_at')
    list_filter = ('is_active', 'state', 'country')
    search_fields = ('name', 'city', 'address')

