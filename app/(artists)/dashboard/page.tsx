import getSongs from '@/actions/getSongs';
import DashboardContent from '@/components/daahboard/dashboard-content';

const Dashboard = async () => {
  const songs = await getSongs();
  return <DashboardContent songs={songs} />;
};

export default Dashboard;
