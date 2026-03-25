"use client";
import { useState } from "react";

export default function useDropdownState() {
  const [showDropdowns, setShowDropdowns] = useState({});
  const [showCalendars, setShowCalendars] = useState({});
  const [timePeriods, setTimePeriods] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});

  return {
    showDropdowns,
    setShowDropdowns,
    showCalendars,
    setShowCalendars,
    timePeriods,
    setTimePeriods,
    searchTerms,
    setSearchTerms,
    imageLoaded,
    setImageLoaded,
  };
}
