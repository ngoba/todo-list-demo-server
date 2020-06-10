const shortid= require("shortid");
var cloudinary = require('cloudinary').v2

//const db = require("../db");
var User = require("../models/user.model")
var cookies=0;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.index =async (req, res) => {
  var users =await User.find();
  res.render("users",{users});
};

// module.exports.deleteUser = (req, res) =>{
//   var id=req.params.id;
//   db.get("users")
//     .remove({id})
//     .write();
//   res.redirect("back");
// }

module.exports.editUser = async (req, res) => {
  var id= req.params.id;
  var user = await User.findById(id)
  //var user=db.get("users").find({id}).value();
  res.render("edit-user",{user});
}

// //post
// module.exports.postCreateUser = (req, res) =>{ 
//   req.body.id=shortid.generate();
  
//     if (req.file) 
//     {
//     cloudinary.uploader.upload(req.file.path, 
//                                { tags: "avatar" },
//                                function(err,result)
//                                {
//                                   req.body.avatar = result.url;
//                                   db.get("users")
//                                     .push(req.body)
//                                     .write();
//                                   res.redirect("back");
//                                 });
//     } else {
//       db.get("users")
//         .push(req.body)
//         .write();
//       res.redirect("/users");
//             }
// }

module.exports.postEditUser = (req, res) => {
  var id = req.params.id
  if (req.file){
  cloudinary.uploader.upload(req.file.path, 
                             {tags : "avatar"},
                             function(err, result){
       req.body.avatar= result.url;
      db.get("users")
        .find({id})
        .assign({name:req.body.name,
                 email:req.body.email,
                 avatar:req.body.avatar })
        .write();
      res.redirect("/users");
    })
  }else{
    db.get("users")
        .find({id})
        .assign({name:req.body.name,
                 email:req.body.email,
                 })
        .write();
      res.redirect("/users");
  }
  
}
