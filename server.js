'use strict'; //so, we can use ES6

var http = require('http');
var express = require('express');
// var reload = require('reload');
//var path = require('path');
// var router = express.Router
var app = express();
var dataFile = require('./data/data.json');
var siteContent = require('./data/siteContent.json');
var io = require('socket.io')();
var nodeMailer = require('nodemailer');
// var sassMiddleWare = require('node-sass-middleware');

// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
// app.use(sassMiddleWare({
//   src: __dirname + '/sass',
//   dest: __dirname + '/public/css',
//   debug: true,
//   outputStyle: 'compressed'
// }));

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('siteContent', siteContent);
app.set('view engine', 'ejs');
app.set('views', 'views');

app.locals.siteTitle = 'Home - CodeAdapt - Seattle Digital Marketting & SEO Company';
app.locals.allSpeakers = dataFile.speakers;
app.locals.allServices = siteContent.services;
app.locals.allCosts = siteContent.costs;
app.locals.allTeamPlayers = siteContent.players;

app.use(express.static('public'));
app.use(require('./routes/index'));
app.use(require('./routes/speakers'));
app.use(require('./routes/feedback'));
app.use(require('./routes/api'));
app.use(require('./routes/chat'));
app.use(require('./routes/components'));

var server = app.listen(app.get('port'), function() {
  console.log(`Listening on port ${app.get('port')}`);
});

app.post('/send', function(req, res) {
  var output = `
    <p> you have a new contact request</p>
    <h3> contact detals</h3>
    <ul>
      <li>Subject: ${req.body.subject}</li>
      <li>Name: ${req.body.name}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>Message: ${req.body.message}</li>
    </ui>
  `;

  // create reusable transporter object using the default SMTP transport
  var transporter = nodeMailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'info@codeadapt.com', // generated ethereal user
          pass: 'CodeAdapt@123' // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
  });
  console.log(req);
  // setup email data with unicode symbols
  var mailOptions = {
      from: '"CodeAdapt Sales" <info@codeadapt.com>', // sender address
      to: 'info@codeadapt.com', // list of receivers
      subject: 'Hello', // Subject line
      text: output, // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    console.log('error' +  error);
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));

      res.render('index', {
        pageTitle: 'Home',
        pageID: 'home',
        msg: 'Email has been sent successfully !'
      });
      // res.render("contact", {msg: 'Email sent'});
  });
});

io.attach(server);
io.on('connection', function(socket) {
  socket.on('postMessage', function(data) {
    io.emit('updateMessages', data);
  });
});


// reload(server, app, true);
