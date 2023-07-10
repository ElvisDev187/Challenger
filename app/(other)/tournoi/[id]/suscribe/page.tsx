"use client"
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { PlayerPayload, TeamPayload } from '@/lib/validators/team'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import * as XLSX from "xlsx"
interface PageProps {
  params: {
    id: string
  }
}
export default  function page({ params: { id} }: PageProps) {
  const [data, setdata] = useState<any>()
  const [name, setName] = useState<string>('')
  const [tel, setTel] = useState<string>('')
  const formRef = useRef<HTMLFormElement>()
  const router = useRouter()
  const { toast } = useToast()
  const { loginToast } = useCustomToasts()


  const { mutate: CreateTeam, isLoading } = useMutation(
    async () => {
      const players: PlayerPayload[] = data.map((player: any)=> {
        return {
          name: player.Nom,
          age: parseInt(player.Age),
          poste: player.Poste
        }
      })
     const payload : TeamPayload = {
      palyer: players,
      name: name,
      tournoiId: id
     }

     const { data: res } = await axios.post('/api/tournoi/teams', payload)
      return res as string
      
    },
    {
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
      onSuccess: (data: string) => {

        toast({
          description: 'Votre equipe a ete creer avec success',
        })
        router.push(`/tournoi/${id}/team/${data}`)
      },
    }
  )

  const handleFileUpload = (e: any) => {
    const reader = new FileReader()
    reader.readAsBinaryString(e.target.files[0])
    reader.onload = (e) => {
      const res = e.target?.result
      const wb = XLSX.read(res, { type: "binary" })
      const shName = wb.SheetNames[0]
      const sheet = wb.Sheets[shName]
      const parseData = XLSX.utils.sheet_to_json(sheet);
      setdata(parseData)
    }
  }
  return (
    <>
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
        <h1 className="text-xl text-center font-bold pt-5 pb-3 text-slate-900 capitalize dark:text-white">Inscription</h1>
        <p className='text-md font-light text-slate-900 pb-5 px-6'>En inscrivant votre equipe vous acceptez de recevoir des emails tout au long du tournoi</p>
        <hr className='bg-gray-500 h-px' />
        <form>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="username">Nom de l'equipe</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} id="username" type="text" className='placeholder:text-slate-900 font-semibold' />
            </div>

            <div className=''>
              <label className="text-slate-700 text-sm font-medium dark:text-gray-200" htmlFor="username">File</label>
              <Input onChange={(e) => handleFileUpload(e)} id="username" type="file" className='placeholder:text-slate-900 font-semibold' />
            </div>
            <div>

              <a href='/template.xlsx' id="template" download className={buttonVariants({ variant: "default", className: "bg-emerald-500" })}>Telecharger template.xlsx</a>
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
              console.log(data);
              
             CreateTeam()

            }} className="px-6 py-2 leading-5 ">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Save</Button>
          </div>
        </form>
      </section>
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-5">
        <h1 className="text-xl text-center font-bold pt-5 pb-3 text-slate-900 capitalize dark:text-white">Instructions</h1>
        <hr className='bg-gray-500 h-px' />
        <ol className='w-full text-md font-light text-slate-900 list-decimal'>
          <li>Lisez la notice de consentement pour les emails</li>
          <li>Inscrivez le nom de votre equipe</li>
          <li>Telechargez le template excel et remplissez le correctement (min 11 joueurs)</li>
          <li>Choisissez le et cliquez sur Save.</li>
        </ol>
      </section>
    </>

  )
}
