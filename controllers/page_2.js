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
        remarks: [],
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
    const master_trainers2 = results.filter((item) => {
      if (item.role == "Master Trainer") {
        return {
          ...item,
        };
      }
    });

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
      let assessment_done = 0;
      Tests.map((itemTask) => {
        const filterData = item.Assignment_Details.filter((itemTask2) => {
          if (itemTask2.testid.toString() == itemTask._id.toString()) {
            switch (itemTask.testTitle) {
              case "Assessment 1":
                Assignment = { ...Assignment, A1: true };
                data5.Assignment1 = data5.Assignment1 + 1;
                assessment_done = assessment_done + 1;
                break;
              case "Assessment 2":
                Assignment = { ...Assignment, A2: true };
                data5.Assignment2 = data5.Assignment2 + 1;
                assessment_done = assessment_done + 1;

                break;
              case "Assessment 3":
                Assignment = { ...Assignment, A3: true };
                data5.Assignment3 = data5.Assignment3 + 1;
                assessment_done = assessment_done + 1;

                break;
              case "Assessment 4":
                Assignment = { ...Assignment, A4: true };
                data5.Assignment4 = data5.Assignment4 + 1;
                assessment_done = assessment_done + 1;

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
        Assignment_Sum: data5,
        assessment_done: assessment_done,
      };
    });
    const Batch_Details = Batches.map((item) => {
      let filterData = field_staff_data.filter(
        (itemTask) => item._id.toString() == itemTask.batchId.toString()
      );
      let final = {
        Assignment1: 0,
        Assignment2: 0,
        Assignment3: 0,
        Assignment4: 0,
      };
      let tot_certified = 0;
      let assessment_done = 0;
      let tot_assessment = filterData.length;
      let data = filterData.map((item) => {
        assessment_done = assessment_done + item.assessment_done;
        if (
          item.Assignment_Sum.Assignment1 +
            item.Assignment_Sum.Assignment2 +
            item.Assignment_Sum.Assignment3 +
            item.Assignment_Sum.Assignment4 ===
          4
        ) {
          tot_certified = tot_certified + 1;
        }
        final.Assignment1 = final.Assignment1 + item.Assignment_Sum.Assignment1;
        final.Assignment2 = final.Assignment2 + item.Assignment_Sum.Assignment2;
        final.Assignment3 = final.Assignment3 + item.Assignment_Sum.Assignment3;
        final.Assignment4 = final.Assignment4 + item.Assignment_Sum.Assignment4;

        return {
          fullname: item.fullname,
          Assessment_done: item.Assignment_Details,
        };
      });
      return {
        Batch_Name: item.batchName,
        coachId: filterData.length > 0 ? filterData[0].coachId : "",
        Date_created: filterData.length > 0 ? filterData[0].sessionDate : "",
        conformation:'',
        remarks:[],
        Assessment_details: { ...final },
      };
    });
    const result = master_trainers2.map((item) => {
      const filterData = Batch_Details.filter((itemTask) => {
        if (item._id.toString() == itemTask.coachId.toString()) {
          return true;
        }
      });

      return {
        MT_fullname: item.fullname,
        division: item.division,
        zone: item.zone,
        Batch_details: filterData,

      };
    });

    // const Batch_Details=field_staff_details.map((item)=>{
    //   if(item.length>0){
    //     return item
    //   }
    // })
    // const TestSubmission = TestSubmissions.map((item) => {
    //   let field_staff_details = [];
    //   const field_staff_details2 = Students.filter((itemTask) => {
    //     if (item.studentid.toString() == itemTask._id.toString()) {
    //       if (field_staff_details.length == 0) {
    //         field_staff_details.push(itemTask);
    //       } else if (
    //         field_staff_details.some(
    //           (person) => person._id.toString() !== itemTask._id.toString()
    //         )
    //       ) {
    //         field_staff_details.push(itemTask);
    //       }
    //     }
    //   });
    //   const Assessment_details = Session.filter(
    //     (itemTask) => item.sessionId == itemTask._id
    //   );

    //   return {
    //     ...item._doc,
    //     field_staff_details,
    //     Assessment_details,
    //   };
    // });

    // let result = master_trainers.map((user, index) => {
    //   filterData = TestSubmission.filter((itemTask) => {
    //     if (itemTask.Assessment_details[0] != undefined) {
    //       if (
    //         itemTask.Assessment_details[0].coachId !== undefined &&
    //         itemTask.Assessment_details[0].coachId.toString() ===
    //           user._id.toString()
    //       ) {
    //         return true;
    //       }
    //       return false;
    //     }
    //     return false;
    //   });
    //   Batch_Details_final = filterData.map((item) => {
    //     let date = "";
    //     let batch_name;
    //     let assignments = {
    //       Assessment_1: false,
    //       Assessment_2: false,
    //       Assessment_3: false,
    //       Assessment_4: false,
    //     };
    //     Batches.filter((itemTask) => {
    //       if (item.Assessment_details[0].batchId !== undefined) {
    //         if (
    //           itemTask._id.toString() ==
    //           item.Assessment_details[0].batchId.toString()
    //         ) {
    //           batch_name = itemTask.batchName;
    //         }
    //       }
    //     });
    //     // Session.filter((itemTask)=>{
    //     //   if(item.sessionId !== undefined && itemTask._id !== undefined){
    //     //     if(itemTask._id.toString() == item.sessionId.toString()){
    //     //       date = itemTask.sessionDate;
    //     //     }
    //     //   }
    //     // })
    //     let assessments = Tests.map((test, index) => {
    //       if (item.testid.toString() == test._id.toString()) {
    //         switch (test.testTitle) {
    //           case "Assessment 1":
    //             assignments = { ...assignments, Assessment_1: true };
    //           case "Assessment 2":
    //             assignments = { ...assignments, Assessment_2: true };
    //           case "Assessment 3":
    //             assignments = { ...assignments, Assessment_3: true };
    //           case "Assessment 4":
    //             assignments = { ...assignments, Assessment_4: true };
    //           default:
    //             break;
    //         }
    //       }
    //     });
    //     let field_staff_details = item.field_staff_details.map((item) => {
    //       return {
    //         test_id: item.testid !== undefined ? "" : item.testid,
    //         _id: item._id,
    //         fullname: item.fullname,
    //         ...assignments,
    //       };
    //     });
    //     return {
    //       batch_name: batch_name,
    //       date_created: date || "",
    //       TOT_fields_present: "",
    //       Assessment_details: "",
    //       Field_staff_details: field_staff_details,
    //     };
    //   });

    //   return { ...user, Batch_Details: Batch_Details_final };
    // });

    // const api1_data = super_trainers.map((sTrainer) => {
    //   filtered_data = result.filter((mTrainer) => {
    //     return mTrainer.division == sTrainer.division;
    //   });
    //   return {Data_Set:sTrainer,MT_Data:{...filtered_data}}
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
