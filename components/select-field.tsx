'use client';

import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import clsx from 'clsx';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder = 'Select an option...',
  options,
  value,
  onChange,
  disabled = false,
  name,
  className,
}) => {
  return (
    <div className='flex flex-col space-y-2'>
      {label && (
        <label
          htmlFor={name}
          className='text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          {label}
        </label>
      )}
      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          id={name}
          className={clsx(
            'inline-flex h-10 w-full items-center justify-between rounded-md border placeholder:text-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition hover:bg-neutral-600 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-neutral-700 dark:text-gray-100 cursor-pointer',
            className
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDownIcon className='text-gray-500' />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className='z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'>
            <Select.ScrollUpButton className='flex h-6 items-center justify-center bg-neutral-700 dark:bg-gray-800'>
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className='p-1'>
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={clsx(
                    'relative flex cursor-pointer select-none items-center rounded px-6 py-1.5 text-sm text-gray-900 outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-red-500 data-highlighted:text-white dark:text-gray-100'
                  )}
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator className='absolute left-1 inline-flex w-4 items-center justify-center'>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className='flex h-6 items-center justify-center bg-white dark:bg-gray-800'>
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
