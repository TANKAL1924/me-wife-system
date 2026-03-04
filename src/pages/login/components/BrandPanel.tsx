import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const features = [
{ icon: 'CalendarHeart', text: 'Shared calendar & events' },
{ icon: 'Images', text: 'Photo gallery & memories' },
{ icon: 'LayoutDashboard', text: 'Couple dashboard overview' },
{ icon: 'UserCircle', text: 'Personal profile management' }];


const BrandPanel = () =>
<div
  className="hidden lg:flex flex-col justify-between h-full p-10 xl:p-14 relative overflow-hidden"
  style={{ backgroundColor: 'var(--color-secondary)' }}>
  
    {/* Background image overlay */}
    <div className="absolute inset-0 overflow-hidden">
      <Image
      src="https://images.unsplash.com/photo-1715118877783-7afac3cc51b9"
      alt="Happy couple sitting together outdoors in warm golden sunlight surrounded by nature"
      className="w-full h-full object-cover opacity-20" />
    
      <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(135deg, rgba(139,69,19,0.85) 0%, rgba(212,118,26,0.75) 100%)'
      }} />
    
    </div>

    {/* Content */}
    <div className="relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
        
          <Icon name="Heart" size={22} color="white" strokeWidth={2.5} />
        </div>
        <span className="font-heading text-2xl font-semibold text-white">Together</span>
      </div>

      <h2 className="font-heading text-3xl xl:text-4xl font-semibold text-white leading-tight mb-4">
        Your private space,<br />built for two.
      </h2>
      <p className="text-white/75 font-body text-base mb-10 max-w-xs">
        Everything you share, organized beautifully in one secure place.
      </p>

      <div className="flex flex-col gap-4">
        {features?.map(({ icon, text }) =>
      <div key={text} className="flex items-center gap-3">
            <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          
              <Icon name={icon} size={18} color="white" strokeWidth={2} />
            </div>
            <span className="text-white/90 font-caption text-sm">{text}</span>
          </div>
      )}
      </div>
    </div>

    {/* Bottom quote */}
    <div
    className="relative z-10 p-5 rounded-2xl"
    style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
    
      <Icon name="Quote" size={20} color="rgba(255,255,255,0.6)" className="mb-2" />
      <p className="text-white/90 font-body text-sm italic leading-relaxed">
        "A shared life deserves a shared space — organized, private, and just for you two."
      </p>
    </div>
  </div>;


export default BrandPanel;