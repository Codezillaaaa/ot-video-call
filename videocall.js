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

// Show/hide local profile placeholder when I turn my camera off
function showLocalPlaceholder(show) {
    const placeholder = document.getElementById('local-video-placeholder');
    if (placeholder) {
        if (show) {
            placeholder.classList.remove('hidden');
            // We don't need to hide localVideo because z-index 15 covers z-index 10
        } else {
            placeholder.classList.add('hidden');
        }
    }
}

// Initialize profile picture from URL parameter
function initProfilePicture() {
    try {
        const urlParams = new URLSearchParams(window.location.search);

        // Remote Profile Pic
        const imgElement = document.getElementById('remote-profile-pic');
        if (imgElement) {
            imgElement.onerror = function () { this.src = DEFAULT_AVATAR; };
            const profilePic = urlParams.get('profilePic');
            if (profilePic) {
                imgElement.src = decodeURIComponent(profilePic);
            } else {
                imgElement.src = DEFAULT_AVATAR;
            }
        }

        // Local Self Profile Pic
        const localImgElement = document.getElementById('local-profile-pic');
        if (localImgElement) {
            localImgElement.onerror = function () { this.src = DEFAULT_AVATAR; };
            const selfProfilePic = urlParams.get('selfProfilePic');
            if (selfProfilePic) {
                localImgElement.src = decodeURIComponent(selfProfilePic);
            } else {
                localImgElement.src = DEFAULT_AVATAR;
            }
        }

    } catch (e) {
        console.log('Error loading profile picture:', e);
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


const turnServers = [
    // 1) gomepif898@haotuwu.com
    {
        urls: [
            "turn:bn-turn1.xirsys.com:80?transport=udp",
            "turn:bn-turn1.xirsys.com:3478?transport=udp",
            "turn:bn-turn1.xirsys.com:80?transport=tcp",
            "turn:bn-turn1.xirsys.com:3478?transport=tcp",
            "turns:bn-turn1.xirsys.com:443?transport=tcp",
            "turns:bn-turn1.xirsys.com:5349?transport=tcp"
        ],
        username: "DbKPwfXrz4KtlM7FpK6d5QXPGyl_p9iMw33FYW6x7YENX93zZTbYvnX4LB7RGiGnAAAAAGkGBPNnb21lcGlmODk4",
        credential: "0e384d54-b723-11f0-a364-0242ac140004"
    },
    // 2) vigopa5442@nctime.com
    {
        urls: [
            "turn:bn-turn2.xirsys.com:80?transport=udp",
            "turn:bn-turn2.xirsys.com:3478?transport=udp",
            "turn:bn-turn2.xirsys.com:80?transport=tcp",
            "turn:bn-turn2.xirsys.com:3478?transport=tcp",
            "turns:bn-turn2.xirsys.com:443?transport=tcp",
            "turns:bn-turn2.xirsys.com:5349?transport=tcp"
        ],
        username: "vBgha3qZeRZO9dEDbaqFdZw1yC5Rg8hecZoo8G8bczaII5GwjQs0gvG-8MrPQgE0AAAAAGlIqVV2aWdvcGE1NDQy",
        credential: "d5abcfac-dedb-11f0-be86-0242ac140004"
    },
    // 3) ram@gmail.com
    {
        urls: [
            "turn:bn-turn2.xirsys.com:80?transport=udp",
            "turn:bn-turn2.xirsys.com:3478?transport=udp",
            "turn:bn-turn2.xirsys.com:80?transport=tcp",
            "turn:bn-turn2.xirsys.com:3478?transport=tcp",
            "turns:bn-turn2.xirsys.com:443?transport=tcp",
            "turns:bn-turn2.xirsys.com:5349?transport=tcp"
        ],
        username: "i9OXzS9amIZ3PF4Y148L8qQFaZhbYIQoskGKPWkP0daKGwEWp4j-4wO8d2aue5TTAAAAAGlIqf1yYW03NDE=",
        credential: "39ee08ea-dedc-11f0-8fca-0242ac140004"
    },
    // 4) bhav@gmail.com
    {
        urls: [
            "turn:bn-turn2.xirsys.com:80?transport=udp",
            "turn:bn-turn2.xirsys.com:3478?transport=udp",
            "turn:bn-turn2.xirsys.com:80?transport=tcp",
            "turn:bn-turn2.xirsys.com:3478?transport=tcp",
            "turns:bn-turn2.xirsys.com:443?transport=tcp",
            "turns:bn-turn2.xirsys.com:5349?transport=tcp"
        ],
        username: "rWs9lAtEAu6QnZrXwQ6zQZqOmmsXEJctt_wORLWA1SwSnY6uA2y1Ta2f2JMgQOa9AAAAAGlIqrBiaGF2MTIz",
        credential: "a4c7d3f8-dedc-11f0-9c2b-0242ac140004"
    },
    // 5) ramji@gmail.com
    {
        urls: [
            "turn:bn-turn1.xirsys.com:80?transport=udp",
            "turn:bn-turn1.xirsys.com:3478?transport=udp",
            "turn:bn-turn1.xirsys.com:80?transport=tcp",
            "turn:bn-turn1.xirsys.com:3478?transport=tcp",
            "turns:bn-turn1.xirsys.com:443?transport=tcp",
            "turns:bn-turn1.xirsys.com:5349?transport=tcp"
        ],
        username: "xv1-aOqYqu7QYMQ71xy7hR2nY9PGHHxIbLulUful4jrM7LYfIAp6q0_fXAkQS8EAAAAAAGlIqxFyYW1qaTEyMw==",
        credential: "de471c10-dedc-11f0-a5e7-0242ac140004"
    },
    // 6) chia123@gmail.com
    {
        urls: [
            "turn:fr-turn7.xirsys.com:80?transport=udp",
            "turn:fr-turn7.xirsys.com:3478?transport=udp",
            "turn:fr-turn7.xirsys.com:80?transport=tcp",
            "turn:fr-turn7.xirsys.com:3478?transport=tcp",
            "turns:fr-turn7.xirsys.com:443?transport=tcp",
            "turns:fr-turn7.xirsys.com:5349?transport=tcp"
        ],
        username: "rj4y6TfwJqJdVrmMfveeAwRumOVqP5kHdZVFDs2VLEtD10njp5TtkFWP7PpRMRKsAAAAAGmGGLhjaGlhMzAxMg==",
        credential: "168cd7e2-037a-11f1-ab48-2692ddfec16f"
    },
    // 7) opentalkies123@gmail.com
    {
        urls: [
            "turn:fr-turn1.xirsys.com:80?transport=udp",
            "turn:fr-turn1.xirsys.com:3478?transport=udp",
            "turn:fr-turn1.xirsys.com:80?transport=tcp",
            "turn:fr-turn1.xirsys.com:3478?transport=tcp",
            "turns:fr-turn1.xirsys.com:443?transport=tcp",
            "turns:fr-turn1.xirsys.com:5349?transport=tcp"
        ],
        username: "ggZm0QoKyGFM8HUZtqOoqCBCBqcKRahsHKh_YBHp0kHVU-XcsWpbL671G7Q3b0E0AAAAAGmGGYJUYWxraWVz",
        credential: "8ec4d700-037a-11f1-bc66-7edf306f7ebf"
    },
    // 8) zidu123@gmail.com
    {
        urls: [
            "turn:fr-turn2.xirsys.com:80?transport=udp",
            "turn:fr-turn2.xirsys.com:3478?transport=udp",
            "turn:fr-turn2.xirsys.com:80?transport=tcp",
            "turn:fr-turn2.xirsys.com:3478?transport=tcp",
            "turns:fr-turn2.xirsys.com:443?transport=tcp",
            "turns:fr-turn2.xirsys.com:5349?transport=tcp"
        ],
        username: "CJtunXNLCjaMWYn5461GEOPLnNIb_TqSdUohBmjVfxPXmEup6A_8SCLg4C-8D1vZAAAAAGmGGrxaaWR1",
        credential: "4a255092-037b-11f1-9866-ea92d184e9b1"
    },
    // 9) nade312@gmail.com
    {
        urls: [
            "turn:fr-turn2.xirsys.com:80?transport=udp",
            "turn:fr-turn2.xirsys.com:3478?transport=udp",
            "turn:fr-turn2.xirsys.com:80?transport=tcp",
            "turn:fr-turn2.xirsys.com:3478?transport=tcp",
            "turns:fr-turn2.xirsys.com:443?transport=tcp",
            "turns:fr-turn2.xirsys.com:5349?transport=tcp"
        ],
        username: "FU4vDlmxTUbkzw5LkmfCEQTtKVSmpG5TnKBp4S2WL6lNjS3SXJ8pUTPYRj5VFOCOAAAAAGmGHCluYWRlZW0zMDE=",
        credential: "23a58ec2-037c-11f1-a00b-ea92d184e9b1"
    },
    // 10) tara201@gmail.com
    {
        urls: [
            "turn:fr-turn4.xirsys.com:80?transport=udp",
            "turn:fr-turn4.xirsys.com:3478?transport=udp",
            "turn:fr-turn4.xirsys.com:80?transport=tcp",
            "turn:fr-turn4.xirsys.com:3478?transport=tcp",
            "turns:fr-turn4.xirsys.com:443?transport=tcp",
            "turns:fr-turn4.xirsys.com:5349?transport=tcp"
        ],
        username: "_vfghiaZivZRwOkGoBzSlmTD-Yy_OEBpoh1HwupC7Kko1BGLFreSJrKM5r_IAvA2AAAAAGmGID10YXJhMjEz",
        credential: "9235cdb4-037e-11f1-828c-9ef8695d8785"
    },
    // 11) xyz124@gmail.com
    {
        urls: [
            "turn:fr-turn3.xirsys.com:80?transport=udp",
            "turn:fr-turn3.xirsys.com:3478?transport=udp",
            "turn:fr-turn3.xirsys.com:80?transport=tcp",
            "turn:fr-turn3.xirsys.com:3478?transport=tcp",
            "turns:fr-turn3.xirsys.com:443?transport=tcp",
            "turns:fr-turn3.xirsys.com:5349?transport=tcp"
        ],
        username: "YvuEO6bQLAQOXnfV-MdH922R37mlrTgPfiKCc5sJmt5ynFfu7UrW1D2I4osDd13HAAAAAGmGIVB4b3kxMg==",
        credential: "36142386-037f-11f1-a6b4-6ab23e5fbfc5"
    },
    // 12) ert@gmail.com
    {
        urls: [
            "turn:fr-turn2.xirsys.com:80?transport=udp",
            "turn:fr-turn2.xirsys.com:3478?transport=udp",
            "turn:fr-turn2.xirsys.com:80?transport=tcp",
            "turn:fr-turn2.xirsys.com:3478?transport=tcp",
            "turns:fr-turn2.xirsys.com:443?transport=tcp",
            "turns:fr-turn2.xirsys.com:5349?transport=tcp"
        ],
        username: "2ybGSU_UN5IVrJkB0nDtWISMOPhNQwbP2xP_LIgMFS5u47nOQ3Y42AoDWiNP3H7NAAAAAGmG8FRFcmExMg==",
        credential: "99ff898c-03fa-11f1-88b9-ea92d184e9b1"
    },
    // 13) ramacharan@gmail.com
    {
        urls: [
            "turn:fr-turn1.xirsys.com:80?transport=udp",
            "turn:fr-turn1.xirsys.com:3478?transport=udp",
            "turn:fr-turn1.xirsys.com:80?transport=tcp",
            "turn:fr-turn1.xirsys.com:3478?transport=tcp",
            "turns:fr-turn1.xirsys.com:443?transport=tcp",
            "turns:fr-turn1.xirsys.com:5349?transport=tcp"
        ],
        username: "wsJd_jzw2JU1Um7Qn3fkiQl0ZIF-f09jiOOw6cMTBEm0yROT5KSxixD70n1PciTgAAAAAGmG8PpSQU1B",
        credential: "fd12a068-03fa-11f1-b468-7edf306f7ebf"
    },
    // 14) kara56@gmail.com
    {
        urls: [
            "turn:fr-turn4.xirsys.com:80?transport=udp",
            "turn:fr-turn4.xirsys.com:3478?transport=udp",
            "turn:fr-turn4.xirsys.com:80?transport=tcp",
            "turn:fr-turn4.xirsys.com:3478?transport=tcp",
            "turns:fr-turn4.xirsys.com:443?transport=tcp",
            "turns:fr-turn4.xirsys.com:5349?transport=tcp"
        ],
        username: "SueccVN8Vkxem2Me-xUSmEF7qZJSeb05eMfY91NpzsvcB16Fl1vg7Xybzx2-34bCAAAAAGmG8nRLQVJBMDEy",
        credential: "de7d28de-03fb-11f1-9f12-9ef8695d8785"
    },
    // 15) mrindia45@gmail.com
    {
        urls: [
            "turn:fr-turn7.xirsys.com:80?transport=udp",
            "turn:fr-turn7.xirsys.com:3478?transport=udp",
            "turn:fr-turn7.xirsys.com:80?transport=tcp",
            "turn:fr-turn7.xirsys.com:3478?transport=tcp",
            "turns:fr-turn7.xirsys.com:443?transport=tcp",
            "turns:fr-turn7.xirsys.com:5349?transport=tcp"
        ],
        username: "n4j0sTgHHDPLw3dwmxvX34hODKC85FW8lgwbNNKoeC06zPxdaK3WnScMzcmHFue5AAAAAGmG9MpNUklZQTEy",
        credential: "42cb7e66-03fd-11f1-97d4-2692ddfec16f"
    },
    // 16) maddy34@gmail.com
    {
        urls: [
            "turn:fr-turn8.xirsys.com:80?transport=udp",
            "turn:fr-turn8.xirsys.com:3478?transport=udp",
            "turn:fr-turn8.xirsys.com:80?transport=tcp",
            "turn:fr-turn8.xirsys.com:3478?transport=tcp",
            "turns:fr-turn8.xirsys.com:443?transport=tcp",
            "turns:fr-turn8.xirsys.com:5349?transport=tcp"
        ],
        username: "MZOe_NF-WB7DEuY7Pe3n2UjD4Ck6T_E9l0CzXNSDMFnGrQwwaiL_IW4Py3lvh4abAAAAAGmG-FhtYWRkeQ==",
        credential: "60d77548-03ff-11f1-a544-be96737d4d7e"
    },
    // 17) darkworld45@gmail.com
    {
        urls: [
            "turn:fr-turn3.xirsys.com:80?transport=udp",
            "turn:fr-turn3.xirsys.com:3478?transport=udp",
            "turn:fr-turn3.xirsys.com:80?transport=tcp",
            "turn:fr-turn3.xirsys.com:3478?transport=tcp",
            "turns:fr-turn3.xirsys.com:443?transport=tcp",
            "turns:fr-turn3.xirsys.com:5349?transport=tcp"
        ],
        username: "aylk4jJfi1L9kt3npPiH1xCKWLrEz6crbPbPF-iNNKU8-1ZFhQppmYgXdv5bVgHZAAAAAGmG-RJEYXJrMTI=",
        credential: "cfae6c7e-03ff-11f1-97ac-6ab23e5fbfc5"
    },
    // 18) karz79@gmail.com
    {
        urls: [
            "turn:fr-turn8.xirsys.com:80?transport=udp",
            "turn:fr-turn8.xirsys.com:3478?transport=udp",
            "turn:fr-turn8.xirsys.com:80?transport=tcp",
            "turn:fr-turn8.xirsys.com:3478?transport=tcp",
            "turns:fr-turn8.xirsys.com:443?transport=tcp",
            "turns:fr-turn8.xirsys.com:5349?transport=tcp"
        ],
        username: "T-ZE3vQJ6E19e6yPW-qcT9HX0Bxve1_qWQ1FDvpco-AxOG2ZO1eMAbpy8AFW0oNZAAAAAGmG-c9rYXJ6MjE=",
        credential: "40477ba6-0400-11f1-8cf0-be96737d4d7e"
    },
    // 19) ss46@gmail.com
    {
        urls: [
            "turn:fr-turn8.xirsys.com:80?transport=udp",
            "turn:fr-turn8.xirsys.com:3478?transport=udp",
            "turn:fr-turn8.xirsys.com:80?transport=tcp",
            "turn:fr-turn8.xirsys.com:3478?transport=tcp",
            "turns:fr-turn8.xirsys.com:443?transport=tcp",
            "turns:fr-turn8.xirsys.com:5349?transport=tcp"
        ],
        username: "BxamUcb_5d-HBnOgnJgLud0h8J5RQmHehtAuBaJN34O8IUWod3_yZRmPrsEkfTf6AAAAAGmG-mhTYW5qdQ==",
        credential: "9bd2e23a-0400-11f1-a846-be96737d4d7e"
    },
    // 20) ii79@gmail.com
    {
        urls: [
            "turn:fr-turn3.xirsys.com:80?transport=udp",
            "turn:fr-turn3.xirsys.com:3478?transport=udp",
            "turn:fr-turn3.xirsys.com:80?transport=tcp",
            "turn:fr-turn3.xirsys.com:3478?transport=tcp",
            "turns:fr-turn3.xirsys.com:443?transport=tcp",
            "turns:fr-turn3.xirsys.com:5349?transport=tcp"
        ],
        username: "bKPWAv0z1hZe-RHxMzPXRRsg1EiH0iTF_bmkt0wO4VKc7cSChsSbo3DP_6m8_Dj0AAAAAGmG-yVpdGk0MzE=",
        credential: "0c419b10-0401-11f1-8ad0-6ab23e5fbfc5"
    },
    // 21) at97@gmail.com
    {
        urls: [
            "turn:fr-turn4.xirsys.com:80?transport=udp",
            "turn:fr-turn4.xirsys.com:3478?transport=udp",
            "turn:fr-turn4.xirsys.com:80?transport=tcp",
            "turn:fr-turn4.xirsys.com:3478?transport=tcp",
            "turns:fr-turn4.xirsys.com:443?transport=tcp",
            "turns:fr-turn4.xirsys.com:5349?transport=tcp"
        ],
        username: "VKagpXV8VN4T-vTNNytiJ8Fw_BKNARvTPQQAacMm1HqttEokHy3KIOK3j6V5AQXqAAAAAGmG_bFBdHlhMQ==",
        credential: "9108569e-0402-11f1-9ca5-9ef8695d8785"
    },
    // 22) ocean9988@gmail.com
    {
        urls: [
            "turn:fr-turn7.xirsys.com:80?transport=udp",
            "turn:fr-turn7.xirsys.com:3478?transport=udp",
            "turn:fr-turn7.xirsys.com:80?transport=tcp",
            "turn:fr-turn7.xirsys.com:3478?transport=tcp",
            "turns:fr-turn7.xirsys.com:443?transport=tcp",
            "turns:fr-turn7.xirsys.com:5349?transport=tcp"
        ],
        username: "ZLjKXQoq1knX17viPFEUuYQo2O4hmgAb__1vl1_pc-O0yzZ7-8f5Y7Sl8qEDe3dIAAAAAGmHAAlPc2hp",
        credential: "f6a8a21e-0403-11f1-bede-2692ddfec16f"
    },
    // 23) hh68@gmail.com
    {
        urls: [
            "turn:fr-turn1.xirsys.com:80?transport=udp",
            "turn:fr-turn1.xirsys.com:3478?transport=udp",
            "turn:fr-turn1.xirsys.com:80?transport=tcp",
            "turn:fr-turn1.xirsys.com:3478?transport=tcp",
            "turns:fr-turn1.xirsys.com:443?transport=tcp",
            "turns:fr-turn1.xirsys.com:5349?transport=tcp"
        ],
        username: "PGIeZGB7mF2QiNxQ1suEUVm4csDlw-2PRoH44Yz2rAmuS41V9xHf8cp3ISYZPHWnAAAAAGmHAZpIYXJz",
        credential: "e5effa34-0404-11f1-aad9-7edf306f7ebf"
    },
    // 24) gau345@gmail.com
    {
        urls: [
            "turn:fr-turn3.xirsys.com:80?transport=udp",
            "turn:fr-turn3.xirsys.com:3478?transport=udp",
            "turn:fr-turn3.xirsys.com:80?transport=tcp",
            "turn:fr-turn3.xirsys.com:3478?transport=tcp",
            "turns:fr-turn3.xirsys.com:443?transport=tcp",
            "turns:fr-turn3.xirsys.com:5349?transport=tcp"
        ],
        username: "-uKkcLIdBMOR1lCmriE2O0Q7Qk94hV4C9XN8EuBvemMYb3aCVT4PX13ubHSlHstnAAAAAGmHAi9HYXZ5",
        credential: "3eae7c7c-0405-11f1-819d-6ab23e5fbfc5"
    },
    // 25) sixt@gmail.com
    {
        urls: [
            "turn:fr-turn4.xirsys.com:80?transport=udp",
            "turn:fr-turn4.xirsys.com:3478?transport=udp",
            "turn:fr-turn4.xirsys.com:80?transport=tcp",
            "turn:fr-turn4.xirsys.com:3478?transport=tcp",
            "turns:fr-turn4.xirsys.com:443?transport=tcp",
            "turns:fr-turn4.xirsys.com:5349?transport=tcp"
        ],
        username: "v_CJUPQjBv41xIE7m3kISOEO8CKZ15oz9eDetXwSQeD71o9kcEc2sMN7w6kH10ESAAAAAGmHArVBbXl5",
        credential: "8e620702-0405-11f1-a0a5-9ef8695d8785"
    },
    // 26) Me35@gmail.com
    {
        urls: [
            "turn:fr-turn1.xirsys.com:80?transport=udp",
            "turn:fr-turn1.xirsys.com:3478?transport=udp",
            "turn:fr-turn1.xirsys.com:80?transport=tcp",
            "turn:fr-turn1.xirsys.com:3478?transport=tcp",
            "turns:fr-turn1.xirsys.com:443?transport=tcp",
            "turns:fr-turn1.xirsys.com:5349?transport=tcp"
        ],
        username: "C8s807ulcMK5lYN--zF1au8WwfnWjgJjuQNxR2dnE_n0QtDDmIPoL9hQMTKRfpHMAAAAAGmHBIFtYWdneQ==",
        credential: "a085032a-0406-11f1-ace9-7edf306f7ebf"
    },
    // 27) quezs@gmail.com
    {
        urls: [
            "turn:fr-turn4.xirsys.com:80?transport=udp",
            "turn:fr-turn4.xirsys.com:3478?transport=udp",
            "turn:fr-turn4.xirsys.com:80?transport=tcp",
            "turn:fr-turn4.xirsys.com:3478?transport=tcp",
            "turns:fr-turn4.xirsys.com:443?transport=tcp",
            "turns:fr-turn4.xirsys.com:5349?transport=tcp"
        ],
        username: "_s7ftHMuNCR5Q1qSqwqVaaiHUo_i7G0YfXtSEPzrLKTvXIqA8HY6Z8sLhTUxnfJZAAAAAGmHBStxdWV6eg==",
        credential: "05c8d2b6-0407-11f1-8d01-9ef8695d8785"
    },
    // 28) pratik97669966@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "a9168b498248d4191b0db8f5",
        credential: "ctHDsDa6o0MGsDB1"
    },
    // 29) dipshaghosh007@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "c7bf2150d5f61a495d83e698",
        credential: "74LI3RX6uwc+FXx1"
    },
    // 30) vik2687@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "3225d9a515e21b5ca07c23fe",
        credential: "w+bC5EXBNr7Kgyan"
    },
    // 31) paulinpreethi76@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "24969779c90a18c50a765561",
        credential: "pL6C74Hw+7Fr++b0"
    },
    // 32) rini.v314@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "2513b8e3c44fdfe12672cb46",
        credential: "G4AS0dGTIhEW4sr2"
    },
    // 33) vgun.gun056@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "679dbcc2f9266a12c72824c6",
        credential: "0VCj1/664MrXISqZ"
    },
    // 34) vrini599@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "01a81a6635b021d73264241f",
        credential: "jDyYhv2Tg3c/7D9X"
    },
    // 35) ashishjn1997@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "e861830987e4bbacb11ac5b0",
        credential: "Ki+JzTyZT/fknqd6"
    },
    // 36) remotejobs4@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "fdfef63fa7908ec972e2e0af",
        credential: "npNxbCnTob25H1VU"
    },
    // 37) alpanamasih84@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "a139ca4a9f18d7eb71c8ccee",
        credential: "+2xcbXx1pZdmroh+"
    },
    // 38) rinkyshing76@gmail.com
    {
        urls: [
            "turn:global.relay.metered.ca:80",
            "turn:global.relay.metered.ca:80?transport=tcp",
            "turn:global.relay.metered.ca:443",
            "turns:global.relay.metered.ca:443?transport=tcp"
        ],
        username: "0b899d87caa1cb7973a6fd25",
        credential: "hVplZQkCdqf6SNp5"
    }
];

function getIceServerConfig() {
    // Always include these STUN servers for robust NAT traversal
    const iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.relay.metered.ca:80" }
    ];

    // Pick one random TURN server if available
    if (turnServers.length > 0) {
        const randomServer = turnServers[Math.floor(Math.random() * turnServers.length)];
        iceServers.push(randomServer);
    }

    return {
        iceServers: iceServers,
        sdpSemantics: 'unified-plan'
    };
}

let peer
function init(userId) {
    peer = new Peer(userId, {
        host: '0.peerjs.com', secure: true, port: 443,
        config: getIceServerConfig(),
    })
    peer.on('open', () => {
        Android.onPeerConnected()
    })

    // Handle incoming data connection
    peer.on('connection', (conn) => {
        setupDataConnection(conn);
    });

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

        // Establish data connection for signaling
        const conn = peer.connect(otherUserId);
        setupDataConnection(conn);

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

// Data connections for signaling camera status
let dataConnections = [];

// Broadcast camera status to all connected peers
function broadcastCameraStatus(enabled) {
    dataConnections.forEach(conn => {
        if (conn.open) {
            conn.send({ type: 'camera_status', enabled: enabled });
        }
    });
}

function setupDataConnection(conn) {
    dataConnections.push(conn);
    conn.on('open', () => {
        // Send initial state
        if (localStream && localStream.getVideoTracks().length > 0) {
            conn.send({
                type: 'camera_status',
                enabled: localStream.getVideoTracks()[0].enabled
            });
        }
    });
    conn.on('data', (data) => {
        if (data.type === 'camera_status') {
            if (data.enabled) {
                console.log('Received signal: Camera ON');
                showRemotePlaceholder(false);
            } else {
                console.log('Received signal: Camera OFF');
                showRemotePlaceholder(true);
            }
        }
    });
    conn.on('close', () => {
        dataConnections = dataConnections.filter(c => c !== conn);
    });
    conn.on('error', (err) => {
        console.error('Data connection error:', err);
    });
}

function toggleVideo(b) {
    if (localStream && localStream.getVideoTracks().length > 0) {
        let enabled = (b == "true");
        localStream.getVideoTracks()[0].enabled = enabled;
        broadcastCameraStatus(enabled);

        // Show/hide local placeholder
        if (enabled) {
            showLocalPlaceholder(false);
        } else {
            showLocalPlaceholder(true);
        }
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
