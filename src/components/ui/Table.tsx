import React from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table ref={ref} className={clsx('w-full text-left text-xs text-neutral-800 dark:text-neutral-200', className)} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={clsx('bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={clsx('divide-y divide-neutral-100 dark:divide-neutral-800/80 bg-white dark:bg-neutral-900', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement> & { isSelected?: boolean }>(
  ({ className, isSelected, ...props }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        'transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40',
        isSelected && 'bg-structure-50/60 dark:bg-structure-950/30',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={clsx(
        'px-4 py-3 text-xs font-semibold select-none',
        sortable && 'cursor-pointer hover:text-neutral-900 dark:hover:text-white',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="text-neutral-400">
            {sortDirection === 'asc' ? (
              <ChevronUp className="w-3.5 h-3.5 text-brand-600" />
            ) : sortDirection === 'desc' ? (
              <ChevronDown className="w-3.5 h-3.5 text-brand-600" />
            ) : (
              <ChevronsUpDown className="w-3.5 h-3.5" />
            )}
          </span>
        )}
      </div>
    </th>
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={clsx('px-4 py-3 align-middle', className)} {...props} />
  )
);
TableCell.displayName = 'TableCell';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  className
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={clsx('flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500', className)}>
      <div>
        {totalItems !== undefined && pageSize !== undefined && (
          <span>
            Showing <strong className="text-neutral-800 dark:text-neutral-200">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">{Math.min(currentPage * pageSize, totalItems)}</strong> of{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">{totalItems}</strong> items
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          Previous
        </button>
        <span className="px-3 font-semibold text-neutral-800 dark:text-neutral-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
};
