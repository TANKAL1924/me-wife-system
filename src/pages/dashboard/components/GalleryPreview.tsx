import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const previewPhotos = [
{
  id: 1,
  src: "https://images.unsplash.com/photo-1602514408340-86e6450a7295",
  alt: "Couple holding hands walking along a scenic mountain trail during golden hour sunset"
},
{
  id: 2,
  src: "https://images.unsplash.com/photo-1697481604158-c277ba1ae025",
  alt: "Romantic couple sharing a meal at an outdoor restaurant with string lights in background"
},
{
  id: 3,
  src: "https://images.unsplash.com/photo-1452029297810-5fa45c524747",
  alt: "Happy couple laughing together on a beach during a beautiful summer vacation"
},
{
  id: 4,
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_17c064f69-1771084704312.png",
  alt: "Couple embracing each other in a cozy living room with warm ambient lighting"
},
{
  id: 5,
  src: "https://images.unsplash.com/photo-1684145039936-70a0e9c50b95",
  alt: "Two people sitting together watching a beautiful sunset over the ocean horizon"
},
{
  id: 6,
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_147c596c8-1766130277188.png",
  alt: "Couple dancing together at an outdoor wedding celebration with flowers in background"
}];


const GalleryPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon name="Images" size={18} color="var(--color-primary)" strokeWidth={2.5} />
          <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
            Recent Memories
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/gallery")}>
          View All
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {previewPhotos?.map((photo) =>
        <div
          key={photo?.id}
          className="aspect-square rounded-lg overflow-hidden cursor-pointer transition-base hover-lift"
          onClick={() => navigate("/gallery")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e?.key === "Enter" && navigate("/gallery")}
          aria-label={photo?.alt}>
          
            <Image
            src={photo?.src}
            alt={photo?.alt}
            className="w-full h-full object-cover" />
          
          </div>
        )}
      </div>
      <div className="flex items-center justify-center mt-4">
        <p className="font-caption text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          Showing 6 of 48 memories
        </p>
      </div>
    </div>);

};

export default GalleryPreview;