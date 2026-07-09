import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiSearch, FiFileText, FiBookOpen, FiCalendar } from 'react-icons/fi';

const features = [
  {
    icon: <FiShoppingBag className="w-8 h-8" />,
    title: 'Buy & Sell',
    description: 'Trade items with fellow students easily and securely.',
  },
  {
    icon: <FiSearch className="w-8 h-8" />,
    title: 'Lost & Found',
    description: 'Find your lost items or help others find theirs.',
  },
  {
    icon: <FiFileText className="w-8 h-8" />,
    title: 'Smart Summarizer',
    description: 'AI-powered summarization of your documents and notes.',
  },
  {
    icon: <FiBookOpen className="w-8 h-8" />,
    title: 'Quiz',
    description: 'Test your knowledge with AI-generated quizzes.',
  },
  {
    icon: <FiCalendar className="w-8 h-8" />,
    title: 'Revision Planner',
    description: 'Plan your study schedule with AI assistance.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
            Congivia AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            All-in-one Student Utility Platform
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Your complete solution for buying, selling, studying, and staying organized on campus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-semibold text-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students using Congivia AI to make campus life easier.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Create Account
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

