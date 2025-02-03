import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]; // Array of breadcrumb items
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <BreadcrumbRoot className='w-full'>
      <BreadcrumbList className='mb-2 w-full'>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage className='underline'>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href || '#'}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
};

export default Breadcrumb;
