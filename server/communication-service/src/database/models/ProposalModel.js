import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * @enum {string}
 */
const Status = {
  ACTIVE: "ACTIVE",
  PASSED: "PASSED",
  FAILED: "FAILED",
  BLOCKED: "BLOCKED",
};

const ProposalSchema = new Schema(
  {
    authorId: {
      type: String,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
  },
    createdAt: {
      type: Date,
      default: Date.now,
      
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      
    },
    endDate: {
        type: Date,
      },
  
    
  },
  {
    timestamps: true,
  }
);
ProposalSchema.pre('save', function(next) {
    if (!this.endDate) {
      this.endDate = new Date(this.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // Cộng thêm 7 ngày
    }
    next();
  });
// chỗ ni t set enđate bằng create + 7 thôi 

const Proposal = mongoose.model("Proposal", ProposalSchema);
export default Proposal;
