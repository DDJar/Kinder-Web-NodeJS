import { Proposal, Vote } from "../database/index.js";
import Annoucement from "../database/models/AnnouModel.js";
import { ApiError } from "../utils/index.js";

//proposal
const createProposal = async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Bad request");
  }

  const {
    title,
    content,
    endDate,
  } = req.body;
  console.log(req.user._id);
  try {
    const proposalData = {
      authorId:req.user._id,
      title,
      content,
      endDate,
    };

    const proposal = await Proposal.create(proposalData);

    return res.json({
      status: 200,
      message: "Proposal created successfully!",
      data: proposal,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const getProposal = async (req, res) => {
  try {
    const listProposal = await Proposal.find(req.query || {}).select(
      "_id authorId title content status createdAt updatedAt endDate"
    );
    return res.json({
      status: 200,
      message: "Proposals fetched successfully",
      data: listProposal,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const getProposalById = async (req, res) => {
  const { id } = req.query; 
  console.log(req.params)
  
  try {
      const proposal = await Proposal.findById(id);

      if (!proposal) {
          return res.status(404).json({ status: 404, message: 'Không tìm thấy đề xuất' });
      }

      res.status(200).json({ status: 200, data: proposal });
  } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
  }
};
const deleteProposal = async (req, res) => {
  const { id } = req.query; 
  console.log(req.params)

  try {
    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return res.status(404).json({ status: 404, message: 'Không tìm thấy đề xuất' });
    }

    await Proposal.findByIdAndDelete(id);

    return res.status(200).json({ status: 200, message: 'Xóa đề xuất thành công' });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};
const updateProposal = async (req, res) => {
  const { id } = req.query;
  const { title, content } = req.body;
  console.log(req.params)

  try {
    // Check if the request body is empty
    if (!req.body) {
      throw new ApiError(400, "Bad request");
    }

    // Find the proposal by ID
    const proposal = await Proposal.findById(id);

    // If proposal does not exist, return 404 Not Found
    if (!proposal) {
      return res.status(404).json({ status: 404, message: 'Không tìm thấy đề xuất' });
    }

    // Update specific fields if provided in request body
    if (title) {
      proposal.title = title;
    }
    if (content) {
      proposal.content = content;
    }

    // Save updated proposal
    await proposal.save();

    // Return success response
    return res.json({
      status: 200,
      message: 'Cập nhật đề xuất thành công',
      data: proposal,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: 500, message: error.message || 'Lỗi server' });
  }
};
//annoucement
const getAnnoucement = async (req, res) => {
  try {
    const listAnnoucement = await Annoucement.find(req.query || {}).select(
      "_id authorId title content status createdAt updatedAt endDate"
    );
    return res.json({
      status: 200,
      message: "Proposals fetched successfully",
      data: listAnnoucement,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const getAnnoucementById = async (req, res) => {
  const { id } = req.query; 
  console.log(req.params)
  
  try {
      const annoucement = await Annoucement.findById(id);

      if (!annoucement) {
          return res.status(404).json({ status: 404, message: 'Không tìm thấy thông báo' });
      }

      res.status(200).json({ status: 200, data: annoucement });
  } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
  }
};
const createAnnoucement = async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Bad request");
  }

  const {
    title,
    content,
  } = req.body;
  console.log(req.user._id);
  try {
    const annoucementData = {
      authorId:req.user._id,
      title,
      content,
    };

    const annoucement = await Annoucement.create(annoucementData);

    return res.json({
      status: 200,
      message: "Annoucement created successfully!",
      data: annoucement,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
const updateAnnoucement = async (req, res) => {
  const { id } = req.query;
  const { title, content } = req.body;
  console.log(req.params)

  try {
    // Check if the request body is empty
    if (!req.body) {
      throw new ApiError(400, "Bad request");
    }

    // Find the proposal by ID
    const annoucement = await Annoucement.findById(id);

    // If proposal does not exist, return 404 Not Found
    if (!annoucement) {
      return res.status(404).json({ status: 404, message: 'Không tìm thấy thông báo' });
    }

    // Update specific fields if provided in request body
    if (title) {
      annoucement.title = title;
    }
    if (content) {
      annoucement.content = content;
    }

    // Save updated proposal
    await annoucement.save();

    // Return success response
    return res.json({
      status: 200,
      message: 'Cập nhật thông báo thành công',
      data: annoucement,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: 500, message: error.message || 'Lỗi server' });
  }
};

//vote
const getVote = async (req, res) => {
  const { proposalId } = req.query;

  if (!proposalId) {
    return res.status(400).json({ status: 400, message: "Proposal ID is required" });
  }

  try {
    const feedbacks = await Vote.find({ proposalId }).select(
      "userId proposalId isAgreed status createdAt updatedAt"
    );
    if (!feedbacks.length) {
      return res.status(404).json({ status: 404, message: "No feedback found for this proposal" });
    }

    return res.status(200).json({
      status: 200,
      message: "Vote fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const createVote = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Bad request. Missing request body.",
    });
  }

  const { proposalId, isAgreed } = req.body;

  // Kiểm tra xem proposalId và isAgreed có được cung cấp không
  if (!proposalId || typeof isAgreed !== 'boolean') {
    return res.status(400).json({
      status: 400,
      message: "Proposal ID and vote decision are required and must be boolean",
    });
  }

  try {
    // Tìm đề xuất từ cơ sở dữ liệu
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        status: 404,
        message: "Proposal not found",
      });
    }

    // Kiểm tra xem người dùng đã bỏ phiếu cho đề xuất này chưa
    const existingVote = await Vote.findOne({
      proposalId,
      authorId: req.user._id
    });

    if (existingVote) {
      return res.status(400).json({
        status: 400,
        message: "You have already voted for this proposal",
      });
    }

    // Tạo đối tượng phiếu bầu mới
    const voteData = {
      proposalId,
      authorId: req.user._id, // Lấy ID của người dùng từ đối tượng req.user 
      isAgreed, // Thông tin bầu chọn
    };

    // Tạo phiếu bầu mới
    const vote = await Vote.create(voteData);

    return res.json({
      status: 200,
      message: "Vote created successfully!",
      data: vote,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

export default {
  createProposal,
  getProposal,
  getProposalById,
  deleteProposal,
  updateProposal,
  getVote,
  getAnnoucement,
  getAnnoucementById,
  createAnnoucement,
  updateAnnoucement,
  createVote,
};
