import { PortfolioData } from '@/services/api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Generate HTML content for the portfolio
 * @param data Portfolio data
 * @returns HTML string
 */
export const generatePortfolioHTML = (data: PortfolioData): string => {
  const projectsHTML = data.projects.map(project => `
    <div class="project-card">
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      <div class="skills-used">
        ${project.skillsUsed.map(skill => `<span class="skill-badge">${escapeHTML(skill)}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const skillsHTML = data.skills.map(skill =>
    `<span class="skill-badge">${escapeHTML(skill)}</span>`
  ).join('');

  const contactHTML = [];
  if (data.email) {
    contactHTML.push(`
      <a href="mailto:${escapeHTML(data.email)}" class="contact-item">
        <div class="contact-icon">📧</div>
        <span class="contact-label">Email</span>
        <span class="contact-value">${escapeHTML(data.email)}</span>
      </a>
    `);
  }

  if (data.linkedin) {
    contactHTML.push(`
      <a href="${escapeHTML(data.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-item">
        <div class="contact-icon">👔</div>
        <span class="contact-label">LinkedIn</span>
        <span class="contact-value">View Profile</span>
      </a>
    `);
  }

  if (data.github) {
    contactHTML.push(`
      <a href="${escapeHTML(data.github)}" target="_blank" rel="noopener noreferrer" class="contact-item">
        <div class="contact-icon">💻</div>
        <span class="contact-label">GitHub</span>
        <span class="contact-value">View Projects</span>
      </a>
    `);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(data.name)} - Portfolio</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
</head>
<body>
  <header>
    <div class="container">
      <h1>${escapeHTML(data.name)}</h1>
      <p class="headline">${escapeHTML(data.headline)}</p>
    </div>
  </header>

  <nav>
    <div class="container">
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#hobbies">Interests</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </nav>

  <section id="about" class="section">
    <div class="container">
      <h2>About Me</h2>
      <div class="about-content">
        <p>${escapeHTML(data.bio)}</p>
      </div>
    </div>
  </section>

  <section id="skills" class="section alt-bg">
    <div class="container">
      <h2>Skills & Expertise</h2>
      <div class="skills-container">
        ${skillsHTML}
      </div>
    </div>
  </section>

  <section id="projects" class="section">
    <div class="container">
      <h2>Featured Work</h2>
      <div class="projects-grid">
        ${projectsHTML}
      </div>
    </div>
  </section>

  <section id="hobbies" class="section alt-bg">
    <div class="container">
      <h2>Beyond the Keyboard</h2>
      <div class="hobbies-intro">
        <p>When I'm not coding, I enjoy exploring my passions outside of technology:</p>
      </div>
      <div class="hobbies-grid">
        ${data.hobbies.split(',').map(hobby => {
          // Define icons for common hobbies
          const getHobbyIcon = (hobby: string): string => {
            const h = hobby.trim().toLowerCase();
            if (h.includes('read')) return '📚';
            if (h.includes('music') || h.includes('play')) return '🎵';
            if (h.includes('travel')) return '✈️';
            if (h.includes('hik') || h.includes('outdoor')) return '🥾';
            if (h.includes('cook') || h.includes('bak')) return '🍳';
            if (h.includes('photo')) return '📷';
            if (h.includes('art') || h.includes('paint')) return '🎨';
            if (h.includes('sport') || h.includes('gym') || h.includes('fit')) return '🏋️';
            if (h.includes('game') || h.includes('gaming')) return '🎮';
            if (h.includes('film') || h.includes('movie')) return '🎬';
            return '🌟';
          };

          return `
          <div class="hobby-card">
            <div class="hobby-icon">${getHobbyIcon(hobby)}</div>
            <div class="hobby-name">${escapeHTML(hobby.trim())}</div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </section>

  <section id="contact" class="section">
    <div class="container">
      <h2>Let's Connect</h2>
      <div class="contact-grid">
        ${contactHTML.join('')}
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>Created with PortfolioAI - © ${new Date().getFullYear()}</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
};

/**
 * Generate CSS for the portfolio
 * @returns CSS string
 */
export const generatePortfolioCSS = (): string => {
  return `/* Portfolio Styles */
:root {
  --primary: #5046e5;
  --primary-light: rgba(80, 70, 229, 0.1);
  --secondary: #f1f5f9;
  --text: #0f172a;
  --text-muted: #64748b;
  --background: #ffffff;
  --border: #e2e8f0;
  --radius: 0.75rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text);
  line-height: 1.6;
  background-color: var(--background);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

header {
  background: linear-gradient(to bottom right, rgba(80, 70, 229, 0.1), rgba(80, 70, 229, 0.05));
  padding: 5rem 1rem;
  text-align: center;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--primary), rgba(80, 70, 229, 0.7));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.headline {
  font-size: 1.5rem;
  color: var(--text-muted);
  max-width: 36rem;
  margin: 0 auto;
}

nav {
  background-color: var(--background);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
}

nav ul {
  display: flex;
  list-style: none;
  padding: 1rem 0;
}

nav a {
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--primary);
}

.section {
  padding: 4rem 1rem;
}

.alt-bg {
  background-color: var(--secondary);
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.about-content {
  max-width: 48rem;
  margin: 0 auto;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.skill-badge {
  background-color: var(--primary-light);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: all 0.3s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.project-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: rgba(80, 70, 229, 0.3);
}

.project-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.project-card p {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.skills-used {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skills-used .skill-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
}

.contact-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: var(--text);
  transition: background-color 0.2s;
  border-radius: var(--radius);
}

.contact-item:hover {
  background-color: var(--secondary);
}

.contact-icon {
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-light);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.contact-label {
  font-weight: 500;
}

.contact-value {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Hobbies Section Styles */
.hobbies-intro {
  text-align: center;
  max-width: 36rem;
  margin: 0 auto 2rem;
}

.hobbies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.hobby-card {
  background-color: var(--background);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.hobby-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hobby-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: var(--primary-light);
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.hobby-name {
  font-weight: 500;
}

footer {
  padding: 2rem 1rem;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  .headline {
    font-size: 1.25rem;
  }

  nav ul {
    flex-direction: column;
    padding: 0.5rem 0;
  }

  nav a {
    display: block;
    padding: 0.75rem 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .hobbies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .hobby-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.75rem;
  }
}`;
};

/**
 * Generate JavaScript for the portfolio
 * @returns JavaScript string
 */
export const generatePortfolioJS = (): string => {
  return `// Simple JavaScript for the portfolio
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add active class to navigation items on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});`;
};

/**
 * Escape HTML special characters to prevent XSS
 * @param text Text to escape
 * @returns Escaped text
 */
const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Create and download a zip file containing the portfolio
 * @param data Portfolio data
 */
export const downloadPortfolio = async (data: PortfolioData): Promise<void> => {
  try {
    const zip = new JSZip();

    // Add HTML file
    zip.file('index.html', generatePortfolioHTML(data));

    // Add CSS file
    zip.file('styles.css', generatePortfolioCSS());

    // Add JavaScript file
    zip.file('script.js', generatePortfolioJS());

    // Try to load the README template
    let readmeContent: string;
    try {
      const response = await fetch('/src/templates/portfolio-readme.txt');
      if (response.ok) {
        readmeContent = await response.text();
        // Replace placeholders if needed
        readmeContent = readmeContent.replace('{{NAME}}', data.name);
      } else {
        // Fallback if template can't be loaded
        readmeContent = `Portfolio for ${data.name}
Generated by PortfolioAI

This folder contains a complete static website for your portfolio.
To view your portfolio, simply open the index.html file in any web browser.

Files included:
- index.html: The main HTML file for your portfolio
- styles.css: The stylesheet for your portfolio
- script.js: JavaScript for interactive elements

To host this portfolio online, you can upload these files to any web hosting service.
`;
      }
    } catch (error) {
      console.warn('Could not load README template, using fallback', error);
      readmeContent = `Portfolio for ${data.name}
Generated by PortfolioAI

This folder contains a complete static website for your portfolio.
To view your portfolio, simply open the index.html file in any web browser.

Files included:
- index.html: The main HTML file for your portfolio
- styles.css: The stylesheet for your portfolio
- script.js: JavaScript for interactive elements

To host this portfolio online, you can upload these files to any web hosting service.
`;
    }

    // Add README file
    zip.file('README.txt', readmeContent);

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Download the zip file
    saveAs(content, `${data.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`);
  } catch (error) {
    console.error('Error creating portfolio zip file:', error);
    throw error;
  }
};
