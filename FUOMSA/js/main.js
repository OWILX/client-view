const animatedElements = document.querySelectorAll(".animate, .animate-hero, .animate-scale");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      // Add/remove "show" class whenever visibility changes
      // (animation will play both when entering AND leaving viewport)
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    // Trigger when even a tiny bit of the element is visible
    threshold: 0.1,
    
    // Start observing 100px before the element enters the viewport
    // (makes animation feel more natural / starts earlier)
    rootMargin: "0px 0px -100px 0px"
    // Breakdown of rootMargin: top right bottom left
    // negative bottom value = trigger earlier (when element is still below viewport)
  }
);

// Start observing all elements
animatedElements.forEach(el => observer.observe(el));