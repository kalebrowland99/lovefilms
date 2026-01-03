import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function MeetTheCrew() {
  const crew = [
    {
      quote:
        "With over 10 years of experience in videography, I'm passionate about capturing authentic moments and telling compelling stories. Every wedding and event is unique, and I strive to deliver films that couples will treasure forever.",
      name: "Kaleb Rowland",
      designation: "Owner & Lead Videographer",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "I bring creativity and technical expertise to every project. From color grading to sound design, I ensure every frame tells your story beautifully. My goal is to create cinematic experiences that evoke emotion.",
      name: "Alex Martinez",
      designation: "Senior Video Editor",
      src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "Capturing candid moments is my specialty. I love documenting the little details and genuine emotions that make each celebration special. Every shot I take aims to preserve the magic of your day.",
      name: "Jordan Taylor",
      designation: "Videographer",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "As a cinematographer, I focus on creating dynamic shots and beautiful compositions. Whether it's drone footage or intimate close-ups, I'm dedicated to capturing your story from every angle.",
      name: "Sam Rivera",
      designation: "Videographer",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "I'm here to make your booking experience seamless and stress-free. From initial consultation to final delivery, I ensure clear communication and coordinate all the details so you can focus on your special day.",
      name: "Taylor Johnson",
      designation: "Booking Coordinator",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-neutral-950 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-semibold text-black dark:text-white mb-4">
            Meet the crew 🤵📹
          </h2>
          <p className="text-md max-w-[600px] mx-auto font-medium text-neutral-600 dark:text-neutral-400 sm:text-xl">
            The talented team behind every unforgettable moment we capture
          </p>
        </div>
        <AnimatedTestimonials testimonials={crew} autoplay={true} />
      </div>
    </section>
  );
}
