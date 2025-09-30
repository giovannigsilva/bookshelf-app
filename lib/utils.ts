import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ReadingStatus } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitário para mapear status a estilos de Badge
export function getStatusVariant(status: ReadingStatus): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case ReadingStatus.LIDO: return 'default';
    case ReadingStatus.LENDO: return 'secondary';
    case ReadingStatus.QUERO_LER: return 'outline';
    default: return 'secondary';
  }
}