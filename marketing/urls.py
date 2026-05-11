from django.urls import path
from .views import *
urlpatterns = [
    path('', index, name='index'),
    path('bts/', bts_shoots, name='bts_shoots'),
    path('about/', about, name='about'),

]