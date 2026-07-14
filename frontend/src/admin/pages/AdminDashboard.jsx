import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { galleryService } from "../../services/galleryService";
import { eventsService } from "../../services/eventsService";
import { achievementsService } from "../../services/achievementsService";
import { mandatoryDisclosureService } from "../../services/mandatoryDisclosureService";
import { transferCertificateService } from "../../services/transferCertificateService";
import { registrationService } from "../../services/registrationService";
import { enquiryService } from "../../services/enquiryService";
import { bannerService } from "../../services/bannerService";
import { leadershipService } from "../../services/leadershipService";
import { settingsService } from "../../services/settingsService";
import { userService } from "../../services/userService";
import { useSchoolData } from "../../context/SchoolDataContext";
import ErrorState from "../../components/ErrorState";
import Loading from "../../components/Loading";

// Import modular components
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
import { Toast } from "../components/Toast";

// Import tab views
import { DashboardTab } from "../components/tabs/DashboardTab";
import { BannersTab } from "../components/tabs/BannersTab";
import { LeadershipTab } from "../components/tabs/LeadershipTab";
import { GalleryTab } from "../components/tabs/GalleryTab";
import { EventsTab } from "../components/tabs/EventsTab";
import { AchievementsTab } from "../components/tabs/AchievementsTab";
import { DisclosureTab } from "../components/tabs/DisclosureTab";
import { TransferCertificatesTab } from "../components/tabs/TransferCertificatesTab";
import { RegistrationsTab } from "../components/tabs/RegistrationsTab";
import { EnquiriesTab } from "../components/tabs/EnquiriesTab";
import { SettingsTab } from "../components/tabs/SettingsTab";
import { UsersTab } from "../components/tabs/UsersTab";
import { ProfileTab } from "../components/tabs/ProfileTab";

// Import modal editors
import { BannerModal } from "../components/modals/BannerModal";
import { LeaderModal } from "../components/modals/LeaderModal";
import { AlbumModal } from "../components/modals/AlbumModal";
import { PhotosModal } from "../components/modals/ManagePhotosModal";
import { EventModal } from "../components/modals/EventModal";
import { AchieverModal } from "../components/modals/AchieverModal";
import { OtherAchModal } from "../components/modals/OtherAchievementModal";
import { DocModal } from "../components/modals/DocumentModal";
import { TransferCertificateModal } from "../components/modals/TransferCertificateModal";
import { RegModal } from "../components/modals/RegistrationModal";
import { ViewRegModal } from "../components/modals/ViewRegistrationModal";
import { UserModal } from "../components/modals/UserModal";

export default function AdminDashboard() {
  const { user, role, logout, isAuthenticated } = useAuth();
  const { updateSettings } = useSchoolData();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const currentUser = user?.name || "principal";
  const navigate = useNavigate();

  // Master Data States
  const [albums, setAlbums] = useState([]);
  const [events, setEvents] = useState([]);
  const [boardAchievers, setBoardAchievers] = useState([]);
  const [otherAchievements, setOtherAchievements] = useState([]);
  const [disclosures, setDisclosures] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [banners, setBanners] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [schoolSettings, setSchoolSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [academicYears, setAcademicYears] = useState([
    "2025-26",
    "2024-25",
    "2023-24",
  ]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2025-26");
  const [achievementSubTab, setAchievementSubTab] = useState("board");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Modal Open/Close States
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAchieverModalOpen, setIsAchieverModalOpen] = useState(false);
  const [isOtherAchModalOpen, setIsOtherAchModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isTcModalOpen, setIsTcModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isViewRegModalOpen, setIsViewRegModalOpen] = useState(false);
  const [isManagePhotosModalOpen, setIsManagePhotosModalOpen] = useState(false);

  // Edit/View Item references
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingLeader, setEditingLeader] = useState(null);
  const [editingAchiever, setEditingAchiever] = useState(null);
  const [editingOtherAch, setEditingOtherAch] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editingTc, setEditingTc] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingReg, setEditingReg] = useState(null);
  const [viewingReg, setViewingReg] = useState(null);
  const [managingAlbum, setManagingAlbum] = useState(null);

  // Form States
  const [tcForm, setTcForm] = useState({
    admissionNumber: "",
    studentName: "",
    pdf: null,
    pdfUrl: "",
  });
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: null,
    imageUrl: "",
    active: true,
  });
  const [leaderForm, setLeaderForm] = useState({
    name: "",
    designation: "Manager & Founder",
    message: "",
    photo: null,
    photoUrl: "",
    order: "",
  });
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [achieverForm, setAchieverForm] = useState({
    studentName: "",
    className: "Class XII",
    percentage: "",
    year: "2025-26",
    rank: "1",
    stream: "",
    image: null,
    imageUrl: "",
  });
  const [otherAchForm, setOtherAchForm] = useState({
    title: "",
    description: "",
    category: "Other",
    date: "",
    image: null,
    imageUrl: "",
    showOnHomepage: true,
  });
  const [docForm, setDocForm] = useState({
    title: "",
    documentCode: "",
    category: "general_information",
    pdf: null,
    pdfUrl: "",
  });
  const [settingsForm, setSettingsForm] = useState({
    phone: "",
    email: "",
    instagramUrl: "",
    youtubeUrl: "",
    facebookUrl: "",
    showCtaBanner: true,
    logoUrl: "",
  });
  const [albumForm, setAlbumForm] = useState({
    title: "",
    description: "",
    coverImage: null,
    coverImageUrl: "",
    date: "",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "academic",
  });
  const [regForm, setRegForm] = useState({
    studentName: "",
    dob: "",
    gender: "Male",
    classApplied: "Class I",
    previousSchool: "",
    fatherName: "",
    motherName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    status: "pending",
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");

  // Notification Toast state
  const [notification, setNotification] = useState(null);

  // Search & Filter States
  const [albumSearch, setAlbumSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [eventCategoryFilter, setEventCategoryFilter] = useState("all");
  const [regSearch, setRegSearch] = useState("");
  const [regClassFilter, setRegClassFilter] = useState("all");
  const [regStatusFilter, setRegStatusFilter] = useState("all");
  const [tcSearch, setTcSearch] = useState("");

  // Custom notify function
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Check auth
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  // Guard against non-superadmin users accessing protected tabs
  useEffect(() => {
    if (
      role !== "super_admin" &&
      (activeTab === "disclosure" || activeTab === "users" || activeTab === "leadership")
    ) {
      setActiveTab("dashboard");
    }
  }, [role, activeTab]);

  // Load All Data
  const loadMasterData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [
        albumData,
        eventData,
        boardData,
        otherData,
        docData,
        regData,
        enqData,
        bannerData,
        leaderData,
        settingsData,
        userData,
        tcData,
      ] = await Promise.all([
        galleryService.getAlbums(),
        eventsService.getEvents(),
        achievementsService.getBoardAchievers(),
        achievementsService.getOtherAchievements(),
        mandatoryDisclosureService.getDocuments(),
        registrationService.getRegistrations(),
        enquiryService.getEnquiries(),
        bannerService.getBanners(),
        leadershipService.getLeaders(),
        settingsService.getSettings(),
        userService.getUsers(),
        transferCertificateService.getCertificates(),
      ]);

      setAlbums(albumData);
      setEvents(eventData);
      setBoardAchievers(boardData);
      setOtherAchievements(otherData);
      setDisclosures(docData);
      setCertificates(tcData || []);
      setRegistrations(regData);
      setEnquiries(enqData);
      setBanners(bannerData);
      setLeaders(leaderData);
      setSchoolSettings(settingsData);
      setUsers(userData);

      if (settingsData) {
        setSettingsForm({
          phone: settingsData.phone || "",
          email: settingsData.email || "",
          instagramUrl: settingsData.instagramUrl || "",
          youtubeUrl: settingsData.youtubeUrl || "",
          facebookUrl: settingsData.facebookUrl || "",
          showCtaBanner: settingsData.showCtaBanner !== false,
          logoUrl: settingsData.logoUrl || "",
        });
      }
    } catch (e) {
      console.error("Master dashboard load error:", e);
      setLoadError(e.message || "Failed to load master index indices from services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Derive Statistics
  const getStats = () => {
    const totalPhotos = albums.reduce(
      (count, album) => count + (album.images?.length || 0),
      0
    );

    const pendingRegistrationsCount = registrations.filter(
      (reg) => reg.status === "pending"
    ).length;

    return {
      albumsCount: albums.length,
      imagesCount: totalPhotos,
      eventsCount: events.length,
      achievementsCount:
        boardAchievers.length + otherAchievements.length,
      pendingRegistrationsCount,
    };
  };

  const stats = getStats();
  const pendingRegistrationsCount = stats.pendingRegistrationsCount;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === "pending").length;

  // Derived filtered state arrays
  const filteredAlbums = albums.filter((al) => {
    const search = albumSearch.toLowerCase();
    return (
      al.title.toLowerCase().includes(search) ||
      (al.description && al.description.toLowerCase().includes(search))
    );
  });

  const filteredCertificates = certificates?.filter((tc) => {
    const search = tcSearch.toLowerCase().trim();
    if (!search) return true;
    return (
      tc.studentName?.toLowerCase().includes(search) ||
      tc.admissionNumber?.toLowerCase().includes(search)
    );
  });

  const filteredEvents = events.filter((evt) => {
    const search = eventSearch.toLowerCase();
    const matchesSearch =
      evt.title.toLowerCase().includes(search) ||
      (evt.description && evt.description.toLowerCase().includes(search)) ||
      (evt.venue && evt.venue.toLowerCase().includes(search));

    const matchesCategory =
      eventCategoryFilter === "all" || evt.category === eventCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const filteredRegistrations = registrations.filter((reg) => {
    const search = regSearch.toLowerCase();
    const matchesSearch =
      reg.studentName.toLowerCase().includes(search) ||
      reg.fatherName.toLowerCase().includes(search) ||
      (reg.motherName && reg.motherName.toLowerCase().includes(search)) ||
      (reg.parentPhone && reg.parentPhone.includes(search));

    const matchesClass =
      regClassFilter === "all" || reg.classApplied === regClassFilter;

    const matchesStatus =
      regStatusFilter === "all" || reg.status === regStatusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // ================= ACTION HANDLERS =================

  // Approve/Reject Registration
  const handleUpdateRegStatus = async (id, status) => {
    const res = await registrationService.updateRegistrationStatus(id, status);
    if (res) {
      setRegistrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      showNotification(`Registration marked as ${status}`, "success");
    }
  };

  // Delete Registration
  const handleDeleteRegStatus = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this registration file permanently?",
    );
    if (!ok) return;
    const success = await registrationService.deleteRegistration(id);
    if (success) {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      showNotification("Registration record deleted", "success");
    }
  };

  // Resolve Enquiry Status
  const handleToggleEnquiry = async (id, currentStatus) => {
    const nextStatus = currentStatus === "pending" ? "resolved" : "pending";
    const res = await enquiryService.updateEnquiryStatus(id, nextStatus);
    if (res) {
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: nextStatus } : item,
        ),
      );
      showNotification(`Enquiry marked as ${nextStatus}`, "success");
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiryStatus = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this enquiry permanently?",
    );
    if (!ok) return;
    const success = await enquiryService.deleteEnquiry(id);
    if (success) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      showNotification("Enquiry record deleted", "success");
    }
  };

  // Delete Album
  const handleDeleteAlbum = async (albumId) => {
    const ok = window.confirm(
      "Are you sure you want to delete this album and all of its photos?",
    );
    if (!ok) return;
    const res = await galleryService.deleteAlbum(albumId);
    if (res) {
      setAlbums((prev) => prev.filter((al) => al.id !== albumId));
      showNotification("Album deleted successfully");
    }
  };

  // Delete Calendar Event
  const handleDeleteEvent = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this event?");
    if (!ok) return;
    const success = await eventsService.deleteEvent(id);
    if (success) {
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
      showNotification("Calendar event deleted");
    }
  };

  // Delete Regulatory Document
  const handleDeleteDisclosure = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this document disclosure?",
    );
    if (!ok) return;
    const success = await mandatoryDisclosureService.deleteDocument(id);
    if (success) {
      setDisclosures((prev) => prev.filter((doc) => doc.id !== id));
      showNotification("CBSE document disclosure deleted");
    }
  };

  // Delete Board Achiever
  const handleDeleteAchiever = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this topper card?",
    );
    if (!ok) return;
    const success = await achievementsService.deleteBoardAchiever(id);
    if (success) {
      setBoardAchievers((prev) => prev.filter((item) => item.id !== id));
      showNotification("Board topper deleted successfully");
    }
  };

  // 1. Banner Management Handlers
  const handleOpenBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        image: null,
        imageUrl: banner.imageUrl || "",
        active: banner.active,
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: "",
        subtitle: "",
        image: null,
        imageUrl: "",
        active: true,
      });
    }

    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", bannerForm.title);
    formData.append("subtitle", bannerForm.subtitle);
    formData.append("active", bannerForm.active);

    if (bannerForm.image) {
      formData.append("image", bannerForm.image);
    }

    let res;

    if (editingBanner) {
      res = await bannerService.updateBanner(editingBanner.id, formData);

      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === editingBanner.id ? res : banner
        )
      );

      showNotification("Banner updated successfully");
    } else {
      res = await bannerService.addBanner(formData);

      setBanners((prev) => [...prev, res]);

      showNotification("Banner added successfully");
    }

    setIsBannerModalOpen(false);
  };

  const handleToggleBannerActive = async (banner) => {
    const formData = new FormData();
    formData.append("active", !banner.active);
    const res = await bannerService.updateBanner(banner.id, formData);
    if (res) {
      setBanners((prev) => prev.map((item) => (item.id === banner.id ? res : item)));
      showNotification("Banner status updated");
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    const ok = await bannerService.deleteBanner(id);
    if (ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showNotification("Banner deleted successfully");
    }
  };

  const handleReorderBanner = async (id, direction) => {
    const list = await bannerService.reorderBanners(id, direction);
    setBanners(list);
    showNotification("Banner reordered");
  };

  // 2. Leadership Management Handlers
  const handleOpenLeaderModal = (leader = null) => {
    if (leader) {
      setEditingLeader(leader);

      setLeaderForm({
        name: leader.name,
        designation: leader.designation,
        message: leader.message,
        photo: null,
        photoUrl: leader.photoUrl || "",
      });
    } else {
      setEditingLeader(null);

      setLeaderForm({
        name: "",
        designation: "",
        message: "",
        photo: null,
        photoUrl: "",
      });
    }

    setIsLeaderModalOpen(true);
  };

  const handleSaveLeader = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", leaderForm.name);
    formData.append("designation", leaderForm.designation);
    formData.append("message", leaderForm.message);

    if (leaderForm.photo) {
      formData.append("photo", leaderForm.photo);
    }

    let res;

    if (editingLeader) {
      res = await leadershipService.updateLeader(
        editingLeader.id,
        formData
      );

      setLeaders((prev) =>
        prev.map((leader) =>
          leader.id === editingLeader.id ? res : leader
        )
      );

      showNotification("Leader updated successfully");
    } else {
      res = await leadershipService.addLeader(formData);

      setLeaders((prev) => [...prev, res]);

      showNotification("Leader added successfully");
    }

    setIsLeaderModalOpen(false);
  };

  const handleDeleteLeader = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leader?")) return;
    const ok = await leadershipService.deleteLeader(id);
    if (ok) {
      setLeaders((prev) => prev.filter((l) => l.id !== id));
      showNotification("Leadership member deleted successfully");
    }
  };

  const handleReorderLeader = async (id, direction) => {
    const list = await leadershipService.reorderLeader(id, direction);
    setLeaders(list);
    showNotification("Leadership order updated");
  };

  // 3. Achievements Sub-Tabs Handlers
  const handleAddAcademicYear = () => {
    const yearStr = window.prompt(
      "Enter new Academic Year block (e.g. 2026-27):",
    );
    if (!yearStr || !yearStr.trim()) return;
    const clean = yearStr.trim();
    if (academicYears.includes(clean)) {
      showNotification("Year block already exists", "info");
      return;
    }
    setAcademicYears((prev) => [clean, ...prev]);
    setSelectedAcademicYear(clean);
    showNotification(`Academic Year ${clean} added`);
  };

  // Toppers form handlers
  const handleOpenAchieverModal = (achiever = null) => {
    if (achiever) {
      setEditingAchiever(achiever);
      setAchieverForm({
        studentName: achiever.studentName,
        className: achiever.className,
        percentage: achiever.percentage,
        rank: achiever.rank,
        year: achiever.year,
        stream: achiever.stream || "",
        image: null,
        imageUrl: achiever.imageUrl || "",
      });
    } else {
      setEditingAchiever(null);
      setAchieverForm({
        studentName: "",
        className: "",
        percentage: "",
        rank: "",
        year: "",
        stream: "",
        image: null,
        imageUrl: "",
      });
    }

    setIsAchieverModalOpen(true);
  };

  const handleSaveAchiever = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("studentName", achieverForm.studentName);
    formData.append("className", achieverForm.className);
    formData.append("percentage", achieverForm.percentage);
    formData.append("rank", achieverForm.rank);
    formData.append("year", achieverForm.year);
    if (achieverForm.className === "Class XII" && achieverForm.stream) {
      formData.append("stream", achieverForm.stream);
    }
    if (achieverForm.image) {
      formData.append("image", achieverForm.image);
    }

    let res;

    if (editingAchiever) {
      res = await achievementsService.updateBoardAchiever(
        editingAchiever.id,
        formData
      );

      setBoardAchievers((prev) =>
        prev.map((item) =>
          item.id === editingAchiever.id ? res : item
        )
      );

      showNotification("Board topper updated successfully");
    } else {
      res = await achievementsService.addBoardAchiever(formData);

      setBoardAchievers((prev) => [...prev, res]);

      showNotification("Board topper added successfully");
    }

    setIsAchieverModalOpen(false);
  };

  // Other achievements handlers
  const handleOpenOtherAchModal = (achievement = null) => {
    if (achievement) {
      setEditingOtherAch(achievement);

      setOtherAchForm({
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        date: achievement.date,
        image: null,
        imageUrl: achievement.imageUrl || "",
        showOnHomepage: achievement.showOnHomepage,
      });
    } else {
      setEditingOtherAch(null);

      setOtherAchForm({
        title: "",
        description: "",
        category: "",
        date: "",
        image: null,
        imageUrl: "",
        showOnHomepage: true,
      });
    }

    setIsOtherAchModalOpen(true);
  };

  const handleSaveOtherAch = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", otherAchForm.title);
    formData.append("description", otherAchForm.description);
    formData.append("category", otherAchForm.category);
    formData.append("date", otherAchForm.date);
    formData.append("showOnHomepage", otherAchForm.showOnHomepage);

    if (otherAchForm.image) {
      formData.append("image", otherAchForm.image);
    }

    let res;

    if (editingOtherAch) {
      res = await achievementsService.updateOtherAchievement(
        editingOtherAch.id,
        formData
      );

      setOtherAchievements((prev) =>
        prev.map((item) =>
          item.id === editingOtherAch.id ? res : item
        )
      );

      showNotification("Achievement updated successfully");
    } else {
      res = await achievementsService.addOtherAchievement(formData);

      setOtherAchievements((prev) => [...prev, res]);

      showNotification("Achievement added successfully");
    }

    setIsOtherAchModalOpen(false);
  };

  const handleToggleOtherAchHomepage = async (id) => {
    const res =
      await achievementsService.toggleOtherAchievementHomepage(id);

    setOtherAchievements((prev) =>
      prev.map((item) =>
        item.id === id ? res : item
      )
    );

    showNotification("Homepage visibility updated");
  };

  const handleDeleteOtherAch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this achievement?"))
      return;
    const ok = await achievementsService.deleteOtherAchievement(id);
    if (ok) {
      setOtherAchievements((prev) => prev.filter((item) => item.id !== id));
      showNotification("Achievement deleted successfully");
    }
  };

  // 4. Mandatory Disclosure Handlers
  const handleOpenDocModal = (doc = null) => {
    if (doc) {
      setEditingDoc(doc);

      setDocForm({
        title: doc.title,
        documentCode: doc.documentCode || "",
        category: doc.category,
        pdf: null,
        pdfUrl: doc.pdfUrl,
      });
    } else {
      setEditingDoc(null);

      setDocForm({
        title: "",
        documentCode: "",
        category: "general_information",
        pdf: null,
        pdfUrl: "",
      });
    }

    setIsDocModalOpen(true);
  };

  const handleSaveDoc = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", docForm.title);
    formData.append("documentCode", docForm.documentCode);
    formData.append("category", docForm.category);

    if (docForm.pdf) {
      formData.append("pdf", docForm.pdf);
    }

    let res;

    if (editingDoc) {
      res = await mandatoryDisclosureService.updateDocument(
        editingDoc.id,
        formData
      );

      setDisclosures((prev) =>
        prev.map((item) =>
          item.id === editingDoc.id ? res : item
        )
      );

      showNotification("Document updated successfully");
    } else {
      res = await mandatoryDisclosureService.addDocument(formData);

      setDisclosures((prev) => [...prev, res]);

      showNotification("Document uploaded successfully");
    }

    setIsDocModalOpen(false);
  };

  // Transfer Certificate Handlers
  const handleOpenTcModal = (certificate = null) => {
    if (certificate) {
      setEditingTc(certificate);

      setTcForm({
        admissionNumber: certificate.admissionNumber,
        studentName: certificate.studentName,
        pdf: null,
        pdfUrl: certificate.pdfUrl,
      });
    } else {
      setEditingTc(null);

      setTcForm({
        admissionNumber: "",
        studentName: "",
        pdf: null,
        pdfUrl: "",
      });
    }

    setIsTcModalOpen(true);
  };

  const handleSaveTc = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "admissionNumber",
        tcForm.admissionNumber
      );

      formData.append(
        "studentName",
        tcForm.studentName
      );

      if (tcForm.pdf) {
        formData.append("pdf", tcForm.pdf);
      }

      let res;

      if (editingTc) {
        res =
          await transferCertificateService.updateCertificate(
            editingTc.id,
            formData
          );

        setCertificates((prev) =>
          prev.map((item) =>
            item.id === editingTc.id ? res : item
          )
        );

        showNotification(
          "Transfer Certificate updated successfully"
        );
      } else {
        res =
          await transferCertificateService.addCertificate(
            formData
          );

        setCertificates((prev) => [...prev, res]);

        showNotification(
          "Transfer Certificate uploaded successfully"
        );
      }

      setIsTcModalOpen(false);
    } catch (err) {
      console.error(err);

      showNotification(
        "Failed to save Transfer Certificate",
        "error"
      );
    }
  };

  const handleDeleteTc = async (id) => {
    if (window.confirm("Are you sure you want to delete this Transfer Certificate?")) {
      try {
        await transferCertificateService.deleteCertificate(id);
        setCertificates((prev) => prev.filter((t) => t.id !== id));
        showNotification("Transfer Certificate deleted successfully");
      } catch (e) {
        console.error(e);
        showNotification("Failed to delete Transfer Certificate", "error");
      }
    }
  };

  // 5. Settings Save handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!settingsForm.phone.trim() || !settingsForm.email.trim()) {
      showNotification("Phone and Email are required", "error");
      return;
    }
    const res = await settingsService.updateSettings(settingsForm);
    if (res) {
      setSchoolSettings(res);
      await updateSettings(settingsForm);
      showNotification("CMS settings saved successfully", "success");
    }
  };

  // 6. User Management Handlers (Super Admin)
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (
      !userForm.name.trim() ||
      !userForm.email.trim() ||
      !userForm.password.trim()
    ) {
      showNotification("All fields are required", "error");
      return;
    }

    const res = await userService.createUser({
      name: userForm.name.trim(),
      email: userForm.email.trim(),
      password: userForm.password,
    });

    if (res) {
      setUsers((prev) => [...prev, res]);

      setUserForm({
        name: "",
        email: "",
        password: "",
        role: "principal",
      });

      setIsUserModalOpen(false);

      showNotification("Administrator created successfully");
    }
  };

  const handleToggleUserStatus = async (user) => {
    const res = await userService.toggleUserStatus(user.id);

    if (res) {
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? res : item
        )
      );

      showNotification("User status updated");
    }
  };

  const handleResetUserPassword = async (user) => {
    const newPassword = window.prompt(
      `Enter a new password for "${user.name}":`
    );

    if (newPassword === null) return; // User clicked Cancel

    if (!newPassword.trim()) {
      showNotification("Password cannot be empty.", "error");
      return;
    }

    if (newPassword.trim().length < 8) {
      showNotification(
        "Password must be at least 8 characters.",
        "error"
      );
      return;
    }

    const res = await userService.resetPassword(
      user.id,
      newPassword.trim()
    );

    if (res) {
      showNotification("Password reset successfully.", "success");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Administrator?"))
      return;
    const ok = await userService.deleteUser(id);
    if (ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showNotification("Administrator deleted successfully");
    }
  };

  // Album Create/Edit handler
  const handleOpenAlbumModal = (album = null) => {
    if (album) {
      setEditingAlbum(album);

      setAlbumForm({
        title: album.title,
        description: album.description,
        coverImage: null,
        coverImageUrl: album.coverImageUrl || "",
        date: album.date,
      });
    } else {
      setEditingAlbum(null);

      setAlbumForm({
        title: "",
        description: "",
        coverImage: null,
        coverImageUrl: "",
        date: "",
      });
    }

    setIsAlbumModalOpen(true);
  };

  const handleSaveAlbum = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", albumForm.title);
    formData.append("description", albumForm.description);
    formData.append("date", albumForm.date);

    if (albumForm.coverImage) {
      formData.append("coverImage", albumForm.coverImage);
    }

    let res;

    if (editingAlbum) {
      res = await galleryService.updateAlbum(
        editingAlbum.id,
        formData
      );

      setAlbums((prev) =>
        prev.map((item) =>
          item.id === editingAlbum.id ? res : item
        )
      );

      showNotification("Album updated successfully");
    } else {
      res = await galleryService.addAlbum(formData);

      setAlbums((prev) => [...prev, res]);

      showNotification("Album created successfully");
    }

    setEditingAlbum(null);
    setIsAlbumModalOpen(false);
  };

  // Event Create/Edit handler
  const handleOpenEventModal = (event) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        description: event.description || "",
        date: event.date,
        time: event.time || "",
        venue: event.venue || "",
        category: event.category,
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "",
        venue: "",
        category: "academic",
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date) {
      showNotification("Title and Date are required", "error");
      return;
    }

    try {
      if (editingEvent) {
        const res = await eventsService.updateEvent(editingEvent.id, {
          title: eventForm.title.trim(),
          description: eventForm.description.trim(),
          date: eventForm.date,
          time: eventForm.time.trim() || undefined,
          venue: eventForm.venue.trim() || undefined,
          category: eventForm.category,
        });
        if (res) {
          setEvents((prev) =>
            prev.map((evt) =>
              evt.id === editingEvent.id ? { ...evt, ...res } : evt,
            ),
          );
          showNotification("Calendar event updated successfully", "success");
        } else {
          showNotification("Failed to update calendar event", "error");
        }
      } else {
        const res = await eventsService.addEvent({
          title: eventForm.title.trim(),
          description: eventForm.description.trim(),
          date: eventForm.date,
          time: eventForm.time.trim() || undefined,
          venue: eventForm.venue.trim() || undefined,
          category: eventForm.category,
        });
        setEvents((prev) => [res, ...prev]);
        showNotification("New calendar event posted successfully", "success");
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      showNotification("An error occurred while saving the event", "error");
    }
  };

  // Registration Create/Edit handler
  const handleOpenRegModal = (reg = null) => {
    if (reg) {
      setEditingReg(reg);
      setRegForm({
        studentName: reg.studentName,
        dob: reg.dob,
        gender: reg.gender,
        classApplied: reg.classApplied,
        previousSchool: reg.previousSchool || "",
        fatherName: reg.fatherName,
        motherName: reg.motherName,
        parentPhone: reg.parentPhone,
        email: reg.email || "",
        address: reg.address,
        status: reg.status,
      });
    } else {
      setEditingReg(null);
      setRegForm({
        studentName: "", dob: "", gender: "Male", classApplied: "Class I",
        previousSchool: "", fatherName: "", motherName: "", parentPhone: "",
        email: "", address: "", status: "pending",
      });
    }
    setIsRegModalOpen(true);
  };

  const handleSaveReg = async (e) => {
    e.preventDefault();
    if (!regForm.studentName.trim() || !regForm.dob || !regForm.fatherName.trim() || !regForm.parentPhone.trim()) {
      showNotification("Student Name, DOB, Father's Name, and Phone are required", "error");
      return;
    }

    const data = {
      studentName: regForm.studentName.trim(),
      dob: regForm.dob,
      gender: regForm.gender,
      classApplied: regForm.classApplied,
      previousSchool: regForm.previousSchool.trim() || undefined,
      fatherName: regForm.fatherName.trim(),
      motherName: regForm.motherName.trim(),
      parentPhone: regForm.parentPhone.trim(),
      email: regForm.email.trim(),
      address: regForm.address.trim(),
    };

    if (editingReg) {
      const res = await registrationService.updateRegistration(editingReg.id, { ...data, status: regForm.status });
      if (res) {
        setRegistrations((prev) => prev.map((r) => (r.id === editingReg.id ? res : r)));
        showNotification("Registration updated successfully");
      }
    } else {
      const res = await registrationService.submitRegistration(data);
      setRegistrations((prev) => [res, ...prev]);
      showNotification("New registration created manually");
    }
    setIsRegModalOpen(false);
    setEditingReg(null);
  };
  // Photo management modal triggers
  const handleOpenPhotosModal = (album) => {
    setManagingAlbum(album);
    setNewPhotoUrl(null);
    setNewPhotoCaption("");
    setIsManagePhotosModalOpen(true);
  };

  const handleModalAddPhoto = async (e) => {
    e.preventDefault();

    if (!managingAlbum || !newPhotoUrl) {
      showNotification("Please choose an image", "error");
      return;
    }

    const formData = new FormData();

    formData.append("image", newPhotoUrl);
    formData.append("caption", newPhotoCaption);

    const res = await galleryService.addImageToAlbum(
      managingAlbum.id,
      formData
    );

    if (res) {
      setAlbums((prev) =>
        prev.map((item) =>
          item.id === managingAlbum.id ? res : item
        )
      );

      setManagingAlbum(res);

      setNewPhotoUrl(null);
      setNewPhotoCaption("");

      showNotification("Photo added successfully");
    }
  };

  const handleModalDeletePhoto = async (imageId) => {
    if (!managingAlbum) return;
    const res = await galleryService.deleteImageFromAlbum(
      managingAlbum.id,
      imageId
    );
    if (res) {
      setAlbums((prev) =>
        prev.map((al) => (al.id === managingAlbum.id ? res : al)),
      );
      setManagingAlbum(res); // Update active managing album ref
      showNotification("Photo deleted from album", "success");
    } else {
      showNotification("Failed to delete photo", "error");
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden relative">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        currentUser={currentUser}
        role={role}
        pendingRegistrationsCount={pendingRegistrationsCount}
        pendingEnquiriesCount={pendingEnquiriesCount}
        handleLogout={handleLogout}
      />

      {/* Main Working Stage */}
      <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader
          activeTab={activeTab}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          role={role}
        />

        {/* Dynamic scrollable panel content */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8 text-left">
          {loading ? (
            <Loading
              size="xl"
              height="h-96"
              text="Loading master indices..."
              containerClassName="space-y-4"
            />
          ) : loadError ? (
            <div className="flex justify-center items-center h-96">
              <ErrorState
                title="Unable to load Dashboard Data"
                message={loadError}
                onRetry={loadMasterData}
              />
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardTab
                  stats={stats}
                  enquiries={enquiries}
                  registrations={registrations}
                  handleToggleEnquiry={handleToggleEnquiry}
                  handleDeleteEnquiryStatus={handleDeleteEnquiryStatus}
                  handleOpenRegModal={handleOpenRegModal}
                  handleUpdateRegStatus={handleUpdateRegStatus}
                  handleDeleteRegStatus={handleDeleteRegStatus}
                  setActiveTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === "banners" && (
                <BannersTab
                  banners={banners}
                  handleOpenBannerModal={handleOpenBannerModal}
                  handleToggleBannerActive={handleToggleBannerActive}
                  handleDeleteBanner={handleDeleteBanner}
                  handleReorderBanner={handleReorderBanner}
                />
              )}

              {activeTab === "leadership" && (
                <LeadershipTab
                  leaders={leaders}
                  handleOpenLeaderModal={handleOpenLeaderModal}
                  handleDeleteLeader={handleDeleteLeader}
                  handleReorderLeader={handleReorderLeader}
                />
              )}

              {activeTab === "gallery" && (
                <GalleryTab
                  albums={albums}
                  albumSearch={albumSearch}
                  setAlbumSearch={setAlbumSearch}
                  filteredAlbums={filteredAlbums}
                  handleOpenAlbumModal={handleOpenAlbumModal}
                  handleDeleteAlbum={handleDeleteAlbum}
                  handleOpenPhotosModal={handleOpenPhotosModal}
                />
              )}

              {activeTab === "events" && (
                <EventsTab
                  events={events}
                  eventSearch={eventSearch}
                  setEventSearch={setEventSearch}
                  eventCategoryFilter={eventCategoryFilter}
                  setEventCategoryFilter={setEventCategoryFilter}
                  filteredEvents={filteredEvents}
                  handleOpenEventModal={handleOpenEventModal}
                  handleDeleteEvent={handleDeleteEvent}
                />
              )}

              {activeTab === "achievements" && (
                <AchievementsTab
                  boardAchievers={boardAchievers}
                  otherAchievements={otherAchievements}
                  achievementSubTab={achievementSubTab}
                  setAchievementSubTab={setAchievementSubTab}
                  academicYears={academicYears}
                  selectedAcademicYear={selectedAcademicYear}
                  setSelectedAcademicYear={setSelectedAcademicYear}
                  handleAddAcademicYear={handleAddAcademicYear}
                  handleOpenAchieverModal={handleOpenAchieverModal}
                  handleDeleteAchiever={handleDeleteAchiever}
                  handleOpenOtherAchModal={handleOpenOtherAchModal}
                  handleToggleOtherAchHomepage={handleToggleOtherAchHomepage}
                  handleDeleteOtherAch={handleDeleteOtherAch}
                />
              )}

              {activeTab === "disclosure" && (
                <DisclosureTab
                  disclosures={disclosures}
                  handleOpenDocModal={handleOpenDocModal}
                  handleDeleteDisclosure={handleDeleteDisclosure}
                />
              )}

              {activeTab === "transfer-certificates" && (
                <TransferCertificatesTab
                  certificates={certificates}
                  tcSearch={tcSearch}
                  setTcSearch={setTcSearch}
                  filteredCertificates={filteredCertificates}
                  handleOpenTcModal={handleOpenTcModal}
                  handleDeleteTc={handleDeleteTc}
                />
              )}

              {activeTab === "registrations" && (
                <RegistrationsTab
                  registrations={registrations}
                  regSearch={regSearch}
                  setRegSearch={setRegSearch}
                  regClassFilter={regClassFilter}
                  setRegClassFilter={setRegClassFilter}
                  regStatusFilter={regStatusFilter}
                  setRegStatusFilter={setRegStatusFilter}
                  filteredRegistrations={filteredRegistrations}
                  handleOpenRegModal={handleOpenRegModal}
                  handleUpdateRegStatus={handleUpdateRegStatus}
                  handleDeleteRegStatus={handleDeleteRegStatus}
                  setViewingReg={setViewingReg}
                  setIsViewRegModalOpen={setIsViewRegModalOpen}
                />
              )}

              {activeTab === "enquiries" && (
                <EnquiriesTab
                  enquiries={enquiries}
                  handleToggleEnquiry={handleToggleEnquiry}
                  handleDeleteEnquiryStatus={handleDeleteEnquiryStatus}
                />
              )}

              {activeTab === "settings" && (
                <SettingsTab
                  settingsForm={settingsForm}
                  setSettingsForm={setSettingsForm}
                  handleSaveSettings={handleSaveSettings}
                  schoolSettings={schoolSettings}
                />
              )}

              {activeTab === "users" && (
                <UsersTab
                  role={role}
                  users={users}
                  setIsUserModalOpen={setIsUserModalOpen}
                  handleToggleUserStatus={handleToggleUserStatus}
                  handleResetUserPassword={handleResetUserPassword}
                  handleDeleteUser={handleDeleteUser}
                />
              )}

              {activeTab === "profile" && (
                <ProfileTab
                  currentUser={currentUser}
                  role={role}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Slide-over Modals */}
      {isBannerModalOpen && (
        <BannerModal
          editingBanner={editingBanner}
          bannerForm={bannerForm}
          setBannerForm={setBannerForm}
          handleSaveBanner={handleSaveBanner}
          setIsBannerModalOpen={setIsBannerModalOpen}
        />
      )}

      {isLeaderModalOpen && (
        <LeaderModal
          editingLeader={editingLeader}
          leaderForm={leaderForm}
          setLeaderForm={setLeaderForm}
          handleSaveLeader={handleSaveLeader}
          setIsLeaderModalOpen={setIsLeaderModalOpen}
        />
      )}

      {isAlbumModalOpen && (
        <AlbumModal
          editingAlbum={editingAlbum}
          albumForm={albumForm}
          setAlbumForm={setAlbumForm}
          handleSaveAlbum={handleSaveAlbum}
          setIsAlbumModalOpen={setIsAlbumModalOpen}
        />
      )}

      {isManagePhotosModalOpen && (
        <PhotosModal
          managingAlbum={managingAlbum}
          setIsManagePhotosModalOpen={setIsManagePhotosModalOpen}
          newPhotoUrl={newPhotoUrl}
          setNewPhotoUrl={setNewPhotoUrl}
          newPhotoCaption={newPhotoCaption}
          setNewPhotoCaption={setNewPhotoCaption}
          handleModalAddPhoto={handleModalAddPhoto}
          handleModalDeletePhoto={handleModalDeletePhoto}
        />
      )}

      {isEventModalOpen && (
        <EventModal
          editingEvent={editingEvent}
          eventForm={eventForm}
          setEventForm={setEventForm}
          handleSaveEvent={handleSaveEvent}
          setIsEventModalOpen={setIsEventModalOpen}
        />
      )}

      {isAchieverModalOpen && (
        <AchieverModal
          editingAchiever={editingAchiever}
          achieverForm={achieverForm}
          setAchieverForm={setAchieverForm}
          handleSaveAchiever={handleSaveAchiever}
          setIsAchieverModalOpen={setIsAchieverModalOpen}
          academicYears={academicYears}
        />
      )}

      {isOtherAchModalOpen && (
        <OtherAchModal
          editingOtherAch={editingOtherAch}
          otherAchForm={otherAchForm}
          setOtherAchForm={setOtherAchForm}
          handleSaveOtherAch={handleSaveOtherAch}
          setIsOtherAchModalOpen={setIsOtherAchModalOpen}
        />
      )}

      {isDocModalOpen && (
        <DocModal
          editingDoc={editingDoc}
          docForm={docForm}
          setDocForm={setDocForm}
          handleSaveDoc={handleSaveDoc}
          setIsDocModalOpen={setIsDocModalOpen}
        />
      )}

      {isTcModalOpen && (
        <TransferCertificateModal
          editingTc={editingTc}
          tcForm={tcForm}
          setTcForm={setTcForm}
          handleSaveTc={handleSaveTc}
          setIsTcModalOpen={setIsTcModalOpen}
        />
      )}

      {isRegModalOpen && (
        <RegModal
          editingReg={editingReg}
          regForm={regForm}
          setRegForm={setRegForm}
          handleSaveReg={handleSaveReg}
          setIsRegModalOpen={setIsRegModalOpen}
        />
      )}

      {isViewRegModalOpen && viewingReg && (
        <ViewRegModal
          viewingReg={viewingReg}
          setIsViewRegModalOpen={setIsViewRegModalOpen}
          showNotification={showNotification}
        />
      )}

      {isUserModalOpen && (
        <UserModal
          userForm={userForm}
          setUserForm={setUserForm}
          handleCreateUser={handleCreateUser}
          setIsUserModalOpen={setIsUserModalOpen}
        />
      )}

      {/* Global Bottom-Right Notification Toaster */}
      <Toast notification={notification} />
    </div>
  );
}
