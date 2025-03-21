import { Story } from "../models/story.model.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addStory = async (req, res) => {
  try {
    console.log('check add story')
    const { caption } = req.body;
    const file = req.file;
    const authorId = req.id;

    if (!file) return res.status(400).json({ message: "File required" });

    let typeContent = file.mimetype.startsWith("image/")
      ? "image"
      : file.mimetype.startsWith("video/")
        ? "video"
        : null;

    if (!typeContent) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
    });

    const story = await Story.create({
      caption,
      src: cloudResponse.secure_url,
      typeContent,
      author: authorId,
    });

    return res.status(201).json({
      message: "New story added",
      story,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getUserStory = async (req, res) => {
  try {
    const authorId = req.id;

    const stories = await Story.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      stories,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getFollowStories = async (req, res) => {
  try {
    const currentId = req.id;

    const currentUser = await User.findById(currentId).select("following");
    const followedUserIds = currentUser.following;

    const stories = await Story.find({ author: { $in: followedUserIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      stories,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// View story
export const viewStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyViewed = story.views.some(view => view.user.toString() === userId.toString());
    if (!alreadyViewed) {
      story.views.push({ user: userId });
      await story.save();
    }

    res.status(200).json({ message: "Story viewed successfully" });
  } catch (error) {
    console.error(" Error in viewStory:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Like / Unlike Story
export const likeOrDislikeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyLiked = story.likes.includes(userId);
    if (alreadyLiked) {
      story.likes = story.likes.filter(like => like.toString() !== userId.toString());
      await story.save();
      return res.status(200).json({ success: true, message: "Unliked the story" });
    } else {
      story.likes.push(userId);
      await story.save();
      return res.status(200).json({ success: true, message: "Liked the story" });
    }
  } catch (error) {
    console.error(" Error in likeStory:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Comment 
export const commentOnStory = async (req, res) => {
  try {
    const { id } = req.params; // id của Story
    const { text } = req.body;
    const userId = req.id;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const comment = new Comment({
      text,
      author: userId,
      story: id
    });

    await comment.save();

    story.comments.push(comment._id);
    await story.save();

    res.status(201).json({ message: "Comment added to story", comment });
  } catch (error) {
    console.error(" Error in commentOnStory:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStoryComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ story: id })
      .populate('author', 'username profilePicture ')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("eerror in getStoryComments: hic loi oi", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//đì lít
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this story" });
    }

    await Story.findByIdAndDelete(id);

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStory:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    const userId = req.id;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this story" });
    }

    story.caption = caption || story.caption;
    await story.save();

    res.status(200).json({ message: "Story updated", story });
  } catch (error) {
    console.error("Error in updateStory:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStoryComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const story = await Story.findById(comment.story);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (comment.author.toString() !== userId.toString() &&
      story.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    story.comments = story.comments.filter(cmtId => cmtId.toString() !== commentId.toString());
    await story.save();

    res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    console.error("Error in deleteStoryComment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
