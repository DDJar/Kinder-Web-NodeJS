import mongoose from 'mongoose';

const Status = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
};

const VoteSchema = new mongoose.Schema({
  authorId: {
    type: String,
    ref: 'User',
    required: true,
  },
  proposalId: {
    type: String,
    required: true,
    ref: 'Proposal'
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.ACTIVE,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isAgreed:{
    type: Boolean,
    required: true,
  }
});

VoteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Vote = mongoose.model('Vote', VoteSchema);

export default Vote;