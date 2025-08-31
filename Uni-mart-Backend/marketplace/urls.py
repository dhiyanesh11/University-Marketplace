# marketplace/urls.py

from django.urls import path
from .views import PostList
from .views import SellingPostList

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'),
]
urlpatterns = [
    path('sell/', SellingPostList.as_view(), name='sell-list'),
]