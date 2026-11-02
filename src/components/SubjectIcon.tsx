import {
  Atom, BookOpen, Briefcase, Calculator, Cpu, Dna, FlaskConical, Globe, Landmark, Languages, Scale, Sigma, TrendingUp,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  atom: Atom,
  book: BookOpen,
  briefcase: Briefcase,
  calculator: Calculator,
  cpu: Cpu,
  dna: Dna,
  flask: FlaskConical,
  globe: Globe,
  landmark: Landmark,
  languages: Languages,
  scale: Scale,
  sigma: Sigma,
  trending: TrendingUp,
};

export default function SubjectIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} />;
}
