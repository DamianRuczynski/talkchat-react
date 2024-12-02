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
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export function ChatSidebar() {
  const navigate = useNavigate();
  const { user, setUser, logoutUser } = useAuth();
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
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.name} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logoutUser}
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
