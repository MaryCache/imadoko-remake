import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import type { Team } from '../../../types';

interface TeamSelectorProps {
  value: Team | null;
  teams: Team[];
  onChange: (team: Team | null) => void;
  placeholder: string;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  value,
  teams,
  onChange,
  placeholder,
}) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        {/* 修正: py-2.5 -> py-2 (モバイル) に変更、フォントサイズ調整 */}
        <Listbox.Button
          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 border-sky-200/60 bg-white 
                     focus:border-sky-300 focus:ring-2 focus:ring-sky-200 focus:bg-sky-50/50
                     transition-all duration-200 shadow-sm hover:shadow-md 
                     hover:border-sky-300 hover:bg-sky-50/30 text-slate-900 font-medium text-left text-sm sm:text-base"
        >
          <span className="block truncate">{value?.teamName || placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronUpDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        {/* ... Transition & Options (変更なし) ... */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {/* ... options ... */}
            {teams.map((t) => (
              <Listbox.Option
                key={t.id}
                value={t}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 rounded-lg transition-colors ${
                    active ? 'bg-sky-100 text-sky-900' : 'text-slate-700'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                    >
                      {t.teamName}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
