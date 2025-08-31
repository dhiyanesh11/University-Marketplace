from django.shortcuts import render

# marketplace/views.py

from rest_framework import generics
from .models import Post
from .serializers import PostSerializer
from .serializers import SellingPostSerializer
from .models import SellingPost

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
class SellingPostList(generics.ListCreateAPIView):
    queryset = SellingPost.objects.all()
    serializer_class = SellingPostSerializer