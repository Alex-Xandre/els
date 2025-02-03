import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isDropdown?: boolean;
    isActive?: boolean;
    id?: string;
    items?: {
      title: string;
      url: string;
      _id?: string;
    }[];
  }[];
}) {
  const navigate = useNavigate();

  const item = useLocation();

  const searchParams = new URLSearchParams(item.search);

  const myParamValue = searchParams.get('');

  useEffect(() => {
    console.log(item, myParamValue);
    if (item ) {
      if (item.pathname.includes('new') || item.pathname.includes('moduleId')  ) {
        return;
      } else {
        document.getElementById('modules')?.click();
      }
    }
  }, [item.search]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item?.isDropdown) {
            return (
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className='group/collapsible'
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    id={item?.id}
                  >
                    {item.icon && <item.icon />}
                    <span onClick={() => navigate(item.url)}>{item.title}</span>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={`${myParamValue && myParamValue === subItem?._id ? 'bg-gray-100' : ''} `}
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
