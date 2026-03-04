import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

interface HeroSectionProps {
  coupleName: string;
}

const HeroSection = ({ coupleName }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-2xl mb-8 md:mb-12">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 px-6 py-12 md:px-12 md:py-20 lg:py-24 text-center">
        {/* Greeting badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-caption font-medium"
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            backdropFilter: "blur(8px)",
          }}
        >
          <Icon name="Heart" size={14} color="white" strokeWidth={2.5} />
          <span>Your Private Space</span>
        </div>

        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-4"
          style={{ color: "white" }}
        >
          Welcome back,{" "}
          <span style={{ color: "rgba(255,255,255,0.85)" }}>{coupleName}</span>
        </h1>

        <p
          className="text-base md:text-lg max-w-xl mx-auto mb-8 font-body"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Your shared life, beautifully organized. Manage memories, schedules,
          and moments — all in one private, secure place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="default"
            size="lg"
            iconName="LayoutDashboard"
            iconPosition="left"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto"
            style={{
              backgroundColor: "white",
              color: "var(--color-primary)",
            }}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            iconName="LogIn"
            iconPosition="left"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto"
            style={{
              borderColor: "rgba(255,255,255,0.6)",
              color: "white",
            }}
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;