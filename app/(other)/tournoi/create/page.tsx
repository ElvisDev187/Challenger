'use client'

import { ComboBox } from '@/components/ComboBox'
import { DatePicker } from '@/components/DatePicker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { VILLES } from '@/constants'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { format } from 'date-fns'
import { Image, ImagePlus } from 'lucide-react'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


const Page = () => {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [isFree, setIsFree] = useState<boolean>(true)
  const [open, setOpen] = useState(false)
  const [Ville, setVille] = useState<string>("")
  const [age, setAge] = useState(17)
  const [inscription, setDateIn] = useState<Date>()
  const [debut, setDateDeb] = useState<Date>()
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { loginToast } = useCustomToasts()

  const { mutate: createTournoi, isLoading } = useMutation({
    mutationFn: async () => {

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
      router.push(`/r/${data}`)
    },
  })

  return (
    <>
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-10">
        <h1 className="text-xl text-center font-bold py-5 text-slate-900 capitalize dark:text-white">Créer un Tournoi</h1>
        <hr className='bg-red-500 h-px' />
        <form>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="username">Nom du Tournoi</label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} id="username" type="text" className='placeholder:text-slate-900 font-semibold' />
            </div>

            <div>
              <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="emailAddress">Ville</label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-[40px] justify-between"
                  >
                    {Ville
                      ? VILLES.find((framework) => framework.value === Ville)?.value
                      : "Selectionner une ville..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 max-h-[250px]">
                  <Command className='max-h-[250px]'>
                    <CommandInput placeholder="Chercher votre ville" />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {VILLES.map((framework) => (
                        <CommandItem
                          key={framework.key}
                          onSelect={(currentValue) => {
                            setVille(currentValue === Ville ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              Ville === framework.value ? "opacity-100" : "opacity-0"
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
            <div>
              <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="passwordConfirmation">Date limit d'inscription</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    role="combobox"
                    className={cn(
                      "w-full h-[40px] justify-start text-left font-normal",
                      !inscription && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {inscription ? <span className="font-semibold text-slate-900">{format(inscription, "PPP")}</span> : <span>Selectioner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={inscription}
                    onSelect={setDateIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="passwordConfirmation">Date d'ouverture</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-[40px] justify-start text-left font-normal",
                      !debut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {debut ? <span className="font-semibold text-slate-900">{format(debut, "PPP")}</span> : <span>Selectioner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={debut}
                    onSelect={setDateDeb}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Switch onClick={()=>setIsFree(prev=> !prev)} id="airplane-mode" />
              <label htmlFor="airplane-mode" className='text-slate-700 text-sm font-medium dark:text-gray-200'>Inscription payante</label>
            </div>
            <div>
              <label className="text-slate-700 text-sm mb-2 font-medium dark:text-gray-200" htmlFor="passwordConfirmation">Age max : <span className="font-semibold text-slate-900">{age}</span></label>
              <Slider defaultValue={[17]} onValueChange={(e)=> setAge(e[0])} max={100} step={1}/> 
            </div>
            <div>
              <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="passwordConfirmation">Description</label>
              <textarea id="textarea" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 bg-indigo-600 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ImagePlus className='text-white self-center h-10 w-10' color='white'/>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative p-1 cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span className="">Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1 text-white">or drag and drop</p>
                  </div>
                  <p className="text-xs text-white">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <Button
              disabled={isLoading}
              variant='ghost'
              onClick={() => router.back()}>
              Cancel
            </Button>
            <Button className="px-6 py-2 leading-5 ">Save</Button>
          </div>
        </form>
      </section>

    </>
  )
}

export default Page
