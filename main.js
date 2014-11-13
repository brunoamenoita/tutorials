/* Definition of the MyApp namespace */
function MyApp() {
  this.remoteMedia = document.getElementById('remote-media');
  this.remoteMedia.volume = 0.5;

  this.destinationInput = document.getElementById('destination-input');
  this.inviteButton = document.getElementById('invite-button');
  this.inviteButton.addEventListener('click', this.sendInvite.bind(this), false);

  document.addEventListener('keydown', function (e) {
    this.sendDTMF(String.fromCharCode(e.keyCode));
  }.bind(this), false);

  this.volumeUp = document.getElementById('volume-up');
  this.volumeUp.addEventListener('click', this.raiseVolume.bind(this), false);

  this.volumeDown = document.getElementById('volume-down');
  this.volumeDown.addEventListener('click', this.lowerVolume.bind(this), false);

  this.muteButton = document.getElementById('mute-button');
  this.muteButton.addEventListener('click', this.toggleMute.bind(this), false);
}

MyApp.prototype = {
  createUA: function () {
    this.ua = new SIP.UA();
  },

  sendInvite: function () {
    var destination = this.destinationInput.value;
    if (!destination) { return; }

    var session = this.ua.invite(destination, this.remoteMedia);

    this.setSession(session);
    this.inviteButton.disabled = true;
  },

  setSession: function (session) {
    session.on('progress', function () {
      this.setStatus('Ringing...', true);
    }.bind(this));

    session.on('accepted', function () {
      this.setStatus('Connected!', true);
    }.bind(this));

    session.on('failed', function () {
      this.setStatus('Call failed. Try again?', false);
    }.bind(this));

    session.on('bye', function () {
      this.setStatus('Bye! Invite Another?', false);
    }.bind(this));

    session.on('refer', session.followRefer(function (req, newSession) {
      this.setStatus('Refer!', true);
      this.setSession(newSession);
    }.bind(this)));

    this.session = session;
  },

  setStatus: function (status, disable) {
    this.inviteButton.innerHTML = status;
    this.inviteButton.disabled = disable;
  },

  sendDTMF: function (tone) {
    if (this.session) {
      this.session.dtmf(tone);
    }
  },

  raiseVolume: function () {
    this.volumeDown.disabled = false;

    /* If volume is very high, jump to max to avoid rounding errors. */
    if (this.remoteMedia.volume >= .85) {
      this.remoteMedia.volume = 1;
      this.volumeUp.disabled = true;
    } else {
      this.remoteMedia.volume += .1;
    }
  },

  lowerVolume: function () {
    this.volumeUp.disabled = false;

    /* If volume is very low, jump to min to avoid rounding errors. */
    if (this.remoteMedia.volume <= .15) {
      this.remoteMedia.volume = 0;
      this.volumeDown.disabled = true;
    } else {
      this.remoteMedia.volume -= .1;
    }
  },

  toggleMute: function () {
    if (!this.session) { return; }

    if (this.muteButton.classList.contains('on')) {
      this.session.unmute();
      this.muteButton.classList.remove('on');
    } else {
      this.session.mute();
      this.muteButton.classList.add('on');
    }
  },
};

/* Initialize the app by creating a new MyApp */
var myApp = new MyApp();
myApp.createUA();
