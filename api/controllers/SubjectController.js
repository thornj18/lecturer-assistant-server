/**
 * SubjectController
 *
 * @description :: Server-side logic for managing Subjects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  //Creates a new Subject
  create: function (req, res) {
    var formdata = req.params.all();

    Subject.create(formdata).exec(function (err, created) {
      if (err) {
        res.send({
          "error": err
        });
      }

      if (created) {
        res.send({
          "success": "Subject created"
        });
      }
    });
  },

//Lists all the Subjects
  listSubjs: function (req, res) {
    Subject.find().exec(function (err, subjs) {
      if (err) {
        res.send({
          "error": err
        });
      }
      if (subjs) {
        res.send(subjs);
      }
    });
  },

//delete subject 
  delete: function(req, res){
    var subject = req.param('module_code');

    Subject.destroy({"module_code":subject}).exec(function(err, obj){
      if(obj){
        console.log(obj);
        Student.destroy({subject:obj.id}).exec(function(err, students){
          if(err){
            console.log(err);
          }
          if(students){
            students.forEach(function(data){
              Attendance.destroy({student:data.id}).exec();
            });

            res.send("Subject deleted");
          }
        });
      }
    });
  }
};
