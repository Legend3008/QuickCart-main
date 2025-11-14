import mongoose from "mongoose";

const helpTopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    articleCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const HelpTopic = mongoose.models.helpTopic || mongoose.model('helpTopic', helpTopicSchema);

export default HelpTopic;
