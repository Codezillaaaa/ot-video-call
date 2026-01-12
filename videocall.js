let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }

// Remote profile picture URL (passed from Android via URL param)
let remoteProfilePicUrl = '';

// Default avatar SVG as data URI
const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#444"/><circle cx="50" cy="35" r="20" fill="#666"/><ellipse cx="50" cy="85" rx="30" ry="25" fill="#666"/></svg>');

// Initialize profile picture from URL parameter
function initProfilePicture() {
    try {
        const imgElement = document.getElementById('remote-profile-pic');
        if (imgElement) {
            // Set fallback on error
            imgElement.onerror = function () {
                this.src = DEFAULT_AVATAR;
            };

            const urlParams = new URLSearchParams(window.location.search);
            const profilePic = urlParams.get('profilePic');
            if (profilePic) {
                remoteProfilePicUrl = decodeURIComponent(profilePic);
                imgElement.src = remoteProfilePicUrl;
            } else {
                imgElement.src = DEFAULT_AVATAR;
            }
        }
    } catch (e) {
        console.log('Error loading profile picture:', e);
    }
}

// Show/hide profile placeholder when remote user turns camera off
function showRemotePlaceholder(show) {
    const placeholder = document.getElementById('remote-video-placeholder');
    if (placeholder) {
        if (show) {
            placeholder.classList.remove('hidden');
            remoteVideo.style.opacity = 0;
        } else {
            placeholder.classList.add('hidden');
            remoteVideo.style.opacity = 1;
        }
    }
}

// Attach mute/unmute listeners to remote video track
function attachRemoteTrackListeners(remoteStream) {
    if (remoteStream && remoteStream.getVideoTracks().length > 0) {
        const videoTrack = remoteStream.getVideoTracks()[0];

        videoTrack.onmute = () => {
            console.log('Remote camera turned OFF');
            showRemotePlaceholder(true);
        };

        videoTrack.onunmute = () => {
            console.log('Remote camera turned ON');
            showRemotePlaceholder(false);
        };

        // Check initial state - if track is muted from start
        if (videoTrack.muted) {
            showRemotePlaceholder(true);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProfilePicture);


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

    // Initialize camera list on peer open
    initializeCameraList();
    listen();
}

let localStream

// Camera management - robust approach for all devices
let videoDevices = [];
let currentCameraIndex = 0;
let currentVideoDeviceId = null;

// Initialize camera list by enumerating devices
async function initializeCameraList() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available cameras:', videoDevices.length);

        // Usually front camera is listed first on mobile devices
        if (videoDevices.length > 0) {
            currentCameraIndex = 0;
            currentVideoDeviceId = videoDevices[0].deviceId;
        }
    } catch (error) {
        console.error('Error enumerating devices:', error);
    }
}

function listen() {
    peer.on('call', (call) => {

        navigator.getUserMedia({
            audio: true,
            video: true
        }, (stream) => {
            localVideo.srcObject = stream
            localStream = stream

            // Store current camera device ID
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                const settings = videoTrack.getSettings();
                currentVideoDeviceId = settings.deviceId;
                // Find current camera index
                currentCameraIndex = videoDevices.findIndex(d => d.deviceId === currentVideoDeviceId);
                if (currentCameraIndex === -1) currentCameraIndex = 0;
            }

            call.answer(stream)
            call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream

                remoteVideo.className = "primary-video"
                localVideo.className = "secondary-video"

                // Attach listeners to detect when remote user turns camera off
                attachRemoteTrackListeners(remoteStream);
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

        // Store current camera device ID
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            const settings = videoTrack.getSettings();
            currentVideoDeviceId = settings.deviceId;
            // Find current camera index
            currentCameraIndex = videoDevices.findIndex(d => d.deviceId === currentVideoDeviceId);
            if (currentCameraIndex === -1) currentCameraIndex = 0;
        }

        const call = peer.call(otherUserId, stream)
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream

            remoteVideo.className = "primary-video"
            localVideo.className = "secondary-video"

            // Attach listeners to detect when remote user turns camera off
            attachRemoteTrackListeners(remoteStream);
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
    if (localStream && localStream.getVideoTracks().length > 0) {
        localStream.getVideoTracks()[0].enabled = (b == "true");
    }
}

function toggleAudio(b) {
    if (localStream && localStream.getAudioTracks().length > 0) {
        localStream.getAudioTracks()[0].enabled = (b == "true");
    }
}

// Debounce flag to prevent rapid flip camera clicks
let isFlippingCamera = false;
const FLIP_COOLDOWN_MS = 1500; // 1.5 second cooldown between flips

// Robust flip camera - uses device enumeration instead of facingMode
// Works on all devices including Xiaomi, Samsung, etc.
async function flipCamera() {
    // Prevent rapid clicks - causes black screen on some devices
    if (isFlippingCamera) {
        console.log('Camera flip in progress, ignoring click');
        return;
    }

    isFlippingCamera = true;

    try {
        // Refresh device list
        const devices = await navigator.mediaDevices.enumerateDevices();
        videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length < 2) {
            console.log('Only one camera available, cannot flip');
            isFlippingCamera = false;
            return;
        }

        // Move to next camera (cycle through all cameras)
        currentCameraIndex = (currentCameraIndex + 1) % videoDevices.length;
        const newDeviceId = videoDevices[currentCameraIndex].deviceId;

        console.log('Switching to camera:', currentCameraIndex, newDeviceId);

        // Get new video stream with specific device ID (most reliable method)
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: { exact: newDeviceId }
            },
            audio: false
        });

        // Get old and new video tracks
        const oldVideoTrack = localStream.getVideoTracks()[0];
        const newVideoTrack = newStream.getVideoTracks()[0];

        if (!newVideoTrack) {
            console.error('Failed to get new video track');
            return;
        }

        // Replace track in local stream
        localStream.removeTrack(oldVideoTrack);
        localStream.addTrack(newVideoTrack);

        // Update current device ID
        currentVideoDeviceId = newDeviceId;

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

        // Stop old track to release camera
        oldVideoTrack.stop();

        console.log('Camera switched successfully to index:', currentCameraIndex);

    } catch (error) {
        console.error('Error flipping camera:', error);
        // Try alternative method with facingMode as fallback
        try {
            await flipCameraFallback();
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
        }
    } finally {
        // Reset debounce flag after cooldown period
        setTimeout(() => {
            isFlippingCamera = false;
        }, FLIP_COOLDOWN_MS);
    }
}

// Fallback flip camera using facingMode (for devices that don't support deviceId)
let useFrontCamera = true;
async function flipCameraFallback() {
    useFrontCamera = !useFrontCamera;
    const facingMode = useFrontCamera ? 'user' : 'environment';

    const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false
    });

    const oldVideoTrack = localStream.getVideoTracks()[0];
    const newVideoTrack = newStream.getVideoTracks()[0];

    localStream.removeTrack(oldVideoTrack);
    localStream.addTrack(newVideoTrack);
    localVideo.srcObject = localStream;

    // Replace in peer connection
    if (peer && peer.connections) {
        Object.values(peer.connections).forEach(connections => {
            connections.forEach(conn => {
                if (conn.peerConnection) {
                    const senders = conn.peerConnection.getSenders();
                    const videoSender = senders.find(s => s.track && s.track.kind === 'video');
                    if (videoSender) {
                        videoSender.replaceTrack(newVideoTrack);
                    }
                }
            });
        });
    }

    oldVideoTrack.stop();
    console.log('Camera switched via fallback to:', facingMode);
}
