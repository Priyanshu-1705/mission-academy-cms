import React, { createContext, useContext, useState, useEffect } from "react";
import { bannerService } from "../services/bannerService";
import { leadershipService } from "../services/leadershipService";
import { galleryService } from "../services/galleryService";
import { eventsService } from "../services/eventsService";
import { achievementsService } from "../services/achievementsService";
import { mandatoryDisclosureService } from "../services/mandatoryDisclosureService";
import { registrationService } from "../services/registrationService";
import { enquiryService } from "../services/enquiryService";
import { settingsService } from "../services/settingsService";

const SchoolDataContext = createContext(null);

export function SchoolDataProvider({ children }) {
  const [banners, setBanners] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [events, setEvents] = useState([]);
  const [boardAchievers, setBoardAchievers] = useState([]);
  const [otherAchievements, setOtherAchievements] = useState([]);
  const [disclosures, setDisclosures] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        bannersData,
        leadersData,
        albumsData,
        eventsData,
        boardData,
        otherData,
        disclosuresData,
        settingsData,
      ] = await Promise.all([
        bannerService.getPublicBanners(),
        leadershipService.getPublicLeaders(),
        galleryService.getPublicAlbums(),
        eventsService.getPublicEvents(),
        achievementsService.getPublicBoardAchievers(),
        achievementsService.getPublicOtherAchievements(),
        mandatoryDisclosureService.getPublicDocuments(),
        settingsService.getPublicSettings(),
      ]);

      setBanners(bannersData || []);
      setLeaders(leadersData || []);
      setAlbums(albumsData || []);
      setEvents(eventsData || []);
      setBoardAchievers(boardData || []);
      setOtherAchievements(otherData || []);
      setDisclosures(disclosuresData || []);
      setSettings(settingsData || {});
    } catch (err) {
      console.warn("Error loading school data gracefully:", err.message || err);
      setError(err.message || "Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const submitEnquiry = async (data) => {
    return await enquiryService.submitEnquiry(data);
  };

  const submitRegistration = async (data) => {
    return await registrationService.submitRegistration(data);
  };

  const updateSettings = async (data) => {
    const updated = await settingsService.updateSettings(data);
    setSettings(updated);
    return updated;
  };

  return (
    <SchoolDataContext.Provider
      value={{
        banners,
        leaders,
        albums,
        events,
        boardAchievers,
        otherAchievements,
        disclosures,
        settings,
        isLoading,
        error,
        refreshData: fetchAllData,
        submitEnquiry,
        submitRegistration,
        updateSettings,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error("useSchoolData must be used within a SchoolDataProvider");
  }
  return context;
}
