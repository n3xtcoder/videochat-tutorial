<template>
  <div class="video">
    <br>
    <b-container fluid>
      <b-row>
        <b-col lg="4" align-self="start">
          <div id="local-media" ref="localMedia"></div>
          <b-button size="sm" v-show="previewTrack === null" variant="primary" v-on:click="startPreview">Preview My Camera</b-button>
          <b-button size="sm" v-show="previewTrack !== null" variant="danger" v-on:click="stopPreview">Stop preview</b-button>
        </b-col>
        <b-col lg="8" align-self="end">
          <div id="remote-media" ref="remoteMedia"></div>
        </b-col>
      </b-row>
    </b-container>
    <br>
    <b-container>
      <b-row>
        <b-col>
          <b-alert variant="danger"
                   dismissible
                   :show="alertText !== ''"
                   @dismissed="alertText = ''">
            {{ alertText }}
          </b-alert>
        </b-col>
      </b-row>
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
      <b-row>
        <b-col>
          <p>Selected identity: <strong>{{ identity }}</strong></p>
          <p>Selected room: <strong>{{ roomName }}</strong></p>
        </b-col>
      </b-row>
    </b-container>
  </div>
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
      participant: null,
      previewTrack: null,
      options: [
        { value: null, text: 'Please select an identity' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'patient', text: 'Patient' },
      ],
      alertText: '',
    };
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
      Video.createLocalVideoTrack().then((track) => {
        console.log(`Preview camera "${track.mediaStreamTrack.label}"`);
        this.previewTrack = track;
        this.attachTrack(this.previewTrack, this.$refs.localMedia);
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

      if (this.previewTrack === null) {
        // Start preview on connection
        this.startPreview();
      }

      if (room.participants.size > 0) {
        // Attach other participant tracks (if already in the room)
        if (room.participants.size > 1) {
          this.alertText = `Detected ${room.participants.length} other participants, only 1 is accepted`;
        }
        this.participantConnected(room.participants.values().next().value);
      }

      // Attach all tracks from a participant that joins the room
      this.room.on('participantConnected', this.participantConnected);
      // Detach all tracks from a participant that leaves the room
      this.room.on('participantDisconnected', this.participantDisconnected);
      // Detach tracks from all participants when the local participant leaves the room
      this.room.once('disconnected', () => {
        if (this.participant !== null) {
          this.participantDisconnected(this.participant);
        }
        this.room = null;
      });
    },

    /**
     * Attaches all tracks from a connected participant.
     * @param {object} participant The remote participant in the room.
     * @return {undefined}
     */
    participantConnected(participant) {
      console.log(`"${participant.identity}" is connected`);
      this.participant = participant;
      // Attach track to DOM when it is added by a participant
      participant.on('trackAdded', track => this.attachTrack(track, this.$refs.remoteMedia));
      // Attach the tracks of the other room participant
      participant.tracks.forEach(track => this.attachTrack(track, this.$refs.remoteMedia));
      // Detach track from the DOM when it is removed by a participant
      participant.on('trackRemoved', this.detachTrack);
    },

    /**
     * Detaches all tracks from a disconnected participant.
     * @param {object} participant The remote participant in the room.
     * @return {undefined}
     */
    participantDisconnected(participant) {
      console.log(`"${participant.identity}" is disconnected`);
      participant.tracks.forEach(this.detachTrack);
      this.participant = null;
    },

    /**
     * Attaches the track.
     * @param {object} track The video track.
     * @param {object} container The DOM element.
     * @return {undefined}
     */
    attachTrack(track, container) {
      container.appendChild(track.attach());
    },

    /**
     * Detaches the track.
     * @param {object} track The video track.
     * @return {undefined}
     */
    detachTrack(track) {
      track.detach().forEach(element => element.remove());
    },
  },
};
</script>

<style>
div#remote-media video {
  max-width: 100%;
  max-height: 100%;
  align: right;
}

div#local-media video {
  max-width: 100%;
  max-height: 100%;
}
</style>
