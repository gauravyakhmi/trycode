var express = require('express');
var http = require('http');
//var reload = require('reload');
var app = express();
var dataFile = require('./data/data.json');
var siteContent = require('./data/siteContent.json');
var teamPlayers = require('./data/teamPlayers.json');
var io = require('socket.io')();
const nodeMailer = require('nodemailer');
//
app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('siteContent', siteContent);
app.set('teamPlayers', teamPlayers);
app.set('view engine', 'ejs');
app.set('views', 'views');

app.locals.siteTitle = 'CodeAdapt - Seattle Digital Marketting & SEO Company';
app.locals.allSpeakers = dataFile.speakers;
app.locals.allServices = siteContent.services;
app.locals.allTeamPlayers = teamPlayers.players;

app.use(express.static('public'));
app.use(require('./routes/index'));
app.use(require('./routes/speakers'));
app.use(require('./routes/feedback'));
app.use(require('./routes/api'));
app.use(require('./routes/chat'));
app.use(require('./routes/components'));


app.post('/send', (req, res) => {
  debugger;
  console.log(req.body);
});

var server = app.listen(app.get('port'), function() {
  const output = `
    <p> you have a new contact request</p>
    <h3> contact detals</h3>
    <ul>
      <li>Name:</li>
    </ui>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodeMailer.createTransport({
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

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"CodeAdapt Sales" <info@codeadapt.com>', // sender address
      to: 'gauravyakhmi@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));

  });
});


io.attach(server);
io.on('connection', function(socket) {
  socket.on('postMessage', function(data) {
    io.emit('updateMessages', data);
  });
});

//reload(server, app, true);
