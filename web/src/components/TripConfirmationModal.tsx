import * as Dialog from '@radix-ui/react-dialog'
import { X, User, Mail } from 'lucide-react'

export function TripConfirmationModal() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60" />
      <Dialog.Content className="w-[640px] px-6 py-5 bg-zinc-900 fixed rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Dialog.Title className="font-bold text-xl mb-2">
          Confirmar criação da viagem
        </Dialog.Title>
        <Dialog.Close className="absolute top-6 right-6 leading-none">
          <X size={24} />
        </Dialog.Close>
          <div className="space-y-5">
            <p className="text-sm text-zinc-400">
              Para concluir a criação da viagem para <span className="font-semibold text-zinc-100">Florianópolis, Brasil</span> 
              nas datas de <span className="font-semibold text-zinc-100">16 a 27 de Agosto de 2024</span> preencha seus dados abaixo:
            </p>

            <form className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <User className="text-zinc-400 size-5" />
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Seu nome completo" className="placeholder-zinc-400 outline-none bg-transparent" 
                />
              </div>

              <div className="flex items-center gap-3 h-14 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <Mail className="text-zinc-400 size-5" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Seu e-mail pessoal" className="placeholder-zinc-400 outline-none bg-transparent" 
                />
              </div>

              <button type="submit" className="h-14 bg-lime-300 px-5 py-2 text-lime-950 flex items-center justify-center gap-2 rounded-lg hover:bg-lime-400">
                Confirmar criação da viagem
              </button>
            </form>
          </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}