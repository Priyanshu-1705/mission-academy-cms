import React from "react";
import { Compass, Target, CalendarDays, Award, BookOpen, Handshake, Users } from 'lucide-react';
import { useSchoolData } from "../context/SchoolDataContext";

export default function About() {
  const { leaders } = useSchoolData();

  const values = [
    {
      title: "Academic Focus",
      desc: "Our teaching model is highly analytical, designed to build logical and empirical skills rather than rote learning.",
      icon: BookOpen,
      color: "bg-emerald-50 text-school-primary",
    },
    {
      title: "Value-Driven Culture",
      desc: "Imparting strong moral characters, mutual respect, self-discipline, and deep respect for cultural values.",
      icon: Handshake,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Holistic Development",
      desc: "Equal emphasis on visual arts, competitive swimming, cricket training, robotics, and oratorical debate formats.",
      icon: Award,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="fade-in">
      {/* Page Title Header banner */}
      <section
        className="text-white py-16 sm:py-24 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/85 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-school-bg/90">
            About Our Institution
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Our Legacy, Vision & Values
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Founded with the ambition of bringing pristine academic instruction
            and CBSE global opportunities directly to the heart of Baheri.
          </p>
        </div>
      </section>

      {/* Legacy and History Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* School History Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-school-primary bg-school-bg px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
                <CalendarDays className="h-4 w-4" />
                <span>Our History & Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                An Educational Journey Marked by Excellence
              </h2>
              <div className="h-1 w-16 bg-school-primary rounded" />
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Mission Academy Baheri was established in the year 2014 by{" "}
                <strong>Shri R.K. Gangwar</strong> under the aegis of the
                educational trust dedicated to rural skill upliftment. Seeing
                local students traverse long distances to Bareilly city for
                quality CBSE curriculum, the foundation stone was laid for a
                state-of-the-art co-educational english medium academy in
                Baheri.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Starting with just 150 students and a primary block, the
                institution grew exponentially through sheer commitment to rigor
                and personal discipline. Today, the academy is proudly
                affiliated with the Central Board of Secondary Education (CBSE),
                New Delhi up to Senior Secondary level, housing over 1200
                scholars from different pockets of the region.
              </p>
            </div>

            {/* School History Image Grid */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-4/3 sm:aspect-video lg:aspect-square overflow-hidden rounded-3xl shadow-lg border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80"
                  alt="School historic assembly"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section (Bento Grid Style) */}
      <section className="py-16 sm:py-20 bg-school-bg/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-50 text-school-primary w-fit rounded-2xl">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="font-sans font-bold text-2xl text-gray-900 tracking-tight">
                Our Institutional Vision
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                To be recognized as a premier educational sanctuary of learning
                and character development in northern Uttar Pradesh, where
                academic excellence meets traditional values, producing
                confident, compassionate global citizens capable of creative
                leadership.
              </p>
              <p className="text-gray-500 text-xs">
                We envision a future where geographical location never limits a
                child's capacity to innovate, lead, and conquer national level
                competitions.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-2xl">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-sans font-bold text-2xl text-gray-900 tracking-tight">
                Our Core Mission
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                To cultivate an environment of empirical discovery, analytical
                training, and creative thought by providing state-of-the-art
                facilities, highly qualified mentors, and extensive
                co-curricular exposure. We aim to support balanced development
                across academic, athletic, and ethical fields.
              </p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-school-primary" />
                  <span>Ensuring individualized scholarly attention</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-school-primary" />
                  <span>Equipping students with modern scientific tools</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Our Educational Philosophies
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              At Mission Academy, our daily lessons and administrative policies
              align with three core pillars.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm text-center space-y-4"
                >
                  <div className={`p-3 rounded-xl mx-auto w-fit ${val.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg">
                    {val.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Preview Section */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center space-x-2 text-school-primary bg-school-primary/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Users className="h-4 w-4" />
              <span>Administrative Directors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Our Leadership Board
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Meet the founders, administrative directors, and experienced academic advisors steering the school's growth path.
            </p>
          </div>

          <div className="space-y-12">
            {leaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                <div className="w-40 sm:w-48 lg:w-56 aspect-square overflow-hidden rounded-2xl shrink-0 bg-gray-100 border border-gray-100 shadow-sm">
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 flex-grow">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{leader.name}</h3>
                    <p className="text-school-primary text-sm font-semibold">{leader.designation}</p>
                  </div>
                  <div className="h-0.5 bg-gray-100" />
                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed italic">
                    "{leader.message}"
                  </p>
                  {leader.bio && (
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{leader.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
