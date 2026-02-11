import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import Dashboard from "@/pages/Dashboard";
import Plantios from "@/pages/Plantios";
import Agenda from "@/pages/Agenda";
import Historico from "@/pages/Historico";
import Alertas from "@/pages/Alertas";
import Cotacao from "@/pages/Cotacao";
import NotFound from "@/pages/NotFound";
import Perfil from "@/pages/Perfil";
import RecuperarSenha from "@/pages/RecuperarSenha";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="plantios" element={<Plantios />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="historico" element={<Historico />} />
              <Route path="alertas" element={<Alertas />} />
              <Route path="cotacao" element={<Cotacao />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
