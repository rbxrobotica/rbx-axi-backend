from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('axie.urls')),
    # path('axie/', include('axie.urls')),  

]
