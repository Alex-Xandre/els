import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Assesment, Question, Submissions } from '../models/assesment-model';
import { AssesmentType, CustomRequest } from '../types';
import { Organize } from '../models/organize-model';
import { Progress } from '../models/progress-model';

//assessment-controller
export const newAssessment = expressAsyncHandler(async (req: any, res) => {
  const data: AssesmentType = req.body;
  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;

      const createMultipleQuestions = [];

      for (let questionData of data.questions) {
        const newQuestion = await Question.create(questionData);
        createMultipleQuestions.push(newQuestion._id);
      }

      const createAssessment = await Assesment.create({ ...data, questions: createMultipleQuestions });

      const returnAssessment = await createAssessment.populate('questions');

      const organize = await Organize.findOne({ moduleId: data.moduleId });

      if (!organize) {
        await Organize.create({
          moduleId: returnAssessment.moduleId,
          contentId: [returnAssessment._id],
        });
      }
      if (!organize.contentId.includes(returnAssessment.moduleId.toString())) {
        organize.contentId.push(returnAssessment._id.toString());
        await organize.save();
      }

      req.io.emit('update-assesment', returnAssessment);
      res.status(200).json(returnAssessment);
    } else {
      const updatedQuestions = [];

      for (let questionData of data.questions) {
        if (!mongoose.isValidObjectId(data._id)) {
          const updatedQuestion = await Question.findByIdAndUpdate(questionData._id, questionData, { new: true });
          updatedQuestions.push(updatedQuestion._id);
        } else {
          const newQuestion = await Question.create(questionData);
          updatedQuestions.push(newQuestion._id);
        }
      }

      const updateAssesment = await Assesment.findByIdAndUpdate(
        data._id,
        { ...data, questions: updatedQuestions },
        { new: true }
      ).populate('questions');

      req.io.emit('update-assesment', updateAssesment);
      res.status(200).json(updateAssesment);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getAssesment = async (req: CustomRequest, res) => {
  const assessment = await Assesment.find({}).sort({ createdAt: -1 }).populate('moduleId').populate('questions');
  return res.status(200).json(assessment);
};

export const newSubmission = expressAsyncHandler(async (req: any, res: any) => {
  const data = req.body;
  const { user, activityId } = data;

  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;

      const submissions = await Submissions.create(data);

      if (!submissions) {
        return res.status(400).json({ msg: 'Submission creation failed' });
      }

      let progress = await Progress.findOne({ studentId: user });

      if (!progress) {
        progress = await Progress.create({
          studentId: user,
          completedLessons: [activityId],
        });
      } else if (!progress.completedLessons.includes(activityId)) {
        progress.completedLessons.push(activityId);
        await progress.save();
      } else {
        progress = null;
      }

      if (progress) req.io.emit('update-progress', progress);
      req.io.emit('update-submission', submissions);

      return res.status(200).json(submissions);
    }

    // Updating existing submission
    const updateSubmissions = await Submissions.findByIdAndUpdate(data._id, data, { new: true });

    if (!updateSubmissions) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    req.io.emit('update-submission', updateSubmissions);
    res.status(200).json(updateSubmissions);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
export const getSubmissions = async (req: CustomRequest, res) => {
  const assessment = await Submissions.find({ activityId: req.params.id });

  const filteredAssessment =
    req.user.role === 'admin' ? assessment : assessment.filter((x) => x.user.toString() === req.user._id);

  return res.status(200).json(filteredAssessment);
};
