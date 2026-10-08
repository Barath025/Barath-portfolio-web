// ============================================
// DYNAMIC SWIPE & SCROLL THEME ENGINE
// ============================================
(function() {
    const THEMES = {
        home: {
            name: 'Cyber Gold',
            accent: '#d4ff00',
            hover: '#aacc00',
            glow: 'rgba(212, 255, 0, 0.5)',
            border: 'rgba(212, 255, 0, 0.22)',
            bg1: 'rgba(212, 255, 0, 0.08)',
            bg2: 'rgba(0, 0, 0, 0)'
        },
        about: {
            name: 'Electric Azure',
            accent: '#00f0ff',
            hover: '#00b8cc',
            glow: 'rgba(0, 240, 255, 0.5)',
            border: 'rgba(0, 240, 255, 0.22)',
            bg1: 'rgba(0, 240, 255, 0.08)',
            bg2: 'rgba(0, 80, 255, 0.05)'
        },
        skills: {
            name: 'Neon Violet',
            accent: '#bd34fe',
            hover: '#9c1fdc',
            glow: 'rgba(189, 52, 254, 0.5)',
            border: 'rgba(189, 52, 254, 0.22)',
            bg1: 'rgba(189, 52, 254, 0.09)',
            bg2: 'rgba(70, 0, 180, 0.06)'
        },
        experience: {
            name: 'Solar Amber',
            accent: '#ff7b00',
            hover: '#d96500',
            glow: 'rgba(255, 123, 0, 0.5)',
            border: 'rgba(255, 123, 0, 0.22)',
            bg1: 'rgba(255, 123, 0, 0.08)',
            bg2: 'rgba(255, 40, 0, 0.05)'
        },
        projects: {
            name: 'Quantum Emerald',
            accent: '#00ff9d',
            hover: '#00cc7a',
            glow: 'rgba(0, 255, 157, 0.5)',
            border: 'rgba(0, 255, 157, 0.22)',
            bg1: 'rgba(0, 255, 157, 0.08)',
            bg2: 'rgba(0, 150, 100, 0.05)'
        },
        education: {
            name: 'Hyper Magenta',
            accent: '#ff2a85',
            hover: '#d61869',
            glow: 'rgba(255, 42, 133, 0.5)',
            border: 'rgba(255, 42, 133, 0.22)',
            bg1: 'rgba(255, 42, 133, 0.08)',
            bg2: 'rgba(180, 0, 100, 0.05)'
        },
        contact: {
            name: 'Cyber Gold',
            accent: '#d4ff00',
            hover: '#aacc00',
            glow: 'rgba(212, 255, 0, 0.5)',
            border: 'rgba(212, 255, 0, 0.22)',
            bg1: 'rgba(212, 255, 0, 0.08)',
            bg2: 'rgba(255, 120, 0, 0.05)'
        }
    };

    let currentThemeKey = 'home';
    let lastScrollY = window.scrollY;
    let particleColor = '#d4ff00';
    let particleVelocityY = 0;

    const progressBar = document.getElementById('scroll-progress-bar');
    const root = document.documentElement;

    function applyTheme(key) {
        if (!THEMES[key]) return;
        const theme = THEMES[key];
        currentThemeKey = key;
        particleColor = theme.accent;

        root.style.setProperty('--accent-primary', theme.accent);
        root.style.setProperty('--accent-hover', theme.hover);
        root.style.setProperty('--accent-glow', theme.glow);
        root.style.setProperty('--border-color', theme.border);
        root.style.setProperty('--bg-glow-1', theme.bg1);
        root.style.setProperty('--bg-glow-2', theme.bg2);
    }

    // Scroll & Swipe Listener
    function onScrollOrSwipe() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        // Scroll Direction & Particle Momentum
        const delta = scrollY - lastScrollY;
        if (delta > 0) {
            // Swiping UP / Scrolling DOWN
            particleVelocityY = Math.min(particleVelocityY - delta * 0.04, -3);
        } else if (delta < 0) {
            // Swiping DOWN / Scrolling UP
            particleVelocityY = Math.max(particleVelocityY - delta * 0.04, 3);
        }
        lastScrollY = scrollY;

        // Determine current active section
        const sectionEls = document.querySelectorAll('section, header');
        const triggerPoint = window.innerHeight * 0.45;
        let activeKey = 'home';

        sectionEls.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
                const id = sec.getAttribute('id');
                if (THEMES[id]) {
                    activeKey = id;
                }
            }
        });

        if (activeKey !== currentThemeKey) {
            applyTheme(activeKey);
        }

        // Update Navbar Links Active Class
        const navItems = document.querySelectorAll('.nav-links li a');
        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(activeKey)) {
                li.classList.add('active');
            }
        });

        // Navbar blur elevation
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollY > 50) {
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.7)';
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.background = 'rgba(0, 0, 0, 0.85)';
            }
        }
    }

    window.addEventListener('scroll', onScrollOrSwipe, { passive: true });

    // Touch Swipe Gesture Detection for Mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touchCurrentY = e.touches[0].clientY;
        const touchDelta = touchStartY - touchCurrentY;
        if (Math.abs(touchDelta) > 15) {
            particleVelocityY += (touchDelta > 0 ? -0.8 : 0.8);
            touchStartY = touchCurrentY;
        }
    }, { passive: true });

    // ============================================
    // INTERACTIVE 3D PARTICLE CONSTELLATION CANVAS
    // ============================================
    const canvas = document.getElementById('canvas-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        let mouse = { x: null, y: null, radius: 140 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.alpha = Math.random() * 0.5 + 0.3;
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.shadowColor = particleColor;
                ctx.shadowBlur = 8;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy + particleVelocityY * 0.3;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 3;
                        this.y -= (dy / dist) * force * 3;
                    }
                }

                // Wrap around edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                this.draw();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            const maxDistance = 115;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.22;
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = particleColor;
                        ctx.globalAlpha = alpha;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            // Dampen vertical impulse smoothly back to 0
            particleVelocityY *= 0.92;

            particles.forEach(p => p.update());
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // Initial theme setup
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme('home');
        onScrollOrSwipe();
    });
})();

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Typewriter effect with cycling roles
document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriter');
    if(textElement) {
        const roles = [
            'Java Software Developer',
            'AI & Automation Builder',
            'Web Application Developer',
            'Problem Solver & Prompt Engineer'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 90;

        function typeLoop() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                textElement.innerText = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 45;
            } else {
                textElement.innerText = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 90;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at end of text
                typeSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        setTimeout(typeLoop, 500);
    }
});

// Reveal elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize styles for elements to animate
document.querySelectorAll('.glass-card, .section-title, .project-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// --- Supabase Connection & Form Logic ---
(function() {
    // Project Credentials (Trimmed to avoid hidden space issues)
    const SUPABASE_URL = "https://vctwfiscbjrupnbedjsh.supabase.co".trim(); 
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdHdmaXNjYmpydXBuYmVkanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTk3NzIsImV4cCI6MjA4OTgzNTc3Mn0.lCodo3tuDUV5NErTL-9aKDLtM8HnORLntYakKp7qA_k".trim();

    let supabase;

    // Initialize client defensively
    function initSupabase() {
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Supabase Client Initialized Successfully.");
            return true;
        } else {
            console.error("Supabase library not found. Check your internet connection or CDN link.");
            return false;
        }
    }

    // Helper to show status on UI
    function showStatus(text, type) {
        const statusDiv = document.getElementById('formStatus');
        if (!statusDiv) return;
        statusDiv.innerText = text;
        statusDiv.style.display = 'block';
        statusDiv.style.background = type === 'success' ? 'rgba(212, 255, 0, 0.15)' : 'rgba(255, 0, 0, 0.15)';
        statusDiv.style.color = type === 'success' ? '#d4ff00' : '#ff4d4d';
        setTimeout(() => { statusDiv.style.display = 'none'; }, 6000);
    }

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', () => {
        if (!initSupabase()) return;

        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                // CRITICAL: Prevent refresh immediately
                e.preventDefault();
                
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                // Capture data
                const email = document.getElementById('userEmail').value.trim();
                const formData = {
                    name: document.getElementById('userName').value.trim(),
                    email: email,
                    job_role: document.getElementById('jobRole').value.trim(),
                    message: document.getElementById('message').value.trim()
                };

                // Store email for history retrieval potential
                localStorage.setItem('lastMessageEmail', email);

                console.log("Attempting to send data:", formData);

                try {
                    const { error } = await supabase.from('users').insert([formData]);
                    
                    if (error) throw error;

                    console.log("Data sent to Supabase successfully!");
                    showStatus('Success! Your message has been sent.', 'success');
                    contactForm.reset();
                } catch (error) {
                    console.error('Submission Error:', error.message || error);
                    showStatus('Error: ' + (error.message || 'Check your internet or Supabase policies'), 'error');
                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            });
        }

        // --- History Modal Logic ---
        const historyModal = document.getElementById('historyModal');
        const showHistoryBtn = document.getElementById('showHistoryBtn');
        const closeHistory = document.getElementById('closeHistory');
        const historyList = document.getElementById('historyList');
        const historyLoader = document.getElementById('historyLoader');

        if (showHistoryBtn) {
            showHistoryBtn.addEventListener('click', async () => {
                historyModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scroll
                
                // Clear previous list (except loader)
                const items = historyList.querySelectorAll('.history-item, .no-history');
                items.forEach(item => item.remove());
                historyLoader.style.display = 'flex';

                try {
                    // Fetch all messages (or you could filter by localStorage.getItem('lastMessageEmail'))
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    historyLoader.style.display = 'none';

                    if (!data || data.length === 0) {
                        historyList.innerHTML += '<div class="no-history">No message history found.</div>';
                        return;
                    }

                    // Store intervals to clear them later if needed
                    if (window.historyIntervals) {
                        window.historyIntervals.forEach(clearInterval);
                    }
                    window.historyIntervals = [];

                    const now = new Date().getTime();

                    data.forEach(msg => {
                        const createdAt = new Date(msg.created_at).getTime();
                        const diffInSeconds = Math.floor((now - createdAt) / 1000);
                        const initialTimeLeft = 60 - diffInSeconds;

                        // If already past 1 minute, delete and skip
                        if (initialTimeLeft <= 0) {
                            deleteMessage(msg.id);
                            return;
                        }

                        const item = document.createElement('div');
                        item.className = 'history-item';
                        item.id = `msg-${msg.id}`;
                        
                        item.innerHTML = `
                            <div class="history-header">
                                <span class="history-name">${msg.name || 'Anonymous'}</span>
                                <span class="history-timer" id="timer-${msg.id}" style="color: #ff4d4d; font-weight: bold; background: rgba(255, 77, 77, 0.1); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">
                                    <i class="fas fa-clock" style="margin-right: 4px;"></i>${initialTimeLeft}s
                                </span>
                            </div>
                            <span class="history-role">${msg.job_role || 'No Role specified'}</span>
                            <div class="history-msg">${msg.message}</div>
                        `;
                        historyList.appendChild(item);

                        // Setup real-time countdown
                        let timeLeft = initialTimeLeft;
                        const interval = setInterval(async () => {
                            timeLeft--;
                            const timerEl = document.getElementById(`timer-${msg.id}`);
                            if (timerEl) {
                                timerEl.innerHTML = `<i class="fas fa-clock" style="margin-right: 4px;"></i>${timeLeft}s`;
                            }

                            if (timeLeft <= 0) {
                                clearInterval(interval);
                                const element = document.getElementById(`msg-${msg.id}`);
                                if (element) {
                                    element.style.opacity = '0.5';
                                    element.style.transform = 'scale(0.95)';
                                    setTimeout(() => element.remove(), 500);
                                }
                                await deleteMessage(msg.id);
                                
                                // Show "No history" if last item removed
                                if (historyList.querySelectorAll('.history-item').length === 0) {
                                    historyList.innerHTML = '<div class="no-history">No message history found.</div>';
                                }
                            }
                        }, 1000);
                        window.historyIntervals.push(interval);
                    });

                } catch (err) {
                    console.error("History Fetch Error:", err);
                    historyLoader.style.display = 'none';
                    historyList.innerHTML += `<div class="no-history" style="color: #ff4d4d;">Failed to load history: ${err.message}</div>`;
                }
            });
        }

        // Helper to delete message from Supabase
        async function deleteMessage(id) {
            console.log(`Deleting message ${id} as it expired...`);
            try {
                const { error } = await supabase.from('users').delete().eq('id', id);
                if (error) throw error;
            } catch (err) {
                console.error("Deletion Error:", err.message);
            }
        }

        if (closeHistory) {
            closeHistory.addEventListener('click', () => {
                historyModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                if (window.historyIntervals) {
                    window.historyIntervals.forEach(clearInterval);
                    window.historyIntervals = [];
                }
            });
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === historyModal) {
                historyModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                if (window.historyIntervals) {
                    window.historyIntervals.forEach(clearInterval);
                    window.historyIntervals = [];
                }
            }
        });
    });

    // One-time verification check
    window.addEventListener('load', async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase.from('users').select('id').limit(1);
            if (error) console.warn("Note: Table access restricted or table not found yet.");
            else console.log("Connection Verified: Table 'users' is accessible.");
        } catch (e) {}
    });
})();

// Self Intro Audio Setup
document.addEventListener('DOMContentLoaded', () => {
    const selfIntroBtn = document.getElementById('self-intro-btn');
    if(selfIntroBtn) {
        const audioIcon = document.getElementById('audio-icon');
        const audioText = document.getElementById('audio-text');
        const audioIconBg = document.getElementById('audio-icon-bg');
        
        let isPlaying = false;
        let audio = new Audio('intro.mp3');
        
        audio.onended = () => {
            isPlaying = false;
            audioIcon.className = 'fas fa-volume-up';
            audioText.innerText = 'Self Intro';
            audioIconBg.style.boxShadow = '0 0 15px rgba(212, 255, 0, 0.4)';
        };
        
        audio.onerror = (e) => {
            console.error('Audio playback error', e);
            isPlaying = false;
            audioIcon.className = 'fas fa-volume-up';
            audioText.innerText = 'Self Intro';
            audioIconBg.style.boxShadow = '0 0 15px rgba(212, 255, 0, 0.4)';
        };
        
        // Hover effects
        selfIntroBtn.addEventListener('mouseenter', () => {
            selfIntroBtn.style.background = 'rgba(255, 255, 255, 0.08)';
            if(!isPlaying) audioIconBg.style.transform = 'scale(1.1)';
        });
        
        selfIntroBtn.addEventListener('mouseleave', () => {
            selfIntroBtn.style.background = 'rgba(255, 255, 255, 0.03)';
            if(!isPlaying) audioIconBg.style.transform = 'scale(1)';
        });

        selfIntroBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                audio.currentTime = 0;
                isPlaying = false;
                audioIcon.className = 'fas fa-volume-up';
                audioText.innerText = 'Self Intro';
                audioIconBg.style.boxShadow = '0 0 15px rgba(212, 255, 0, 0.4)';
            } else {
                audio.currentTime = 0;
                audio.play();
                isPlaying = true;
                audioIcon.className = 'fas fa-stop';
                audioText.innerText = 'Stop Audio';
                audioIconBg.style.boxShadow = '0 0 25px rgba(212, 255, 0, 0.8)';
            }
        });
    }
});
