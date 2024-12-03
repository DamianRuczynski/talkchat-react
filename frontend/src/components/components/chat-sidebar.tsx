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
import { getOrCreateChat, getChats } from "@/services/chat.service";
import { TChat } from "@/types/chat.types";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "@/types/auth.types";

export function ChatSidebar() {
  const navigate = useNavigate();
  const { user, setUser, logoutUser } = useAuth();
  const [chats, setChats] = useState<TChat[] | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[]>([
    {
      _id: "674f009e80f444dcb4ea92cb",
      name: "Chatter",
      email: "chatter@email.com",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGYwMDllODBmNDQ0ZGNiNGVhOTJjYiIsImVtYWlsIjoiY2hhdHRlckBlbWFpbC5jb20iLCJuYW1lIjoiQ2hhdHRlciIsImlhdCI6MTczMzIzMDg2NiwiZXhwIjoxNzMzMjMyNjY2fQ.AoTfXhj9SVLjPHRjTSgeIFhx-htFd6PW9lxtTou9xe8",
    },
    {
      _id: "674f013980f444dcb4ea92d9",
      name: "Uczestnik",
      email: "uczestnik@email.com",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGYwMTM5ODBmNDQ0ZGNiNGVhOTJkOSIsImVtYWlsIjoidWN6ZXN0bmlrQGVtYWlsLmNvbSIsIm5hbWUiOiJVY3plc3RuaWsiLCJpYXQiOjE3MzMyMzA5MDUsImV4cCI6MTczMzIzMjcwNX0.ghjlxtq7nZ9F1MtgUks8mHYfgsgZCyrcGPouLsdHPvc",
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleActiveUserClick = async (activeUserId: string) => {
    if (!user) return;

    try {
      const chat = await getOrCreateChat(user._id, activeUserId);

      if (chat) {
        navigate(`/chat/${chat._id}`, {
          state: { chatId: chat._id },
        });
      }
    } catch (error) {
      console.error("Failed to create or get chat:", error);
    }
  };

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
      <SidebarContent className="flex flex-col h-full">
        <div className="flex flex-col flex-1 overflow-y-auto border-b">
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats?.map((chat) => (
                  <SidebarMenuItem key={chat._id}>
                    <SidebarMenuButton asChild>
                      {/* TODO ON DOUBLE CLICK RENAME CHAT AND UPDATE NAME IN DATABASE */}
                      <Link to={`/chat/${chat._id}`}>
                        {/* TODO load chat name as target user name in function */}
                        <span>{chat.participants[1].name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Active Users</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {activeUsers.map((activeUser) => (
                  // TODO LOAD ACTIVE USERS, IMPLEMENT METHOD ON BE
                  <SidebarMenuItem key={activeUser._id}>
                    {/* TODO generate chat on this click, or check if the chat does not exist then create new if exist link to the current chat with this user */}
                    <SidebarMenuButton
                      asChild
                      onClick={() => handleActiveUserClick(activeUser._id)}
                    >
                      <div className="flex items-center gap-3 cursor-pointer">
                        <Avatar>
                          <AvatarImage
                            src={activeUser?.name}
                            alt={activeUser?.name}
                          />
                          <AvatarFallback>
                            {activeUser?.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {activeUser?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {activeUser?.email}
                          </span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
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
