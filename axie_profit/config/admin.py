# admin.py
from django.contrib import admin
from .models import Config

class ConfigAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        # Impede a criação de novos objetos
        return not Config.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Impede a exclusão do objeto
        return False

admin.site.register(Config, ConfigAdmin)
