import { loginUser } from '@/api/login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/stores/AuthContext';
import { SocketContext } from '@/stores/SocketContext';
import { EyeClosedIcon, EyeIcon, UserIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginLayout = () => {
  const [data, setData] = useState({
    userId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(true);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const handleSubmit = async () => {
    const res = await loginUser(data);

    if (res.success === false) return toast.error(res.data?.msg || 'Error');

    // if (res.role === 'user') {
    //   return toast.error('For employees, use the application');
    // }

    sessionStorage.setItem('token', res.token);
    dispatch({ type: 'SIGNING', payload: res });
    socket.emit('login', res._id);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <main className='w-full h-screen flex'>
      <section className='w-1/2 flex justify-center items-center '>
        {/* You can place additional content on this side, like an image or a logo */}
      </section>
      <section className='w-1/2 p-6 bg-muted shadow-lg rounded-lg flex justify-center items-center'>
        <div className='w-2/3  p-5   shadow-md rounded-lg bg-white'>
          <h1 className='text-xl  font-semibold'>Login Account</h1>
          <p className='text-sm mb-5'>Enter your ID and password below to login to your account</p>
          <div className='space-y-4'>
            <div>
              <Label
                htmlFor='email'
                className='text-xs  text-muted-foreground'
              >
                User ID
              </Label>
              <div className='mt-1'>
                <Input
                  id='email'
                  placeholder='user-sample'
                  className='w-full'
                  icon={<UserIcon />}
                  onChange={(event) => setData({ ...data, userId: event.target.value })}
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor='password'
                className='text-sm  text-muted-foreground'
              >
                Password
              </Label>
              <div className='mt-1'>
                <Input
                  id='password'
                  className='w-full'
                  icon={
                    showPassword ? (
                      <EyeIcon onClick={() => handleShowPassword()} />
                    ) : (
                      <EyeClosedIcon onClick={() => handleShowPassword()} />
                    )
                  }
                  type={showPassword ? 'password' : 'text'}
                  onChange={(event) => setData({ ...data, password: event.target.value })}
                />
              </div>
            </div>
            <div className='mt-4'>
              <Button
                className='w-full '
                onClick={handleSubmit}
              >
                Login
              </Button>
            </div>

            <div className='text-sm'>
              Don't have an account?
              <span>
                <Button variant='link'> Sign up</Button>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginLayout;
