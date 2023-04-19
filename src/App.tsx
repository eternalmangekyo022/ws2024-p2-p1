import React, { useState, useEffect } from 'react'
import Runner from './components/Runner'

const saveToLs: boolean = true

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [runners, setRunners] = useState<User[]>([]);
  const [token, setToken] = useState<string>('');
  const [changed, setChanged] = useState<boolean>(false);

  const actions = {
    login: async(token: string): Promise<void> => {
      let data: Awaited<Promise<{ status: string, user: User, team: Team, runners: User[] }>> = await (await fetch('http://localhost/login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ token })
      })).json()
      if(saveToLs) localStorage.setItem('token', data.user.token.toString())
      data.team = await (await fetch('http://localhost/teams/' + data.user.teamId, { headers: new Headers({ Authorization: data.user.token.toString() }) })).json()
      data.runners = await (await fetch('http://localhost/teams/' + data.team.id + '/runners', {
        headers: new Headers({
          Authorization: data.user.token.toString()
        })
      })).json()
      setUser(data.user)
      setTeam(data.team)
      setRunners(data.runners)
    },

    logout: () => {
      setUser(null)
      setTeam(null)
      setRunners([])
      localStorage.removeItem('token')
    },

    saveTeam: async() => {
      const res: Awaited<Promise<Team>> = await (await fetch('http://localhost/teams/' + team?.id, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: user!.token.toString()
        }),
        body: JSON.stringify({ name: team!.name, location: team!.location, contactEmail: team!.contactEmail }) }))
        .json()
      if(res.id) {
        setTeam(res)
        setChanged(false)
      }
    },

    deleteTeam: async() => {
      const res = await (await fetch('http://localhost/teams/' + team!.id, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: user!.token.toString()
        })
      })).json()
      console.log(res)
      setUser(null)
    },
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
        <div className='w-5/6 h-[98%] border-2 border-black rounded-md center flex flex-col justify-center items-center'>
          <div className='w-[95%] h-1/2 border-b-2 border-b-black'>
            <div className='w-1/3 h-full flex flex-col justify-evenly items-start'>
              {/** input for teamName contactEmail location */}
              <h1 className='font-semibold text-2xl'>Manage your team</h1>
              <input placeholder='Team Name' type="text" className='w-full h-8 border-2 border-black rounded-sm' value={team?.name} onChange={(e) => {
                setTeam((prev: any) => ({ ...prev, name: e.target.value }))
                setChanged(true)
              }} />
              <input placeholder='Contact Email' type="text" className='w-full h-8 border-2 border-black rounded-sm' value={team?.contactEmail || ''} onChange={(e) => {
                setTeam((prev: any) => ({...prev, contactEmail: e.target.value}))
                setChanged(true)
              }}/>
              <input placeholder='Location' type="text" className='w-full h-8 border-2 border-black rounded-sm' value={team?.location || ''} onChange={(e) => {
                setTeam((prev: any) => ({...prev, location: e.target.value}))
                setChanged(true)
              }}/>
              <div className='w-full h-8 flex justify-end gap-4'>
                <button className='w-24 h-full bg-rose-400 border-2 border-rose-800' type='button' onClick={actions.deleteTeam}>Delete team</button>
                <button disabled={!changed} className='w-12 h-full bg-gray-600 border-2 border-gray-800' type='button' onClick={actions.saveTeam}>Save</button>
              </div>
              <button type="button" className='w-16 h-8 bg-gray-800 border-2 border-black absolute top-4 right-8' onClick={actions.logout}>Logout</button>
            </div>
          </div>
          <div className='w-[95%] h-1/2'>
            <div className='w-full h-12 flex justify-between'>
              <h2 className='font-semibold text-2xl'>Runners</h2>
              <a className='w-32 h-8 border-2 border-black relative right-5 top-2 flex justify-center items-center' href='http://stage-planner.ub2023.hu' target='_blank'>Stage Planner</a>
            </div>
            <div className='w-[98%] h-5/6 border-black border-2 flex flex-col'>
              <div className='flex justify-evenly items-center border-b-2 border-b-black h-[10%]'>
                <span className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center'>Firstname</span>
                <span className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center'>Lastname</span>
                <span className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center'>Speed</span>
                <span className='border-r-2 border-r-black w-[22.5%] h-full text-center flex justify-center items-center'>Token</span>
                <span className='w-[10%] h-full text-center flex justify-center items-center'>Actions</span>
              </div>
              {runners.map(({ firstName, id, lastName, speed, token }) => <>
                <Runner remove={() => {
                  setRunners(prev => prev.filter(i => i.id !== id))
                }} user={user} firstName={firstName} id={id} speed={speed} lastName={lastName} team={team as Team} token={token} key={id.toString()}></Runner>
              </>)}
              {runners.length < 10 && <>
                <div className='flex justify-evenly items-center h-[10%]'></div>
              </>}
            </div>
          </div>
        </div>
      </>}

    </div>
  </>
}

export default App