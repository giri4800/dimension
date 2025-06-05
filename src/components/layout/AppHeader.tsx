import { Ruler } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Ruler size={32} />
          <h1 className="text-2xl font-headline font-semibold">Dimension Detective</h1>
        </div>
      </div>
    </header>
  );
}
