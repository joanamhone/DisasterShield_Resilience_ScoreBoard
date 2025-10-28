/// <reference types="vite/client" />

// jsPDF autotable type declarations
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}