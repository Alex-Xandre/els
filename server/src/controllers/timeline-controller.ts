import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { CustomRequest } from '../types';
import Timeline from '../models/timeline-model';

// Course Controllers
export const newTimeLine = expressAsyncHandler(async (req: any, res) => {
  const data = req.body;
  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;
      const createTimeline = await Timeline.create(data);
      req.io.emit('update-timeline', createTimeline);
      res.status(200).json(createTimeline);
    } else {
      const updateTimeline = await Timeline.findByIdAndUpdate(data._id, data, { new: true });
      req.io.emit('update-timeline', updateTimeline);
      res.status(200).json(updateTimeline);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getTimeLine = async (req: CustomRequest, res) => {
  const timelines = await Timeline.find({}).sort({ createdAt: -1 });
  const filteredTimelines =
    req.user.role === 'admin' ? timelines : timelines.filter((x) => x.user.toString() === req.user._id.toString());

  res.status(200).json(filteredTimelines);
};
