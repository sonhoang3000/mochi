import { Story } from "../models/story.model.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export const addStory = async (req, res) => {
      try {
            const { caption } = req.body;
            const file = req.file;
            const authorId = req.id;

            if (!file) return res.status(400).json({ message: "File required" });

            let typeContent;

            if (file.mimetype.startsWith("image/")) {
                  typeContent = "image";
            } else if (file.mimetype.startsWith("video/")) {
                  typeContent = "video";
            } else {
                  return res.status(400).json({ message: "Invalid file type" });
            }

            // Chuyển buffer thành base64
            const fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

            // Upload lên Cloudinary
            const cloudResponse = await cloudinary.uploader.upload(fileUri, {
                  resource_type: "auto",
            });

            // Lưu vào MongoDB
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
            const stories = await Story.find({ author: authorId }).sort({ createdAt: -1 }).populate({
                  path: 'author',
                  select: 'username, profilePicture'
            }).populate({
                  path: 'comments',
                  sort: { createdAt: -1 },
                  populate: {
                        path: 'author',
                        select: 'username, profilePicture'
                  }
            });
            return res.status(200).json({
                  stories,
                  success: true
            })
      } catch (error) {
            console.log(error);
      }
}

export const getFollow = async (req, res) => {
      const currentId = req.id;
      let user = await User.findById(currentId)
}