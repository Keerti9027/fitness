import React, { useState } from 'react';
import { Users, MessageSquare, Heart, Share2, Award, Plus, Image as ImageIcon, Send } from 'lucide-react';
import Modal from '../components/Modal';

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    badge: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked?: boolean;
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export default function Social() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        badge: '🏋️‍♀️ Elite Trainer'
      },
      content: 'Just completed a 5K run in 22 minutes! New personal best! 🎉',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      likes: 124,
      comments: [
        {
          id: 1,
          user: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
          },
          content: 'Amazing achievement! Keep it up! 💪',
          timestamp: '1 hour ago'
        }
      ],
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        badge: '💪 Fitness Pro'
      },
      content: 'Here\'s my go-to healthy breakfast! Packed with proteins and healthy fats.',
      image: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800',
      likes: 89,
      comments: [],
      timestamp: '5 hours ago',
      isLiked: false
    }
  ]);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: '' });
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      user: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        badge: '🌟 Fitness Enthusiast'
      },
      content: newPost.content,
      image: newPost.image || undefined,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', image: '' });
    setIsCreatePostOpen(false);
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: post.comments.length + 1,
            user: {
              name: 'Current User',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            },
            content: newComment,
            timestamp: 'Just now'
          }]
        };
      }
      return post;
    }));

    setNewComment('');
    setActiveCommentId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fitness Community</h1>
        <div className="flex space-x-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
            <Users className="w-5 h-5" />
            <span>Find Friends</span>
          </button>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{post.user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{post.timestamp}</span>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {post.user.badge}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{post.content}</p>
                
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                )}
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 ${
                        post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-4 space-y-4">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  {activeCommentId === post.id && (
                    <div className="flex items-center space-x-3 mt-4">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                        alt="Current user"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full pr-10 py-2 px-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-indigo-600" />
              Top Achievers
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Emma Wilson', achievement: '30-Day Streak', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
                { name: 'David Kim', achievement: 'Weight Goal Reached', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
              ].map((achiever, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <img
                    src={achiever.avatar}
                    alt={achiever.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{achiever.name}</p>
                    <p className="text-sm text-indigo-600">{achiever.achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Trending Tags</h2>
            <div className="flex flex-wrap gap-2">
              {['#FitnessGoals', '#HealthyEating', '#WorkoutMotivation', '#FitFam', '#StrengthTraining'].map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-indigo-100 hover:text-indigo-800 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        title="Create New Post"
      >
        <div className="space-y-4">
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="What's on your mind?"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPost.image}
              onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
              placeholder="Image URL (optional)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="p-2 text-gray-500 hover:text-indigo-600">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}