import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import { FiPlus, FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';

export default function Planner() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    subjects: '',
    hoursPerDay: '',
    examDate: '',
    name: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/planner');
      setPlans(res.data);
    } catch (error) {
      toast.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.put(`/planner/${editingPlan._id}`, formData);
        toast.success('Plan updated successfully');
      } else {
        await api.post('/planner', formData);
        toast.success('Plan created successfully');
      }
      setShowModal(false);
      setEditingPlan(null);
      setFormData({ subjects: '', hoursPerDay: '', examDate: '', name: '' });
      fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save plan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/planner/${id}`);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      subjects: plan.subjects.join(', '),
      hoursPerDay: plan.hoursPerDay,
      examDate: plan.examDate.split('T')[0],
      name: plan.name || '',
    });
    setShowModal(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Revision Planner</h1>
          <button
            onClick={() => {
              setEditingPlan(null);
              setFormData({ subjects: '', hoursPerDay: '', examDate: '', name: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus /> New Plan
          </button>
        </div>

        {/* Plans List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name || 'Study Plan'}
                </h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Subjects:</span> {plan.subjects.join(', ')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Hours/Day:</span> {plan.hoursPerDay}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Exam Date:</span>{' '}
                  {new Date(plan.examDate).toLocaleDateString()}
                </p>
              </div>
              {plan.schedule && plan.schedule.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Schedule Preview:
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {plan.schedule.slice(0, 3).map((day, idx) => (
                      <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                        {day.date}: {day.subjects.join(', ')}
                      </div>
                    ))}
                    {plan.schedule.length > 3 && (
                      <div className="text-xs text-gray-500">...and {plan.schedule.length - 3} more days</div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Plan Name (optional)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Subjects (comma-separated)"
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Hours per day"
                  value={formData.hoursPerDay}
                  onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                  required
                  min="1"
                  max="24"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="date"
                  placeholder="Exam Date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingPlan ? 'Update' : 'Create Plan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPlan(null);
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

