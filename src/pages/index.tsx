interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

import Image from 'next/image';
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheck from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = useState('');

  const createPool = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      alert(`Bolão criado com sucesso. O código ${code} foi copiado para área de transferência!`);
      setPoolTitle('');
    } catch (err) {
      console.log(err);
      alert('Falha ao criar o bolão, tente novamente');
    }
    
  }

  return (
    <div className='max-w-[1124px] mx-auto h-screen grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} className='select-none'
        alt="Logo da NLW Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
            <Image src={usersAvatarExampleImg}
            alt="" className='select-none'/>

            <strong className='text-gray-100 text-xl'>
              <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
            </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            type="text"
            required 
            placeholder='Qual nome do seu bolão?'
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' 
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}/>
          <button type="submit"
            className='bg-nlwYellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-nlwYellow-700 transition'>
            Criar meu bolão
          </button>
        </form>

        <p className='text-gray-300 text-sm mt-4 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" className='select-none'/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" className='select-none'/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
      src={appPreviewImg} 
      alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
      quality={100} className='select-none'/>
    </div>
  )
}

// getServerSideProps
export const getStaticProps = async () => {

  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api('pools/count'),
    api('guesses/count'),
    api('users/count'),
  ])
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: usersCountResponse.data.count
    }
  }
}