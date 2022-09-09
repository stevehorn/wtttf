import { inferProcedureOutput, inferSubscriptionOutput } from "@trpc/server";
import Head from "next/head";
import { useState } from "react";
import type { AppRouter } from "../server/router";
import { trpc } from "../utils/trpc";
import ClientOnlyPortal from "./ClientOnlyPortal";
import GameInviteNotification from "./GameInviteNotification";

type Invite = inferSubscriptionOutput<AppRouter, "auth.streamInvites">;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [invites, setInvites] = useState<Invite[]>([]);

  trpc.useSubscription(["game.invite.streamReceivedInvites"], {
    onNext: (data) => {
      setInvites([...invites, data]);
      setTimeout(() => {
        setInvites(invites.filter((invite) => invite.id !== data.id));
      }, 10000);
    },
  });

  function closeInvite(id: string) {
    setInvites(invites.filter((invite) => invite.id !== id));
  }

  const acceptInvite = trpc.useMutation(["game.invite.acceptInvite"]);
  const declineInvite = trpc.useMutation(["game.invite.declineInvite"]);

  return (
    <>
      <ClientOnlyPortal selector="main">
        <div className=" absolute top-1 sm:right-4 sm:top-4 flex flex-col gap-2">
          {invites.map((invite) => (
            <GameInviteNotification
              key={invite.id}
              name={invite.from.name}
              inviteId={invite.id}
              close={() => closeInvite(invite.id)}
              accept={() => {
                acceptInvite.mutate({ inviteId: invite.id });
                closeInvite(invite.id);
              }}
              decline={() => {
                declineInvite.mutate({ inviteId: invite.id });
                closeInvite(invite.id);
              }}
            />
          ))}
        </div>
      </ClientOnlyPortal>
      <Head>
        <title>WTTF</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen max-h-screen flex flex-col">
        <nav className="w-full h-16 bg-white border-b"></nav>
        <div className="grow overflow-y-auto flex flex-col">
          <main className="relative grow bg-slate-100 flex items-center justify-center">
            {children}
          </main>
          <footer></footer>
        </div>
      </div>
    </>
  );
}
