import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Rapid Lightning',
  description: 'Fresh from the Ranch Road',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}