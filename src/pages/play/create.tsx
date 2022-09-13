import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import SearchInput from '../../components/SearchInput';
import { trpc } from '../../utils/trpc';

const Create: NextPage = () => {
  const [name, setName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const router = useRouter();

  const players = trpc.useQuery(['auth.getUsersByName', { name }]);
  const createGame = trpc.useMutation(['game.invite.sendInvite']);

  trpc.useSubscription(['game.invite.streamAcceptedInvites'], {
    onNext: (data) => {
      router.push(`/play/${data.id}`);
    },
  });

  return (
    <Layout>
      <div className="w-full p-6 flex flex-col gap-3 bg-white sm:rounded-lg border-b sm:border border-gray-200 shadow-md sm:max-w-md">
        <div className="flex flex-row items-center gap-2">
          <Link href="/">
            <a className="btn btn-sm btn-ghost btn-circle">
              <ArrowLeftIcon className="h-5" />
            </a>
          </Link>
          <h5 className="text-lg font-bold tracking-tight text-gray-900 ">
            Create Game
          </h5>
        </div>
        <div className="text-gray-400">Search Players</div>
        <SearchInput
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="text-gray-400">Players</div>
        <ul className="h-60 overflow-y-auto bg-gray-50 border border-gray-300 rounded-lg flex flex-col ">
          {players.data?.map((player) => (
            <li key={player.id} className="relative">
              {player.id === selectedUserId && (
                <div className="absolute w-1 h-full bg-purple-500 l-0 t-0" />
              )}
              <button
                className={[
                  'w-full p-4 flex flex-row gap-2 ',
                  selectedUserId === player.id
                    ? 'bg-purple-100'
                    : 'hover:bg-gray-100',
                ].join(' ')}
                onClick={() => setSelectedUserId(player.id)}
              >
                <div className="avatar mr-2">
                  <div className="w-12 mask mask-circle">
                    <Image layout="fill" src={player.image!} alt="Avatar" />
                  </div>
                </div>
                <div className="text-start">
                  <span className="font-medium text-gray-800">
                    {player.name}
                  </span>
                  <span className="ml-2 text-gray-600 font-mono">
                    ({Math.round(player.rating)})
                  </span>
                  <div className="text-gray-500 text-sm">{player.email}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 w-full flex flex-row justify-end">
          <button
            onClick={() =>
              createGame.mutate({ otherPlayerId: selectedUserId! })
            }
            className="btn btn-primary"
            disabled={!selectedUserId}
          >
            Send
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
