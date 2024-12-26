import paymentBusiness from "../business/paymentBusiness.js";

const GetTuitionFees = async (req, res, next) => {
  const childId = req.query.childId;
  const time = req.query.time;
  try {
    const tuitionFees = await paymentBusiness.GetTuitionFeesByChildId(
      childId,
      time
    );

    if (!tuitionFees) {
      return res.json({
        status: 404,
        message: "Not found",
        data: {
          tuitionFees: null,
        },
      });
    }
    return res.json({
      status: 200,
      message: "Get data successfully",
      data: {
        tuitionFees: tuitionFees,
      },
    });
  } catch (error) {
    res.json({
      status: error.statusCode || 500,
      message: error.message || "Get data Failed!",
    });
  }
};

const GetMyChildrenLearn = async (req, res, next) => {
  const time = req.query.time;
  const parentId = req.user._id;
  try {
    const tuitionFees = await paymentBusiness.HandleGetChildrenLearnByParentId(
      parentId,
      time
    );

    if (!tuitionFees) {
      return res.json({
        status: 404,
        message: "Not found",
        data: {
          tuitionFees: null,
        },
      });
    }
    return res.json({
      status: 200,
      message: "Get data successfully",
      data: {
        tuitionFees: tuitionFees,
      },
    });
  } catch (error) {
    res.json({
      status: error.statusCode || 500,
      message: error.message || "Get data Failed!",
    });
  }
};

export default {
  GetTuitionFees,
  GetMyChildrenLearn,
};
