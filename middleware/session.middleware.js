var shortid = require("shortid");

const authMiddleware = require("../middleware/auth.middleware");
var db = require("../db");
var Session = require('../models/session.model');
//create sessionId
module.exports =async function(req, res, next) {
  var sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    var sessionId = shortid.generate();
    res.cookie("sessionId", sessionId, {
      signed: true
    });
    console.log(sessionId);  
    
    // db.get("sessions")
    //   .push({ id: sessionId })
    //   .write();
    var session = Session.findOne({id: sessionId});
    session.id = sessionId;
    await session.save();
  }
  // var data = db.get("sessions").value();
  // data.map(item => {
  //   if (item.id !== sessionId) {
  //     db.get("sessions")
  //       .remove({ id: item.id })
  //       .write();
  //   }
  // });
  //count number boook in cart
  var session = db
    .get("sessions")
    .find({ id: sessionId })
    .value();
  //get values quantity of cart=> show(index>cart)
  if (session && session.cart) {
    var items = session.cart;
    res.locals.quantity = Object.values(items).reduce((a, b) => a + b);
    var books = Object.keys(items).map(key => {
      var book = db
        .get("books")
        .find({ id: key })
        .value();
      book.quantity = items[key]; //insert quantity
      return book;
    });

    res.locals.books = books;
  }
  next();
};
