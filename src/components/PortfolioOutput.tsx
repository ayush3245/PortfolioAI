
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';

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
  onReset: () => void;
}

const PortfolioOutput: React.FC<PortfolioOutputProps> = ({ data, onReset }) => {
  const [activeProject, setActiveProject] = React.useState<number | null>(null);
  
  const handleDownload = () => {
    alert('Portfolio download feature will be implemented in the next version!');
  };
  
  return (
    <div className="w-full animate-fade-in">
      <nav className="sticky top-0 z-10 w-full backdrop-blur-sm bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">{data.name}</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onReset} size="sm">
              Edit
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              <span>Download</span>
            </Button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pb-2">
          <ul className="flex gap-6 text-sm">
            <li>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            </li>
            <li>
              <a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">Skills</a>
            </li>
            <li>
              <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
            </li>
            <li>
              <a href="#hobbies" className="text-muted-foreground hover:text-foreground transition-colors">Interests</a>
            </li>
            <li>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient">
            {data.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {data.headline}
          </p>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <div className="md:flex md:items-start md:gap-8">
            <div className="hidden md:block md:w-1/4 mb-6 md:mb-0">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                <span className="text-5xl">👋</span>
              </div>
            </div>
            <div className="md:w-3/4">
              <p className="text-lg leading-relaxed mb-6">
                {data.bio}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1.5 px-4">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Work</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <Card 
                key={index} 
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${activeProject === index ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/30'}`}
                onClick={() => setActiveProject(activeProject === index ? null : index)}
              >
                <div className="p-6 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  
                  <p className={`text-muted-foreground leading-relaxed mb-4 ${activeProject !== index && 'line-clamp-2'}`}>
                    {project.description}
                  </p>
                  
                  <div className={`flex flex-wrap gap-2 ${activeProject !== index && 'mt-2'}`}>
                    {project.skillsUsed.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-xs text-primary mt-4 font-medium">
                    {activeProject === index ? 'Click to collapse' : 'Click to expand'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Hobbies Section */}
      <section id="hobbies" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Beyond the Keyboard</h2>
          <div className="text-center">
            <p className="text-lg">{data.hobbies}</p>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {data.email && (
              <a 
                href={`mailto:${data.email}`}
                className="flex flex-col items-center p-4 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl">📧</span>
                </div>
                <span className="font-medium">Email</span>
                <span className="text-sm text-muted-foreground">{data.email}</span>
              </a>
            )}
            
            {data.linkedin && (
              <a 
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl">👔</span>
                </div>
                <span className="font-medium">LinkedIn</span>
                <span className="text-sm text-muted-foreground">View Profile</span>
              </a>
            )}
            
            {data.github && (
              <a 
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl">💻</span>
                </div>
                <span className="font-medium">GitHub</span>
                <span className="text-sm text-muted-foreground">View Projects</span>
              </a>
            )}
          </div>
        </div>
      </section>
      
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Created with PortfolioAI - © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioOutput;
