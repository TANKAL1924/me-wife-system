import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/ui/AppShell";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import SummaryCard from "./components/SummaryCard";
import Button from "../../components/ui/Button";
import UpcomingEvents from "./components/UpcomingEvents";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { useAuthStore } from "../../store/authStore";
import { fetchEvents } from "../calendar/service/calendarService";
import { supabase, getGalleryPhotoUrl } from "../../utils/supabase";

const mockUser = {
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1644a99bc-1772213833652.png",
  avatarAlt: "Woman with curly brown hair smiling warmly in a casual outdoor setting",
  partnerAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1bfa721d1-1772395466231.png",
  partnerAvatarAlt: "Man with short dark hair wearing casual blue shirt in outdoor setting",
  anniversaryDate: "June 16, 2022",
  yearsTogther: 3
};


const Dashboard = () => {
  const { user, username } = useAuthStore();
  const navigate = useNavigate();
  const displayName = username ?? user?.email ?? 'Welcome';
  const [greeting] = useState(() => {
    const hour = new Date()?.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  });
  const [cardsLoading, setCardsLoading] = useState(false);
  const [thisMonthCount, setThisMonthCount] = useState<number | null>(null);
  const [galleryMonthCount, setGalleryMonthCount] = useState<number | null>(null);
  const [favPhotos, setFavPhotos] = useState<{ id: number; photo_name: string; title: string }[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then(({ data }) => {
      const now = new Date();
      const count = data.filter((e) => {
        const d = new Date(e.startDate);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }).length;
      setThisMonthCount(count);
    });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    supabase
      .from('gallery')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', monthStart)
      .lte('created_at', monthEnd)
      .then(({ count }) => setGalleryMonthCount(count ?? 0));

    supabase
      .from('gallery')
      .select('id, photo_name, title')
      .eq('fav', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setFavPhotos(data ?? []);
        setFavLoading(false);
      });
  }, []);

  // Anniversary countdown — always accurate
  const today = new Date();
  const nextAnniversary = new Date(today.getFullYear(), 5, 16); // June 16
  if (nextAnniversary <= today) nextAnniversary.setFullYear(today.getFullYear() + 1);
  const daysUntil = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const lastAnniversary = new Date(nextAnniversary.getFullYear() - 1, 5, 16);
  const totalDays = Math.ceil((nextAnniversary.getTime() - lastAnniversary.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((today.getTime() - lastAnniversary.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercent = Math.min(100, Math.round((daysPassed / totalDays) * 100));

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });
  const { ref: favRef, isVisible: favVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });

  const handleRefreshCards = useCallback(() => {
    setCardsLoading(true);
    setTimeout(() => setCardsLoading(false), 1500);
  }, []);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

          {/* Hero Welcome Banner */}
          <div
            ref={heroRef}
            className={`card mb-6 md:mb-8 overflow-hidden relative scroll-hidden ${heroVisible ? 'scroll-visible' : ''}`}
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, #8B4513 100%)",
              padding: "28px 32px",
              border: "none"
            }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white">
                    <Image src={mockUser?.avatar} alt={mockUser?.avatarAlt} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white">
                    <Image src={mockUser?.partnerAvatar} alt={mockUser?.partnerAvatarAlt} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="font-caption text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {greeting} ✨
                  </p>
                  <h1 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                    {displayName}
                  </h1>
                  <p className="font-caption text-xs md:text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                    Together since {mockUser?.anniversaryDate} &middot; {mockUser?.yearsTogther} beautiful years
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative hearts */}
            <div className="absolute top-4 right-8 opacity-10 hidden lg:block">
              <Icon name="Heart" size={80} color="white" strokeWidth={1} />
            </div>
            <div className="absolute bottom-2 right-24 opacity-10 hidden lg:block">
              <Icon name="Heart" size={40} color="white" strokeWidth={1} />
            </div>
          </div>

          {/* Summary Cards Grid */}
          <div
            ref={cardsRef}
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8 scroll-hidden ${cardsVisible ? 'scroll-visible' : ''}`}
          >
            <SummaryCard
              title="Upcoming Events"
              value={thisMonthCount !== null ? String(thisMonthCount) : '—'}
              subtitle={`${new Date().toLocaleString('en-MY', { month: 'long', timeZone: 'Asia/Kuala_Lumpur' })} ${new Date().getFullYear()}`}
              iconName="CalendarHeart"
              iconColor="var(--color-primary)"
              bgColor="rgba(212, 118, 26, 0.12)"
              route="/calendar"
              actionLabel="View Calendar"
              isLoading={cardsLoading}
              onRefresh={handleRefreshCards}
            />
            <SummaryCard
              title="Shared Memories"
              value={galleryMonthCount !== null ? String(galleryMonthCount) : '—'}
              subtitle={`Added in ${new Date().toLocaleString('en-MY', { month: 'long', timeZone: 'Asia/Kuala_Lumpur' })} ${new Date().getFullYear()}`}
              iconName="Images"
              iconColor="#2D5016"
              bgColor="rgba(45, 80, 22, 0.12)"
              route="/gallery"
              actionLabel="Open Gallery"
              isLoading={cardsLoading}
              onRefresh={handleRefreshCards}
            />
            <SummaryCard
              title="Days Together"
              value="2,456"
              subtitle={`Since ${mockUser?.anniversaryDate}`}
              iconName="Heart"
              iconColor="#FF6B35"
              bgColor="rgba(255, 107, 53, 0.12)"
              route="/profile-page"
              actionLabel="View Profile"
              isLoading={cardsLoading}
              onRefresh={handleRefreshCards}
            />
          </div>

          {/* Main Content Grid */}
          <div
            ref={contentRef}
            className={`grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 scroll-hidden ${contentVisible ? 'scroll-visible' : ''}`}
          >
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
              <UpcomingEvents />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Anniversary Countdown Card */}
              <div
                className="card"
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(212,118,26,0.08) 0%, rgba(255,107,53,0.08) 100%)",
                  borderColor: "rgba(212, 118, 26, 0.25)"
                }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Sparkles" size={18} color="var(--color-primary)" strokeWidth={2.5} />
                  <h2 className="font-heading text-base font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Next Anniversary
                  </h2>
                </div>
                <div className="text-center py-2">
                  <p className="font-heading text-4xl font-semibold" style={{ color: "var(--color-primary)" }}>{daysUntil}</p>
                  <p className="font-caption text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
                    days until June 16, {nextAnniversary.getFullYear()}
                  </p>
                  <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-muted)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg, var(--color-primary), #FF6B35)" }}
                    />
                  </div>
                  <p className="font-caption text-xs mt-2" style={{ color: "var(--color-muted-foreground)" }}>
                    {progressPercent}% of the year completed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Favourite Memories */}
          <div
            ref={favRef}
            className={`mt-6 md:mt-8 scroll-hidden ${favVisible ? 'scroll-visible' : ''}`}
          >
            <div className="card" style={{ padding: "24px" }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={18} color="#FF6B35" strokeWidth={2.5} />
                  <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Favourite Memories
                  </h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/gallery")}>
                  View All
                </Button>
              </div>

              {favLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg animate-pulse"
                      style={{ backgroundColor: "var(--color-muted)" }}
                    />
                  ))}
                </div>
              ) : favPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 107, 53, 0.12)" }}
                  >
                    <Icon name="HeartOff" size={22} color="#FF6B35" strokeWidth={2} />
                  </div>
                  <p className="font-caption text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                    No favourite photos yet. Heart a photo in the gallery!
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/gallery")}>
                    Open Gallery
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                  {favPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer transition-base hover-lift relative group"
                      onClick={() => navigate("/gallery")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && navigate("/gallery")}
                      aria-label={photo.title}
                    >
                      <Image
                        src={getGalleryPhotoUrl(photo.photo_name)}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                        >
                          <Icon name="Heart" size={12} color="#FF6B35" strokeWidth={0} fill="#FF6B35" />
                        </div>
                      </div>
                      <div
                        className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-2"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}
                      >
                        <p className="font-caption text-xs text-white truncate">{photo.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </AppShell>
  );
};

export default Dashboard;