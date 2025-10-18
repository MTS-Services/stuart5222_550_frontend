import { useParams } from 'react-router-dom';

const UserDetailsView = () => {
  const { id } = useParams();
  return (
    <div className='p-4 md:p-8'>
      <h1 className='text-2xl font-semibold mb-6'>
        Requested User Details (ACTIVE - ID: {id})
      </h1>
      <p>From User Management table ({id})</p>
      {/* User details content goes here */}
    </div>
  );
};

export default UserDetailsView;
