import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, default: '' },
    is_active: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now },
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

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
