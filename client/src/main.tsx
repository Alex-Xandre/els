import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './stores/AuthContext';
import { SidebarProvider } from './components/ui/sidebar';
import { CourseContextProvider } from './stores/CourseContext';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <CourseContextProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </CourseContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
