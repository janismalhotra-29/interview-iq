export interface ParsedResume {
  rawText: string;
  detectedName?: string;
  detectedEmail?: string;
  detectedRole?: string;
  extractedSkills: string[];
  extractedProjects: string[];
  experienceYearsEstimate?: string;
  summary: string;
}

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular',
  'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot',
  'C++', 'C#', '.NET', 'Go', 'Rust', 'Ruby', 'PHP',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'GraphQL', 'REST API', 'gRPC', 'Microservices', 'System Design',
  'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'Transformers', 'LangChain',
  'Git', 'Linux', 'Agile', 'Jira'
];

export function parseResumeContent(text: string): ParsedResume {
  const clean = text.replace(/\r\n/g, '\n');
  const lower = clean.toLowerCase();

  // Extract skills
  const extractedSkills: string[] = [];
  for (const skill of COMMON_SKILLS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(clean)) {
      extractedSkills.push(skill);
    }
  }

  // Extract email
  const emailMatch = clean.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const detectedEmail = emailMatch ? emailMatch[0] : undefined;

  // Extract projects - look for lines starting with Project or bullet points with links/verbs
  const projectMatches: string[] = [];
  const lines = clean.split('\n');
  let capturingProject = false;
  let currentProject = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(project|key projects|featured projects|portfolio)/i.test(trimmed)) {
      capturingProject = true;
      continue;
    }
    if (capturingProject) {
      if (/^(education|experience|work history|skills|certifications)/i.test(trimmed)) {
        capturingProject = false;
      } else if (trimmed.length > 10) {
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
          if (currentProject) projectMatches.push(currentProject);
          currentProject = trimmed.replace(/^[-•*]\s*/, '');
        } else {
          currentProject += ' ' + trimmed;
        }
      }
    }
  }
  if (currentProject) projectMatches.push(currentProject);

  // Experience estimate
  let experienceYearsEstimate = '1-3 years';
  if (/(\d+)\+?\s*years?\s*(of)?\s*experience/i.test(clean)) {
    const match = clean.match(/(\d+)\+?\s*years?\s*(of)?\s*experience/i);
    if (match) {
      experienceYearsEstimate = `${match[1]}+ years`;
    }
  } else if (/senior|lead|architect|staff/i.test(clean)) {
    experienceYearsEstimate = '5+ years (Senior)';
  }

  // Role estimate
  let detectedRole = 'Software Developer';
  if (/machine learning|deep learning|data scientist|ai engineer/i.test(clean)) {
    detectedRole = 'AI/ML Engineer';
  } else if (/frontend|react|ui\/ux|css|nextjs/i.test(clean) && !/backend|microservices|distributed/i.test(clean)) {
    detectedRole = 'Frontend Developer';
  } else if (/backend|distributed|postgresql|microservices|database/i.test(clean) && !/react|frontend/i.test(clean)) {
    detectedRole = 'Backend Developer';
  } else if (/full stack|fullstack/i.test(clean) || (extractedSkills.includes('React') && extractedSkills.includes('Node.js'))) {
    detectedRole = 'Full Stack Developer';
  }

  return {
    rawText: clean,
    detectedEmail,
    detectedRole,
    extractedSkills: extractedSkills.length > 0 ? extractedSkills : ['JavaScript', 'React', 'Problem Solving'],
    extractedProjects: projectMatches.slice(0, 3),
    experienceYearsEstimate,
    summary: `Candidate profile identified with ${extractedSkills.length} key competencies including ${extractedSkills.slice(0, 4).join(', ')}. Experience estimate: ${experienceYearsEstimate}.`
  };
}
