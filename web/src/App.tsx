import { ChangeEvent, FormEvent, useState } from "react"
import { MapPin, Calendar, ArrowRight, UserRoundPlus, Settings2 } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog'
import logoImg from "../assets/Logo.svg"
import { GuestsModal } from "./components/GuestsModal"
import { TripConfirmationModal } from "./components/TripConfirmationModal"

export function App() {
  const [isGuestInputOpen, setIsGuestInputOpen] = useState(false)
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')

  function openGuestInput() {
    setIsGuestInputOpen(true)
  }

  function closeGuestInput() {
    setIsGuestInputOpen(false)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if(!emailInput) {
      return alert('Field required!')
    }

    if(emailsToInvite.includes(emailInput)) {
      setEmailInput('')
      return alert('Email already invited!')
    }

    setEmailsToInvite(state => [...state, emailInput])
    setEmailInput('')
  }

  function changeEmailInput(event: ChangeEvent<HTMLInputElement>) {
    setEmailInput(event.target.value)
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const filteredEmailList = emailsToInvite.filter(emailInvited => emailInvited !== emailToRemove)

    setEmailsToInvite(filteredEmailList)
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl px-6 text-center space-y-10">
        <div>
          <img src={logoImg} alt="" className="m-auto" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">
          <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-1">
            <div className="flex gap-2 items-center flex-1">
              <MapPin className="size-5 text-zinc-400" />
              <input disabled={isGuestInputOpen} type="text" placeholder="Para onde você vai?" className="bg-transparent text-lg placeholder-zinc-400 p-1 outline-none" />
            </div>

            <div className="flex gap-2 items-center">
              <Calendar className="size-5 text-zinc-400" />
              <input disabled={isGuestInputOpen} type="text" placeholder="Quando?" className="bg-transparent text-lg placeholder-zinc-400 p-1 w-40 outline-none" />
            </div>

            <div className="w-[2px] h-6 bg-zinc-800 mx-3" />

            {isGuestInputOpen ? (
              <button 
                className="bg-zinc-800 text-zinc-200 rounded-lg py-2 px-5 font-medium flex items-center gap-2 hover:bg-zinc-700"
                onClick={closeGuestInput}
              >
                  Alterar local/data
                  <Settings2 className="size-5 text-zinc-200" />
              </button>
            ) : (
              <button 
                className="bg-lime-300 text-lime-950 rounded-lg py-2 px-5 font-medium flex items-center gap-2 hover:bg-lime-400"
                onClick={openGuestInput}  
              >
                Continuar
                <ArrowRight className="text-lime-950 size-5" />  
              </button>
            )}
          </div>

          {isGuestInputOpen && (
            <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-1">
              <Dialog.Root>
              <Dialog.Trigger asChild>
                <div className="flex gap-2 items-center flex-1 cursor-pointer">
                  <UserRoundPlus className="size-5 text-zinc-400" />
                  <button type="button" className="bg-transparent text-lg text-zinc-400 p-1 outline-none">
                    { (emailsToInvite.length > 0) ? (
                      `${emailsToInvite.length} pessoa(s) convidada(s)`
                    ) : (
                      "Quem estará na viagem?"
                    )}
                  </button>
                </div>
              </Dialog.Trigger>
              <GuestsModal 
                addNewEmailToInvite={addNewEmailToInvite}
                changeEmailInput={changeEmailInput}
                emailInput={emailInput}
                emailsToInvite={emailsToInvite}
                removeEmailFromInvites={removeEmailFromInvites}
              />
              </Dialog.Root>

              <div className="w-[2px] h-6 bg-zinc-800 mx-3" />

              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button 
                    className="bg-lime-300 text-lime-950 rounded-lg py-2 px-5 font-medium flex items-center gap-2 hover:bg-lime-400"
                    onClick={() => {console.log('oi')}}  
                    >
                    Confirmar viagem
                    <ArrowRight className="text-lime-950 size-5" />  
                  </button>
                </Dialog.Trigger>
                <TripConfirmationModal />
              </Dialog.Root>
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda <br/>
          com nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> e <a href="#" className="text-zinc-300 underline">políticas de privacidade</a>.
        </p>
      </div>
    </div>
  )
}
