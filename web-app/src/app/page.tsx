import Navbar from '@/components/Navbar';
import Snackbar from '@/components/Snackbar';
import DeviceGrid from '@/components/DeviceGrid';


const Home = async () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-[64px]">

        <Snackbar message="BLS WAKE ON LAN" />

        <DeviceGrid userId={1}/>

        <hr />

        <hr />
      </div>
    </div>
  );
};

export default Home;
