import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import UserProfile from '../../components/profile/UserProfile';

const ProfilePage: NextPage = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  if (!userId) {
    return null;
  }

  return <UserProfile userId={userId} isMe={true} />;
};

export default ProfilePage;
