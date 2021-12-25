let myVideoStream;
const Socket = io('/');

var roomGrid = document.getElementById('room-grid');
var vedioElement = document.createElement('video');
vedioElement.muted = true;

// var mypeer = new Peer(undefined, {
//     path: '/peerjs',
//     host: '/',
//     port: '3000'
//   });

var mypeer = new Peer();


// console.log(mypeer.call());

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    // console.log(stream);
    myVideoStream = stream

    addVedioStream(vedioElement, stream);

    mypeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream', userVedioStream => {
            // console.log('call answer'+ userVedioStream);

            addVedioStream(video, userVedioStream)
        })
        call.on('error', function (err) {
            console.log('Failed to get local stream : ' + err);
        })
    })

    Socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })
});


//console.log(myVideoStream);

mypeer.on('open', id => {
    Socket.emit('join-room', roomId, id);
    // console.log(id);
})

Socket.on('user-disconnected', useId => {
    if(peers[userId]) peers[userId].close();
})


function connectToNewUser(userId, stream) {
    // console.log(userId);
    const call = mypeer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVedioStream => {
        // console.log(userVedioStream);
        addVedioStream(video, userVedioStream);
    })
    call.on('close', () => {
        video.remove()
      })

    call.on('error', function (err) {
        console.log('Failed to get local stream : ' + err);
    })
}

function addVedioStream(vedio, stream) {
    vedio.srcObject = stream;
    vedio.addEventListener('loadedmetadata', () => {
        vedio.play();
    })
    //console.log('vedio stream');
    roomGrid.append(vedio);
}



//messages  
let text = $('input');
// console.log(text);

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        //console.log(text.val());
        Socket.emit('message', text.val());
        text.val('');
    }
})

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


Socket.on('createMessage', (message) => {
    //console.log("this is a message from server: " + message);
    $('.messages').append(`<li class="message_list"><b>user</b><br />${message}</li>`);
    scrollToBottom();
})



// Mute our video 

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayButton();
    }else{
        setStopButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setUnmuteButton = () => {
    let html = '<i class="fas fa-microphone-slash stop_mic"></i><span>Unmute</span>';
    $('.main__mute_btn').html(html);
}

const setMuteButton = () => {
    let html = '<i class="fas fa-microphone"></i><span>Mute</span>';
    $('.main__mute_btn').html(html);
}

const setPlayButton = () => {
    let html = '<i class="stop fas fa-video-slash stop_vedio"></i><span>Play Video</span>';
    $('.main__video_btn').html(html);
}

const setStopButton = () => {
    let html = '<i class="fas fa-video"></i><span>Stop Video</span>';
    $('.main__video_btn').html(html);
}

const leaveFun = () => {
    myVideoStream.getAudioTracks()[0].enabled = false;
    myVideoStream.getVideoTracks()[0].enabled = false;
    window.location.href = '/t/thanks';
}
