/**
 * @twilio.js
 * Provides twilio API video functions.
 *
 * Code adapted from
 * https://github.com/twilio/video-quickstart-js/blob/master/quickstart/src/index.js
 */

import Video from 'twilio-video';

let activeRoom;
let previewTracks;

/**
 * Attaches the tracks to the given container.
 * @param {object} tracks The video track.
 * @param {object} container The video container.
 * @return {undefined}
 */
function attachTracks(tracks, container) {
  tracks.forEach((track) => {
    container.appendChild(track.attach());
  });
}

/**
 * Attaches the participant's Tracks to the given container.
 * @param {object} participant The video participant.
 * @param {object} container The video container.
 * @return {undefined}
 */
function attachParticipantTracks(participant, container) {
  const tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}

/**
 * Detaches the tracks.
 * @param {object} tracks The video tracks.
 * @return {undefined}
 */
function detachTracks(tracks) {
  tracks.forEach((track) => {
    track.detach().forEach((detachedElement) => {
      detachedElement.remove();
    });
  });
}

/**
 * Detaches the participant's tracks
 * @param {object} participant The video participant.
 * @return {undefined}
 */
function detachParticipantTracks(participant) {
  const tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}

/**
 * TODO remove window and document
 * Triggers events when a participant successfully joins a room.
 * @param {object} room The video room.
 * @return {undefined}
 */
function roomJoined(room) {
  activeRoom = room;
  window.room = activeRoom;

  document.getElementById('button-join').style.display = 'none';
  document.getElementById('button-leave').style.display = 'inline';

  // Attach LocalParticipant's Tracks, if not already attached.
  let previewContainer = document.getElementById('local-media');
  if (!previewContainer.querySelector('video')) {
    attachParticipantTracks(room.localParticipant, previewContainer);
  }

  // Attach the Tracks of the Room's Participants.
  room.participants.forEach((participant) => {
    // Participant already in room
    previewContainer = document.getElementById('remote-media');
    attachParticipantTracks(participant, previewContainer);
  });

  // When a Participant joins the Room, log the event.
  // room.on('participantConnected', function (participant) {
  //   console.log("Joining: '" + participant.identity + "'")
  // })

  // When a Participant adds a Track, attach it to the DOM.
  room.on('trackAdded', (track) => {
    previewContainer = document.getElementById('remote-media');
    attachTracks([track], previewContainer);
  });

  // When a Participant removes a Track, detach it from the DOM.
  room.on('trackRemoved', (track) => {
    detachTracks([track]);
  });

  // When a Participant leaves the Room, detach its Tracks.
  room.on('participantDisconnected', (participant) => {
    detachParticipantTracks(participant);
  });

  // Once the LocalParticipant leaves the room, detach the Tracks
  // of all Participants, including that of the LocalParticipant.
  room.on('disconnected', () => {
    if (previewTracks) {
      previewTracks.forEach((track) => {
        track.stop();
      });
    }
    detachParticipantTracks(room.localParticipant);
    room.participants.forEach(detachParticipantTracks);
    activeRoom = null;
    document.getElementById('button-join').style.display = 'inline';
    document.getElementById('button-leave').style.display = 'none';
  });
}

/* Exposed functions */

/**
 * TODO remove window and document
 * Sets track into the preview camera container.
 * @return {undefined}
 */
function previewCamera() {
  // let localTracksPromise = previewTracks
  //   ? Promise.resolve(previewTracks)
  //   : Video.createLocalTracks()
  //
  // localTracksPromise.then(function (tracks) {
  //   window.previewTracks = previewTracks = tracks
  //   let previewContainer = document.getElementById('local-media')
  //   if (!previewContainer.querySelector('video')) {
  //     attachTracks(tracks, previewContainer)
  //   }
  // }, function (error) {
  //   throw new Error('Unable to access Camera and Microphone: ' + error.message)
  // })
  Video.createLocalVideoTrack().then((track) => {
    const localMediaContainer = document.getElementById('local-media');
    localMediaContainer.appendChild(track.attach());
  });
}

/**
 * Attaches the participant's Tracks to the given container.
 * @param {string} roomName The video room name.
 * @param {string} token The Twilio's auth token.
 * @return {undefined}
 */
function joinRoom(roomName, token) {
  if (!roomName) {
    throw new Error('Please enter a room name');
  }

  const connectOptions = {
    name: roomName,
    logLevel: 'debug',
  };

  // Join the Room with the token from the server and the
  // LocalParticipant's Tracks.
  Video.connect(token.token, connectOptions).then(roomJoined, (error) => {
    throw new Error(`Could not connect to Room: ${error.message}`);
  });
}

/**
 * Leaves the active room.
 * @return {undefined}
 */
function leaveRoom() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}

export { previewCamera, joinRoom, leaveRoom };
