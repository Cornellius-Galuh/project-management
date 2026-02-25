"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  ListCollapse,
  Mail,
  PieChart,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavLinks } from "./nav-links"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  dashboard:[
    {
      name:"Dashboard",
      url:"#",
      icon: LayoutDashboard
    }
  ],

  projects: [
    {
      name: "Project",
      url: "/projects",
      icon: ListCollapse,
    },
    {
      name: "Jobs",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Invitations",
      url: "#",
      icon: Mail,
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
  } | null
}

export function AppSidebar({ user,...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks title="Dashboard" links={data.dashboard}/>
        <NavLinks title="Project" links={data.projects}/>
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user}/>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
