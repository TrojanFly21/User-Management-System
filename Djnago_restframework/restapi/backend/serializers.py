from rest_framework.serializers import Serializer,ModelSerializer
from backend.models import Users
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'