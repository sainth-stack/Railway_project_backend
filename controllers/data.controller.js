const UsersModel = require("../models/users.model");
const StudentModel = require("../models/students.model");
const AuditsModel = require("../models/adits.model");
const TestSubmissionsModel = require("../models/testsubmissions.model");
const UserRolesModel = require("../models/userrole.model");
const BatchModel = require("../models/batches.model");
const SessionModel = require("../models/session.model");
// const Students = await UsersModel.find({}).sort({ _id: -1 });
// const Audit = await AuditsModel.find({}).sort({ _id: -1 });
// const UserRoles=await UserRolesModel.find({}).sort({_id:-1})
// const TestSubmissions = await TestSubmissionsModel.find({}).sort({
//   _id: -1,
// });
// const Batches = await BatchModel.find({}).sort({ _id: -1 });
// const Session = await SessionModel.find({}).sort({ _id: -1 });
const successResponse = ({ message, data, ...rest }) => ({
  success: true,
  data: data ? data : null,
  message,
  ...rest,
});
const failResponse = ({ message, data, ...rest }) => ({
  success: false,
  data: data ? data : null,
  message,
  ...rest,
});

const getObjectives = async (req, res) => {
  try {
    const TestSubmissions = await TestSubmissionsModel.find({}).sort({
      _id: -1,
    }).skip({'sessionId':undefined});
    const Session = await SessionModel.find({}).sort({ _id: -1 });
    const Users = await UsersModel.find(
      {fullname:'Sagar Motghare'},
      { fullname: 1, meta: 1, role: 1 }
    )
      .sort({ _id: -1 })
      .skip({ fullname: "" });
    const UserRoles = await UserRolesModel.find({}).sort({ _id: -1 });
    const results = Users.map((item) => {
      let roleName;
      UserRoles.filter((itemTask) => {
        if (item._doc.role[0] !== undefined) {
          if (itemTask._doc._id.toString() == item._doc.role[0].toString()) {
            roleName = itemTask.rolename;
          }
        }
      });
      return {
       _id: item._id,
        fullname: item.fullname,
        role: roleName,
        remarks: "",
        division: item.meta
          ? item.meta.railways
            ? item.meta.railways.division
            : ""
          : "",
        conformation: "",
        zone: item.meta
          ? item.meta.railways
            ? item.meta.railways.station
            : ""
          : "",
      }
    });
   
    const TestSubmission = await TestSubmissionsModel.aggregate([
      {

        $lookup: {
          from: "students",
          localField: "studentid",
          foreignField: "_id",
          as: "field_staff_details",
        },
      },
      {
       $lookup: {
          from: "sessions",
          localField: "sessionId",
          foreignField: "_id",
          as: "Assessment_details",
        },
      },
    
    ]);
    let result = results.map((user) => {
      let Batch_Details = [];
       filterData= TestSubmission.filter((itemTask) => {
        if (itemTask.Assessment_details[0] != undefined) {
          if (
            itemTask.Assessment_details[0].coachId !== undefined && 
            itemTask.Assessment_details[0].coachId.toString() === user._id.toString()
          ) {
            Batch_Details.push(itemTask);
          }
        }
      })
      
      return {Data_Set:user,Batch_Details}
    });
    const Students = await StudentModel.find({}, { fullname: 1 }).sort({
      _id: -1,
    });
    
    // let result2 = TestSubmissions.map((task) => {
    //   let Batch_Details2 = [];
    //   let newObj = {
    //      ...task._doc };
    //   filterData = Students.filter((itemTask) => {
    //     if (
    //       itemTask._id !== undefined &&
    //       itemTask._id.toString() === newObj.studentid.toString()
    //     ) {
    //       Batch_Details2.push(itemTask);
    //     }
    //   });
    //   return { ...newObj, field_staff_details:Batch_Details2 };
    // });
    // let result3 = result2.map((task) => {
    //   let Batch_Details2 = [];
    //   let newObj = {
    //      ...task._doc };
    //   filterData = Session.filter((itemTask) => {
    //     if (
    //       result2.sessionId && result2.sessionId !==undefined &&
    //       itemTask._id.toString() === newObj.sessionId.toString()
    //     ) {
    //       Batch_Details2.push(itemTask);
    //     }
    //   });
    //   return { ...newObj, Batch_Details:Batch_Details2 };
    // });

    res.status(200).send(
      successResponse({
        message: "Users Retrieved Successfully!",
        data: result,
      })
    );
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Users Not Fetched!",
      })
    );
  }
};

module.exports = {
  getObjectives,
};
