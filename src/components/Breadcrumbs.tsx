import React from "react";
import { Folder, File, ChevronRight, Home } from "lucide-react";
import { cn } from "../lib/utils";

interface BreadcrumbsProps {
  items: { id: string; name: string }[];
  onNavigate: (id: string) => void;
  rootType: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate, rootType }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <button
        onClick={() => onNavigate("root")}
        className="flex items-center hover:text-indigo-600 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        <span className="capitalize">{rootType} Repository</span>
      </button>
      
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => onNavigate(item.id)}
            className="hover:text-indigo-600 transition-colors max-w-[150px] truncate"
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
