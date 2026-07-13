import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import { FiPlus, FiMapPin, FiCheckCircle } from 'react-icons/fi';

export default function LostFound() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'lost',
    image: null,
    imageUrl: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [filterType, searchTerm]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/lost-found', { params: { type: filterType, search: searchTerm } });
      setPosts(res.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setFormData({ ...formData, imageUrl: data.secure_url });
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lost-found', formData);
      toast.success('Post created successfully');
      setShowModal(false);
      setFormData({ title: '', description: '', location: '', type: 'lost', image: null, imageUrl: '' });
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleClaim = async (postId) => {
    try {
      await api.post(`/lost-found/${postId}/claim`);
      toast.success('Claim request sent to owner');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to send claim request');
    }
  };

  const handleResolve = async (postId) => {
    try {
      await api.put(`/lost-found/${postId}/resolve`);
      toast.success('Post marked as resolved');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to resolve post');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Lost & Found</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus /> New Post
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 sm:mb-6 flex flex-col md:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition ${
                post.resolved ? 'opacity-60' : ''
              }`}
            >
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      post.type === 'lost'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {post.type.toUpperCase()}
                  </span>
                  {post.resolved && (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <FiCheckCircle /> Resolved
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
                  <FiMapPin />
                  {post.location}
                </div>
                {!post.resolved && post.type === 'found' && (
                  <button
                    onClick={() => handleClaim(post._id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Claim Item
                  </button>
                )}
                {post.isOwner && !post.resolved && (
                  <button
                    onClick={() => handleResolve(post._id)}
                    className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Post Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">New Post</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
                )}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Post
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ title: '', description: '', location: '', type: 'lost', image: null, imageUrl: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

