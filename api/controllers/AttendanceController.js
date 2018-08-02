var async = require('async');

/**
 * AttendanceController
 *
 * @description :: Server-side logic for managing attendances
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var updatedDetails = new Array();

//calculates the attendance of a particular student
function calculateAttendance(student, callback) {
  var total_periods = 0;
  var present_periods = 0;
  Attendance.find({
    student: student.id
  }).exec(function (err, attendance) {
    if (err) {
      //TODO: Handle error if student not found    
    }

    if (attendance) {
      attendance.forEach(function (data) {
        total_periods += data.periods;
        if (data.availability === "present") {
          present_periods += data.periods;
        }

      });

      var averageAttendance = (present_periods / total_periods) * 100;
      callback(averageAttendance);
    }
  });
}

module.exports = {

  take: function (req, res) {
    var formData = req.params.all();
    var studentArray = new Array();
    studentArray = JSON.parse(formData.attendance);
    var periods = formData.periods;

    
    async.each(studentArray, function (data, callback) {

      if (data) {
        //   console.log(data.availability);
        Student.findOne({
          reg_no: data.reg_no
        }).exec(function (err, student) {
          if (err) {
            //TODO: Handle error if student not found
          }

          if (student) {

            Attendance.create({
              student: student,
              periods: periods,
              availability: data.availability
            }).exec(function (err, created) {

              if (err) {
                res.send(err);

              }

              if (created) {

                calculateAttendance(student, function (percentage) {
                  if (percentage) {
                    Student.update({
                      reg_no: student.reg_no
                    }, {
                      attendancePercentage: percentage
                    }).exec(function afterwards(err, updated) {

                      if (updated) {
                        updated.forEach(function (data) {
                          updatedDetails.push(data);
                          callback();

                        });
                      }

                      if (err) {
                        console.log(err);
                      }
                    });
                  }
                });
              }
            });
          }
        });

      }

    }, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.send({"success":updatedDetails});
      }
    });

  }

};
