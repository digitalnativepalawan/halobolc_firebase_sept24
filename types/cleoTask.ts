// Project Cleo Task type for Home page
export interface CleoTask {
  id: string;
  name: string;
  date: string; // ISO string
  priority: 'Low' | 'Medium' | 'High';
  notes: string;
  image: string; // URL
  url: string;
}
