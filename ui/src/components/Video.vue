<template>
  <div class="video">
    <br>
    <b-container>
      <b-row>
        <b-col lg="4" align-self="center" class="text-center">
          <div id="local-media" ref="localMedia"></div>
          <b-button size="sm" v-show="previewTrack === null" variant="primary" @click="startPreview">Preview My Camera</b-button>
          <b-button size="sm" v-show="previewTrack !== null" variant="danger" @click="stopPreview">Stop preview</b-button>
        </b-col>
        <b-col lg="8" align-self="end" class="text-center">
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
      <b-row align-self="start">
        <b-col lg="4" class="text-center">
          <b-row align-v="center" align-h="center">
            <b-col lg="5">
              <b-row>
                <b-form-input type="text" v-model="roomName" placeholder="Enter room name" ></b-form-input>
              </b-row>
            </b-col>
            <b-col lg="2">
              <b-button size="sm" v-show="videoRoom === null && roomName !== ''" variant="success" v-on:click="joinRoom" v-b-tooltip.hover :title="`Selected room: ${roomName}`">Join</b-button>
              <b-button size="sm" v-show="videoRoom !== null" variant="danger" v-on:click="leaveRoom">Leave</b-button>
            </b-col>
          </b-row>
        </b-col>
        <b-col v-show="chatRoom !== null" lg="8">
          <div id="messages" ref="messages">
            <template v-for="{ message, from } in chatMessages">
              <div v-show="from == 'info'" class="info">
                {{ message }}
              </div>
              <div v-show="from != 'info'" class="message-container">
                <span class="username">{{ from }}: </span>
                <span class="message">{{ message }}</span>
              </div>
            </template>
          </div>
          <input id="chat-input" type="text" placeholder="say anything" autofocus v-model="chatMessage" @keyup.enter="writesChatMessage"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import auth from '@/auth';
import Video from 'twilio-video';
import Chat from 'twilio-chat';

export default {
  name: 'Video',
  data() {
    return {
      identity: '',
      roomName: '',
      videoRoom: null,
      chatRoom: null,
      chatMessage: '',
      chatMessages: [],
      participant: null,
      previewTrack: null,
      alertText: '',
    };
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
      auth.getTwilioToken(this.roomName).then(
        this.connectToTwilio,
        (error) => { this.alertText = `Could not retrieve Twilio token from the backend: ${error.message}`; },
      );
    },

    /**
     * Disconects from the current video room.
     * @return {undefined}
     */
    leaveRoom() {
      this.videoRoom.disconnect();
      this.videoRoom = null;
      this.chatRoom = null;
    },

    /**
     * Writes a message to the chat room.
     * @return {undefined}
     */
    writesChatMessage() {
      this.chatRoom.sendMessage(this.chatMessage);
      this.chatMessage = '';
    },

    // Private methods

    /**
     * Connects to the specified videochat room using an already generated twilio token.
     * @param {object} res The backend /api/token HTTP response.
     * @return {undefined}
     */
    connectToTwilio(res) {
      this.identity = res.data.identity;
      console.log(`Connecting to Twilio videochat for identity "${this.identity}"`);
      Video.connect(res.data.token, { name: this.roomName }).then(
        this.videoRoomJoined,
        (error) => { this.alertText = `Could not connect to room "${this.roomName}": "${error.message}"`; },
      );
      this.chatClient = new Chat(res.data.token);
      this.chatClient.getSubscribedChannels().then(this.createOrJoinChatRoom);
    },

    /**
     * Triggers events when a participant successfully joins a room.
     * @param {object} room The video room.
     * @return {undefined}
     */
    videoRoomJoined(videoRoom) {
      console.log(`Connected to videoRoom "${this.roomName}"`);
      this.videoRoom = videoRoom;

      if (this.previewTrack === null) {
        // Start preview on connection
        this.startPreview();
      }

      if (videoRoom.participants.size > 0) {
        // Attach other participant tracks (if already in the room)
        if (videoRoom.participants.size > 1) {
          this.alertText = `Detected ${videoRoom.participants.length} other participants, only 1 is accepted`;
        }
        this.participantConnected(videoRoom.participants.values().next().value);
      }

      // Attach all tracks from a participant that joins the room
      this.videoRoom.on('participantConnected', this.participantConnected);
      // Detach all tracks from a participant that leaves the room
      this.videoRoom.on('participantDisconnected', this.participantDisconnected);
      // Detach tracks from all participants when the local participant leaves the room
      this.videoRoom.once('disconnected', () => {
        if (this.participant !== null) {
          this.participantDisconnected(this.participant);
        }
        this.videoRoom = null;
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

    /**
     * Creates a chat room or joins to an existing one.
     * @return {undefined}
     */
    createOrJoinChatRoom() {
      console.log(`Attempting to join "${this.roomName}" chat room...`);
      this.chatClient.getChannelByUniqueName(this.roomName)
        .then(this.setupChatRoom)
        .catch(this.createChatRoom);
    },

    setupChatRoom(chatRoom) {
      this.chatRoom = chatRoom;
      console.log(`Found "${this.roomName}" chat room, joining...`);
      // Join the chatRoom channel
      this.chatRoom.join().then(() => {
        this.writeMessage(`Joined channel "${this.roomName}" as "${this.identity}"`, 'info');
      });
      // Listen for new messages sent to the channel
      this.chatRoom.on('messageAdded', (message) => {
        this.writeMessage(message.body, message.author);
      });
    },

    createChatRoom() {
      // Create channel if it doesn't exist
      console.log(`Chat room "${this.roomName}" not found, creating it...`);
      this.chatClient.createChannel({
        uniqueName: this.roomName,
        friendlyName: `Chat room for "${this.roomName}" video session`,
      }).then(this.setupChatRoom);
      this.writeMessage(`"${this.identity}" has created channel "${this.roomName}"`, 'info');
    },

    writeMessage(message, from) {
      this.chatMessages.push({ message, from });
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.clientHeight;
      });
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

input {
  display:block;
  height:52px;
  width:100%;
  margin:1px auto;
  outline:none;
  background-color:transparent;
  border:none;
  border-bottom:1px solid #2B2B2A;
  padding:0;
}

#messages {
  background-color:#343a40;
  padding:10px;
  height:150px;
  width:100%;
  margin:0 auto;
  overflow-y:auto;
}

#messages p {
  margin:5px 0;
  padding:0;
}

.info {
  margin:5px 0;
  font-style:italic;
  color: #849091;
}

.message-container {
  margin:5px 0;
  color:#fff;
}

.message-container .username {
  display:inline-block;
  margin-right:5px;
  font-weight:bold;
  color:#849091;
}
</style>
