/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  //api used to create a new student
  create: function (req, res) {
    var formdata = req.params.all();
    console.log(formdata);
    var subject = formdata.subject;

    Subject.findOne({
      module_code: subject
    }).exec(function (err, subj) {
      if (err) {
        res.send({
          "error": err
        });
      }
      if (subj) {
        var student = {
          name: formdata.name,
          reg_no: formdata.reg_no,
          subject: subj,
          attendancePercentage: 0
        };

        Student.create(student).exec(function (err, created) {
          if (err) {
            res.send({
              "error": err
            });
          }

          if (created) {
            res.send({
              "success": "New Student Registered"
            });
          }
        });

      }
    });


  },
  //api used to get all the registered students 
  listStudents: function (req, res) {

    Student.find().populate('subject').exec(function (err, students) {
      if (err) {
        res.send({
          "error": err
        });
      }
      if (students) {
        res.send(students);
      }
    });
  },
  //Gets the details for the specifc student
  get: function (req, res) {
    var reg_no = req.param("reg_no");

    Student.findOne({
      reg_no: reg_no
    }).populate('subject').exec(function (err, student) {
      if (err) {
        res.send({
          "error": err
        });
      }

      if (student) {
        res.send({
          "found": student
        });
      } else {
        res.send({
          "404": "Student Not found, check the Registration Number"
        });
      }
    })
  },
  //Gets all the students under the particular Subject
  listSubjectStudents: function (req, res) {
    Subject.findOne({
      module_code: req.param('module_code')
    }).exec(function (err, subj) {


      if (err) {
        res.send({
          "error": err
        });
      }

      if (subj) {
        Student.find({
          subject: subj.id
        }).populate('subject').exec(function (err, students) {

          if (err) {
            res.send({
              "error": err
            });
          }
          if (students) {
            res.send(students);
          }
        });
      }
    });


  },
//Removng student
  delete: function(req, res){
    var regno = req.param('reg_no');

    Student.destroy({"reg_no":regno}).exec(function(err, obj){
      if(obj){
        console.log(obj);
        Attendance.destroy({student:data.id}).exec();
        res.send("Student Removed!");
      }
    });
  }
};
