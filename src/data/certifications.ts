export interface Certification {
  name: string;
  provider: string;
  color: 'blue' | 'green';
  link: string;
}

export const certifications: Certification[] = [
  { name: 'AI Ethics & Governance (Associate)', provider: 'Singapore Computer Society', color: 'blue', link: '#' },
  { name: 'Intermediate Data Visualization with Seaborn', provider: 'DataCamp', color: 'green', link: '#' },
  { name: 'Supervised Learning with scikit-learn', provider: 'DataCamp', color: 'green', link: '#' },
  { name: 'Introduction to Deep Learning with PyTorch', provider: 'DataCamp', color: 'green', link: '#' },
  { name: 'Introduction to Deep Learning with Keras', provider: 'DataCamp', color: 'green', link: '#' },
  { name: 'Generative AI Concepts', provider: 'DataCamp', color: 'green', link: '#' },
];
