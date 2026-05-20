import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Integration with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  
  // 0. Interactive Navbar Overlay
  const hamburger = document.querySelector('.hamburger');
  const navOverlay = document.querySelector('.nav-overlay');
  const overlayLinks = document.querySelectorAll('.overlay-link, .overlay-btn');

  if (hamburger && navOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navOverlay.classList.toggle('active');
      
      if (isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
        lenis.start();
      });
    });
  }

  // 1. Parallax Images
  const parallaxImages = document.querySelectorAll('.parallax-bg');
  parallaxImages.forEach(image => {
    gsap.to(image, {
      yPercent: 30, // Moves the image down as you scroll down
      ease: "none",
      scrollTrigger: {
        trigger: image.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // 2. Fade Up Elements
  const fadeUpElements = document.querySelectorAll('.fade-up');
  fadeUpElements.forEach(element => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%", // Trigger when the top of the element hits 85% down the viewport
        toggleActions: "play none none reverse"
      }
    });
  });

  // 3. Horizontal Scroll for Ethos Section
  const ethosSection = document.querySelector('.ethos-section');
  const ethosTrack = document.querySelector('.ethos-scroll-container');
  
  if (ethosSection && ethosTrack) {
    gsap.to(ethosTrack, {
      x: () => {
        // Account for the 10vw left padding on ethos-section, and leave 10vw on the right.
        const paddingOffset = window.innerWidth * 0.20; 
        return -(ethosTrack.scrollWidth - window.innerWidth + paddingOffset);
      },
      ease: "none",
      scrollTrigger: {
        trigger: ethosSection,
        pin: true,
        scrub: 1,
        end: () => "+=" + ethosTrack.scrollWidth,
      }
    });
  }
});
