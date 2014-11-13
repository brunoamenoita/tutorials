/* Definition of the MyApp namespace */
function MyApp() {
  this.remoteMedia = document.getElementById('remote-media');

  this.inviteButton = document.getElementById('invite-button');
  this.inviteButton.addEventListener('click', this.sendInvite.bind(this), false);
}

MyApp.prototype = {
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
    }.bind(this));

    session.on('bye', function () {
      this.setStatus('Bye! Invite Another?', false);
    }.bind(this));

    this.session = session;
  },

  setStatus: function (status, disable) {
    this.inviteButton.innerHTML = status;
    this.inviteButton.disabled = disable;
  },
};

/* Initialize the app by creating a new MyApp */
var myApp = new MyApp();
myApp.createUA();
