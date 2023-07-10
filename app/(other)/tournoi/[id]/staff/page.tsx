"use client"
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { cn } from '@/lib/utils'
import { Role, StaffPayload } from '@/lib/validators/staff'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, {useState} from 'react'
interface PageProps {
    params: {
        id: string
    }
}
export default function page({ params }: PageProps) {
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [role, setRole] = useState("")
    const [email, setEmail] = useState<string>('')
    const [open, setOpen] = useState(false)
    const {toast} = useToast()
    
    const { loginToast } = useCustomToasts()

    const Roles = [
        {
            value: "ARBITRE",
            label: "Arbitre"
        },
        {
            value: "ASSISTANT",
            label: "Assistant"
        }
    ]
  
    const { mutate: addStaff, isLoading } = useMutation({
      mutationFn: async () => {
        const payload: StaffPayload = {
          name,
          email,
          role,
          tournoiId: params.id
        }
  
        const { data } = await axios.post('/api/tournoi/staff', payload)
        return data as string
      },
      onError: (err: any) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 409) {
            return toast({
              title: 'Subreddit already exists.',
              description: 'Please choose a different name.',
              variant: 'destructive',
            })
          }
  
          if (err.response?.status === 422) {
            return toast({
              title: 'Invalid subreddit name.',
              description: 'Please choose a name between 3 and 21 letters.',
              variant: 'destructive',
            })
          }
  
          if (err.response?.status === 401) {
            return loginToast()
          }
        }
  
        toast({
          title: 'There was an error.',
          description: 'Could not create subreddit.',
          variant: 'destructive',
        })
      },
      onSuccess: (data: any) => {
        
        toast({
          description: 'Nouveou Staff creer avec success',
        })
        router.push(`/tournoi/${data}`)
      },
    })
  
    return (
        <>
            <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
                <h1 className="text-xl text-center font-bold py-5 text-slate-900 capitalize dark:text-white">Ajouter un membre au Staff</h1>
                <hr className='bg-gray-500 h-px' />
                <form>
                    <div className="grid grid-cols-1 gap-6 mt-4 w-[600px]">
                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="username">Nom complet</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} id="username" type="text" className='placeholder:text-slate-900 font-semibold' />
                        </div>
                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="email">Email</label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="text" className='placeholder:text-slate-900 font-semibold' />
                        </div>

                        <div>
                            <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="role">Role</label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id='role'
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full h-[40px] justify-between text-slate-900"
                                    >
                                        {role
                                            ? Roles.find((framework) => framework.value.toLocaleLowerCase() === role.toLocaleLowerCase())?.label
                                            : "Selectionner une ville..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 max-h-[250px]">
                                    <Command className='max-h-[250px]'>
                                        <CommandInput placeholder="Chercher votre ville" />
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {Roles.map((framework) => (
                                                <CommandItem
                                                    key={framework.value}
                                                    onSelect={(currentValue) => {
                                                        setRole(currentValue === role ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            role === framework.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {framework.value}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 gap-4">
                        <Button
                            disabled={isLoading}
                            variant='ghost'
                            onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={(e) => {
                            e.preventDefault()
                            addStaff()
                        }} className="px-6 py-2 leading-5 ">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Save</Button>
                    </div>
                </form>
            </section>

        </>
    )
}
