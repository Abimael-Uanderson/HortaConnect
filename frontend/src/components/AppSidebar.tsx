import {
  Sprout, LayoutDashboard, CalendarCheck, History, Bell, ShoppingCart, LogOut, User,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Meus Plantios", url: "/plantios", icon: Sprout },
  { title: "Agenda de Cuidados", url: "/agenda", icon: CalendarCheck },
  { title: "Histórico", url: "/historico", icon: History },
];

const infoItems = [
  { title: "Meu Perfil", url: "/perfil", icon: User },
  { title: "Alertas", url: "/alertas", icon: Bell },
  { title: "Cotação", url: "/cotacao", icon: ShoppingCart },
];

export function AppSidebar() {
  const { logout, usuario } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-5">
          <Sprout className="h-7 w-7 text-sidebar-primary" />
          <span className="font-display text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            HortaConnect
          </span>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Informações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-3 group-data-[collapsible=icon]:px-2">
          <p className="text-xs text-sidebar-foreground/70 truncate group-data-[collapsible=icon]:hidden">
            {usuario?.nome}
          </p>
          <button onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sair</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
