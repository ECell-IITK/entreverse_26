import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roll_no: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    is_leader: { type: Boolean, default: false },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true }, // Sequential team_id (1, 2, 3...)
    competition_id: { type: Number, required: true, index: true },
    team_name: { type: String, required: true, trim: true },
    comments: { type: String, default: '' },
    members: {
      type: [memberSchema],
      validate: [
        (val) => val && val.length > 0,
        'Team must contain at least one member',
      ],
    },
    created_at: { type: Date, default: Date.now, index: true },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes matching Go PostgreSQL schema:
teamSchema.index({ competition_id: 1, team_name: 1 }, { unique: true });
teamSchema.index({ competition_id: 1, 'members.roll_no': 1 }, { unique: true });
teamSchema.index({ competition_id: 1, 'members.email': 1 }, { unique: true });

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export default Team;
