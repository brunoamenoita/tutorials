/* This is the InstaCall constructor. */
function InstaCall() {

}

/* This is the InstaCall prototype. */
InstaCall.prototype = {

  createUA: function () {
    this.ua = new SIP.UA();
  },

};

/* This is the InstaCall init function. */
(function () {
  var IC = new InstaCall();
  IC.createUA();
}());
