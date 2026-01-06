document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (simple scroll animations)
  AOS.init({
    once: true,          // Animate only once
    duration: 800,
    easing: 'ease-out-cubic',
    offset: 100
  });

  // GSAP: Parallax background on scroll (subtle depth)
  if (window.innerWidth > 768) { // Desktop only for performance
    gsap.to('#hero', {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // GSAP: Add floating animation to mockup after AOS fade
  gsap.to('#hero-mockup', {
    y: -20,
    repeat: -1,
    yoyo: true,
    duration: 6,
    ease: 'power1.inOut',
    delay: 1.5 // After fade-in
  });

  // Optional: Button pulse on hover (extra engagement)
  document.querySelectorAll('.hero-cta .btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.05, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.3 });
    });
  });
});

// Icon hover interaction on feature cards
document.querySelectorAll('.feature-card').forEach(card => {
  const icon = card.querySelector('.feature-icon');
  card.addEventListener('mouseenter', () => {
    gsap.to(icon, { y: -10, rotation: 10, duration: 0.4, ease: 'back.out(1.7)' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(icon, { y: 0, rotation: 0, duration: 0.4 });
  });
});

// Draw timeline line progressively
gsap.timeline({
  scrollTrigger: {
    trigger: '#how',
    start: 'top 20%',
    end: 'bottom 80%',
    scrub: 1
  }
})
.fromTo('.timeline::before', { height: '0%' }, { height: '100%' });

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('testimonial-carousel');
  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  let currentIndex = 0;
  let autoSlideInterval;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('span');

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    let next = currentIndex + 1;
    if (next >= slides.length) next = 0;
    goToSlide(next);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Touch/Mouse swipe support
  carousel.addEventListener('touchstart', dragStart);
  carousel.addEventListener('touchmove', dragMove);
  carousel.addEventListener('touchend', dragEnd);
  carousel.addEventListener('mousedown', dragStart);
  carousel.addEventListener('mousemove', dragMove);
  carousel.addEventListener('mouseup', dragEnd);
  carousel.addEventListener('mouseleave', dragEnd);

  function dragStart(e) {
    isDragging = true;
    startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    stopAutoSlide();
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentPos = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    currentTranslate = currentPos - startPos;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (currentTranslate < -50) nextSlide();
    if (currentTranslate > 50) {
      let prev = currentIndex - 1;
      if (prev < 0) prev = slides.length - 1;
      goToSlide(prev);
    }
    startAutoSlide();
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  // Start auto-slide
  startAutoSlide();
});
// Download confetti: https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js
document.querySelectorAll('#final-cta .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  });
});