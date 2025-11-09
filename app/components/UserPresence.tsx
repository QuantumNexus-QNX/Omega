'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface User {
  id: string;
  name: string;
  color?: string;
  avatar?: string;
}

interface UserPresenceProps {
  users: User[];
  currentUserId?: string;
  className?: string;
}

export const UserPresence: React.FC<UserPresenceProps> = ({
  users,
  currentUserId,
  className = ''
}) => {
  const otherUsers = users.filter(u => u.id !== currentUserId);

  if (otherUsers.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-400">Collaborating:</span>
      
      <div className="flex items-center -space-x-2">
        <AnimatePresence>
          {otherUsers.slice(0, 5).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-900"
                  style={{ borderColor: user.color || '#8b5cf6' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: user.color || '#8b5cf6' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {user.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>

              {/* Online indicator */}
              <div
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 animate-pulse"
                style={{ backgroundColor: user.color || '#10b981' }}
              ></div>
            </motion.div>
          ))}
        </AnimatePresence>

        {otherUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white">
            +{otherUsers.length - 5}
          </div>
        )}
      </div>

      <span className="text-xs text-gray-500 font-mono">
        ({otherUsers.length} {otherUsers.length === 1 ? 'user' : 'users'})
      </span>
    </div>
  );
};
