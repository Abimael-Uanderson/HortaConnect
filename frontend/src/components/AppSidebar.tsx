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
  { title: "Alertas", url: "/alertas", icon: Bell },
  { title: "Cotação", url: "/cotacao", icon: ShoppingCart },
  { title: "Meu Perfil", url: "/perfil", icon: User },
];

export function AppSidebar() {
  const { logout, usuario } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-[image:var(--gradient-sidebar)]">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary/20">
            <Sprout className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="font-display text-lg font-bold text-sidebar-foreground tracking-tight">
              HortaConnect
            </span>
            <p className="text-[10px] text-sidebar-foreground/50 -mt-0.5">Gestão Inteligente</p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest font-semibold">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
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
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest font-semibold">Informações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
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

      <SidebarFooter className="bg-[image:var(--gradient-sidebar)]">
        <div className="px-4 py-4 group-data-[collapsible=icon]:px-2">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary text-xs font-bold flex-shrink-0">
              {usuario?.nome?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="group-data-[collapsible=icon]:hidden min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{usuario?.nome}</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">{usuario?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200">
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sair</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
