
from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from .models import Room, Timeslot, RoomTimeslot, Booking
from .serializers import *
from django.conf import settings
# Create your views here.
# users/views.py
from rest_framework.decorators import action
from datetime import timedelta
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


User = settings.AUTH_USER_MODEL

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class RoomTimeslotViewSet(viewsets.ModelViewSet):
#     queryset = RoomTimeslot.objects.all()
#     serializer_class = RoomTimeslotSerializer
#     permission_classes = [AllowAny]

#     @action(detail=True, methods=['post'], url_path='timeslots')
#     def create_room_timeslot(self, request, pk=None):
#         room = Room.objects.get(pk=pk)
#         start_time = request.data.get('start_time')
#         end_time = request.data.get('end_time')

#         timeslot, created = Timeslot.objects.get_or_create(start_time=start_time, end_time=end_time)
#         room_timeslot = RoomTimeslot.objects.create(room=room, timeslot=timeslot)
#         serializer = self.get_serializer(room_timeslot)

#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     @action(detail=True, methods=['get'], url_path='timeslots')
#     def list_room_timeslots(self, request, pk=None):
#         room = Room.objects.get(pk=pk)
#         start_date = request.query_params.get('start_date')
#         end_date = request.query_params.get('end_date')

#         timeslots = RoomTimeslot.objects.filter(
#             room=room, 
#             timeslot__start_time__gte=start_date,
#             timeslot__end_time__lte=end_date
#         ).select_related('timeslot')

#         booked_timeslots = Booking.objects.filter(room_timeslot__in=timeslots).values_list('room_timeslot_id', flat=True)
#         data = []
#         for room_timeslot in timeslots:
#             is_booked = room_timeslot.id in booked_timeslots
#             data.append({
#                 'id': room_timeslot.id,
#                 'start_time': room_timeslot.timeslot.start_time,
#                 'end_time': room_timeslot.timeslot.end_time,
#                 'is_booked': is_booked
#             })

#         return Response(data, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateparse import parse_datetime
from datetime import timedelta

class RoomTimeslotsView(APIView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user = request.user
        room_timeslot_id = request.data.get('room_timeslot')
        description = request.data.get('description')

        room_timeslot = RoomTimeslot.objects.get(pk=room_timeslot_id)
        booking = Booking.objects.create(user=user, room_timeslot=room_timeslot, description=description)
        serializer = BookingSerializer(booking)  # Assuming BookingSerializer exists

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, room_id, date):
        try:
            room = Room.objects.get(pk=room_id)

            # Calculate the start and end of the week
            start_of_the_week = parse_datetime(f"{date}T00:00:00Z")
            end_of_the_week = start_of_the_week + timedelta(days=7)

            # Filter Timeslots by date range
            timeslots = Timeslot.objects.filter(
                start_time__gte=start_of_the_week,
                start_time__lt=end_of_the_week
            )

            # Filter RoomTimeslots by room and filtered timeslots
            room_timeslots = RoomTimeslot.objects.filter(
                room=room,
                timeslot__in=timeslots
            )

            # Filter Bookings by room_timeslots
            bookings = Booking.objects.filter(
                room_timeslot__in=room_timeslots
            )

            # Create a dictionary mapping room_timeslot_id to description
            booking_descriptions = {booking.room_timeslot.id: booking.description for booking in bookings}

            # Prepare the timeslot data
            timeslot_data = [
                {
                    "room_timeslot_id": rt.id,
                    "room_id": rt.room.id,
                    "room_name": rt.room.name,
                    "timeslot_id": rt.timeslot.id,
                    "start_time": rt.timeslot.start_time,
                    "description": booking_descriptions.get(rt.id, "")
                }
                for rt in room_timeslots
            ]

            return Response(timeslot_data, status=status.HTTP_200_OK)

        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)


# class RoomTimeslotViewSet(viewsets.ModelViewSet):
#     permission_classes = [AllowAny]
#     queryset = RoomTimeslot.objects.all()
#     serializer_class = RoomTimeslotSerializer

#     @action(detail=True, methods=['post'])
#     def create_room_timeslot(self, request, pk=None):
#         room = self.get_object()
#         timeslot_data = request.data.get('timeslot')
#         timeslot_serializer = TimeslotSerializer(data=timeslot_data)

#         if timeslot_serializer.is_valid():
#             timeslot = timeslot_serializer.save()
#             room_timeslot = RoomTimeslot.objects.create(room=room, timeslot=timeslot)
#             return Response(RoomTimeslotSerializer(room_timeslot).data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(timeslot_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    # permission_classes = [IsAuthenticated]

class RoomList(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    def perform_create(self, serializer):
        serializer.save()


class RoomListCreateView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()

class TimeslotViewSet(viewsets.ModelViewSet):
    queryset = Timeslot.objects.all()
    serializer_class = TimeslotSerializer
    permission_classes = [AllowAny]

    # permission_classes = [IsAuthenticated]




class RoomWithBookingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    # permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        bookings = Booking.objects.filter(room_timeslot__room=instance)
        booking_serializer = BookingSerializer(bookings, many=True)
        room_serializer = self.get_serializer(instance)
        return Response({
            'room': room_serializer.data,
            'bookings': booking_serializer.data
        })

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateparse import parse_datetime
from .models import Room, Timeslot, RoomTimeslot, Booking
from .serializers import BookingSerializer

class AvailableTimeslotsView(APIView):
    def get(self, request, room_id, date):
        try:
            room = Room.objects.get(pk=room_id)
            start_of_day = parse_datetime(f"{date}T00:00:00Z")
            end_of_day = parse_datetime(f"{date}T23:59:59Z")
            timeslots = Timeslot.objects.filter(
                start_time__gte=start_of_day,
                end_time__lte=end_of_day
            ).exclude(
                roomtimeslot__room=room
            )
            timeslot_data = [{"id": ts.id, "start_time": ts.start_time, "end_time": ts.end_time} for ts in timeslots]
            return Response(timeslot_data, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

class CreateBookingView(APIView):
    def post(self, request):
        data = request.data
        room_id = data.get('room_id')
        start_time = parse_datetime(data.get('start_time'))
        end_time = parse_datetime(data.get('end_time'))
        description = data.get('description')
        user = request.user

        try:
            room = Room.objects.get(pk=room_id)
            timeslots = Timeslot.objects.filter(start_time__gte=start_time, end_time__lte=end_time)
            if not timeslots.exists():
                return Response({"error": "No available timeslots for the given time range"}, status=status.HTTP_400_BAD_REQUEST)

            booking = Booking.objects.create(user=user, description=description)
            for timeslot in timeslots:
                room_timeslot = RoomTimeslot.objects.create(room=room, timeslot=timeslot)
                booking.room_timeslot.add(room_timeslot)
            
            booking.save()
            return Response({"message": "Booking created successfully"}, status=status.HTTP_201_CREATED)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_booking(request):
    try:
        user = request.user
        room_id = request.data.get('room_id')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        description = request.data.get('description')
        
        room = Room.objects.get(id=room_id)
        timeslot, created = Timeslot.objects.get_or_create(start_time=start_time, end_time=end_time)
        room_timeslot, created = RoomTimeslot.objects.get_or_create(room=room, timeslot=timeslot)
        
        booking = Booking.objects.create(user=user, room_timeslot=room_timeslot, description=description)
        serializer = BookingSerializer(booking)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)