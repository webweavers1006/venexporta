import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@src/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@src/components/ui/sidebar"
import { Link } from "react-router";

export function NavMain({
  items
}) {
  // Filtra items y subitems por la bandera `isActive`.
  const visibleItems = (items || []).filter(item => item?.isActive !== false);

  return (
    (<SidebarGroup>
      <SidebarGroupLabel>Modulos</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => (
          <Collapsible key={item.title} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <CollapsibleTrigger asChild>
                  <Link to={item.url}>
                    {item.icon && <item.icon color={item.color} />}
                    <span>{item.title} <span>{item.badge && <Badge className="bg-[#2c04494f] text-primary">{item.badge}</Badge>}</span></span>
                  </Link>
                </CollapsibleTrigger>
              </SidebarMenuButton>
              { (item.items || []).filter(si => si?.isActive !== false).length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.filter(si => si?.isActive !== false).map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              {subItem.icon && <subItem.icon color={subItem.color}/>}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>)
  );
}
