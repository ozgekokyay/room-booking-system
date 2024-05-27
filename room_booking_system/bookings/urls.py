
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = routers.DefaultRouter()
# router.register(r'rooms', RoomViewSet)
router.register(r'timeslots', TimeslotViewSet)
# router.register(r'room_timeslots', RoomTimeslotViewSet)
# router.register(r'bookings', BookingViewSet)
# router.register(r'rooms-with-bookings', RoomWithBookingsViewSet, basename='rooms-with-bookings')
# router.register(r'rooms', RoomTimeslotViewSet, basename='room')
# router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('roomslist/', RoomListCreateView.as_view(), name='room_list'),
	path('register/', RegisterView.as_view(), name='register'),
	path('login/', LoginView.as_view(), name='login'),
    path('api/timeslots/<int:room_id>/<str:date>/', RoomTimeslotsView.as_view(), name='room_timeslots'),

	# path('logout/', UserLogout.as_view(), name='logout'),
	# path('user/', UserView.as_view(), name='user'),
    # path('register/', RegisterView.as_view(), name='register'),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]