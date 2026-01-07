import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function MeetTheCrew() {
  const crew = [
    {
      quote:
        "With over 10 years of experience in videography, Kaleb is passionate about capturing authentic moments and telling compelling stories. Every wedding and event is unique, and he strives to deliver films that couples will treasure forever.",
      name: "Kaleb Rowland",
      designation: "Owner",
      src: "/kaleb.png",
    },
    {
      quote:
        "Alex brings creativity and technical expertise to every project. From color grading to sound design, he ensures every frame tells your story beautifully. His goal is to create cinematic experiences that evoke emotion.",
      name: "Alex Martinez",
      designation: "Senior Video Editor",
      src: "/alex.png",
    },
    {
      quote:
        "Grace is here to make your booking experience seamless and stress-free. From initial consultation to final delivery, she ensures clear communication and coordinates all the details so you can focus on your special day.",
      name: "Grace Moffatt",
      designation: "Booking Coordinator",
      src: "/grace.png",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-neutral-950 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-normal text-black dark:text-white mb-4">
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
