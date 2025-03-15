import { useState } from "react"
import CommentDialog from "./CommentDialog"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedPost } from "@/redux/postSlice"

const Explore = () => {
      const { posts } = useSelector(store => store.post)
      const [open, setOpen] = useState(false)
      const dispatch = useDispatch()

      return (
            <div className="flex-1 p-4 ml-60 md:ml-64 bg-white min-h-screen mt-10">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                        {posts?.map((post) => (
                              <div key={post._id} className="relative group" onClick={() => {
                                    dispatch(setSelectedPost(post));
                                    setOpen(true)
                              }} >
                                    {post?.typeContent === "image" ? (
                                          <img
                                                className="w-full h-full object-cover aspect-square"
                                                src={post?.src}
                                                alt="post_img"
                                          // onDoubleClick={likeOrDislikeHandler}
                                          />
                                    ) : post?.typeContent === "video" ? (
                                          <video
                                                className="w-full h-full object-cover aspect-square"
                                                controls
                                          // onDoubleClick={likeOrDislikeHandler}
                                          >
                                                <source src={post?.src} type="video/mp4" />
                                                Your browser does not support the video tag.
                                          </video>
                                    ) : null}

                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                                          <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-all">
                                                ❤️ {post?.likes.length} | 💬 {post?.comments.length}
                                          </p>
                                    </div>


                              </div>


                        ))}
                        <CommentDialog open={open} setOpen={setOpen} />
                  </div>
            </div>
      )
}

export default Explore
