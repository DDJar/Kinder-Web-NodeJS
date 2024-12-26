import mongoose from 'mongoose';
const { Schema } = mongoose;

const salarySchema = new Schema({
  authorId: {
    type: String,
    required: true,
    ref: 'User',
  },
  salaryId: {
    type: String,
    required: true,
    unique: true
  },
  payMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'Cheque'], // hoặc các phương thức thanh toán khác
    required: true
  },
  transactionId: {
    type: String,
    ref: 'Transaction',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Cập nhật `updatedAt` khi tài liệu được lưu
salarySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;
