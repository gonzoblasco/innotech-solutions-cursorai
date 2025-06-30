import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  fullScreenOnMobile?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, description, children, footer, fullScreenOnMobile = true }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
        <Dialog.Content
          className={cn(
            'fixed z-50 left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg focus:outline-none transition-all',
            'data-[state=open]:animate-slide-up data-[state=closed]:animate-fade-out',
            fullScreenOnMobile && 'sm:max-w-lg max-w-full sm:rounded-xl rounded-none sm:top-1/2 top-0 sm:translate-y-[-50%] translate-y-0 sm:p-6 p-4'
          )}
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex items-center justify-between mb-4">
            {title && <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</Dialog.Title>}
            <Dialog.Close asChild>
              <button aria-label="Cerrar" className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          {description && <Dialog.Description className="mb-4 text-gray-600 dark:text-gray-400">{description}</Dialog.Description>}
          <div>{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 