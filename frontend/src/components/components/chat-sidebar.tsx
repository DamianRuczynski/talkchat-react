import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth.context";
import { getChats } from "@/services/chat.service";
import { TChat } from "@/types/chat.types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ChatSidebar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [chats, setChats] = useState<TChat[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const storedUser =
          user || JSON.parse(localStorage.getItem("User") || "null");

        if (!storedUser) {
          throw new Error("User not logged in");
        }

        if (!user && storedUser) {
          setUser(storedUser);
        }

        const data = await getChats(storedUser._id);
        setChats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load chats");
        localStorage.removeItem("User");
        navigate("/login", {
          state: { error: "Session expired. Please log in again." },
        });
      }
    };

    fetchChats();
  }, [user, navigate, setUser]);

  if (error) {
    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Error</SidebarGroupLabel>
            <SidebarGroupContent>
              <p>{error}</p>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats?.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/chat/${user?._id}/${chat._id}`}>
                      <span>{chat.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
