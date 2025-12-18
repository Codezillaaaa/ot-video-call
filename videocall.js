let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }


let peer
function init(userId) {
    peer = new Peer(userId, {
        host: '0.peerjs.com', secure: true, port: 443,
        config: {
            iceServers: [
                { url: "stun:stun.l.google.com:19302" },
                {
                    url: "turn:relay1.expressturn.com:3478",
                    username: "efVUZD5UTACRXVRWPZ",
                    credential: "8sySd3wS5s4NU2mR",
                },
            ],
        },
    })
    peer.on('open', () => {
        Android.onPeerConnected()
    })

    listen();
}

let localStream
function listen() {
    peer.on('call', (call) => {

        navigator.getUserMedia({
            audio: true,
            video: true
        }, (stream) => {
            localVideo.srcObject = stream
            localStream = stream

            call.answer(stream)
            call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream

                remoteVideo.className = "primary-video"
                localVideo.className = "secondary-video"

            })

        })

    })
}

function startCall(otherUserId) {
    navigator.getUserMedia({
        audio: true,
        video: true
    }, (stream) => {

        localVideo.srcObject = stream
        localStream = stream

        const call = peer.call(otherUserId, stream)
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream

            remoteVideo.className = "primary-video"
            localVideo.className = "secondary-video"
        })

    })
}
function voiceCall(b) {
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true
    } else {
        localStream.getVideoTracks()[0].enabled = false
    }
}
function toggleVideo(b) {
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true
    } else {
        localStream.getVideoTracks()[0].enabled = false
    }
}

function toggleAudio(b) {
    if (b == "true") {
        localStream.getAudioTracks()[0].enabled = true
    } else {
        localStream.getAudioTracks()[0].enabled = false
    }
}

// Track current camera facing mode
let currentFacingMode = 'user'; // 'user' = front camera, 'environment' = back camera
let currentCall = null;

// Store call reference for track replacement
function setCurrentCall(call) {
    currentCall = call;
}

// Flip camera between front and back
async function flipCamera() {
    try {
        // Toggle facing mode
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

        // Get new video stream with opposite camera
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode },
            audio: false
        });

        // Get old and new video tracks
        const oldVideoTrack = localStream.getVideoTracks()[0];
        const newVideoTrack = newStream.getVideoTracks()[0];

        // Replace track in local stream
        localStream.removeTrack(oldVideoTrack);
        localStream.addTrack(newVideoTrack);

        // Update local video element
        localVideo.srcObject = localStream;

        // Replace track in peer connection if call is active
        if (peer && peer.connections) {
            Object.values(peer.connections).forEach(connections => {
                connections.forEach(conn => {
                    if (conn.peerConnection) {
                        const senders = conn.peerConnection.getSenders();
                        const videoSender = senders.find(sender =>
                            sender.track && sender.track.kind === 'video'
                        );
                        if (videoSender) {
                            videoSender.replaceTrack(newVideoTrack);
                        }
                    }
                });
            });
        }

        // Stop old track
        oldVideoTrack.stop();

        // Notify Android of success
        if (typeof Android !== 'undefined' && Android.onCameraFlipped) {
            Android.onCameraFlipped(currentFacingMode);
        }
    } catch (error) {
        console.error('Error flipping camera:', error);
        // Revert facing mode on error
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    }
}
