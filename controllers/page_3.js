const UsersModel = require("../models/users.model");
const StudentModel = require("../models/students.model");
const AuditsModel = require("../models/adits.model");
const TestSubmissionsModel = require("../models/testsubmissions.model");
const UserRolesModel = require("../models/userrole.model");
const BatchModel = require("../models/batches.model");
const SessionModel = require("../models/session.model");
const TestsModel = require("../models/tests.model");
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
  const Students = await StudentModel.find({}).sort({ _id: -1 });
  const Tests = await TestsModel.find({}).sort({ _id: -1 });
  const Audit = await AuditsModel.find({}).sort({ _id: -1 });
  const UserRoles = await UserRolesModel.find({}).sort({ _id: -1 });
  const TestSubmissions = await TestSubmissionsModel.find({}).sort({
    _id: -1,
  });
  const Batches = await BatchModel.find({}).sort({ _id: -1 });
  const Session = await SessionModel.find({}).sort({ _id: -1 });
  try {
    const Users = await UsersModel.find(
      {
        fullname: [
          "Bikash Kumar jha",
          "r j patil",
          "Joydeep Mukherjee",
          "Tarun kumar bala",
          "Awinash Kumar",
          "L. Kiran Kumar",
        ],
      },
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
            ? item.meta.railways.zone || item.meta.railways.ZONE
            : ""
          : "",
      };
    });
    const master_trainers = results.filter(
      (item) => item.role == "Master Trainer"
    );
    const super_trainers = results.filter(
      (item) => item.role == "Super Trainer"
    );
    const Test_Submission = TestSubmissions.map((item) => {
      let filterData = Session.filter(
        (itemTask) => item.sessionId == itemTask._id
      );
      return {
        ...item._doc,
        coachId: filterData[0] ? filterData[0].coachId : "",
        batchId: filterData[0] ? filterData[0].batchId : "",
        sessionDate: filterData[0] ? filterData[0].sessionDate : "",
      };
    });
    const field_staff_details = Students.map((item) => {
      const filterData = Test_Submission.filter((itemTask) => {
        if (itemTask.studentid != undefined && itemTask != null) {
          if (item._id.toString() == itemTask.studentid.toString()) {
            return itemTask;
          }
        }
      });

      return {
        fullname: item.fullname,
        batchId: filterData.length > 0 ? filterData[0].batchId : "",
        coachId: filterData.length > 0 ? filterData[0].coachId : "",
        sessionDate: filterData.length > 0 ? filterData[0].sessionDate : "",
        Assignment_Details: filterData,
      };
    });
    const dat = field_staff_details.filter((item) => {
      if (item.Assignment_Details.length > 0) {
        return item;
      }
    });

    const field_staff_data = dat.map((item) => {
      let data5 = {
        Assignment1: 0,
        Assignment2: 0,
        Assignment3: 0,
        Assignment4: 0,
      };
      let Assignment = {
        A1: false,
        A2: false,
        A3: false,
        A4: false,
      };
      Tests.map((itemTask) => {
        const filterData = item.Assignment_Details.filter((itemTask2) => {
          if (itemTask2.testid.toString() == itemTask._id.toString()) {
            switch (itemTask.testTitle) {
              case "Assessment 1":
                Assignment = { ...Assignment, A1: true };
                data5.Assignment1=data5.Assignment1 + 1
                break;
              case "Assessment 2":
                Assignment = { ...Assignment, A2: true };
                data5.Assignment2=data5.Assignment2 + 1

                break;
              case "Assessment 3":
                Assignment = { ...Assignment, A3: true };
                data5.Assignment3=data5.Assignment3 + 1

                break;
              case "Assessment 4":
                Assignment = { ...Assignment, A4: true };
                data5.Assignment4=data5.Assignment4 + 1

              default:
                break;
            }
          }
        });
      });
      return {
        fullname: item.fullname,
        batchId: item.batchId,
        coachId: item.coachId,
        sessionDate: item.sessionDate,
        Assignment_Details: Assignment,
        Assignment_Sum:data5
      };
    });
    const Batch_Details = Batches.map((item) => {
      let filterData = field_staff_data.filter(
        (itemTask) => item._id.toString() == itemTask.batchId.toString()
      );
      let final={
        Assignment1:0,Assignment2:0,
        Assignment3:0,Assignment4:0
      }
      let data = filterData.map((item) => {
        final.Assignment1=final.Assignment1 + item.Assignment_Sum.Assignment1;
        final.Assignment2=final.Assignment2 + item.Assignment_Sum.Assignment2;
        final.Assignment3=final.Assignment3 + item.Assignment_Sum.Assignment3;
        final.Assignment4=final.Assignment4 + item.Assignment_Sum.Assignment4;

        return {
          part_name: item.fullname,
          assessment: item.Assignment_Details,
        };
      });
      return {
        Batch_Name: item.batchName,
        Date_created: filterData.length > 0 ? filterData[0].sessionDate : "",
        part_details: data,
      };
    });
    const dat2 = Batch_Details.filter((item) => {
      if (item.part_details.length > 0) {
        return item;
      }
    });

    res.status(200).send(
      successResponse({
        message: "Users Retrieved Successfully!",
        data: dat2,
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
