import React, { useState, useEffect } from 'react'

const saveToLs: boolean = true

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [token, setToken] = useState<string>('')

  const actions = {
    login: async(token: string): Promise<void> => {
      let data: Awaited<Promise<{ status: string, user: User, team: Team }>> = await (await fetch('http://localhost/login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ token })
      })).json()
      if(saveToLs) localStorage.setItem('token', data.user.token.toString())
      data.team = await (await fetch('http://localhost/teams/' + data.user.teamId, { headers: new Headers({ Authorization: data.user.token.toString() }) })).json()
      setUser(data.user)
      setTeam(data.team)
      console.log(data)
    },

    saveTeam: async() => {
      const res = await (await fetch('http://localhost/teams/' + team?.id, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: user!.token.toString()
        }),
        body: JSON.stringify({ name: team!.name, location: team!.location, contactEmail: team!.contactEmail }) }))
        .json()
    },

    deleteTeam: async() => {
      const res = (await fetch('http://localhost/teams/' + team!.id, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: user!.token.toString()
        })
      })).json()
      console.log(res)
      setUser(null)
    }
  }

  useEffect(() => {
    const fetchData = async(): Promise<void> => {
      const token = localStorage.getItem('token')
      if(!token) return
      await actions.login(token)
    }

    fetchData()
  }, [])

  return <>
    <div className='w-screen h-screen relative'>
      {!user ? <>
        <div className='w-[25rem] h-[14rem] border-2 rounded-md center flex flex-col'>
          <div className='w-full h-1/2 flex flex-col justify-center items-center gap-2'>
            <h2 className='text-3xl font-semibold'>Login</h2>
            <span>Login using your token</span>
          </div>
          <div className='w-full h-1/2 flex flex-col justify-center items-center gap-2'>
            <input className='w-[80%] h-8 border-2 border-black' placeholder='Token' type="text" onChange={e => setToken(e.target.value)}/>
            <button onClick={() => actions.login(token)} type='button' className='w-16 h-8 bg-gray-600 border-2 border-black'>Login</button>
          </div>
        </div>
      </> : <>
        <div className='w-5/6 h-5/6 border-2 border-black rounded-md center flex flex-col justify-center items-center'>
          <div className='w-[95%] h-1/2 border-b-2 border-b-black'>
            <div className='w-1/3 h-full flex flex-col border-2 justify-evenly items-start'>
              {/** input for teamName contactEmail location */}
              <h1 className='font-semibold text-2xl'>Manage your team</h1>
              <input type="text" className='w-full h-8 border-2 border-black rounded-sm' value={team?.name} onChange={(e) => setTeam((prev: any) => ({ ...prev, name: e.target.value }))} />
              <input type="text" className='w-full h-8 border-2 border-black rounded-sm' value={team?.contactEmail || ''} onChange={(e) => setTeam((prev: any) => ({...prev, contactEmail: e.target.value}))}/>
              <input type="text" className='w-full h-8 border-2 border-black rounded-sm' value={team?.location || ''} onChange={(e) => setTeam((prev: any) => ({...prev, location: e.target.value}))}/>
              <div className='w-full h-8 flex justify-end gap-4'>
                <button className='w-24 h-full bg-rose-400 border-2 border-rose-800' type='button'>Delete team</button>
                <button className='w-12 h-full bg-gray-600 border-2 border-gray-800' type='button' onClick={actions.saveTeam}>Save</button>
              </div>
            </div>
          </div>
          <div className='w-[95%] h-1/2'>

          </div>
        </div>
      </>}

    </div>
  </>
}

export default App