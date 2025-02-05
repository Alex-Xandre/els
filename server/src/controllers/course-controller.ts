import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Course, Module, Section } from '../models/course-model';
import { CustomRequest } from '../types';
import { Organize } from '../models/organize-model';

// Course Controllers
export const newCourse = expressAsyncHandler(async (req: any, res) => {
  const data = req.body;
  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;
      const createCourse = await Course.create(data);
      req.io.emit('update-course', createCourse);
      res.status(200).json(createCourse);
    } else {
      const updateCourse = await Course.findByIdAndUpdate(data._id, data, { new: true });
      req.io.emit('update-course', updateCourse);
      res.status(200).json(updateCourse);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getCourse = async (req: CustomRequest, res) => {
  const courses = await Course.find({});
  return res.status(200).json(courses);
};

export const getCourseWithModulesAndSections = async (req: CustomRequest, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId)
      .populate({
        path: 'modules',
        populate: {
          path: 'sections',
        },
      })
      .exec();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Module Controllers
export const newModule = expressAsyncHandler(async (req: any, res) => {
  const data = req.body;
  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;
      const createModule = await Module.create(data);
      req.io.emit('update-module', createModule);
      res.status(200).json(createModule);
    } else {
      const updateModule = await Module.findByIdAndUpdate(data._id, data, { new: true });
      req.io.emit('update-module', updateModule);
      res.status(200).json(updateModule);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getModule = async (req: CustomRequest, res) => {
  const modules = await Module.find({}).populate('courseId');
  return res.status(200).json(modules);
};

export const getModuleWithSections = async (req: CustomRequest, res) => {
  const moduleId = req.params.id;
  try {
    const module = await Module.findById(moduleId).populate('sections').exec();
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Section Controllers
export const newSection = expressAsyncHandler(async (req: any, res) => {
  const data = req.body;
  try {
    if (!mongoose.isValidObjectId(data._id)) {
      delete data._id;
      const createSection = await Section.create(data);

      const organize = await Organize.findOne({ moduleId: data.moduleId });

      if (!organize) {
        await Organize.create({
          moduleId: createSection.moduleId,
          contentId: [createSection._id],
        });
      }
      if (!organize.contentId.includes(createSection._id.toString())) {
        organize.contentId.push(createSection._id.toString());
        await organize.save();
      }

      req.io.emit('update-section', createSection);
      res.status(200).json(createSection);
    } else {
      const updateSection = await Section.findByIdAndUpdate(data._id, data, { new: true });
      req.io.emit('update-section', updateSection);
      res.status(200).json(updateSection);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getSection = async (req: CustomRequest, res) => {
  const sections = await Section.find({}).sort({ createdAt: -1 }).populate('moduleId');
  return res.status(200).json(sections);
};

export const getSectionWithModule = async (req: CustomRequest, res) => {
  const sectionId = req.params.id;
  try {
    const section = await Section.findById(sectionId).populate('moduleId').exec();
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSectionOrganization = async (req: CustomRequest, res) => {
  const sectionId = req.params.id;
  try {
    const sectionSequence = await Organize.findOne({ moduleId: sectionId });
    res.status(200).json(sectionSequence);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
