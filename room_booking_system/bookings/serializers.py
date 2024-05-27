from rest_framework import serializers
from .models import Room, Timeslot, RoomTimeslot, Booking
# from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.save()
        return user

# class LoginSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)
#     token = serializers.CharField(read_only=True)

#     def validate(self, data):
#         username = data.get('username')
#         password = data.get('password')
#         user = authenticate(username=username, password=password)
#         if user and user.is_active:
#             refresh = RefreshToken.for_user(user)
#             return {
#                 'username': user.username,
#                 'refresh': str(refresh.access_token),
#             }
#         raise serializers.ValidationError('Invalid credentials')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user is None:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include "username" and "password"')

        data['user'] = user
        return data

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

    
class TimeslotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeslot
        fields = '__all__'

class RoomTimeslotSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomTimeslot
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
