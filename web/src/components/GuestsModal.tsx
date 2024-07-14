import * as Dialog from '@radix-ui/react-dialog'
import { X, AtSign, Plus } from 'lucide-react'
import { ChangeEvent, FormEvent } from 'react';

interface GuestsModalProps {
  emailsToInvite: string[];
  emailInput: string;
  removeEmailFromInvites: (email: string) => void;
  addNewEmailToInvite: (event: FormEvent<HTMLFormElement>) => void;
  changeEmailInput: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function GuestsModal({
  addNewEmailToInvite, 
  changeEmailInput, 
  emailInput, 
  emailsToInvite, 
  removeEmailFromInvites
}: GuestsModalProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60" />
      <Dialog.Content className="w-[640px] px-6 py-5 bg-zinc-900 fixed rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Dialog.Title className="font-bold text-xl mb-2">
          Selecionar convidados
        </Dialog.Title>
        <Dialog.Close className="absolute top-6 right-6 leading-none">
          <X size={24} />
        </Dialog.Close>
          <div className="space-y-5">
            <p className="text-sm text-zinc-400">Os convidados irão receber e-mails para confirmar a participação na viagem.</p>

            <div className="flex flex-wrap gap-2">
              {emailsToInvite.map(email => {
                return (
                  <div key={email} className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2">
                    <span className="text-zinc-300">{email}</span>
                    <button onClick={() => removeEmailFromInvites(email)}>
                      <X className="size-4 text-zinc-300" />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="h-px bg-zinc-800" />

            <form onSubmit={addNewEmailToInvite} className="h-14 bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex flex-row items-center gap-2">
              <AtSign className="size-4 text-zinc-400" />
              <input 
                type="email" 
                name="email" 
                value={emailInput}
                onChange={changeEmailInput}
                placeholder="Digite o e-mail do convidado" className="placeholder-zinc-400 bg-transparent outline-none flex flex-1" 
              />
              <button type="submit" className="bg-lime-300 px-5 py-2 text-lime-950 flex items-center gap-2 rounded-lg hover:bg-lime-400">
                Confirmar
                <Plus className="size-4 text-lime-950" />
              </button>
            </form>
          </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}