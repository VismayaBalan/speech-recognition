import os
from chat.models import Chat
import speech_recognition as sr
from django.http import HttpResponse
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import render, redirect


def home(request):
    chats = Chat.objects.all()
    all_users = User.objects.filter(messages__isnull=False).distinct()
    ctx = {
        'home': 'active',
        'chat': chats,
        'allusers': all_users
    }
    if request.user.is_authenticated:
        return render(request, 'chat.html', ctx)
    else:
        return render(request, 'base.html', None)


# def upload(request):
#     customHeader = request.META['HTTP_MYCUSTOMHEADER']

#     # obviously handle correct naming of the file and place it somewhere like media/uploads/
#     filename = str(Chat.objects.count())
#     filename = filename + "name" + ".wav"
#     uploadedFile = open(filename, "wb")
#     # the actual file is in request.body
#     uploadedFile.write(request.body)
#     uploadedFile.close()
#     # put additional logic like creating a model instance or something like this here
#     r = sr.Recognizer()
#     harvard = sr.AudioFile(filename)
#     with harvard as source:
#         audio = r.record(source)
#     msg = r.recognize_google(audio)
#     os.remove(filename)
#     chat_message = Chat(user=request.user, message=msg)
#     if msg != '':
#         chat_message.save()
#     return redirect('/')

import os
import speech_recognition as sr
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from .models import Chat
import joblib

# Load your machine learning model
# model = joblib.load('path/to/your/model.pkl')

def upload(request):
    if request.method == 'POST':
        # Get the WAV audio file from the request
        audio_file = request.FILES['audio']

        # Save the audio file temporarily
        filename = 'temp_audio.wav'
        with open(filename, 'wb') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)

        # Perform prediction using your machine learning model
        # prediction = model.predict_audio(filename)
        prediction = cat

        # Delete the temporary audio file
        os.remove(filename)

        # Save the prediction to the database
        chat_message = Chat(user=request.user, prediction=prediction)
        chat_message.save()

        # Redirect to the home page or any other page you want
        return redirect('/')
    else:
        return HttpResponse('Invalid request method')



def post(request):
    if request.method == "POST":
        msg = request.POST.get('msgbox', None)
        print('Our value = ', msg)
        chat_message = Chat(user=request.user, message=msg)
        if msg != '':
            chat_message.save()
        return JsonResponse({'msg': msg, 'user': chat_message.user.username})
    else:
        return HttpResponse('Request should be POST.')


def messages(request):
    chat = Chat.objects.all()
    return render(request, 'messages.html', {'chat': chat})





