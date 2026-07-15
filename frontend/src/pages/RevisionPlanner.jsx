import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { format, addDays, differenceInDays } from 'date-fns';
import { FiCalendar, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RevisionPlanner() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([{ name: '', hours: '' }]);
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);

  useEffect(() => {
    fetchSavedPlans();
  }, []);

  const fetchSavedPlans = async () => {
    try {
      const res = await api.get('/planner');
      setSavedPlans(res.data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', hours: '' }]);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const generateSchedule = async () => {
    if (!examDate) {
      toast.error('Please select an exam date');
      return;
    }

    const validSubjects = subjects.filter((s) => s.name && s.hours);
    if (validSubjects.length === 0) {
      toast.error('Please add at least one subject');
      return;
    }

    setLoading(true);

    try {
      const totalHours = validSubjects.reduce((sum, s) => sum + parseFloat(s.hours || 0), 0);
      const examDateObj = new Date(examDate);
      const today = new Date();
      const daysAvailable = differenceInDays(examDateObj, today);

      if (daysAvailable <= 0) {
        toast.error('Exam date must be in the future');
        setLoading(false);
        return;
      }

      // Generate schedule
      const generatedSchedule = [];
      let currentDate = new Date(today);
      let subjectIndex = 0;
      const hoursPerSubject = validSubjects.map((s) => ({
        name: s.name,
        totalHours: parseFloat(s.hours),
        remainingHours: parseFloat(s.hours),
      }));

      for (let day = 0; day < daysAvailable; day++) {
        const daySchedule = {
          date: format(addDays(today, day), 'yyyy-MM-dd'),
          dateFormatted: format(addDays(today, day), 'MMM dd, yyyy'),
          subjects: [],
        };

        let dayHoursRemaining = hoursPerDay;

        while (dayHoursRemaining > 0 && hoursPerSubject.some((s) => s.remainingHours > 0)) {
          const subject = hoursPerSubject[subjectIndex % hoursPerSubject.length];
          if (subject.remainingHours > 0) {
            const hoursToAllocate = Math.min(dayHoursRemaining, subject.remainingHours, 4);
            daySchedule.subjects.push({
              name: subject.name,
              hours: hoursToAllocate,
            });
            subject.remainingHours -= hoursToAllocate;
            dayHoursRemaining -= hoursToAllocate;
          }
          subjectIndex++;
        }

        if (daySchedule.subjects.length > 0) {
          generatedSchedule.push(daySchedule);
        }
      }

      setSchedule(generatedSchedule);
      toast.success('Schedule generated successfully!');
    } catch (error) {
      toast.error('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (schedule.length === 0) {
      toast.error('Please generate a schedule first');
      return;
    }

    try {
      await api.post('/planner', {
        subjects: subjects.filter((s) => s.name && s.hours),
        examDate,
        hoursPerDay,
        schedule,
      });
      toast.success('Plan saved successfully!');
      fetchSavedPlans();
    } catch (error) {
      toast.error('Failed to save plan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Revision Planner
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create Plan
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exam Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hours per Day
                  </label>
                  <input
                    type="number"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 4)}
                    min={1}
                    max={12}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subjects
                    </label>
                    <button
                      onClick={addSubject}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  {subjects.map((subject, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Subject name"
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Hours"
                        value={subject.hours}
                        onChange={(e) => updateSubject(index, 'hours', e.target.value)}
                        min={1}
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      {subjects.length > 1 && (
                        <button
                          onClick={() => removeSubject(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generateSchedule}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Generate Schedule'}
                </button>
                {schedule.length > 0 && (
                  <button
                    onClick={savePlan}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <FiSave className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Display */}
          <div className="lg:col-span-2">
            {schedule.length > 0 ? (
              <div className="space-y-4">
                {schedule.map((day, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {day.dateFormatted}
                    </h3>
                    <div className="space-y-2">
                      {day.subjects.map((subject, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {subject.name}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {subject.hours} {subject.hours === 1 ? 'hour' : 'hours'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Generate a revision schedule to see your plan here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

