import { create } from 'zustand';

export const useSideBarStore = create((set) => ({
  isOpen: false,
  isClientSidebarOpen: false,
  
  // Toggle both sidebars together on mobile
  toggle: () => set((state) => ({ 
    isOpen: !state.isOpen,
    isClientSidebarOpen: !state.isOpen // Toggle client sidebar with left sidebar
  })),
  
  // Close both sidebars
  closeAll: () => set({ 
    isOpen: false, 
    isClientSidebarOpen: false 
  }),
  
  // Individual controls (if needed)
  toggleClientSidebar: () => set((state) => ({ 
    isClientSidebarOpen: !state.isClientSidebarOpen 
  })),
  closeClientSidebar: () => set({ isClientSidebarOpen: false }),
}));