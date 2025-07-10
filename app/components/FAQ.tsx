'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "How do I start my property search?",
    answer: "You can begin your search by using our search bar at the top of the page. Filter by location, price range, and property features to find your perfect match."
  },
  {
    question: "How do I schedule a viewing?",
    answer: "Once you've found a property you're interested in, simply click the 'Schedule Viewing' button on the property page. You'll be able to choose from available time slots."
  },
  {
    question: "What documents do I need to rent?",
    answer: "Typically, you'll need proof of income, identification, references from previous landlords, and possibly a credit check. Specific requirements may vary by property."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take data security seriously. All your personal information is encrypted and stored securely in accordance with data protection regulations."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
          whileTap={{ scale: 0.97 }}
          className="border dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

