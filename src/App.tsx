
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useStore } from './hooks/useEvents';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminArchive from './pages/Admin/Archive';
import AdminEventForm from './pages/Admin/EventForm';
import AdminEventDetails from './pages/Admin/EventDetails';
import PublicEventList from './pages/Public/EventList';
import PublicEventRegistration from './pages/Public/EventRegistration';
import CheckinPage from './pages/Public/Checkin';

const App: React.FC = () => {
  const store = useStore();

  // ✅ CRITICAL: Wait for auth to be ready before rendering routes
  if (!store.authReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
        <div className="text-center">
          <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">Inicializando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header isAdmin={store.isAdmin} onLogout={store.logout} />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicEventList eventos={store.eventos} />} />
            <Route
              path="/evento/:id"
              element={<PublicEventRegistration eventos={store.eventos} onRegister={store.registrarInscrito} />}
            />
            <Route
              path="/checkin"
              element={<CheckinPage validateCheckin={store.validateCheckin} />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin/login"
              element={store.isAdmin ? <Navigate to="/admin" /> : <AdminLogin onLogin={store.login} />}
            />

            <Route
              path="/admin"
              element={store.isAdmin ? <AdminDashboard eventos={store.eventos} /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="/admin/arquivo"
              element={store.isAdmin ? <AdminArchive eventos={store.eventos} /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="/admin/novo"
              element={store.isAdmin ? <AdminEventForm onSave={store.addEvento} onUpload={store.uploadImage} /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="/admin/evento/:id"
              element={store.isAdmin ? <AdminEventDetails eventos={store.eventos} onEnd={store.encerrarEvento} onDelete={store.deleteEvento} /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="/admin/evento/:id/editar"
              element={store.isAdmin ? <AdminEventEditWrapper eventos={store.eventos} onSave={store.updateEvento} onUpload={store.uploadImage} /> : <Navigate to="/admin/login" />}
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

const AdminEventEditWrapper: React.FC<{ eventos: any[], onSave: (evento: any) => void, onUpload: (file: File) => Promise<string> }> = ({ eventos, onSave, onUpload }) => {
  const { id } = useParams<{ id: string }>();
  const evento = eventos.find(e => e.id === id);

  if (!evento) return <div className="text-center py-20 font-bold text-gray-400">Evento não localizado.</div>;

  return <AdminEventForm onSave={onSave} onUpload={onUpload} initialData={evento} />;
};

export default App;
