import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import { Heart, MessageCircle, Send, Trash2, Edit2, MoreVertical, Upload, X, FileText, Search, Hash, TrendingUp, Users } from "lucide-react";
import axiosInstance from "../utils/axiosConfig";
import UploadImage from "../components/UploadImage";
import { Link } from "react-router-dom";

function Community() {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const { showToast } = useToast();

  // State
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newAttachment, setNewAttachment] = useState(null);
  const [newAttachmentType, setNewAttachmentType] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAttachment, setEditAttachment] = useState(null);
  const [editAttachmentType, setEditAttachmentType] = useState(null);
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showPostLikes, setShowPostLikes] = useState(null);
  const [showCommentLikes, setShowCommentLikes] = useState(null);
  const [postLikes, setPostLikes] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [topProfiles, setTopProfiles] = useState([]);

  // Fetch all posts with optional search
  const fetchPosts = async (search = "") => {
    try {
      const url = search ? `/api/community/posts/?search=${encodeURIComponent(search)}` : "/api/community/posts/";
      const response = await axiosInstance.get(url, { skipGlobalLoader: true });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // showToast("Failed to load posts", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/community/posts/${postId}/comments/`);
      setComments(prev => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch trending hashtags and top trainers
  const fetchTrendingData = async () => {
    try {
      const response = await axiosInstance.get("/api/community/posts/trending-hashtags", { skipGlobalLoader: true });

      // Transform trending_hashtags from [["#tag", count], ...] to [{ tag: "#tag", count: num }, ...]
      const formattedHashtags = response.data.trending_hashtags.map(([tag, count]) => ({
        tag,
        count
      }));

      setTrendingHashtags(formattedHashtags);
      setTopProfiles(response.data.top_trainers);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchQuery);
  };

  // Handle hashtag click
  const handleHashtagClick = (tag) => {
    setSearchQuery(tag);
    fetchPosts(tag);
  };

  // Create a new post
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      showToast("Please fill in both title and content", { type: "error" });
      return;
    }

    setIsCreatingPost(true);
    try {
      const postData = {
        title: newPostTitle,
        content: newPostContent
      };

      if (newAttachment && newAttachmentType) {
        postData.attachment = newAttachment;
        postData.attachment_type = newAttachmentType;
      }

      await axiosInstance.post("/api/community/posts/", postData);

      setNewPostTitle("");
      setNewPostContent("");
      setNewAttachment(null);
      setNewAttachmentType(null);
      setShowUpload(false);
      showToast("Post created successfully!", { type: "success" });
      fetchPosts(searchQuery); // Refresh without loading state
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Failed to create post", { type: "error" });
    } finally {
      setIsCreatingPost(false);
    }
  };

  // Update post
  const handleUpdatePost = async (postId) => {
    if (!editTitle.trim() || !editContent.trim()) {
      showToast("Title and content cannot be empty", { type: "error" });
      return;
    }

    try {
      const postData = {
        title: editTitle,
        content: editContent,
        attachment: editAttachment || null,
        attachment_type: editAttachmentType || null
      };

      await axiosInstance.put(`/api/community/posts/${postId}/update/`, postData);

      showToast("Post updated successfully!", { type: "success" });
      setEditingPostId(null);
      setEditTitle("");
      setEditContent("");
      setEditAttachment(null);
      setEditAttachmentType(null);
      fetchPosts(searchQuery);
    } catch (error) {
      console.error("Error updating post:", error);
      showToast("Failed to update post", { type: "error" });
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axiosInstance.delete(`/api/community/posts/${postId}/delete/`);
      showToast("Post deleted successfully!", { type: "success" });
      fetchPosts(searchQuery);
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post", { type: "error" });
    }
  };

  // Like/Unlike post
  const handleToggleLike = async (postId) => {
    try {
      await axiosInstance.post(`/api/community/posts/${postId}/like/`);
      fetchPosts(searchQuery);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Add comment
  const handleAddComment = async (postId) => {
    const content = commentTexts[postId]?.trim();
    if (!content) return;

    try {
      await axiosInstance.post(`/api/community/posts/${postId}/comments/`, { content });
      setCommentTexts(prev => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
      fetchPosts(searchQuery);
      showToast("Comment added!", { type: "success" });
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Failed to add comment", { type: "error" });
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axiosInstance.delete(`/api/community/comments/${commentId}/delete/`);
      fetchComments(postId);
      fetchPosts(searchQuery);
      showToast("Comment deleted!", { type: "success" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment", { type: "error" });
    }
  };

  // Toggle comments section
  const toggleComments = (postId) => {
    if (openCommentsId === postId) {
      setOpenCommentsId(null);
    } else {
      setOpenCommentsId(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  // Start editing
  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditAttachment(post.attachment || null);
    setEditAttachmentType(post.attachment_type || null);
    setOpenMenuId(null);
  };

  // Handle attachment upload
  const handleAttachmentUpload = (url, type) => {
    if (editingPostId) {
      setEditAttachment(url);
      setEditAttachmentType(type);
    } else {
      setNewAttachment(url);
      setNewAttachmentType(type);
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId, postId) => {
    if (!editCommentText.trim()) {
      showToast("Comment cannot be empty", { type: "error" });
      return;
    }

    try {
      await axiosInstance.put(`/api/community/comments/${commentId}/update/`, {
        content: editCommentText
      });

      showToast("Comment updated!", { type: "success" });
      setEditingCommentId(null);
      setEditCommentText("");
      fetchComments(postId);
    } catch (error) {
      console.error("Error updating comment:", error);
      showToast("Failed to update comment", { type: "error" });
    }
  };

  // Toggle comment like
  const handleToggleCommentLike = async (commentId, postId) => {
    try {
      await axiosInstance.post(`/api/community/comments/${commentId}/like/`);
      fetchComments(postId);
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  // Fetch post likes
  const fetchPostLikes = async (postId) => {
    try {
      const response = await axiosInstance.get(`/api/community/posts/${postId}/likes/`);
      setPostLikes(prev => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error("Error fetching post likes:", error);
    }
  };

  // Fetch comment likes
  const fetchCommentLikes = async (commentId) => {
    try {
      const response = await axiosInstance.get(`/api/community/comments/${commentId}/likes/`);
      setCommentLikes(prev => ({ ...prev, [commentId]: response.data }));
    } catch (error) {
      console.error("Error fetching comment likes:", error);
    }
  };

  // Toggle showing post likes
  const toggleShowPostLikes = (postId) => {
    if (showPostLikes === postId) {
      setShowPostLikes(null);
    } else {
      setShowPostLikes(postId);
      if (!postLikes[postId]) {
        fetchPostLikes(postId);
      }
    }
  };

  // Toggle showing comment likes
  const toggleShowCommentLikes = (commentId) => {
    if (showCommentLikes === commentId) {
      setShowCommentLikes(null);
    } else {
      setShowCommentLikes(commentId);
      if (!commentLikes[commentId]) {
        fetchCommentLikes(commentId);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
    fetchTrendingData();
  }, []);

  // Parse content and make hashtags clickable
  const renderContentWithHashtags = (content) => {
    const parts = content.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.match(/^#\w+$/)) {
        return (
          <span
            key={index}
            onClick={() => handleHashtagClick(part)}
            className="text-orange-600 hover:text-orange-700 cursor-pointer font-semibold hover:underline"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Skeleton Loader Component
  const PostSkeleton = () => (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="px-6 pb-4">
        <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </article>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="font-bebas text-6xl tracking-wide mb-2">COMMUNITY</h1>
            <p className="text-orange-100 text-lg">Connect, Share, Inspire</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts or hashtags..."
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg shadow-sm"
              />
            </div>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Trending Hashtags */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <h3 className="font-bebas text-xl tracking-wide text-gray-900">TRENDING</h3>
                </div>
                <div className="space-y-3">
                  {trendingHashtags.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleHashtagClick(item.tag)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-orange-600" />
                        <span className="font-semibold text-gray-900 group-hover:text-orange-600">{item.tag.slice(1)}</span>
                      </div>
                      <p className="text-xs text-gray-500 ml-6">{item.count.toLocaleString()} posts</p>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-6 space-y-6">
              {/* Create Post Card */}
              {user && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.username} className="h-12 w-12 rounded-full object-cover border-2 border-orange-500" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Post title..."
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                      />
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share your fitness journey..."
                        rows="3"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none transition-colors"
                      />

                      {newAttachment && (
                        <div className="relative border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <button
                            onClick={() => {
                              setNewAttachment(null);
                              setNewAttachmentType(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {newAttachmentType === 'image' && (
                            <img src={newAttachment} alt="Attachment" className="w-full h-48 object-cover rounded" />
                          )}
                          {newAttachmentType === 'video' && (
                            <video src={newAttachment} controls className="w-full h-48 rounded" />
                          )}
                          {newAttachmentType === 'document' && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-8 w-8 text-gray-500" />
                              <a href={newAttachment} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                View Document
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {showUpload && (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <UploadImage onUpload={(url, type) => handleAttachmentUpload(url, type)} />
                          <button
                            onClick={() => setShowUpload(false)}
                            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <button
                          onClick={() => setShowUpload(!showUpload)}
                          disabled={showUpload || newAttachment}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Attach
                        </button>
                        <button
                          onClick={handleCreatePost}
                          disabled={!newPostTitle.trim() || !newPostContent.trim() || isCreatingPost}
                          className="rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:from-orange-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          {isCreatingPost && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          {isCreatingPost ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-4">
                {isLoading ? (
                  // Show skeleton loaders while loading
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                ) : posts.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500">No posts yet. Be the first to share!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      {/* Post Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {post.author_profile_picture ? (
                              <img src={post.author_profile_picture} alt={post.author_name} className="h-12 w-12 rounded-full object-cover border-2 border-orange-500" />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                                {post.author_name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-gray-900">{post.author_name}</h3>
                              <p className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                          </div>

                          {user && user.current_profile === post.author && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>

                              {openMenuId === post.id && (
                                <div className="absolute right-0 mt-2 w-36 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-10">
                                  <button
                                    onClick={() => startEdit(post)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Post Content */}
                        {editingPostId === post.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                            />
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows="4"
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none resize-none"
                            />

                            {editAttachment && (
                              <div className="relative border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <button
                                  onClick={() => {
                                    setEditAttachment(null);
                                    setEditAttachmentType(null);
                                  }}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                  title="Remove attachment"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                {editAttachmentType === 'image' && (
                                  <img src={editAttachment} alt="Attachment" className="w-full h-48 object-cover rounded" />
                                )}
                                {editAttachmentType === 'video' && (
                                  <video src={editAttachment} controls className="w-full h-48 rounded" />
                                )}
                                {editAttachmentType === 'document' && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-8 w-8 text-gray-500" />
                                    <a href={editAttachment} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                      View Document
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {!editAttachment && showUpload && editingPostId === post.id && (
                              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <UploadImage onUpload={(url, type) => handleAttachmentUpload(url, type)} />
                                <button
                                  onClick={() => setShowUpload(false)}
                                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}

                            <div className="flex justify-between items-center gap-2">
                              {!editAttachment && !showUpload && (
                                <button
                                  onClick={() => setShowUpload(true)}
                                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600"
                                >
                                  <Upload className="h-4 w-4" />
                                  Add Attachment
                                </button>
                              )}

                              <div className="flex gap-2 ml-auto">
                                <button
                                  onClick={() => handleUpdatePost(post.id)}
                                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPostId(null);
                                    setEditTitle("");
                                    setEditContent("");
                                    setEditAttachment(null);
                                    setEditAttachmentType(null);
                                    setShowUpload(false);
                                  }}
                                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h2 className="font-bebas text-2xl text-gray-900 mb-2">{post.title}</h2>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {renderContentWithHashtags(post.content)}
                            </p>

                            {post.attachment && (
                              <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                                {post.attachment_type === 'image' && (
                                  <img src={post.attachment} alt="Post attachment" className="w-full max-h-96 object-cover" />
                                )}
                                {post.attachment_type === 'video' && (
                                  <video src={post.attachment} controls className="w-full max-h-96" />
                                )}
                                {post.attachment_type === 'document' && (
                                  <div className="p-4 bg-gray-50 flex items-center gap-3">
                                    <FileText className="h-10 w-10 text-gray-500" />
                                    <a href={post.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                      View Attached Document
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="px-6 pb-4 space-y-3">
                        <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleToggleLike(post.id)}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group"
                          >
                            <Heart className="h-5 w-5 group-hover:fill-current" />
                            <span
                              className="text-sm font-semibold cursor-pointer hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleShowPostLikes(post.id);
                              }}
                            >
                              {post.likes_count}
                            </span>
                          </button>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm font-semibold">{post.comments_count}</span>
                          </button>
                        </div>

                        {/* Show post likers */}
                        {showPostLikes === post.id && postLikes[post.id] && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-bold text-gray-600 mb-2">Liked by:</p>
                            <div className="space-y-1">
                              {postLikes[post.id].length > 0 ? (
                                postLikes[post.id].map((like) => (
                                  <div key={like.id} className="flex items-center gap-2 text-sm">
                                    <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                      {like.profile_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{like.profile_name}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-gray-500">No likes yet</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Comments Section */}
                        {openCommentsId === post.id && (
                          <div className="space-y-4 pt-3 border-t border-gray-100">
                            {user && (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={commentTexts[post.id] || ""}
                                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                  placeholder="Write a comment..."
                                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                                />
                                <button
                                  onClick={() => handleAddComment(post.id)}
                                  className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 transition-colors"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              </div>
                            )}

                            <div className="space-y-3">
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                                  <div className="flex items-start gap-3">
                                    {comment.author_profile_picture ? (
                                      <img src={comment.author_profile_picture} alt={comment.author_name} className="h-8 w-8 rounded-full object-cover" />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                                        {comment.author_name?.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-gray-900">{comment.author_name}</p>
                                        {user && user.current_profile === comment.author && (
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => {
                                                setEditingCommentId(comment.id);
                                                setEditCommentText(comment.content);
                                              }}
                                              className="text-xs text-blue-500 hover:text-blue-700"
                                            >
                                              <Edit2 className="h-3 w-3" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteComment(comment.id, post.id)}
                                              className="text-xs text-red-500 hover:text-red-700"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {editingCommentId === comment.id ? (
                                        <div className="space-y-2">
                                          <textarea
                                            value={editCommentText}
                                            onChange={(e) => setEditCommentText(e.target.value)}
                                            rows="2"
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none resize-none"
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleUpdateComment(comment.id, post.id)}
                                              className="rounded bg-orange-600 px-3 py-1 text-xs font-bold text-white hover:bg-orange-700"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={() => {
                                                setEditingCommentId(null);
                                                setEditCommentText("");
                                              }}
                                              className="rounded bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700 hover:bg-gray-300"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <p className="text-sm text-gray-700 mb-1">{comment.content}</p>
                                          <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                                            <button
                                              onClick={() => handleToggleCommentLike(comment.id, post.id)}
                                              className="flex items-center gap-1 hover:text-red-500"
                                            >
                                              <Heart className="h-3 w-3" />
                                              <span
                                                className="cursor-pointer hover:underline"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  toggleShowCommentLikes(comment.id);
                                                }}
                                              >
                                                Like
                                              </span>
                                            </button>
                                          </div>

                                          {showCommentLikes === comment.id && commentLikes[comment.id] && (
                                            <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                                              <p className="text-xs font-bold text-gray-600 mb-1">Liked by:</p>
                                              <div className="space-y-1">
                                                {commentLikes[comment.id].length > 0 ? (
                                                  commentLikes[comment.id].map((like) => (
                                                    <div key={like.id} className="flex items-center gap-2 text-xs">
                                                      <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {like.profile_name?.charAt(0).toUpperCase()}
                                                      </div>
                                                      <span>{like.profile_name}</span>
                                                    </div>
                                                  ))
                                                ) : (
                                                  <p className="text-xs text-gray-500">No likes yet</p>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar - Top Profiles */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-orange-600" />
                  <h3 className="font-bebas text-xl tracking-wide text-gray-900">TOP TRAINERS</h3>
                </div>
                <div className="space-y-4">
                  {topProfiles.length > 0 ? (
                    topProfiles.map((profile, idx) => (
                      profile.trainer_name && (
                        <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                          {profile.profile_picture ? (
                            <img
                              src={profile.profile_picture}
                              alt={profile.trainer_name}
                              className="h-10 w-10 rounded-full object-cover border-2 border-orange-500"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                              {profile.trainer_name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link to={`/trainer-profile/${profile.author_id}`} className="inline-block hover:opacity-90 transition">
                              <p className="font-semibold text-sm text-gray-900 truncate cursor-pointer hover:underline">{profile.trainer_name.split(' ')[0]}</p>
                            </Link>
                            <p className="text-xs text-gray-500">{profile.post_count} posts</p>
                          </div>
                        </div>
                      )
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No top trainers yet</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Community;
