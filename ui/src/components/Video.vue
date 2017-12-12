<template>
  <b-container class="video">
    <br>
    <b-container>
      <b-row>
        <b-col lg="12">
          <div ref="remoteMedia"></div>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-container>
        <b-row>
          <b-col lg="12">
            <p>Camera preview</p>
            <div ref="localMedia"></div>
            <b-button size="sm" v-show="previewTrack === null" variant="primary" v-on:click="startPreview">Preview My Camera</b-button>
            <b-button size="sm" v-show="previewTrack !== null" variant="danger" v-on:click="stopPreview">Stop preview</b-button>
          </b-col>
        </b-row>
      </b-container>
      <br>
      <b-container>
        <b-alert variant="danger"
                 dismissible
                 :show="alertText !== ''"
                 @dismissed="alertText = ''">
          {{ alertText }}
        </b-alert>
        <b-row>
          <b-col lg="3">
            <b-form-select v-model="identity" :options="options" class="mb-3"></b-form-select>
          </b-col>
          <b-col lg="3">
            <b-form-input type="text" v-model="roomName" placeholder="Enter a room name"></b-form-input>
          </b-col>
          <b-col lg="3">
            <b-button size="sm" v-show="room === null" variant="success" v-on:click="joinRoom">Join Room</b-button>
            <b-button size="sm" v-show="room !== null" variant="danger" v-on:click="leaveRoom">Leave Room</b-button>
          </b-col>
        </b-row>
        </b-row>
          <div>Selected identity: <strong>{{ identity }}</strong></div>
          <div>Selected room: <strong>{{ roomName }}</strong></div>
      </b-container>
    </b-container>
  </b-container>
</template>

<script>
import * as axios from 'axios';
import Video from 'twilio-video';

export default {
  name: 'Video',
  data() {
    return {
      roomName: '',
      identity: null,
      tokenCache: {
        doctor: '',
        patient: '',
      },
      videoInput: null,
      room: null,
      previewTrack: null,
      options: [
        { value: null, text: 'Please select an identity' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'patient', text: 'Patient' },
      ],
      alertText: '',
    };
  },
  mounted() {
    // Detect video input device
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.videoInput = devices.find(device => device.kind === 'videoinput');
    }, (error) => {
      this.alertText = `Error retrieving camera: "${error}"`;
    });
  },
  watch: {
    identity(newIdentity) {  // eslint-disable-line object-shorthand
      if (this.tokenCache[newIdentity] === '') {
        // Retrieve Twilio token from the backend
        axios.get('/api/token', { params: { identity: newIdentity }}).then((res) => { // eslint-disable-line
          this.tokenCache[newIdentity] = res.data.token;
          console.log(`Retrieved token for "${newIdentity}"`);
        }, (error) => {
          this.alertText = `Unable to retrieve access token for "${newIdentity}": "${error.message}"`;
        });
      } else {
        console.log(`"${newIdentity}" has already a cached token`);
      }
    },
  },
  methods: {
    // Public methods

    /**
     * Sets track into the preview camera container.
     * @return {undefined}
     */
    startPreview() {
      Video.createLocalVideoTrack({
        video: { deviceId: this.videoInput.deviceId },
      }).then((track) => {
        console.log(`Previewing camera "${track.mediaStreamTrack.label}"`);
        this.previewTrack = track;
        this.$refs.localMedia.appendChild(this.previewTrack.attach());
      }, (error) => {
        this.alertText = `Error previewing camera: "${error.message}"`;
      });
    },

    /**
     * Detachs preview tracks and remove DOM elements.
     * @return {undefined}
     */
    stopPreview() {
      console.log(`Stop preview in camera "${this.previewTrack.mediaStreamTrack.label}"`);
      this.previewTrack.stop();
      this.detachTrack(this.previewTrack);
      this.previewTrack = null;
    },

    /**
     * Creates twilio connection for the defined participant and room.
     * @return {undefined}
     */
    joinRoom() {
      if (this.roomName === '') {
        this.alertText = 'Please enter a room name';
      } else if (this.identity === null) {
        this.alertText = 'Please select an identity';
      } else {
        const connectOptions = { name: this.roomName };
        Video.connect(this.tokenCache[this.identity], connectOptions).then(
          this.roomJoined,
          (error) => { this.alertText = `Could not connect to room "${this.roomName}": "${error.message}"`; },
        );
      }
    },

    /**
     * Disconects from the current video room.
     * @return {undefined}
     */
    leaveRoom() {
      this.room.disconnect();
      this.room = null;
    },

    // Private methods

    /**
     * Triggers events when a participant successfully joins a room.
     * @param {object} room The video room.
     * @return {undefined}
     */
    roomJoined(room) {
      console.log(`Connected to room "${this.roomName}"`);
      this.room = room;

      // If video is in preview, attach the track
      console.log(this.$refs.localMedia);
      if (!this.$refs.localMedia.querySelector('video')) {
        this.attachParticipantTracks(this.room.localParticipant, this.$refs.localMedia);
      }

      // Attach the tracks of the room's participants
      this.room.participants.forEach((participant) => {
        this.attachParticipantTracks(participant, this.$refs.remoteMedia);
      });

      // Log event when a participant joins the room
      this.room.on('participantConnected', (participant) => {
        console.log(`"${participant.identity}" is joining`);
      });

      // Attach track to DOM when it is added by a participant
      this.room.on('trackAdded', (track) => {
        this.$refs.remoteMedia.appendChild(track.attach());
      });

      // Detach track from the DOM when it is removed by a participant
      this.room.on('trackRemoved', this.detachTrack);

      // Detach all tracks from a participant that leaves the room
      room.on('participantDisconnected', (participant) => {
        this.detachParticipantTracks(participant);
      });

      // Detach tracks from all participants when the local participant leaves the room
      room.on('disconnected', () => {
        if (this.previewTrack) {
          this.stopPreview();
        }
        this.detachParticipantTracks(this.room.localParticipant);
        this.room.participants.forEach(this.detachParticipantTracks);
        this.room = null;
      });
    },

    /**
     * Attaches the participant's Tracks to the given container.
     * @param {object} participant The video participant.
     * @param {object} container The video container.
     * @return {undefined}
     */
    attachParticipantTracks(participant, container) {
      Array.from(participant.tracks.values()).forEach((track) => {
        container.appendChild(track.attach());
      });
    },

    /**
     * Detaches the track.
     * @param {object} track The video track.
     * @return {undefined}
     */
    detachTrack(track) {
      track.detach().forEach((detachedElement) => {
        detachedElement.remove();
      });
    },

    /**
     * Detaches the participant's tracks
     * @param {object} participant The video participant.
     * @return {undefined}
     */
    detachParticipantTracks(participant) {
      Array.from(participant.tracks.values()).forEach((track) => {
        this.detachTrack(track);
      });
    },
  },
};
</script>

<style>
</style>
