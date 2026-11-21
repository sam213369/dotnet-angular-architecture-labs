import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Role = 'viewer' | 'admin';

interface Experience {
  role: string;
  company: string;
  period: string;
  summary: string;
  bullets: string[];
  accent: string;
}

interface PortfolioItem {
  category: string;
  title: string;
  description: string;
  image: string;
  accent: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  role: Role = 'admin';
  saved = false;

  hero = {
    name: 'Samiran Chandra',
    headline: 'Project Manager',
    subtitle: 'I turn complexity into clear, thoughtful delivery.',
    intro: 'An empathetic leader using rational thinking to build aligned teams and scalable solutions.',
    photo: 'assets/samiran-chandra.jpg',
    resume: 'Resume',
    hire: 'Get in touch'
  };

  about = [
    "Hello, I'm Simron, but you can call me Simmi! I'm a project manager who loves organizing chaos and turning big, messy ideas into things that actually ship.",
    "I believe project management is happening around us all the time. Planning a trip, making dinner, or fixing a house all involve requirements, stakeholders, budgets, and follow-through.",
    "Outside of work, I plan trips with spreadsheets, host quarterly Zumba classes, foster kittens, and am learning CAD with a 3D printer."
  ];

  experiences: Experience[] = [
    {
      role: 'Marketplace Implementation Manager',
      company: 'Commerce',
      period: 'Mar 2026 — Present',
      summary: 'Implementation lead for scalable marketplace and technical solutions.',
      bullets: [
        'Translate complex client requirements into actionable technical roadmaps',
        'Align product and engineering teams through clear meeting insights',
        'Use SQL and HTML to remove blockers and optimize merchant experiences'
      ],
      accent: '#c8c1ac'
    },
    {
      role: 'Project Manager & Senior Associate Manager',
      company: 'Bazaarvoice',
      period: 'Mar 2022 — Mar 2025',
      summary: 'Delivered ratings and reviews integrations for global commerce brands.',
      bullets: [
        'Managed clients including Target, Michael Kors, and P&G',
        'Built scalable onboarding processes across international teams',
        'Reduced production errors and costs while contributing ~$2M in revenue'
      ],
      accent: '#dcb4a7'
    },
    {
      role: 'Project Manager',
      company: 'TransPerfect',
      period: 'Jul 2021 — Oct 2021',
      summary: 'Managed translation project resources, scope, budget, and delivery.',
      bullets: [
        'Led international vendor communication across time zones',
        'Reduced production errors by 20%, lead times by 15%, and costs by 38%'
      ],
      accent: '#aeb9ac'
    }
  ];

  portfolio: PortfolioItem[] = [
    {
      category: 'Strategy',
      title: 'UGC & Ratings at Scale',
      description: 'Implemented Bazaarvoice tools for global brands, connecting UGC with measurable sales growth.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
      accent: '#d5cbbb'
    },
    {
      category: 'Agile / UX',
      title: 'Salon Website Redesign',
      description: 'Partnered with developers and local stakeholders to turn customer research into a clearer service website.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
      accent: '#d8ad9c'
    },
    {
      category: 'Customer Research',
      title: 'Restaurant Journey Analysis',
      description: 'Analyzed menu discovery, ordering, and confirmation flows to identify practical friction points.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85',
      accent: '#aab7a4'
    }
  ];

  certifications = [
    { title: 'Google Project Management', provider: 'Coursera', date: 'Jan 2022', description: 'Initiating, planning, executing, and applying Agile in real-world projects.' },
    { title: 'Google Cloud — Gen AI Beyond the Chatbot', provider: 'Coursera', date: '2024', description: 'Foundation models, prompt engineering, and practical AI strategy.' },
    { title: 'IBM — Introduction to Project Management', provider: 'Coursera', date: '2022', description: 'Project methods, scope, scheduling, budgeting, risks, and stakeholders.' }
  ];

  skills = [
    'Project Planning', 'Agile', 'Risk Management', 'SQL', 'JIRA', 'Confluence',
    'Stakeholder Management', 'Slack', 'Figma', 'Budgeting', 'Microsoft 365', 'Google Workspace'
  ];

  education = [
    { degree: 'Bachelor of Information Systems', school: 'Illinois State University', period: '2017 — 2021' },
    { degree: 'High School Diploma', school: 'Warren Township High School', period: '2013 — 2017' }
  ];

  references = [
    { name: 'Tonya Pierce', role: 'IT Professional', quote: 'Competent and organized, with a positive attitude and sense of humor that made her popular with customers and colleagues.' },
    { name: 'Abdelmounaam Rezgui, PhD', role: 'IT Professional', quote: 'Her passion and communication immediately made her a valuable member of the group.' }
  ];

  articles = [
    { title: '7 Responsibilities of Project Managers that Impact the Business', url: 'https://medium.com/@simron.dhali.singh' },
    { title: 'Overseeing the 5 Phases of the Project Life Cycle', url: 'https://medium.com/@simron.dhali.singh' }
  ];

  contact = {
    email: 'simron.dhali.singh@gmail.com',
    linkedin: 'linkedin.com/in/simron-dhali',
    location: 'Austin, Texas'
  };

  constructor(private http: HttpClient) {
    this.http.get<Record<string, unknown>>('assets/portfolio.json').subscribe({
      next: (content) => Object.assign(this, content),
      error: () => {}
    });
    this.role = (localStorage.getItem('portfolio-role') as Role) || 'admin';
  }

  ngOnInit(): void {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }

  setRole(role: Role): void {
    this.role = role;
    localStorage.setItem('portfolio-role', role);
  }

  save(): void {
    const state = {
      hero: this.hero, about: this.about, experiences: this.experiences,
      portfolio: this.portfolio, certifications: this.certifications, skills: this.skills,
      education: this.education, references: this.references, articles: this.articles,
      contact: this.contact
    };
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.json';
    link.click();
    URL.revokeObjectURL(url);
    this.saved = true;
    window.setTimeout(() => this.saved = false, 1800);
  }

  reset(): void {
    window.location.reload();
  }

  addExperience(): void {
    this.experiences.push({
      role: 'New role', company: 'Company', period: 'Year — Present',
      summary: 'Describe your contribution.', bullets: ['Add a key responsibility'], accent: '#c8c1ac'
    });
  }

  addPortfolio(): void {
    this.portfolio.push({
      category: 'Category', title: 'New project',
      description: 'Describe the work and its impact.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
      accent: '#d5cbbb'
    });
  }

  addSkill(): void {
    this.skills.push('New skill');
  }

  changePhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.hero.photo = String(reader.result);
    };
    reader.readAsDataURL(file);
  }
}
