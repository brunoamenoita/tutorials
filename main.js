/* This is the InstaCall constructor. */
function InstaCall() {
  this.remoteMedia = document.getElementById('remote-media');

  this.inviteButton = document.getElementById('invite-button');
  this.inviteButton.addEventListener('click', this.sendInvite.bind(this), false);

  this.terminateButton = document.getElementById('terminate-button');
  this.terminateButton.addEventListener('click', this.terminateSession.bind(this), false);

  document.addEventListener('keydown', function (e) {
    this.sendDTMF(String.fromCharCode(e.keyCode));
  }.bind(this), false);
}

/* This is the InstaCall prototype. */
InstaCall.prototype = {

  createUA: function () {
    this.ua = new SIP.UA();
  },

  sendInvite: function () {
    var session = this.ua.invite('welcome@onsip.com', this.remoteMedia);

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
      delete this.session;
    }.bind(this));

    session.on('bye', function () {
      this.setStatus('Bye! Invite Another?', false);
      delete this.session;
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

  terminateSession: function () {
    if (!this.session) { return; }

    this.session.terminate();
  },

  sendDTMF: function (tone) {
    if (this.session) {
      this.session.dtmf(tone);
    }
  },

};

/* This is the InstaCall init function. */
(function () {
  var IC = new InstaCall();
  IC.createUA();
}());
