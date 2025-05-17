
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ChevronUp, Menu, X, Loader2 } from 'lucide-react';
import { useSmooth } from '@/hooks/use-smooth';
import { toast } from '@/components/ui/use-toast';
import { downloadPortfolio } from '@/lib/download-utils';

interface PortfolioData {
  name: string;
  headline: string;
  bio: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    skillsUsed: string[];
  }[];
  hobbies: string;
  email: string;
  linkedin: string;
  github: string;
}

interface PortfolioOutputProps {
  data: PortfolioData;
  originalData?: PortfolioData | null;
  onReset: () => void;
}

const PortfolioOutput: React.FC<PortfolioOutputProps> = ({ data, originalData, onReset }) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showEnhancementBadge, setShowEnhancementBadge] = useState(false);
  const { scrollToElement } = useSmooth();

  // Check if content was enhanced by AI
  useEffect(() => {
    if (originalData) {
      const bioEnhanced = data.bio !== originalData.bio;
      const projectsEnhanced = JSON.stringify(data.projects) !== JSON.stringify(originalData.projects);
      const hobbiesEnhanced = data.hobbies !== originalData.hobbies;
      setShowEnhancementBadge(bioEnhanced || projectsEnhanced || hobbiesEnhanced);
    }
  }, [data, originalData]);

  // Handle scroll events to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToElement(id);
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Start the download process
      await downloadPortfolio(data);

      toast({
        title: "Download Started",
        description: "Your portfolio files are being downloaded as a ZIP file.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error downloading portfolio:", error);
      toast({
        title: "Download Failed",
        description: "There was an error creating your portfolio files. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <nav className="sticky top-0 z-10 w-full backdrop-blur-sm bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">{data.name}</h2>
            {showEnhancementBadge && (
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                AI Enhanced
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onReset} size="sm">
              Edit
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Preparing...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download</span>
                </>
              )}
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="container mx-auto px-4 pb-2 hidden md:block">
          <ul className="flex gap-6 text-sm">
            <li>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, 'about')}
                className={`transition-colors ${activeTab === 'about'
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'}`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#skills"
                onClick={(e) => handleNavClick(e, 'skills')}
                className={`transition-colors ${activeTab === 'skills'
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'}`}
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#projects"
                onClick={(e) => handleNavClick(e, 'projects')}
                className={`transition-colors ${activeTab === 'projects'
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'}`}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#hobbies"
                onClick={(e) => handleNavClick(e, 'hobbies')}
                className={`transition-colors ${activeTab === 'hobbies'
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'}`}
              >
                Interests
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className={`transition-colors ${activeTab === 'contact'
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'}`}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden container mx-auto px-4 pb-2 animate-fade-in">
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className={`block py-2 px-3 rounded-md ${activeTab === 'about'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  onClick={(e) => handleNavClick(e, 'skills')}
                  className={`block py-2 px-3 rounded-md ${activeTab === 'skills'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => handleNavClick(e, 'projects')}
                  className={`block py-2 px-3 rounded-md ${activeTab === 'projects'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#hobbies"
                  onClick={(e) => handleNavClick(e, 'hobbies')}
                  className={`block py-2 px-3 rounded-md ${activeTab === 'hobbies'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  Interests
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className={`block py-2 px-3 rounded-md ${activeTab === 'contact'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-accent/5 py-24 px-4 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-60"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-3/5 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium mb-4">
                Professional Portfolio
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
                {data.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                {data.headline}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button
                  className="px-6 gap-2 bg-primary hover:bg-primary/90"
                  onClick={(e) => handleNavClick(e as any, 'contact')}
                >
                  Get in Touch
                  <span>→</span>
                </Button>
                <Button
                  variant="outline"
                  className="px-6 border-primary/20 text-primary hover:bg-primary/5"
                  onClick={(e) => handleNavClick(e as any, 'projects')}
                >
                  View Projects
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
                <div className="h-10 w-[3px] bg-primary/30 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Delivering innovative solutions for complex challenges</span>
              </div>
            </div>

            <div className="md:w-2/5 flex justify-center">
              <div className="w-64 h-64 rounded-lg bg-gradient-to-br from-background to-muted/50 flex items-center justify-center shadow-lg relative border border-border/50 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Professional</div>
                    <div className="text-sm text-muted-foreground">Developer & Designer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-md shadow-sm border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">{data.skills.length}+</div>
                <div className="text-xs text-muted-foreground">Skills</div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-md shadow-sm border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <div className="font-medium">{data.projects.length}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-md shadow-sm border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">Expert</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
            </div>
            <div className="bg-background p-4 rounded-md shadow-sm border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">Continuous</div>
                <div className="text-xs text-muted-foreground">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <h2 className="text-3xl font-bold text-center">About Me</h2>
            {showEnhancementBadge && originalData && data.bio !== originalData.bio && (
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                AI Enhanced
              </Badge>
            )}
          </div>

          <div className="md:flex md:items-start md:gap-12">
            <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
              <div className="w-48 h-48 rounded-md bg-gradient-to-br from-background to-muted/50 flex items-center justify-center shadow-md border border-border/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Professional Profile</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              {/* Bio paragraphs with cleaner design */}
              <div className="space-y-4">
                {data.bio.split('. ').reduce((acc: JSX.Element[], _sentence, index, array) => {
                  // Group sentences into paragraphs of 2-3 sentences
                  if (index % 2 === 0) {
                    const paragraph = array.slice(index, index + 2).join('. ') + (index + 2 < array.length ? '.' : '');
                    if (paragraph.trim()) {
                      acc.push(
                        <div key={index} className="bg-background p-4 rounded-md shadow-sm border border-border/50">
                          <p className="text-base leading-relaxed">{paragraph}</p>
                        </div>
                      );
                    }
                  }
                  return acc;
                }, [])}
              </div>

              {/* Key highlights/strengths section with more professional icons */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background p-4 rounded-md border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <h3 className="font-semibold">Innovation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Driving cutting-edge solutions for complex challenges</p>
                </div>
                <div className="bg-background p-4 rounded-md border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21 2v6h-6"></path>
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                        <path d="M3 22v-6h6"></path>
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold">Adaptability</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Thriving in dynamic environments with changing requirements</p>
                </div>
                <div className="bg-background p-4 rounded-md border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold">Collaboration</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Building impactful partnerships and effective teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Skills & Expertise</h2>

          {/* Skill categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  💻
                </div>
                <h3 className="text-lg font-semibold">Technical</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills
                  .filter(skill =>
                    ['javascript', 'python', 'react', 'node', 'typescript', 'java', 'c#', 'html', 'css', 'sql', 'mongodb', 'aws', 'docker'].some(
                      tech => skill.toLowerCase().includes(tech)
                    )
                  )
                  .map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm py-1.5 px-3 bg-primary/5 text-primary/90 hover:bg-primary/10 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))
                }
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  🧠
                </div>
                <h3 className="text-lg font-semibold">Domain Knowledge</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills
                  .filter(skill =>
                    ['ai', 'machine learning', 'data', 'analytics', 'nlp', 'cloud', 'devops', 'security', 'blockchain'].some(
                      domain => skill.toLowerCase().includes(domain)
                    )
                  )
                  .map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm py-1.5 px-3 bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))
                }
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  🤝
                </div>
                <h3 className="text-lg font-semibold">Soft Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills
                  .filter(skill =>
                    ['communication', 'leadership', 'teamwork', 'problem solving', 'agile', 'project', 'management', 'collaboration'].some(
                      soft => skill.toLowerCase().includes(soft)
                    )
                  )
                  .map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm py-1.5 px-3 bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Skill proficiency bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
            {data.skills.slice(0, 6).map((skill, index) => (
              <div key={index} className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">{skill}</span>
                  <span className="text-xs text-muted-foreground">
                    {['Expert', 'Advanced', 'Proficient', 'Intermediate', 'Skilled', 'Experienced'][index % 6]}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/60 h-2.5 rounded-full"
                    style={{ width: `${95 - (index * 7)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4 bg-gradient-to-tr from-background to-primary/5">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <h2 className="text-3xl font-bold text-center">Featured Work</h2>
            {showEnhancementBadge && originalData &&
              JSON.stringify(data.projects) !== JSON.stringify(originalData.projects) && (
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                AI Enhanced
              </Badge>
            )}
          </div>

          {/* Project filter tabs - decorative for now */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-muted/50 p-1 rounded-lg">
              <button className="px-4 py-2 rounded-md bg-background shadow-sm font-medium text-sm">All Projects</button>
              <button className="px-4 py-2 rounded-md text-muted-foreground font-medium text-sm">Web Development</button>
              <button className="px-4 py-2 rounded-md text-muted-foreground font-medium text-sm">AI Solutions</button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <Card
                key={index}
                className={`overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 ${
                  activeProject === index ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-primary/30'
                }`}
                onClick={() => setActiveProject(activeProject === index ? null : index)}
              >
                {/* Project header with visual element */}
                <div className="h-3 bg-gradient-to-r from-primary/80 to-primary/30"></div>

                <div className="p-6 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-lg">
                        {index === 0 ? '🏆' : index === 1 ? '💡' : index === 2 ? '🔍' : '🛠️'}
                      </div>
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                    </div>

                    {showEnhancementBadge && originalData &&
                      originalData.projects[index] &&
                      project.description !== originalData.projects[index].description && (
                      <Badge variant="outline" className="text-xs bg-primary/5 text-primary">
                        AI Enhanced
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4 bg-muted/20 p-4 rounded-lg">
                    {activeProject === index ? (
                      // Show full description with visual formatting when expanded
                      <div>
                        {project.description.split('. ').map((sentence, i) => (
                          <p key={i} className="mb-2 leading-relaxed">
                            {sentence.trim() + (i < project.description.split('. ').length - 1 ? '.' : '')}
                          </p>
                        ))}
                      </div>
                    ) : (
                      // Show truncated description when collapsed
                      <p className="text-muted-foreground leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.skillsUsed.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="outline"
                        className="text-xs bg-background border-primary/20 text-primary/80 hover:bg-primary/5 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        Demo
                      </button>
                      <button className="text-xs px-3 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                        Details
                      </button>
                    </div>
                    <p className="text-xs text-primary font-medium">
                      {activeProject === index ? 'Click to collapse' : 'Click to expand'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="py-16 px-4 bg-gradient-to-bl from-background to-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <h2 className="text-3xl font-bold text-center">Beyond the Keyboard</h2>
            {showEnhancementBadge && originalData && data.hobbies !== originalData.hobbies && (
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                AI Enhanced
              </Badge>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            {/* Left side - intro and quote */}
            <div className="md:w-1/3">
              <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
                <div className="max-w-2xl mb-6">
                  <p className="text-lg leading-relaxed">
                    When I'm not coding, I enjoy exploring my passions outside of technology:
                  </p>
                </div>

                <div className="relative mt-8 mb-4 px-6">
                  <div className="absolute top-0 left-0 text-5xl text-primary/20">"</div>
                  <p className="italic text-muted-foreground pl-4">
                    A balanced life fuels creativity and innovation in my professional work.
                  </p>
                  <div className="absolute bottom-0 right-0 text-5xl text-primary/20">"</div>
                </div>

                <div className="mt-8 bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">🔄</span> Work-Life Balance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    My diverse interests help me approach technical challenges with fresh perspectives and creative solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - hobby cards in grid */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.hobbies.split(',').map((hobby, index) => {
                  // Define icons for common hobbies
                  const getHobbyIcon = (hobby: string) => {
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

                  return (
                    <div
                      key={index}
                      className="bg-background rounded-lg p-5 shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all flex flex-col items-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-3">
                        <span className="text-2xl">{getHobbyIcon(hobby)}</span>
                      </div>
                      <span className="font-medium text-center">{hobby.trim()}</span>

                      {/* Small decorative element */}
                      <div className="w-8 h-1 bg-primary/20 rounded-full mt-3"></div>
                    </div>
                  );
                })}
              </div>

              {/* Activity level indicators */}
              <div className="mt-8 bg-background p-4 rounded-lg shadow-sm border border-border/50">
                <h3 className="font-medium mb-3 text-sm text-center">Activity Level</h3>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Reading</span>
                      <span className="text-primary">Frequent</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Travel</span>
                      <span className="text-primary">Occasional</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Music</span>
                      <span className="text-primary">Daily</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-gradient-to-t from-muted/20 to-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Let's Connect</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - contact cards */}
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">🔗</span>
                </div>
                Connect With Me
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="flex items-center p-4 hover:bg-primary/5 rounded-md transition-all border border-border/50 hover:border-primary/20 group"
                  >
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/15 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium block">Email</span>
                      <span className="text-sm text-muted-foreground block truncate">{data.email}</span>
                    </div>
                    <div className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </a>
                )}

                {data.linkedin && (
                  <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 hover:bg-primary/5 rounded-md transition-all border border-border/50 hover:border-primary/20 group"
                  >
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/15 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium block">LinkedIn</span>
                      <span className="text-sm text-muted-foreground">View Profile</span>
                    </div>
                    <div className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </a>
                )}

                {data.github && (
                  <a
                    href={data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 hover:bg-primary/5 rounded-md transition-all border border-border/50 hover:border-primary/20 group"
                  >
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/15 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium block">GitHub</span>
                      <span className="text-sm text-muted-foreground">View Projects</span>
                    </div>
                    <div className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-medium mb-3">Availability</h4>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Open to new opportunities</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  I'm currently available for freelance work, collaborations, and full-time positions.
                </p>
              </div>
            </div>

            {/* Right side - contact form mockup */}
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">✉️</span>
                </div>
                Send a Message
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                    placeholder="Enter your name"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Your Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                    placeholder="Enter your email"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 min-h-[120px]"
                    placeholder="Your message here..."
                    disabled
                  ></textarea>
                </div>

                <button
                  className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors cursor-not-allowed opacity-70"
                  disabled
                >
                  Send Message
                </button>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  This is a demo form. Please use the contact methods on the left to reach out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-4 bg-gradient-to-b from-background to-muted/30 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                {data.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {data.headline}
              </p>
              <div className="flex gap-3">
                {data.linkedin && (
                  <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                )}
                {data.github && (
                  <a
                    href={data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    title="GitHub Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                )}
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    title={data.email}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, 'about')}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Me
                  </a>
                </li>
                <li>
                  <a
                    href="#skills"
                    onClick={(e) => handleNavClick(e, 'skills')}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Skills & Expertise
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    onClick={(e) => handleNavClick(e, 'projects')}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Featured Work
                  </a>
                </li>
                <li>
                  <a
                    href="#hobbies"
                    onClick={(e) => handleNavClick(e, 'hobbies')}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Beyond the Keyboard
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Let's Connect
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Portfolio Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={onReset}
                >
                  <span className="text-lg">✏️</span> Edit Portfolio
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Preparing...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Download Files</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Created with PortfolioAI - © {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={scrollToTop}
              >
                Back to Top
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Terms of Use
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      {showBackToTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg animate-fade-in z-20"
          onClick={scrollToTop}
        >
          <ChevronUp size={20} />
        </Button>
      )}
    </div>
  );
};

export default PortfolioOutput;
