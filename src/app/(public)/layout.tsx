import { Navbar } from '@/components/landing/Navbar';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </SmoothScrollProvider>
  );
}
