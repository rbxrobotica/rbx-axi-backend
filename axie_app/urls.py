from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('find', views.find_axies, name='find_axies'),
    path('axie-name/', views.get_axie_name, name='get_axie_name'),
]
