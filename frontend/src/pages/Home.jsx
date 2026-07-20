import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  ShieldCheck,
  Image,
  GraduationCap,
  ArrowLeft,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import { useSchoolData } from "../context/SchoolDataContext";
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import usePageTitle from "../hooks/usePageTitle";

export default function Home() {
  usePageTitle("Home");
  const [activeSlide, setActiveSlide] = useState(0);
  const { boardAchievers, banners, leaders, isLoading, error, refreshData } = useSchoolData();
  const activeBanners = banners.filter((banner) => banner.active);
  const defaultSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80",
      title: "Nurturing Minds, Building Future Leaders",
      subtitle:
        "Affiliated to CBSE, New Delhi. Imparting premium education with a blend of academic rigor, sports, and value systems.",
      cta: "Explore Admissions",
      link: "/register",
    },
    {
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80",
      title: "State-of-the-Art Science & Computer Labs",
      subtitle:
        "Fostering empirical enquiry, rational thinking, and practical mastery with fully equipped modern testing suites.",
      cta: "See Facilities",
      link: "/about",
    },
    {
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&auto=format&fit=crop&q=80",
      title: "Nurturing Athletic & Cultural Potentials",
      subtitle:
        "Comprehensive indoor sports court, vast football and cricket grounds, and professional music & classical dance academies.",
      cta: "View Gallery",
      link: "/gallery",
    },
  ];

  const heroSlides =
    activeBanners.length > 0
      ? activeBanners.map((b) => ({
        image: b.imageUrl,
        title: b.title || "",
        subtitle: b.subtitle || "",
        cta: b.ctaText || null,
        link: b.ctaLink || "/",
      }))
      : defaultSlides;

  // Auto slide effect
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const quickAccess = [
    {
      title: "About Mission Academy",
      desc: "Learn about our rich legacy, vision, mission, and the core values that guide our educators.",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-school-primary",
      link: "/about",
    },
    {
      title: "Event Calendar",
      desc: "Stay updated with important exam schedules, holidays, and co-curricular sports events.",
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
      link: "/events",
    },
    {
      title: "Interactive Gallery",
      desc: "Browse our comprehensive photography vault capturing school events and science exhibitions.",
      icon: Image,
      color: "bg-amber-50 text-amber-600",
      link: "/gallery",
    },
    {
      title: "Mandatory Disclosures",
      desc: "Review official safety certificates, fee structures, and regulatory CBSE declarations.",
      icon: GraduationCap,
      color: "bg-purple-50 text-purple-600",
      link: "/mandatory-disclosure",
    },
    {
      title: "Transfer Certificate",
      desc: "Download your transfer certificate using your admission number.",
      icon: FileText,
      color: "bg-rose-50 text-rose-600",
      link: "/mandatory-disclosure?tab=tc",
    },
  ];

  const leadershipToUse = leaders.length > 0 ? leaders : [];

  const groupedToppers = boardAchievers.reduce((acc, topper) => {
    const cls = topper.className;

    if (!acc[cls]) {
      acc[cls] = [];
    }

    acc[cls].push(topper);
    return acc;
  }, {});

  const displayOrder = ["Class X", "Class XII"];

  return (
    <div className="fade-in">
      {error && (
        <ErrorState
          compact
          title="Notice"
          message={`Error loading live school data (${error}). Showing offline cached placeholders.`}
          onRetry={refreshData}
          className="rounded-none border-t-0 border-x-0 border-b border-red-200"
        />
      )}
      {/* 1. Hero Slideshow Section */}
      <div className="relative h-[65vh] sm:h-[75vh] md:h-[80vh] w-full bg-gray-900 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === activeSlide
              ? "opacity-100 z-10 visible pointer-events-auto"
              : "opacity-0 z-0 invisible pointer-events-none"
              }`}
          >
            <div className="absolute inset-0 bg-black/55 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-102 transform transition-transform duration-[5000ms]"
            />

            {/* Slide Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
                <div className="max-w-3xl space-y-4 sm:space-y-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-school-primary text-white uppercase tracking-wider">
                    Affiliated to CBSE, New Delhi
                  </span>
                  {slide.title && (
                    <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-light">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 pt-2">
                    {slide.cta && (
                      <Link
                        to={slide.link}
                        className="bg-school-primary hover:bg-school-primary/95 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-school-primary/20 transition-all hover:-translate-y-0.5"
                      >
                        {slide.cta}
                      </Link>
                    )}
                    <Link to="/contact" className="border border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all">
                      Contact Office
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Arrow Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/10 transition-colors hidden sm:block"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/10 transition-colors hidden sm:block"
          aria-label="Next slide"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === activeSlide
                ? "w-8 bg-school-primary"
                : "w-2 bg-white/50"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. School Welcoming Block */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-school-primary block">
                Welcome to Mission Academy
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Empowering the Next Generation of Intellectual Scholars in
                Baheri
              </h2>
              <div className="h-1 w-20 bg-school-primary rounded" />
              <p className="text-gray-600 leading-relaxed text-[15px] sm:text-base">
                Established with a vision to deliver world-class infrastructure
                and rigorous educational models to Baheri,{" "}
                <strong>Mission Academy </strong> stands as a temple of
                character and learning. Our curriculum is tailored according to
                modern scientific methods while reinforcing deep ethical
                frameworks.
              </p>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                From advanced computer coding suites and modern physical science
                testing arenas to extensive grass playing turfs and national
                athletic levels, we ensure every child receives personal
                attention to foster analytical skill, self-discipline, and
                confident speech.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-school-bg text-school-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-base">
                      Expert Faculty
                    </h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Highly certified mentors and CBSE examiners
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-school-bg text-school-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-base">
                      Rich Facilities
                    </h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Advanced libraries, science lab & play fields
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* School Campus Photo Container */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-4/3 sm:aspect-video lg:aspect-square overflow-hidden rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80"
                  alt="School Campus Building"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-lg border border-gray-50 flex items-center space-x-4 max-w-[240px] hidden sm:flex">
                <div className="p-3 bg-school-primary/10 text-school-primary rounded-xl">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900">100%</h4>
                  <p className="text-gray-500 text-xs leading-none mt-1">
                    CBSE Board Exam Pass Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Access Cards Block */}
      <section className="py-16 bg-school-bg/45 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Explore Our Institution
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Quick access links to regulatory CBSE notifications, visual media,
              and our academic planner resources.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {quickAccess.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.link}
                  id={`home-quick-${idx}`}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-school-accent/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div
                      className={`p-3 rounded-xl w-fit ${item.color} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-[17px] sm:text-lg leading-tight group-hover:text-school-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-school-primary font-bold text-xs pt-4 tracking-wider uppercase">
                    <span>Learn More</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Top 5 Board Achievers SPOTLIGHT Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-4 md:space-y-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-school-primary block mb-1">
                Academic Hall of Fame
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Top Board Achievers
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-1">
                Celebrating outstanding scholars who set milestones in CBSE
                Class X & XII Board Examinations.
              </p>
            </div>
            <Link
              id="home-all-achievements"
              to="/achievements"
              className="inline-flex items-center space-x-2 text-school-primary font-bold text-sm hover:text-school-primary/80 group"
            >
              <span>View All Toppers</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <Loading size="md" height="h-48" />
          ) : (
            <div className="space-y-12">
              {displayOrder.map((cls) => {
                const toppers = groupedToppers[cls];

                if (!toppers || toppers.length === 0) return null;

                return (
                  <div key={cls}>
                    <div className="flex items-center mb-6">
                      <div className="h-8 w-1 bg-school-primary rounded-full mr-3"></div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {cls} Board Toppers
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                      {toppers.slice(0, 5).map((topper) => (
                        <div
                          key={topper.id}
                          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-center"
                        >
                          <div className="aspect-[3/4] relative bg-gray-50 overflow-hidden">
                            <img
                              src={topper.imageUrl}
                              alt={topper.studentName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            <div className="absolute top-2.5 right-2.5 bg-yellow-400 text-gray-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-sm">
                              Rank {topper.rank}
                            </div>
                          </div>

                          <div className="p-3.5 sm:p-4 space-y-1 flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-school-primary transition-colors">
                                {topper.studentName}
                              </h4>

                              <p className="text-gray-500 text-xs font-semibold mt-0.5">
                                {topper.stream}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-gray-100 mt-2 flex flex-col items-center">
                              <span className="text-school-primary font-extrabold text-base sm:text-lg">
                                {topper.percentage}%
                              </span>

                              <span className="text-[10px] text-gray-400 font-medium">
                                Batch {topper.year}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. Leadership Message Section */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-school-primary block">
              Our Guiding Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Words from School Leadership
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Meet the distinguished administrative and instructional team
              steering Mission Academy's excellence journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipToUse.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Quotation Icon and Mark */}
                <div className="text-school-primary/20 text-5xl font-serif leading-none select-none h-4">
                  “
                </div>
                <div className="flex-grow pt-2 flex flex-col">
                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed italic min-h-[9rem]">
                    {leader.bio}
                  </p>

                  <Link
                    to={`/about`}
                    className="mt-4 inline-flex items-center text-school-primary text-sm font-semibold hover:underline"
                  >
                    Read Message →
                  </Link>
                </div>
                <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-gray-50">
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-school-primary/10 shadow-sm"
                  />

                  <div>
                    <h4 className="text-gray-900 font-bold text-sm sm:text-base">
                      {leader.name}
                    </h4>
                    <p className="text-school-primary text-xs font-semibold">
                      {leader.designation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quick Stats Section Banner */}
      <section className="relative py-12 sm:py-16 bg-school-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center">
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight">
                30+
              </span>
              <span className="text-school-bg/85 text-xs sm:text-sm font-medium">
                Years of Legacy
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight">
                100+
              </span>
              <span className="text-school-bg/85 text-xs sm:text-sm font-medium">
                Expert Faculty
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight">
                2000+
              </span>
              <span className="text-school-bg/85 text-xs sm:text-sm font-medium">
                Enrolled Scholars
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight">
                100%
              </span>
              <span className="text-school-bg/85 text-xs sm:text-sm font-medium">
                Labs Ready
              </span>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight">
                2
              </span>
              <span className="text-school-bg/85 text-xs sm:text-sm font-medium">
                Branches
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
