import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';

interface FormData {
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

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData | null;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    headline: '',
    bio: '',
    skills: [],
    projects: [
      {
        title: '',
        description: '',
        skillsUsed: []
      }
    ],
    hobbies: '',
    email: '',
    linkedin: '',
    github: ''
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [projectSkillInput, setProjectSkillInput] = useState('');
  
  // Initialize form with existing data if available
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [name]: value
    };
    
    setFormData(prev => ({
      ...prev,
      projects: updatedProjects
    }));
  };
  
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const addProjectSkill = (projectIndex: number) => {
    if (projectSkillInput.trim()) {
      const updatedProjects = [...formData.projects];
      if (!updatedProjects[projectIndex].skillsUsed.includes(projectSkillInput.trim())) {
        updatedProjects[projectIndex].skillsUsed.push(projectSkillInput.trim());
        setFormData(prev => ({
          ...prev,
          projects: updatedProjects
        }));
      }
      setProjectSkillInput('');
    }
  };
  
  const removeProjectSkill = (projectIndex: number, skillToRemove: string) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[projectIndex].skillsUsed = updatedProjects[projectIndex].skillsUsed.filter(
      skill => skill !== skillToRemove
    );
    setFormData(prev => ({
      ...prev,
      projects: updatedProjects
    }));
  };
  
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: '',
          description: '',
          skillsUsed: []
        }
      ]
    }));
  };
  
  const removeProject = (indexToRemove: number) => {
    if (formData.projects.length > 1) {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, index) => index !== indexToRemove)
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-xl shadow-lg border-primary/10 hover:border-primary/20 transition-all duration-300 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-xl">
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Your Portfolio Details</CardTitle>
        <CardDescription className="text-base">
          Fill in the information below to generate your professional portfolio
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">1</span>
              Personal Information
            </h3>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="headline">Headline/Tagline</Label>
                <Input 
                  id="headline" 
                  name="headline"
                  placeholder="Full-Stack Developer | AI Enthusiast | Creative Problem Solver"
                  value={formData.headline}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Your Story (Brief Bio)</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  placeholder="I'm a passionate developer with 5 years of experience..."
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-y"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Key Skills</Label>
                <div className="flex gap-2">
                  <Input 
                    id="skills" 
                    placeholder="JavaScript"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button 
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm flex items-center gap-1 group"
                    >
                      {skill}
                      <span 
                        className="cursor-pointer rounded-full hover:bg-background/20 p-0.5 transition-colors"
                        onClick={() => removeSkill(skill)}
                      >
                        ×
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">2</span>
                Showcase Your Work
              </h3>
              <Button 
                type="button" 
                variant="ghost"
                size="sm"
                onClick={addProject}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                + Add Project
              </Button>
            </div>
            
            {formData.projects.map((project, projectIndex) => (
              <Card key={projectIndex} className="bg-muted/30 p-4 border border-border hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Project {projectIndex + 1}</h4>
                  {formData.projects.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(projectIndex)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 px-2"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`project-title-${projectIndex}`}>Project/Experience Title</Label>
                    <Input
                      id={`project-title-${projectIndex}`}
                      name="title"
                      placeholder="E-commerce Website Redesign"
                      value={project.title}
                      onChange={(e) => handleProjectChange(e, projectIndex)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`project-description-${projectIndex}`}>Brief Project Description</Label>
                    <Textarea
                      id={`project-description-${projectIndex}`}
                      name="description"
                      placeholder="Led the redesign of the company's e-commerce platform..."
                      value={project.description}
                      onChange={(e) => handleProjectChange(e, projectIndex)}
                      required
                      rows={3}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-y"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`project-skills-${projectIndex}`}>Skills Used/Learned</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`project-skills-${projectIndex}`}
                        placeholder="React"
                        value={projectSkillInput}
                        onChange={(e) => setProjectSkillInput(e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addProjectSkill(projectIndex);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addProjectSkill(projectIndex)}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.skillsUsed.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="outline"
                          className="px-3 py-1 text-sm flex items-center gap-1"
                        >
                          {skill}
                          <span
                            className="cursor-pointer rounded-full hover:bg-muted/80 p-0.5 transition-colors"
                            onClick={() => removeProjectSkill(projectIndex, skill)}
                          >
                            ×
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">3</span>
              Additional Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies & Interests</Label>
              <Textarea
                id="hobbies"
                name="hobbies"
                placeholder="Photography, hiking, reading sci-fi novels..."
                value={formData.hobbies}
                onChange={handleChange}
                rows={2}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-y"
              />
            </div>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">4</span>
              Contact Information
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="github">GitHub/Other Portfolio Link</Label>
                <Input
                  id="github"
                  name="github"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.github}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              type="submit" 
              size="lg" 
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-4 font-medium bg-gradient-to-r from-primary to-primary/80 px-8 py-6"
            >
              Generate My Portfolio
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
