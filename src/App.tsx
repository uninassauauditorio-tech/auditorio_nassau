
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

const App: React.FC = () => {
  const store = useStore();

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-secondary">
        <Header isAdmin={store.isAdmin} onLogout={store.logout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicEventList eventos={store.eventos} />} />
            <Route
              path="/evento/:id"
              element={<PublicEventRegistration eventos={store.eventos} onRegister={store.registrarInscrito} />}
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
              element={store.isAdmin ? <AdminEventForm onSave={store.addEvento} /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="/admin/evento/:id"
              element={store.isAdmin ? <AdminEventDetails eventos={store.eventos} onEnd={store.encerrarEvento} /> : <Navigate to="/admin/login" />}
            />

            <Route
              path="/admin/evento/:id/editar"
              element={store.isAdmin ? <AdminEventEditWrapper eventos={store.eventos} onSave={store.updateEvento} /> : <Navigate to="/admin/login" />}
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

const AdminEventEditWrapper: React.FC<{ eventos: any[], onSave: (evento: any) => void }> = ({ eventos, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const evento = eventos.find(e => e.id === id);

  if (!evento) return <div className="text-center py-20 font-bold text-gray-400">Evento não localizado.</div>;

  return <AdminEventForm onSave={onSave} initialData={evento} />;
};

export default App;
