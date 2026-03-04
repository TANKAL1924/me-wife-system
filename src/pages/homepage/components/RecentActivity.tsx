import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const activities = [
{
  id: 1,
  type: "photo",
  icon: "Image",
  iconColor: "var(--color-accent)",
  iconBg: "rgba(255, 107, 53, 0.10)",
  title: "New photo added to Gallery",
  description: "Beach sunset from our weekend trip to Santa Monica.",
  time: "2 hours ago",
  image: "https://images.unsplash.com/photo-1685018354500-ab4fc487508f",
  imageAlt: "Golden sunset over calm ocean waves at Santa Monica beach with silhouettes of palm trees"
},
{
  id: 2,
  type: "event",
  icon: "CalendarHeart",
  iconColor: "var(--color-primary)",
  iconBg: "rgba(212, 118, 26, 0.10)",
  title: "Anniversary dinner scheduled",
  description: "March 15, 2026 — Reservations at La Maison at 7:30 PM.",
  time: "Yesterday",
  image: null,
  imageAlt: ""
},
{
  id: 3,
  type: "photo",
  icon: "Image",
  iconColor: "var(--color-accent)",
  iconBg: "rgba(255, 107, 53, 0.10)",
  title: "Memory album updated",
  description: "Added 6 new photos from the hiking trip at Griffith Park.",
  time: "2 days ago",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b6fa3244-1772563690506.png",
  imageAlt: "Lush green hiking trail winding through Griffith Park with city skyline visible in the distance"
},
{
  id: 4,
  type: "event",
  icon: "CalendarHeart",
  iconColor: "var(--color-primary)",
  iconBg: "rgba(212, 118, 26, 0.10)",
  title: "Movie night added to calendar",
  description: "Friday, March 7 — Home movie night with popcorn.",
  time: "3 days ago",
  image: null,
  imageAlt: ""
},
{
  id: 5,
  type: "profile",
  icon: "UserCircle",
  iconColor: "var(--color-secondary)",
  iconBg: "rgba(139, 69, 19, 0.10)",
  title: "Profile updated",
  description: "Emma updated her profile photo and bio.",
  time: "5 days ago",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_109550d11-1766719301487.png",
  imageAlt: "Young woman with warm smile and brown hair wearing casual white top in bright natural light"
}];


const RecentActivity = () => {
  return (
    <section className="mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl md:text-2xl font-heading font-semibold mb-1"
            style={{ color: "var(--color-foreground)" }}>
            
            Recent Activity
          </h2>
          <p
            className="text-sm font-caption"
            style={{ color: "var(--color-muted-foreground)" }}>
            
            Your latest shared moments and updates.
          </p>
        </div>
        <div
          className="flex items-center gap-1 text-xs font-caption font-medium"
          style={{ color: "var(--color-primary)" }}>
          
          <Icon name="Clock" size={14} color="var(--color-primary)" />
          <span className="hidden sm:inline">Live updates</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {activities?.map((activity) =>
        <div
          key={activity?.id}
          className="card flex items-start gap-4 hover-lift transition-base"
          style={{ padding: "16px 20px" }}>
          
            {/* Icon or thumbnail */}
            <div className="flex-shrink-0">
              {activity?.image ?
            <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <Image
                src={activity?.image}
                alt={activity?.imageAlt}
                className="w-full h-full object-cover" />
              
                </div> :

            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: activity?.iconBg }}>
              
                  <Icon
                name={activity?.icon}
                size={22}
                color={activity?.iconColor}
                strokeWidth={2} />
              
                </div>
            }
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
              className="text-sm font-caption font-semibold line-clamp-1"
              style={{ color: "var(--color-foreground)" }}>
              
                {activity?.title}
              </p>
              <p
              className="text-xs font-caption line-clamp-1 mt-0.5"
              style={{ color: "var(--color-muted-foreground)" }}>
              
                {activity?.description}
              </p>
            </div>

            {/* Time */}
            <span
            className="flex-shrink-0 text-xs font-data whitespace-nowrap"
            style={{ color: "var(--color-muted-foreground)" }}>
            
              {activity?.time}
            </span>
          </div>
        )}
      </div>
    </section>);

};

export default RecentActivity;