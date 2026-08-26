const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const Like = require('../models/Like');
const Rating = require('../models/Rating');

const toTagsArray = (tags) => {
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

const createProject = async (req, res) => {
  const { title, description, tags, githubUrl, liveUrl } = req.body;
  if (!title || !description || !githubUrl) {
    return res.status(400).json({ message: 'Title, description, and GitHub URL are required' });
  }
  try {
    const project = await Project.create({
      title,
      description,
      tags: toTagsArray(tags),
      githubUrl,
      liveUrl: liveUrl || '',
      ownerUid: req.uid,
      ownerName: req.user.displayName,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

// GET /api/projects?q=&tag=&page=&limit=
const getProjects = async (req, res) => {
  const { q, tag, page = 1, limit = 9 } = req.query;
  const filter = {};
  if (tag) filter.tags = tag;
  if (q) filter.$text = { $search: q };

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Project.countDocuments(filter),
    ]);
    res.json({ projects, total, page: Number(page), pages: Math.max(1, Math.ceil(total / Number(limit))) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const comments = await Comment.find({ project: project._id }).sort({ createdAt: -1 });

    let isBookmarked = false;
    let isLiked = false;
    let myRating = 0;
    if (req.uid) {
      const [bm, lk, rt] = await Promise.all([
        Bookmark.findOne({ userUid: req.uid, project: project._id }),
        Like.findOne({ userUid: req.uid, project: project._id }),
        Rating.findOne({ userUid: req.uid, project: project._id }),
      ]);
      isBookmarked = !!bm;
      isLiked = !!lk;
      myRating = rt ? rt.value : 0;
    }

    res.json({ project, comments, isBookmarked, isLiked, myRating });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project', error: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.ownerUid !== req.uid) return res.status(403).json({ message: 'Not authorized' });

    const { title, description, tags, githubUrl, liveUrl } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    if (tags !== undefined) project.tags = toTagsArray(tags);
    if (githubUrl) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.ownerUid !== req.uid) return res.status(403).json({ message: 'Not authorized' });

    await Promise.all([
      Comment.deleteMany({ project: project._id }),
      Bookmark.deleteMany({ project: project._id }),
      Like.deleteMany({ project: project._id }),
      Rating.deleteMany({ project: project._id }),
      project.deleteOne(),
    ]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerUid: req.uid }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your projects', error: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
};
