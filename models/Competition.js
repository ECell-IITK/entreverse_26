import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const competitionSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    event_id: { type: Number, required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, default: '' },
    max_team_size: { type: Number, required: true, min: 1, max: 10 },
    min_team_size: { type: Number, required: true, min: 1, max: 10 },
    registration_open: { type: Boolean, default: true, index: true },
    registration_code: { type: String, required: false, select: false, default: '' },
    created_at: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.registration_code;
        return ret;
      },
    },
  }
);

competitionSchema.methods.compareRegistrationCode = async function (plainCode) {
  if (!this.registration_code) return true;
  return bcrypt.compare(plainCode, this.registration_code);
};

export const Competition = mongoose.models.Competition || mongoose.model('Competition', competitionSchema);
export default Competition;
