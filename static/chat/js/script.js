$('#chat-form').on('submit', function(event){
    event.preventDefault();

    $.ajax({
        url : 'post/',
        type : 'POST',
        data : { 'msgbox' : $('#chat-msg').val() },

        success : function(json){
            $('#chat-msg').val('');
            $('#msg-list').append('<li class="text-right list-group-item">' + json.msg + '</li>');
            var chatlist = document.getElementById('msg-list-div');
            chatlist.scrollTop = chatlist.scrollHeight;
        }
    });
});

function getMessages(){
    if (!scrolling) {
        $.get('/messages/', function(messages){
            $('#msg-list').html(messages);
        });
    }
    scrolling = false;
}

var scrolling = false;
$(function(){
    $('#msg-list-div').on('scroll', function(){
        scrolling = true;
    });
    refreshTimer = setInterval(getMessages, 500);
});


// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$(document).ready(function() {
    $('#send').attr('disabled','disabled');
    $('#chat-msg').keyup(function() {
        if($(this).val() != '') {
            $('#send').removeAttr('disabled');
        }
        else {
            $('#send').attr('disabled','disabled');
        }
    });

});


// Capture audio from the user's microphone
function captureAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            // Initialize MediaRecorder
            var mediaRecorder = new MediaRecorder(stream);
            var chunks = [];

            mediaRecorder.ondataavailable = function(event) {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = function() {
                // Convert recorded audio chunks to a Blob
                var audioBlob = new Blob(chunks, { type: 'audio/wav' });
                
                // Send the recorded audio Blob to the Django backend
                sendAudioToBackend(audioBlob);
            };

            // Start recording audio
            mediaRecorder.start();

            // Stop recording after a certain duration (e.g., 10 seconds)
            setTimeout(function() {
                mediaRecorder.stop();
            }, 10000);
        })
        .catch(function(error) {
            console.error('Error accessing microphone:', error);
        });
}

// Send recorded audio data to the Django backend
function sendAudioToBackend(audioBlob) {
    var formData = new FormData();
    formData.append('audio', audioBlob);

    fetch('/predict/', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Handle prediction results returned by the backend
        console.log('Prediction:', data.prediction);
    })
    .catch(function(error) {
        console.error('Error sending audio to backend:', error);
    });
}
