from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes


@api_view(['POST', 'GET'])
@permission_classes((AllowAny, ))
def index(request):
    if request.method == 'POST':
        pass
    else:
        return render(request, 'shopmaid/index.html')


@api_view(['DELETE'])
def delete_user(request):
    u = User.objects.get(id=request.user.id)
    u.delete()
    return Response({"success": "Successful"})


@api_view(['PUT'])
def edit_user(request):
    u = User.objects.get(id=request.user.id)
    u.first_name = request.data['first_name']
    u.last_name = request.data['last_name']
    u.save()
    return Response({"success": "Successful"})


@api_view()
def my_user(request):
    return Response({
        "user": request.user.id,
        "firstname": request.user.first_name,
        "lastname": request.user.last_name,
        'email': request.user.email
    })


