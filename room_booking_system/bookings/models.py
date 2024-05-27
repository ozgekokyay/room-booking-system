from django.db import models

# from django.contrib.auth.models import User

# class User(models.Models){
#     name = models.CharField(max_length = 36)
#     user_type = models.CharField(max_length = 36)
#     def __str__(self):
#         return user.name
# }
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField()

    def __str__(self):
        return self.email

class RoomType(models.Model):
    name = models.CharField(max_length=100, null=True)
    capacity = models.IntegerField(default=8, null=True)
    
    def __str__(self):
        return self.name

class Room(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=300, null=True)
    room_type = models.ForeignKey(RoomType, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

class Timeslot(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"

class RoomTimeslot(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    timeslot = models.ForeignKey(Timeslot, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.room.name} - {self.timeslot}"

class Booking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room_timeslot = models.ForeignKey(RoomTimeslot, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return f"{self.room_timeslot} - {self.user.username}"
