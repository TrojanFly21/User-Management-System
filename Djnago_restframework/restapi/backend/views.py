from rest_framework.response import Response
from rest_framework.decorators import api_view
from backend.models import Users
from backend.serializers import UserSerializer
from django.http import HttpResponse
from rest_framework import status




@api_view(['GET'])
def get_users(request):
    user_data=Users.objects.all()
    serial_data = UserSerializer(user_data,many=True)
    return Response(serial_data.data)



@api_view(['POST'])
def create_users(request):
    x=request.data
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        email=serializer.validated_data.get('email')
        email=x["email"]
        unique_email=Users.objects.filter(email=email)
        if unique_email:
            return Response({"detail": {"message": "email already exist","statusCode": 409,"errorCode": None}})
        
        serializer.save()    
        user_data = Users.objects.all()
        serializer = UserSerializer(user_data, many=True)
        user_data = Users.objects.all()
        serializer = UserSerializer(user_data, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # Return errors if invalid
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_user_by_id(request, user_id):
    print("Received user_id from path:", user_id)
    try:
        user_id = int(user_id)
    except ValueError:
        return Response({"detail": {"message": "Uesr not found","statusCode": 404,"errorCode": None}})

    user_queryset = Users.objects.filter(id=user_id)

    if not user_queryset.exists():
        return Response({"detail": {"message": "Uesr not found","statusCode": 404,"errorCode": None}})

    serializer = UserSerializer(user_queryset.first())
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_user(request, user_id):
    print(user_id)
    try:
        user = Users.objects.filter(id=user_id)
    except Users.DoesNotExist:
        return Response({
            "detail": {
                "message": "User not found",
                "statusCode": 404,
                "errorCode": None
            }
        }, status=status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response({
        "detail": {
            "message": f"User with ID {user_id} deleted successfully",
            "statusCode": 200,
            "errorCode": None
        }
    }, status=status.HTTP_200_OK)