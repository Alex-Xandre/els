import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, icon, placeholder, ...props }, ref) => {
  return type === 'checkbox' ? (
    <label className="flex h-9 items-center gap-2">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border border-input text-primary shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
        ref={ref}
        {...props}
      />
      {placeholder && <span className="text-sm text-muted-foreground">{placeholder}</span>}
    </label>
  ) : (
    <div className="relative w-full">
      {icon && <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 border-r pr-1">{icon}</div>}
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          icon ? 'pl-12' : '',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
