from . import gameconsumer
from django.urls import path

websocket_urlpatterns =[
    path('ws/game/<int:boardId>/', gameconsumer.GameConsumer.as_asgi())
]