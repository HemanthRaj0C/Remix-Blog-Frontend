import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MarkdownTipsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const tips = [
    {
      category: "Text Formatting",
      items: [
        { label: "Bold", syntax: "**bold**" },
        { label: "Italic", syntax: "*italic*" }
      ]
    },
    {
      category: "Structure",
      items: [
        { label: "Heading 1", syntax: "# Heading" },
        { label: "Heading 2", syntax: "## Heading" },
        { label: "Heading 3", syntax: "### Heading" }
      ]
    },
    {
      category: "New Line",
      items: [
        { label: "New Line", syntax: "Blank Space" }
      ]
    },
    {
      category: "Elements",
      items: [
        { label: "Link", syntax: "[text](url)" },
        { label: "Image", syntax: "![alt](url)" },
        { label: "Blockquote", syntax: "> Quote" }
      ]
    },
    {
      category: "Lists",
      items: [
        { label: "Bullet List", syntax: "- Item" },
        { label: "Numbered List", syntax: "1. Item" }
      ]
    },
    {
      category: "Code",
      items: [
        { label: "Inline Code", syntax: "`code`" },
        { label: "Code Block", syntax: "```\ncode\n```" }
      ]
    }
  ];

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-300 
                 dark:hover:text-gray-200 underline font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        View Markdown Tips
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { type: "spring", damping: 25, stiffness: 300 }
              }}
              exit={{ 
                scale: 0.5, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
              className="bg-white dark:bg-stone-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b dark:border-stone-700">
                <motion.h3 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  Markdown Tips
                </motion.h3>
                <motion.button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
                           dark:hover:text-gray-200"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tips.map((section, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        transition: { delay: idx * 0.1 }
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 dark:bg-stone-700 rounded-lg p-4 shadow-sm"
                    >
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        {section.category}
                      </h4>
                      <div className="space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <motion.div 
                            key={itemIdx}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ 
                              x: 0, 
                              opacity: 1,
                              transition: { delay: (idx * 0.1) + (itemIdx * 0.05) }
                            }}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-600 dark:text-gray-300">
                              {item.label}:
                            </span>
                            <code className="bg-gray-100 dark:bg-stone-600 px-2 py-1 
                                         rounded text-gray-800 dark:text-gray-200">
                              {item.syntax}
                            </code>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end p-4 border-t dark:border-stone-700">
                <motion.button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-950 hover:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MarkdownTipsModal;