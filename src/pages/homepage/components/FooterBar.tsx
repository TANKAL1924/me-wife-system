import Icon from "../../../components/AppIcon";

const FooterBar = () => {
  const year = new Date()?.getFullYear();

  return (
    <footer
      className="border-t pt-6 pb-8 md:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Icon name="Heart" size={14} color="white" strokeWidth={2.5} />
        </div>
        <span
          className="font-heading text-sm font-semibold"
          style={{ color: "var(--color-foreground)" }}
        >
          Together
        </span>
      </div>

      <p
        className="text-xs font-caption text-center"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        &copy; {year} Together. Your private couple space. All rights reserved.
      </p>

      <div className="flex items-center gap-1">
        <Icon name="ShieldCheck" size={13} color="var(--color-success)" />
        <span
          className="text-xs font-caption"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Secured &amp; Private
        </span>
      </div>
    </footer>
  );
};

export default FooterBar;