"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type HeaderAuthProps = {
  className?: string;
  /** Compact row for course headers */
  variant?: "default" | "compact";
};

type DummyNotification = {
  id: string;
  title: string;
  content: string;
  read: boolean;
  at: string;
};

const DUMMY_NOTIFICATIONS: DummyNotification[] = [
  {
    id: "1",
    title: "New lesson available",
    content:
      "The “React Hooks in depth” lesson was added to your enrolled course.",
    read: false,
    at: "2025-03-25T14:30:00",
  },
  {
    id: "2",
    title: "Weekly streak",
    content: "You’re on a 5-day learning streak. Keep it going tomorrow!",
    read: false,
    at: "2025-03-24T09:15:00",
  },
  {
    id: "3",
    title: "Course update",
    content: "TypeScript Fundamentals now includes a new quiz in module 2.",
    read: true,
    at: "2025-03-22T16:45:00",
  },
  {
    id: "4",
    title: "Reminder",
    content: "Pick up where you left off in “Next.js App Router basics”.",
    read: true,
    at: "2025-03-20T11:00:00",
  },
];

function formatNotificationTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function LoggedInActions({
  email,
  onLogout,
  variant,
  className,
}: {
  email: string | null;
  onLogout: () => void;
  variant: "default" | "compact";
  className?: string;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifications, setNotifications] = useState<DummyNotification[]>(
    () => DUMMY_NOTIFICATIONS
  );

  const iconBox = variant === "compact" ? "h-9 w-9 rounded-lg" : "h-10 w-10 rounded-xl";
  const avatarSize = variant === "compact" ? 36 : 40;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className={cn("flex items-center gap-5 md:gap-7", className)}>
      <Popover
        open={notifOpen}
        onOpenChange={(o) => {
          setNotifOpen(o);
          if (o) setAccountOpen(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "relative shrink-0 border border-primary/15 bg-white/70 text-primary shadow-sm backdrop-blur-md transition",
              "hover:border-primary/25 hover:bg-primary/10 hover:text-primary hover:shadow-md",
              "focus-visible:ring-primary/30",
              "data-[state=open]:border-primary/30 data-[state=open]:bg-primary/10 data-[state=open]:shadow-md data-[state=open]:ring-2 data-[state=open]:ring-primary/15",
              iconBox
            )}
            aria-label="Notifications"
          >
            <Bell
              className={cn(
                variant === "compact" ? "h-4 w-4" : "h-5 w-5",
                "text-primary"
              )}
              strokeWidth={1.75}
            />
            {unreadCount > 0 ? (
              <span
                className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-tertiary shadow-sm ring-1 ring-tertiary/40"
                aria-hidden
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[min(100vw-2rem,22rem)] max-w-88 p-0 overflow-hidden"
          align="end"
        >
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-sm font-semibold text-primary">Notifications</p>
            {unreadCount > 0 ? (
              <p className="text-xs text-zinc-600">{unreadCount} unread</p>
            ) : (
              <p className="text-xs text-zinc-600">You&apos;re all caught up</p>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto bg-white py-1">
            {notifications.map((n) => (
              <li key={n.id}>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-auto min-h-0 w-full justify-start gap-3 whitespace-normal rounded-none border-b border-zinc-100 bg-white px-4 py-3 font-normal text-left shadow-none last:border-b-0 hover:bg-zinc-50",
                    !n.read && "bg-violet-50 hover:bg-violet-100/80"
                  )}
                  onClick={() => markRead(n.id)}
                >
                  <span className="mt-1.5 shrink-0" aria-hidden>
                    {n.read ? (
                      <span className="block h-2 w-2 rounded-full bg-zinc-300" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-sm text-zinc-900",
                        !n.read && "font-semibold"
                      )}
                    >
                      {n.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-zinc-600">
                      {n.content}
                    </span>
                    <time
                      className="mt-1 block text-[11px] text-zinc-400"
                      dateTime={n.at}
                    >
                      {formatNotificationTime(n.at)}
                    </time>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <Dialog
        open={accountOpen}
        onOpenChange={(o) => {
          setAccountOpen(o);
          if (o) setNotifOpen(false);
        }}
      >
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "relative shrink-0 rounded-full p-0 ring-2 ring-primary ring-offset-2 ring-offset-white hover:bg-transparent hover:ring-primary/80",
              variant === "compact" ? "h-9 w-9" : "h-10 w-10"
            )}
            aria-label="Account menu"
          >
            <Image
              src="/images/character/avatar.png"
              alt=""
              width={avatarSize}
              height={avatarSize}
              className="h-full w-full rounded-full object-cover"
            />
          </Button>
        </DialogTrigger>
        <DialogContent
          variant="drawer-right"
          overlayClassName={cn("account-drawer-overlay bg-black/45")}
          className={cn(
            "account-drawer-panel w-80 max-w-[85vw] overflow-hidden rounded-none border-l border-zinc-200 bg-white shadow-xl"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-zinc-200 px-6 py-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Image
                    src="/images/character/avatar.png"
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
                {email ? (
                  <p className="mt-3 text-sm font-medium text-zinc-900">
                    {email}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-0 py-2">
              <nav className="flex flex-col">
                <Link
                  href="/courses"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  <BookOpen
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  My Courses
                </Link>
                <Link
                  href="/account/payments"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  <Receipt
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Payment History
                </Link>
                <Link
                  href="/account/settings"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  <Settings
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Settings
                </Link>
                <Link
                  href="/help"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  <HelpCircle
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Help
                </Link>
                <div className="my-1 h-px bg-zinc-200" />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setAccountOpen(false);
                    onLogout();
                  }}
                  className="h-auto min-h-0 w-full justify-start gap-2.5 rounded-none px-6 py-3 text-sm font-medium text-red-600 shadow-none hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut
                    className="h-4 w-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function HeaderAuth({ className, variant = "default" }: HeaderAuthProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn, email, login, logout } = useAuth();

  if (isLoggedIn) {
    return (
      <LoggedInActions
        email={email}
        onLogout={logout}
        variant={variant}
        className={className}
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setModalOpen(true)}
        className="h-auto px-0 py-0 text-sm font-medium text-primary shadow-none hover:bg-transparent hover:text-primary/80"
      >
        Log In
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => setModalOpen(true)}
        className={cn(
          "rounded-xl border-2 border-primary bg-transparent px-5 py-2.5 font-bold shadow-none hover:bg-primary/5",
          variant === "compact" && "h-9 px-4 py-2 text-xs"
        )}
      >
        Join for Free
      </Button>
      <AuthModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onLogin={(e) => login(e ?? undefined)}
      />
    </div>
  );
}
