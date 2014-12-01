/* Definition of the MyApp namespace */
function MyApp() {

}

MyApp.prototype = {
  createUA: function () {
    this.ua = new SIP.UA();
  },
};

/* Initialize the app by creating a new MyApp */
var myApp = new MyApp();
myApp.createUA();
