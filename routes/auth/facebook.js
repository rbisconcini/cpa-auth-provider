"use strict";

var db = require('../../models');
var config = require('../../config');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new FacebookStrategy({
    clientID: config.identity_providers.facebook.client_id,
    clientSecret: config.identity_providers.facebook.client_secret,
    callbackURL: config.identity_providers.facebook.callback_url,
    profileFields: ['id', 'displayName', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
    var photo = (profile.photos.length > 0) ? profile.photos[0].value : null;
    db.User.findOrCreate({provider_uid: profile.id, display_name: profile.displayName, photo: photo }).success(function(user){
      return done(null, user);
    }).error(function(err) {
      done(err, null);
    });
  }
));



module.exports = function(app, options) {
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/?error=login_failed'
  }));

};
