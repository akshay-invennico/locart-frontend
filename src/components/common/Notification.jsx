"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getAll, markAsRead } from "@/state/notification/notificationService";

const Notification = ({ isOpen, heading, subHeading }) => {
  const ref = useRef();
  const [isExpanded, setIsExpanded] = useState(false);
  const [readAll, setReadAll] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getAll();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAsRead();
      setReadAll(true);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const renderIcon = (n) => {
    const baseStyle =
      "w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden";

    switch (n.type) {
      case "booking":
        return (
          <div className={baseStyle}>
            <Image
              src="/icons/notification_booking.svg"
              alt="Booking"
              width={20}
              height={20}
            />
          </div>
        );
      case "general":
        const initials = n.name
          ? n.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()
          : "CL";
        return (
          <div className={`${baseStyle} bg-primary1 text-white font-bold`}>
            {initials}
          </div>
        );
      case "payment":
        return (
          <div className={baseStyle}>
            <Image
              src="/icons/notification_payment.svg"
              alt="Payment"
              width={24}
              height={24}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-14 -right-22 w-[90vw] sm:w-[500px] bg-white shadow-xl rounded-xl border border-gray-200 z-50"
        >
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-[var(--color-black)]">
                {heading}
              </h3>
              <button
                className={`text-xs ${notifications.length === 0 ? 'hidden' : 'flex text-primary1'} hover:underline`}
                onClick={handleMarkAllAsRead}
              >
                Mark all as Read
              </button>
            </div>
            <h5 className="text-sm text-[var(--color-dull-text)] mt-1">
              {subHeading}
            </h5>
          </div>

          <div
            className={`transition-all duration-300 overflow-y-auto ${isExpanded ? "max-h-[500px]" : "max-h-[300px]"
              }`}
          >
            {loading ? (
              <p className="text-center text-gray-400 p-4">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-400 p-4">
                No notifications available
              </p>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 border-b hover:bg-gray-50 transition"
                >
                  <div className="flex-shrink-0">{renderIcon(n)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${readAll || n.read
                              ? "bg-[var(--color-dull-text)]"
                              : "bg-[var(--color-primary1)]"
                            } transition-colors duration-300`}
                        ></span>
                        <p className="text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>

                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2 sm:line-clamp-none">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t flex justify-end items-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`${notifications.length === 0 ? 'hidden' : 'flex '} items-center gap-1 text-sm text-primary1 font-medium hover:underline transition-all`}
            >
              <span>{isExpanded ? "Collapse" : "View More"}</span>
              <Image
                src="/icons/direction.svg"
                alt="View More"
                width={18}
                height={18}
                className={`transition-transform duration-300 ${isExpanded ? "rotate-270" : "rotate-0"
                  }`}
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
