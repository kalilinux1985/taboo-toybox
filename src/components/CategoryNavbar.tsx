import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
const CategoryNavbar = () => {
  const categories = [{
    name: 'Industrial Equipment',
    subcategories: ['Manufacturing Tools', 'Heavy Machinery', 'Safety Equipment', 'Quality Control', 'Automation Systems']
  }, {
    name: 'Office Supplies',
    subcategories: ['Furniture', 'Electronics', 'Stationery', 'Printing Supplies', 'Storage Solutions']
  }, {
    name: 'Raw Materials',
    subcategories: ['Metals & Alloys', 'Chemicals', 'Textiles', 'Plastics & Polymers', 'Building Materials']
  }, {
    name: 'Technology',
    subcategories: ['Software Solutions', 'Hardware Components', 'Networking Equipment', 'Cloud Services', 'IT Support']
  }, {
    name: 'Services',
    subcategories: ['Consulting', 'Logistics', 'Maintenance', 'Training', 'Marketing']
  }];
  return (
  <div className="bg-slate-900 border-b border-slate-700 mt-[65px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationMenu className="max-w-full">
          <NavigationMenuList className="flex space-x-8">
            {categories.map(category => <NavigationMenuItem key={category.name}>
                <NavigationMenuTrigger className="transition-colors bg-transparent text-violet-200 text-lg font-normal">
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 w-64 bg-slate-950/[0.48]">
                    <h4 className="font-semibold text-slate-200 mb-3">{category.name}</h4>
                    <ul className="space-y-2">
                      {category.subcategories.map(subcategory => <li key={subcategory}>
                          <a href="#" className="block text-sm text-slate-400 hover:text-violet-400 hover:bg-slate-700 px-3 py-2 transition-colors">
                            {subcategory}
                          </a>
                        </li>)}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>)}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
};
export default CategoryNavbar;