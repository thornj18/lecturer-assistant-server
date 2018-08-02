/**
 * TeacherController
 *
 * @description :: Server-side logic for managing Teachers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require("bcryptjs");
// var randtoken = require('rand-token');


module.exports = {

  create: function (req, res) {
    var data = req.params.all();

    Teacher.findOne({
      "regno": data.regno
    }).exec(function (err, teacher) {
      if (err) {

      }

      if (teacher) {
        res.send({
          "found": "Lecturer already exists in the server!"
        });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(data.password, salt, function (err, hash) {
            if (err) {
              console.log(err);
              cb(err);
            } else {
              data.password = hash;
              Teacher.create(data).exec(function (err, teacher) {

                if (err) {
                  res.send({
                    "error": err
                  });
                }
                if (teacher) {
                  var modified = {
                    name: teacher.name,
                    regno: teacher.regno
                  };
                  res.send({
                    "ok": modified
                  });
                } else {

                }
              });

            }
          });
        });

      }
    });
  },

  getTeacher: function (req, res) {
    var data = req.params.all();

    Teacher.findOne({
      regno: data.regno
    }).exec(function (err, teacher) {
      if (err) {
        res.send({
          "error": "Error fetching teacher!"
        });
      }

      if (teacher) {
        var modified = {
          name: teacher.name,
          regno: teacher.regno
        };
        res.send({
          "teacher": modified
        });
      }
    });
  },

  login: function (req, res) {
    var data = req.params.all();

    Teacher.findOne({
      regno: data.regno
    }).exec(function (err, teacher) {
      if (err) {
        res.send({
          "error": "Error!, Lecturer not found!"
        });
      }

      if (teacher) {
        bcrypt.compare(data.password, teacher.password, function (err, isTeacher) {
          if (!isTeacher) {
            res.send("Invalid password, Please try again!");
          } else {
            var modified = {
              name: teacher.name,
              regno: teacher.regno
            };
            res.send({
              "teacher": modified
            });
          }
        });
      }
    })
  }

};
