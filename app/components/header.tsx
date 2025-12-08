import { Bell, User } from "lucide-react";

export function Header({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-gray-500">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 leading-none">
              Admin User
            </span>
            <span className="text-xs text-gray-500 mt-0.5">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
