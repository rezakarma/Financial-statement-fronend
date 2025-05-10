"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { isMenuGroup, MenuItemType } from "@/types/sidebar.type";
import {
  BriefcaseMedical,
  Calendar,
  CalendarPlus,
  ChartNoAxesColumn,
  ChevronDown,
  Contact,
  Home,
  Hospital,
  Inbox,
  LayoutDashboard,
  Pill,
  Search,
  Settings,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { usePathname } from "next/navigation";
import { Card } from "../ui/card";
import { isActive } from "@/utils/sidebarActive";

// const items = [
//   {
//     title: "Home",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Inbox",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ];

const items: MenuItemType[] = [
  {
    type: "GROUP",
    items: [
      {
        title: "داشبورد",
        icon: LayoutDashboard,
        url: "/admin",
      },
    ],
  },
  {
    separator: true,
  },
  {
    title: "مطب",
    type: "GROUP",
    items: [
      {
        title: "نوبت دهی",
        icon: CalendarPlus,
        url: "/admin/reserve",
      },
      {
        title: "بیماران",
        icon: User,
        url: "/admin/patients",
      },
      {
        title: "کارکنان",
        icon: Contact,
        url: "/admin/staff",
        items: [
          {
            title: "دکتر ها",
            icon: Stethoscope,
            url: "/admin/staff/doctors",
          },
          {
            title: "پرسنل",
            icon: Users,
            url: "/admin/staff/personnels",
          },
        ],
      },
    ],
  },
  {
    separator: true,
  },
  {
    title: "حسابداری",
    type: "GROUP",
    items: [
      {
        title: "ویزیت ها",
        icon: ChartNoAxesColumn,
        url: "/admin/visits",
      },
      {
        title: "تنظیمات",
        icon: Settings,
        url: "/admin/setting",
        items: [
          {
            title: "دارو ها",
            icon: Pill,
            url: "/admin/setting/medicines",
          },
        ],
      },
      {
        title: "خروج",
        icon: Contact,
        url: "/admin/logout",
      },
    ],
  },
];

export function AppSidebar() {
  const currentPath = usePathname();

  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar side="right" collapsible="icon" className="text-2xl">
      {/* <SidebarHeader className={state === "collapsed" ? "hidden" : ""}>
        <SidebarMenu>
          <SidebarMenuItem className="h-full text-right mt-2">
            <div className="text-3xl font-bold flex items-center gap-2">
              <BriefcaseMedical size={40} />
              <h2>مدیریت کلینیک</h2>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="h-full text-right">
            <Card className="text-xl py-3 flex px-2 items-center gap-2 mt-8">
              <Hospital size={30} />
              <h2>مطب دکتر فخر موسوی</h2>
            </Card>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent className="overflow-hidden overflow-y-auto">
        {items.map((item, i) => {
          if (isMenuGroup(item)) {
            return (
              <SidebarGroup key={i}>
                {item.title && (
                  <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem, i) => {
                      if (subItem.items) {
                        const isActiveItem = isActive(currentPath, subItem.url);

                        return (
                          <Collapsible
                            key={i}
                            defaultOpen
                            className="group/collapsible"
                          >
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  className={`text-xl flex justify-between ${
                                    isActiveItem ? "!text-white !bg-black" : ""
                                  }`}
                                  isActive={isActiveItem}
                                >
                                  <Link
                                    href={subItem.url}
                                    className={"text-xl flex gap-2"}
                                  >
                                    {subItem.icon && (
                                      <subItem.icon
                                        size={100}
                                        className="!w-[25px] !h-[25px]"
                                      />
                                    )}
                                    <span>{subItem.title}</span>
                                  </Link>
                                  <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub className="!border-l-0 !border-r-1">
                                  {subItem.items.map((subMenuItem, i) => {
                                    const isActiveSubMenuItem = isActive(
                                      currentPath,
                                      subMenuItem.url
                                    );
                                    return (
                                      <SidebarMenuSubItem key={i}>
                                        <SidebarMenuButton
                                          className={
                                            isActiveSubMenuItem
                                              ? "text-lg !text-white !bg-black"
                                              : "text-lg"
                                          }
                                          asChild
                                          isActive={isActiveSubMenuItem}
                                        >
                                          <Link
                                            className="ss"
                                            href={subMenuItem.url}
                                          >
                                            {subMenuItem.icon && (
                                              <subMenuItem.icon className="!w-[20px] !h-[20px]" />
                                            )}

                                            <span>{subMenuItem.title}</span>
                                          </Link>
                                        </SidebarMenuButton>
                                      </SidebarMenuSubItem>
                                    );
                                  })}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        );
                      } else {
                        const isActiveSubItem = isActive(
                          currentPath,
                          subItem.url
                        );
                        return (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton
                              className={`${
                                isActiveSubItem
                                  ? "text-xl !bg-black !text-white"
                                  : "text-xl"
                              }`}
                              asChild
                              isActive={isActiveSubItem}
                            >
                              <Link href={subItem.url} className="text-xl">
                                {subItem.icon && (
                                  <subItem.icon
                                    size={100}
                                    className="!w-[25px] !h-[25px]"
                                  />
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      }
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          } else if (item.separator) {
            return <SidebarSeparator key={i} />;
          }
        })}
      </SidebarContent>
    </Sidebar>
  );
}
